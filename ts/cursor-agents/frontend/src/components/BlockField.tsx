import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { HERO_LANES, LANE_CLIP, LANE_DRIFT } from "./heroCubes";

// The isometric block field from the encore.dev hero, ported from
// www/components/landing/BlockField.tsx. Four lanes of cubes drift and ripple
// on a 12s loop; the keyframes live in styles.css.
//
// Here it does one more job: it is the agent's activity meter. Every tool call
// the agent makes calls `spawn()`, and a fresh stack rises out of the field
// with the warm grain-in from the landing page. You can still click it.

const LANE_Y = 121.25;
const LANE_GAP = 46;
const DEPTH = 11;
const STEP = 14.5;
const TILE = 1400;
const SPAWN_LIFE = 8000;
const MAX_PER_LANE = 10;
const GRAIN_BUDGET = 5;

const GRAIN_LEVELS = [
  [0.4, 0.425, 0.34, 0.455, 0.44, 0.405],
  [0.351, 0.449, 0.298, 0.476, 0.386, 0.432],
  [0.304, 0.473, 0.259, 0.496, 0.335, 0.458],
  [0.26, 0.495, 0.221, 0.515, 0.286, 0.482],
  [0.218, 0.516, 0.185, 0.532, 0.24, 0.505],
  [0.178, 0.536, 0.151, 0.549, 0.196, 0.527],
  [0.141, 0.554, 0.12, 0.564, 0.155, 0.547],
  [0.107, 0.57, 0.091, 0.578, 0.118, 0.565],
  [0.076, 0.585, 0.065, 0.591, 0.084, 0.581],
  [0.049, 0.598, 0.042, 0.602, 0.054, 0.595],
  [0.027, 0.611, 0.023, 0.613, 0.03, 0.61],
  [0.01, 0.62, 0.008, 0.621, 0.011, 0.62],
];

const GrainFilters = () => (
  <>
    {GRAIN_LEVELS.map((v, i) => {
      const id = `holoGrain${12 - i}`;
      const [ar, ao, ag, go, ab, bo] = v;
      return (
        <filter key={id} id={id} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={1} seed={11} stitchTiles="stitch" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values={`${ar} 0 0 0 ${ao}  0 ${ag} 0 0 ${go}  0 0 ${ab} 0 ${bo}  0 0 0 0 1`}
            result="g"
          />
          <feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1={1.6} k2={0} k3={0} k4={0} result="b" />
          <feComposite in="b" in2="SourceGraphic" operator="in" />
        </filter>
      );
    })}
  </>
);

const LANE_LINES = [
  { y: 121.25, stroke: "#373735", delay: 0.15 },
  { y: 167.25, stroke: "#40403d", delay: 0.3 },
  { y: 213.25, stroke: "#474744", delay: 0.45 },
  { y: 259.25, stroke: "#4f4f4b", delay: 0.6 },
];

const SPAWN_TONES: [string, string, string][] = [
  ["#3e3e3c", "#63635e", "#9a9a92"],
  ["#3b3b39", "#5d5d59", "#909089"],
];

interface SpawnCube {
  l: string;
  r: string;
  t: string;
  fills: [string, string, string];
  delay: number;
}

interface Spawn {
  id: number;
  lane: number;
  cubes: SpawnCube[];
  variant: "" | "B";
  grain: boolean;
  life: number;
}

const buildStack = (cx: number, lane: number, hw: number, n: number): SpawnCube[] => {
  const base = 120 + LANE_GAP * lane;
  const out: SpawnCube[] = [];
  for (let rep = 0; rep < 2; rep++) {
    const x = cx + rep * TILE;
    for (let i = 0; i < n; i++) {
      const top = base - hw / 2 - DEPTH - i * STEP;
      const mid = top + hw / 2;
      const low = mid + DEPTH;
      const lift = top + DEPTH;
      out.push({
        l: `${x - hw},${top} ${x},${mid} ${x},${low} ${x - hw},${lift}`,
        r: `${x},${mid} ${x + hw},${top} ${x + hw},${lift} ${x},${low}`,
        t: `${x},${mid} ${x + hw},${top} ${x},${top - hw / 2} ${x - hw},${top}`,
        fills: SPAWN_TONES[i % 2],
        delay: i * 58,
      });
    }
  }
  return out;
};

export interface BlockFieldHandle {
  // Raise a stack somewhere in the visible field. `size` (1-4) scales height.
  spawn(size?: number): void;
}

const BlockField = forwardRef<BlockFieldHandle, { className?: string }>(({ className }, ref) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [spawns, setSpawns] = useState<Spawn[]>([]);
  const spawnsRef = useRef(spawns);
  spawnsRef.current = spawns;
  const nextId = useRef(0);

  useEffect(() => {
    if (!spawns.length) return;
    const t = window.setTimeout(() => {
      const now = Date.now();
      setSpawns((prev) => prev.filter((s) => s.life > now));
    }, 1200);
    return () => window.clearTimeout(t);
  }, [spawns]);

  // Places a stack under a screen point, in the given lane (or the nearest).
  const spawnAt = useCallback((clientX: number, clientY: number, forcedLane?: number, size?: number) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const loc = pt.matrixTransform(m.inverse());
    const lane = forcedLane ?? Math.max(0, Math.min(3, Math.round((loc.y - LANE_Y) / LANE_GAP)));

    const drift = svg.querySelector(`[data-drift="${lane}"]`) as SVGGElement | null;
    const dm = drift?.getScreenCTM();
    const lx = dm ? pt.matrixTransform(dm.inverse()).x : loc.x;

    const now = Date.now();
    const live = spawnsRef.current.filter((s) => s.life > now);
    if (live.filter((s) => s.lane === lane).length >= MAX_PER_LANE) return;

    const hw = 20 + 4 * Math.floor(Math.random() * 4);
    const n = size ? 2 + size : 3 + Math.floor(Math.random() * 4);
    const id = nextId.current++;
    setSpawns([
      ...live,
      {
        id,
        lane,
        cubes: buildStack(Math.round(lx), lane, hw, n),
        variant: id % 2 ? "B" : "",
        grain: live.length <= GRAIN_BUDGET,
        life: now + SPAWN_LIFE + n * 60,
      },
    ]);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      spawn(size) {
        const box = rootRef.current?.getBoundingClientRect();
        if (!box) return;
        const x = box.left + box.width * (0.18 + Math.random() * 0.64);
        spawnAt(x, box.bottom, Math.floor(Math.random() * 4), size);
      },
    }),
    [spawnAt],
  );

  const onClick = (e: MouseEvent<HTMLDivElement>) => spawnAt(e.clientX, e.clientY);

  return (
    <div ref={rootRef} onClick={onClick} className={`block-field ${className ?? ""}`} aria-hidden="true">
      <svg ref={svgRef} viewBox="0 -12 1400 300" preserveAspectRatio="xMidYMax slice">
        <defs>
          {LANE_CLIP.map((h, i) => (
            <clipPath key={i} id={`laneClip${i}`}>
              <rect x="-3200" y="-460" width="8400" height={h} />
            </clipPath>
          ))}
          <GrainFilters />
        </defs>

        {HERO_LANES.map((cubes, lane) => (
          <Fragment key={lane}>
            <g clipPath={`url(#laneClip${lane})`}>
              <g data-drift={lane} style={{ animation: `waveDrift ${LANE_DRIFT[lane]}s linear infinite` }}>
                {cubes.map(([holo, delay, lp, lf, rp, rf, tp, tf], i) => (
                  <g
                    key={i}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "50% 100%",
                      animation: `blockRise${holo} 12s ${delay}s infinite backwards, blockTint${holo} 12s ${delay}s infinite backwards`,
                    }}
                  >
                    <polygon points={lp} fill={lf} />
                    <polygon points={rp} fill={rf} />
                    <polygon points={tp} fill={tf} />
                  </g>
                ))}

                {spawns
                  .filter((s) => s.lane === lane)
                  .map((s) => (
                    <g key={s.id}>
                      {s.cubes.map((c, i) => (
                        <g
                          key={i}
                          style={s.grain ? { animation: `spawnHolo${s.variant} 1.3s linear ${c.delay}ms both` } : undefined}
                        >
                          <g
                            style={{
                              transformBox: "fill-box",
                              transformOrigin: "50% 100%",
                              animation: `spawnLife${s.variant} ${SPAWN_LIFE - i * 130}ms linear ${c.delay}ms both, spawnTint${s.variant} 1.3s linear ${c.delay}ms both`,
                            }}
                          >
                            <polygon points={c.l} fill={c.fills[0]} />
                            <polygon points={c.r} fill={c.fills[1]} />
                            <polygon points={c.t} fill={c.fills[2]} />
                          </g>
                        </g>
                      ))}
                    </g>
                  ))}
              </g>
            </g>
            <path
              d={`M -20 ${LANE_LINES[lane].y} L 1420 ${LANE_LINES[lane].y}`}
              fill="none"
              stroke={LANE_LINES[lane].stroke}
              strokeWidth="1.6"
              style={{
                transformOrigin: `700px ${LANE_LINES[lane].y}px`,
                animation: `lineDraw 0.85s cubic-bezier(0.22,1,0.36,1) ${LANE_LINES[lane].delay}s both, lineHolo 1.5s linear ${LANE_LINES[lane].delay}s both`,
              }}
            />
          </Fragment>
        ))}
      </svg>
      <span className="block-field-fade" />
    </div>
  );
});

export default BlockField;
