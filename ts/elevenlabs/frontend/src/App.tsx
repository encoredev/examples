import { useContext, useEffect, useRef, useState } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import PromptInput from "./PromptInput.tsx";
import VoicesPanel from "./VoicesPanel.tsx";
import audioMotionSettings from "./audioMotionSettings.ts";
import { ClientContext } from "./ClientContext.ts";
import Suggestions from "./Suggestions.tsx";
import { ClockCounterClockwise, UserSound } from "@phosphor-icons/react";
import RangeSlider from "./RangeSlider.tsx";
import HistoryPanel from "./HistoryPanel.tsx";
import gitHubSvg from "./assets/github.svg";
import poweredbyPng from "./assets/poweredby.png";

function App() {
  const client = useContext(ClientContext);
  const [text, setText] = useState("");
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [bufferNode, setBufferNode] = useState<AudioBufferSourceNode>();
  const [showVoicesPanel, setShowVoicesPanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  const [voice, setVoice] = useState<string>("Rachel");
  const [stability, setStability] = useState<number>(50);
  const [similarity, setSimilarity] = useState<number>(75);
  const [exaggeration, setExaggeration] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const onSubmit = async () => {
    setIsStreamLoading(true);
    const context = new AudioContext();

    const payload = JSON.stringify({
      text,
      voice,
      voice_settings: {
        stability: stability / 100,
        similarity: similarity / 100,
        exaggeration: exaggeration / 100,
      },
    });
    await client.elevenlabs
      .generateVoiceAudio("POST", payload)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        setBufferNode(source);
      })
      .finally(() => {
        setIsStreamLoading(false);
      });
  };

  useEffect(() => {
    if (!bufferNode) return;

    const audioMotionAnalyzer = new AudioMotionAnalyzer(
      containerRef.current as HTMLDivElement,
      {
        source: bufferNode,
        ...audioMotionSettings,
      },
    );

    // Play audio
    bufferNode.start();

    return () => {
      audioMotionAnalyzer.destroy();
    };
  }, [bufferNode]);

  return (
    <main className="flex flex-col items-center">
      <VoicesPanel
        show={showVoicesPanel}
        setShow={setShowVoicesPanel}
        setVoice={(voice) => setVoice(voice.name)}
      />

      <HistoryPanel show={showHistoryPanel} setShow={setShowHistoryPanel} />

      {/* Waveform element */}
      <div className="h-[250px]" ref={containerRef} />

      <div className="relative w-[700px] space-y-8">
        <div className="w-full flex justify-end">
          <button
            className="flex items-center text-xs space-x-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-1 border border-gray-400 rounded shadow"
            onClick={() => setShowHistoryPanel(true)}
          >
            <ClockCounterClockwise size={20} />
            <span>History</span>
          </button>
        </div>

        <Suggestions
          onSelect={({ voice, text }) => {
            setVoice(voice);
            setText(text);
          }}
        />

        <PromptInput
          value={text}
          onChange={setText}
          onSubmit={onSubmit}
          isLoading={isStreamLoading}
        />

        <div className="w-fit flex mx-auto">
          <button
            className="flex items-center space-x-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
            onClick={() => setShowVoicesPanel(true)}
          >
            <UserSound size={20} />
            <span>{voice}</span>
          </button>
        </div>

        <div className="w-full flex items-center space-x-10">
          <RangeSlider
            title="Stability"
            minDesc="More variable"
            maxDesc="More stable"
            min={0}
            max={100}
            value={stability}
            setValue={setStability}
          />

          <RangeSlider
            title="Similarity"
            minDesc="Low"
            maxDesc="High"
            min={0}
            max={100}
            value={similarity}
            setValue={setSimilarity}
          />

          <RangeSlider
            title="Style Exaggeration"
            minDesc="None"
            maxDesc="Exaggerated"
            min={0}
            max={100}
            value={exaggeration}
            setValue={setExaggeration}
          />
        </div>
      </div>

      <div className="flex space-x-4 absolute bottom-5 right-5">
        <a
          href="https://github.com/encoredev/examples/tree/main/ts/elevenlabs"
          target="_blank"
        >
          <img src={gitHubSvg} alt="GitHub" className="h-[50px]" />
        </a>
        <a href="https://encore.dev" target="_blank">
          <img
            src={poweredbyPng}
            alt="Powered by Encore"
            className="h-[50px]"
          />
        </a>
      </div>
    </main>
  );
}

export default App;
