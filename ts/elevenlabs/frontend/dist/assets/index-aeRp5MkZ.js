var ap = Object.defineProperty;
var up = (e, t, n) =>
  t in e
    ? ap(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var ot = (e, t, n) => (up(e, typeof t != "symbol" ? t + "" : t, n), n);
function cp(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const l in r)
        if (l !== "default" && !(l in e)) {
          const i = Object.getOwnPropertyDescriptor(r, l);
          i &&
            Object.defineProperty(
              e,
              l,
              i.get ? i : { enumerable: !0, get: () => r[l] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver((l) => {
    for (const i of l)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const i = {};
    return (
      l.integrity && (i.integrity = l.integrity),
      l.referrerPolicy && (i.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function r(l) {
    if (l.ep) return;
    l.ep = !0;
    const i = n(l);
    fetch(l.href, i);
  }
})();
function dp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var ud = { exports: {} },
  Zi = {},
  cd = { exports: {} },
  X = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var kl = Symbol.for("react.element"),
  fp = Symbol.for("react.portal"),
  pp = Symbol.for("react.fragment"),
  hp = Symbol.for("react.strict_mode"),
  mp = Symbol.for("react.profiler"),
  vp = Symbol.for("react.provider"),
  gp = Symbol.for("react.context"),
  yp = Symbol.for("react.forward_ref"),
  wp = Symbol.for("react.suspense"),
  _p = Symbol.for("react.memo"),
  Ep = Symbol.for("react.lazy"),
  yu = Symbol.iterator;
function Sp(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (yu && e[yu]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var dd = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  fd = Object.assign,
  pd = {};
function Nr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = pd),
    (this.updater = n || dd);
}
Nr.prototype.isReactComponent = {};
Nr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Nr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function hd() {}
hd.prototype = Nr.prototype;
function oa(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = pd),
    (this.updater = n || dd);
}
var sa = (oa.prototype = new hd());
sa.constructor = oa;
fd(sa, Nr.prototype);
sa.isPureReactComponent = !0;
var wu = Array.isArray,
  md = Object.prototype.hasOwnProperty,
  aa = { current: null },
  vd = { key: !0, ref: !0, __self: !0, __source: !0 };
function gd(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      md.call(t, r) && !vd.hasOwnProperty(r) && (l[r] = t[r]);
  var s = arguments.length - 2;
  if (s === 1) l.children = n;
  else if (1 < s) {
    for (var a = Array(s), u = 0; u < s; u++) a[u] = arguments[u + 2];
    l.children = a;
  }
  if (e && e.defaultProps)
    for (r in ((s = e.defaultProps), s)) l[r] === void 0 && (l[r] = s[r]);
  return {
    $$typeof: kl,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: aa.current,
  };
}
function xp(e, t) {
  return {
    $$typeof: kl,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function ua(e) {
  return typeof e == "object" && e !== null && e.$$typeof === kl;
}
function kp(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var _u = /\/+/g;
function So(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? kp("" + e.key)
    : t.toString(36);
}
function li(e, t, n, r, l) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case kl:
          case fp:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (l = l(o)),
      (e = r === "" ? "." + So(o, 0) : r),
      wu(l)
        ? ((n = ""),
          e != null && (n = e.replace(_u, "$&/") + "/"),
          li(l, t, n, "", function (u) {
            return u;
          }))
        : l != null &&
          (ua(l) &&
            (l = xp(
              l,
              n +
                (!l.key || (o && o.key === l.key)
                  ? ""
                  : ("" + l.key).replace(_u, "$&/") + "/") +
                e,
            )),
          t.push(l)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), wu(e)))
    for (var s = 0; s < e.length; s++) {
      i = e[s];
      var a = r + So(i, s);
      o += li(i, t, n, a, l);
    }
  else if (((a = Sp(e)), typeof a == "function"))
    for (e = a.call(e), s = 0; !(i = e.next()).done; )
      (i = i.value), (a = r + So(i, s++)), (o += li(i, t, n, a, l));
  else if (i === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      ))
    );
  return o;
}
function Il(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    li(e, r, "", "", function (i) {
      return t.call(n, i, l++);
    }),
    r
  );
}
function Cp(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ue = { current: null },
  ii = { transition: null },
  Lp = {
    ReactCurrentDispatcher: Ue,
    ReactCurrentBatchConfig: ii,
    ReactCurrentOwner: aa,
  };
function yd() {
  throw Error("act(...) is not supported in production builds of React.");
}
X.Children = {
  map: Il,
  forEach: function (e, t, n) {
    Il(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Il(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Il(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!ua(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
X.Component = Nr;
X.Fragment = pp;
X.Profiler = mp;
X.PureComponent = oa;
X.StrictMode = hp;
X.Suspense = wp;
X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Lp;
X.act = yd;
X.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = fd({}, e.props),
    l = e.key,
    i = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (o = aa.current)),
      t.key !== void 0 && (l = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var s = e.type.defaultProps;
    for (a in t)
      md.call(t, a) &&
        !vd.hasOwnProperty(a) &&
        (r[a] = t[a] === void 0 && s !== void 0 ? s[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    s = Array(a);
    for (var u = 0; u < a; u++) s[u] = arguments[u + 2];
    r.children = s;
  }
  return { $$typeof: kl, type: e.type, key: l, ref: i, props: r, _owner: o };
};
X.createContext = function (e) {
  return (
    (e = {
      $$typeof: gp,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: vp, _context: e }),
    (e.Consumer = e)
  );
};
X.createElement = gd;
X.createFactory = function (e) {
  var t = gd.bind(null, e);
  return (t.type = e), t;
};
X.createRef = function () {
  return { current: null };
};
X.forwardRef = function (e) {
  return { $$typeof: yp, render: e };
};
X.isValidElement = ua;
X.lazy = function (e) {
  return { $$typeof: Ep, _payload: { _status: -1, _result: e }, _init: Cp };
};
X.memo = function (e, t) {
  return { $$typeof: _p, type: e, compare: t === void 0 ? null : t };
};
X.startTransition = function (e) {
  var t = ii.transition;
  ii.transition = {};
  try {
    e();
  } finally {
    ii.transition = t;
  }
};
X.unstable_act = yd;
X.useCallback = function (e, t) {
  return Ue.current.useCallback(e, t);
};
X.useContext = function (e) {
  return Ue.current.useContext(e);
};
X.useDebugValue = function () {};
X.useDeferredValue = function (e) {
  return Ue.current.useDeferredValue(e);
};
X.useEffect = function (e, t) {
  return Ue.current.useEffect(e, t);
};
X.useId = function () {
  return Ue.current.useId();
};
X.useImperativeHandle = function (e, t, n) {
  return Ue.current.useImperativeHandle(e, t, n);
};
X.useInsertionEffect = function (e, t) {
  return Ue.current.useInsertionEffect(e, t);
};
X.useLayoutEffect = function (e, t) {
  return Ue.current.useLayoutEffect(e, t);
};
X.useMemo = function (e, t) {
  return Ue.current.useMemo(e, t);
};
X.useReducer = function (e, t, n) {
  return Ue.current.useReducer(e, t, n);
};
X.useRef = function (e) {
  return Ue.current.useRef(e);
};
X.useState = function (e) {
  return Ue.current.useState(e);
};
X.useSyncExternalStore = function (e, t, n) {
  return Ue.current.useSyncExternalStore(e, t, n);
};
X.useTransition = function () {
  return Ue.current.useTransition();
};
X.version = "18.3.1";
cd.exports = X;
var g = cd.exports;
const w = dp(g),
  Eu = cp({ __proto__: null, default: w }, [g]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Np = g,
  Tp = Symbol.for("react.element"),
  Pp = Symbol.for("react.fragment"),
  Rp = Object.prototype.hasOwnProperty,
  Op = Np.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Ap = { key: !0, ref: !0, __self: !0, __source: !0 };
function wd(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (r in t) Rp.call(t, r) && !Ap.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: Tp,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: Op.current,
  };
}
Zi.Fragment = Pp;
Zi.jsx = wd;
Zi.jsxs = wd;
ud.exports = Zi;
var T = ud.exports,
  ls = {},
  _d = { exports: {} },
  rt = {},
  Ed = { exports: {} },
  Sd = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(x, O) {
    var A = x.length;
    x.push(O);
    e: for (; 0 < A; ) {
      var Q = (A - 1) >>> 1,
        H = x[Q];
      if (0 < l(H, O)) (x[Q] = O), (x[A] = H), (A = Q);
      else break e;
    }
  }
  function n(x) {
    return x.length === 0 ? null : x[0];
  }
  function r(x) {
    if (x.length === 0) return null;
    var O = x[0],
      A = x.pop();
    if (A !== O) {
      x[0] = A;
      e: for (var Q = 0, H = x.length, G = H >>> 1; Q < G; ) {
        var te = 2 * (Q + 1) - 1,
          q = x[te],
          V = te + 1,
          I = x[V];
        if (0 > l(q, A))
          V < H && 0 > l(I, q)
            ? ((x[Q] = I), (x[V] = A), (Q = V))
            : ((x[Q] = q), (x[te] = A), (Q = te));
        else if (V < H && 0 > l(I, A)) (x[Q] = I), (x[V] = A), (Q = V);
        else break e;
      }
    }
    return O;
  }
  function l(x, O) {
    var A = x.sortIndex - O.sortIndex;
    return A !== 0 ? A : x.id - O.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      s = o.now();
    e.unstable_now = function () {
      return o.now() - s;
    };
  }
  var a = [],
    u = [],
    f = 1,
    c = null,
    m = 3,
    v = !1,
    _ = !1,
    S = !1,
    N = typeof setTimeout == "function" ? setTimeout : null,
    d = typeof clearTimeout == "function" ? clearTimeout : null,
    p = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function h(x) {
    for (var O = n(u); O !== null; ) {
      if (O.callback === null) r(u);
      else if (O.startTime <= x)
        r(u), (O.sortIndex = O.expirationTime), t(a, O);
      else break;
      O = n(u);
    }
  }
  function E(x) {
    if (((S = !1), h(x), !_))
      if (n(a) !== null) (_ = !0), K(C);
      else {
        var O = n(u);
        O !== null && Z(E, O.startTime - x);
      }
  }
  function C(x, O) {
    (_ = !1), S && ((S = !1), d(P), (P = -1)), (v = !0);
    var A = m;
    try {
      for (
        h(O), c = n(a);
        c !== null && (!(c.expirationTime > O) || (x && !y()));

      ) {
        var Q = c.callback;
        if (typeof Q == "function") {
          (c.callback = null), (m = c.priorityLevel);
          var H = Q(c.expirationTime <= O);
          (O = e.unstable_now()),
            typeof H == "function" ? (c.callback = H) : c === n(a) && r(a),
            h(O);
        } else r(a);
        c = n(a);
      }
      if (c !== null) var G = !0;
      else {
        var te = n(u);
        te !== null && Z(E, te.startTime - O), (G = !1);
      }
      return G;
    } finally {
      (c = null), (m = A), (v = !1);
    }
  }
  var R = !1,
    k = null,
    P = -1,
    j = 5,
    $ = -1;
  function y() {
    return !(e.unstable_now() - $ < j);
  }
  function ne() {
    if (k !== null) {
      var x = e.unstable_now();
      $ = x;
      var O = !0;
      try {
        O = k(!0, x);
      } finally {
        O ? ae() : ((R = !1), (k = null));
      }
    } else R = !1;
  }
  var ae;
  if (typeof p == "function")
    ae = function () {
      p(ne);
    };
  else if (typeof MessageChannel < "u") {
    var we = new MessageChannel(),
      Y = we.port2;
    (we.port1.onmessage = ne),
      (ae = function () {
        Y.postMessage(null);
      });
  } else
    ae = function () {
      N(ne, 0);
    };
  function K(x) {
    (k = x), R || ((R = !0), ae());
  }
  function Z(x, O) {
    P = N(function () {
      x(e.unstable_now());
    }, O);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (x) {
      x.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      _ || v || ((_ = !0), K(C));
    }),
    (e.unstable_forceFrameRate = function (x) {
      0 > x || 125 < x
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (j = 0 < x ? Math.floor(1e3 / x) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return m;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (e.unstable_next = function (x) {
      switch (m) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = m;
      }
      var A = m;
      m = O;
      try {
        return x();
      } finally {
        m = A;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (x, O) {
      switch (x) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          x = 3;
      }
      var A = m;
      m = x;
      try {
        return O();
      } finally {
        m = A;
      }
    }),
    (e.unstable_scheduleCallback = function (x, O, A) {
      var Q = e.unstable_now();
      switch (
        (typeof A == "object" && A !== null
          ? ((A = A.delay), (A = typeof A == "number" && 0 < A ? Q + A : Q))
          : (A = Q),
        x)
      ) {
        case 1:
          var H = -1;
          break;
        case 2:
          H = 250;
          break;
        case 5:
          H = 1073741823;
          break;
        case 4:
          H = 1e4;
          break;
        default:
          H = 5e3;
      }
      return (
        (H = A + H),
        (x = {
          id: f++,
          callback: O,
          priorityLevel: x,
          startTime: A,
          expirationTime: H,
          sortIndex: -1,
        }),
        A > Q
          ? ((x.sortIndex = A),
            t(u, x),
            n(a) === null &&
              x === n(u) &&
              (S ? (d(P), (P = -1)) : (S = !0), Z(E, A - Q)))
          : ((x.sortIndex = H), t(a, x), _ || v || ((_ = !0), K(C))),
        x
      );
    }),
    (e.unstable_shouldYield = y),
    (e.unstable_wrapCallback = function (x) {
      var O = m;
      return function () {
        var A = m;
        m = O;
        try {
          return x.apply(this, arguments);
        } finally {
          m = A;
        }
      };
    });
})(Sd);
Ed.exports = Sd;
var Fp = Ed.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Mp = g,
  nt = Fp;
function L(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var xd = new Set(),
  sl = {};
function Qn(e, t) {
  _r(e, t), _r(e + "Capture", t);
}
function _r(e, t) {
  for (sl[e] = t, e = 0; e < t.length; e++) xd.add(t[e]);
}
var Qt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  is = Object.prototype.hasOwnProperty,
  $p =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Su = {},
  xu = {};
function Ip(e) {
  return is.call(xu, e)
    ? !0
    : is.call(Su, e)
      ? !1
      : $p.test(e)
        ? (xu[e] = !0)
        : ((Su[e] = !0), !1);
}
function jp(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function zp(e, t, n, r) {
  if (t === null || typeof t > "u" || jp(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function We(e, t, n, r, l, i, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o);
}
var Me = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Me[e] = new We(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Me[t] = new We(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Me[e] = new We(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Me[e] = new We(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Me[e] = new We(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Me[e] = new We(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Me[e] = new We(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Me[e] = new We(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Me[e] = new We(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var ca = /[\-:]([a-z])/g;
function da(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ca, da);
    Me[t] = new We(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ca, da);
    Me[t] = new We(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(ca, da);
  Me[t] = new We(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Me[e] = new We(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Me.xlinkHref = new We(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Me[e] = new We(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function fa(e, t, n, r) {
  var l = Me.hasOwnProperty(t) ? Me[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (zp(t, n, l, r) && (n = null),
    r || l === null
      ? Ip(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : l.mustUseProperty
        ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
        : ((t = l.attributeName),
          (r = l.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((l = l.type),
              (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Kt = Mp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  jl = Symbol.for("react.element"),
  nr = Symbol.for("react.portal"),
  rr = Symbol.for("react.fragment"),
  pa = Symbol.for("react.strict_mode"),
  os = Symbol.for("react.profiler"),
  kd = Symbol.for("react.provider"),
  Cd = Symbol.for("react.context"),
  ha = Symbol.for("react.forward_ref"),
  ss = Symbol.for("react.suspense"),
  as = Symbol.for("react.suspense_list"),
  ma = Symbol.for("react.memo"),
  ln = Symbol.for("react.lazy"),
  Ld = Symbol.for("react.offscreen"),
  ku = Symbol.iterator;
function Mr(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (ku && e[ku]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ye = Object.assign,
  xo;
function Wr(e) {
  if (xo === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      xo = (t && t[1]) || "";
    }
  return (
    `
` +
    xo +
    e
  );
}
var ko = !1;
function Co(e, t) {
  if (!e || ko) return "";
  ko = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (
        var l = u.stack.split(`
`),
          i = r.stack.split(`
`),
          o = l.length - 1,
          s = i.length - 1;
        1 <= o && 0 <= s && l[o] !== i[s];

      )
        s--;
      for (; 1 <= o && 0 <= s; o--, s--)
        if (l[o] !== i[s]) {
          if (o !== 1 || s !== 1)
            do
              if ((o--, s--, 0 > s || l[o] !== i[s])) {
                var a =
                  `
` + l[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", e.displayName)),
                  a
                );
              }
            while (1 <= o && 0 <= s);
          break;
        }
    }
  } finally {
    (ko = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? Wr(e) : "";
}
function Dp(e) {
  switch (e.tag) {
    case 5:
      return Wr(e.type);
    case 16:
      return Wr("Lazy");
    case 13:
      return Wr("Suspense");
    case 19:
      return Wr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Co(e.type, !1)), e;
    case 11:
      return (e = Co(e.type.render, !1)), e;
    case 1:
      return (e = Co(e.type, !0)), e;
    default:
      return "";
  }
}
function us(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case rr:
      return "Fragment";
    case nr:
      return "Portal";
    case os:
      return "Profiler";
    case pa:
      return "StrictMode";
    case ss:
      return "Suspense";
    case as:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Cd:
        return (e.displayName || "Context") + ".Consumer";
      case kd:
        return (e._context.displayName || "Context") + ".Provider";
      case ha:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case ma:
        return (
          (t = e.displayName || null), t !== null ? t : us(e.type) || "Memo"
        );
      case ln:
        (t = e._payload), (e = e._init);
        try {
          return us(e(t));
        } catch {}
    }
  return null;
}
function Bp(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return us(t);
    case 8:
      return t === pa ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function En(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Nd(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function Hp(e) {
  var t = Nd(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var l = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (o) {
          (r = "" + o), i.call(this, o);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function zl(e) {
  e._valueTracker || (e._valueTracker = Hp(e));
}
function Td(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Nd(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function gi(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function cs(e, t) {
  var n = t.checked;
  return ye({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function Cu(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = En(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Pd(e, t) {
  (t = t.checked), t != null && fa(e, "checked", t, !1);
}
function ds(e, t) {
  Pd(e, t);
  var n = En(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? fs(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && fs(e, t.type, En(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Lu(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function fs(e, t, n) {
  (t !== "number" || gi(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Gr = Array.isArray;
function hr(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      (l = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + En(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        (e[l].selected = !0), r && (e[l].defaultSelected = !0);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function ps(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(L(91));
  return ye({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Nu(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(L(92));
      if (Gr(n)) {
        if (1 < n.length) throw Error(L(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: En(n) };
}
function Rd(e, t) {
  var n = En(t.value),
    r = En(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Tu(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Od(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function hs(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Od(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Dl,
  Ad = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Dl = Dl || document.createElement("div"),
          Dl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Dl.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function al(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var qr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Vp = ["Webkit", "ms", "Moz", "O"];
Object.keys(qr).forEach(function (e) {
  Vp.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (qr[t] = qr[e]);
  });
});
function Fd(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (qr.hasOwnProperty(e) && qr[e])
      ? ("" + t).trim()
      : t + "px";
}
function Md(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        l = Fd(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : (e[n] = l);
    }
}
var Up = ye(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function ms(e, t) {
  if (t) {
    if (Up[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(L(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(L(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(L(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(L(62));
  }
}
function vs(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var gs = null;
function va(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var ys = null,
  mr = null,
  vr = null;
function Pu(e) {
  if ((e = Nl(e))) {
    if (typeof ys != "function") throw Error(L(280));
    var t = e.stateNode;
    t && ((t = Ki(t)), ys(e.stateNode, e.type, t));
  }
}
function $d(e) {
  mr ? (vr ? vr.push(e) : (vr = [e])) : (mr = e);
}
function Id() {
  if (mr) {
    var e = mr,
      t = vr;
    if (((vr = mr = null), Pu(e), t)) for (e = 0; e < t.length; e++) Pu(t[e]);
  }
}
function jd(e, t) {
  return e(t);
}
function zd() {}
var Lo = !1;
function Dd(e, t, n) {
  if (Lo) return e(t, n);
  Lo = !0;
  try {
    return jd(e, t, n);
  } finally {
    (Lo = !1), (mr !== null || vr !== null) && (zd(), Id());
  }
}
function ul(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Ki(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(L(231, t, typeof n));
  return n;
}
var ws = !1;
if (Qt)
  try {
    var $r = {};
    Object.defineProperty($r, "passive", {
      get: function () {
        ws = !0;
      },
    }),
      window.addEventListener("test", $r, $r),
      window.removeEventListener("test", $r, $r);
  } catch {
    ws = !1;
  }
function Wp(e, t, n, r, l, i, o, s, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (f) {
    this.onError(f);
  }
}
var Yr = !1,
  yi = null,
  wi = !1,
  _s = null,
  Gp = {
    onError: function (e) {
      (Yr = !0), (yi = e);
    },
  };
function Zp(e, t, n, r, l, i, o, s, a) {
  (Yr = !1), (yi = null), Wp.apply(Gp, arguments);
}
function Qp(e, t, n, r, l, i, o, s, a) {
  if ((Zp.apply(this, arguments), Yr)) {
    if (Yr) {
      var u = yi;
      (Yr = !1), (yi = null);
    } else throw Error(L(198));
    wi || ((wi = !0), (_s = u));
  }
}
function Xn(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Bd(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Ru(e) {
  if (Xn(e) !== e) throw Error(L(188));
}
function Xp(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Xn(e)), t === null)) throw Error(L(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return Ru(l), e;
        if (i === r) return Ru(l), t;
        i = i.sibling;
      }
      throw Error(L(188));
    }
    if (n.return !== r.return) (n = l), (r = i);
    else {
      for (var o = !1, s = l.child; s; ) {
        if (s === n) {
          (o = !0), (n = l), (r = i);
          break;
        }
        if (s === r) {
          (o = !0), (r = l), (n = i);
          break;
        }
        s = s.sibling;
      }
      if (!o) {
        for (s = i.child; s; ) {
          if (s === n) {
            (o = !0), (n = i), (r = l);
            break;
          }
          if (s === r) {
            (o = !0), (r = i), (n = l);
            break;
          }
          s = s.sibling;
        }
        if (!o) throw Error(L(189));
      }
    }
    if (n.alternate !== r) throw Error(L(190));
  }
  if (n.tag !== 3) throw Error(L(188));
  return n.stateNode.current === n ? e : t;
}
function Hd(e) {
  return (e = Xp(e)), e !== null ? Vd(e) : null;
}
function Vd(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Vd(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Ud = nt.unstable_scheduleCallback,
  Ou = nt.unstable_cancelCallback,
  qp = nt.unstable_shouldYield,
  Yp = nt.unstable_requestPaint,
  Ee = nt.unstable_now,
  Kp = nt.unstable_getCurrentPriorityLevel,
  ga = nt.unstable_ImmediatePriority,
  Wd = nt.unstable_UserBlockingPriority,
  _i = nt.unstable_NormalPriority,
  Jp = nt.unstable_LowPriority,
  Gd = nt.unstable_IdlePriority,
  Qi = null,
  Mt = null;
function bp(e) {
  if (Mt && typeof Mt.onCommitFiberRoot == "function")
    try {
      Mt.onCommitFiberRoot(Qi, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Et = Math.clz32 ? Math.clz32 : n1,
  e1 = Math.log,
  t1 = Math.LN2;
function n1(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((e1(e) / t1) | 0)) | 0;
}
var Bl = 64,
  Hl = 4194304;
function Zr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Ei(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    i = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var s = o & ~l;
    s !== 0 ? (r = Zr(s)) : ((i &= o), i !== 0 && (r = Zr(i)));
  } else (o = n & ~l), o !== 0 ? (r = Zr(o)) : i !== 0 && (r = Zr(i));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - Et(t)), (l = 1 << n), (r |= e[n]), (t &= ~l);
  return r;
}
function r1(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function l1(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var o = 31 - Et(i),
      s = 1 << o,
      a = l[o];
    a === -1
      ? (!(s & n) || s & r) && (l[o] = r1(s, t))
      : a <= t && (e.expiredLanes |= s),
      (i &= ~s);
  }
}
function Es(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Zd() {
  var e = Bl;
  return (Bl <<= 1), !(Bl & 4194240) && (Bl = 64), e;
}
function No(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Cl(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Et(t)),
    (e[t] = n);
}
function i1(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Et(n),
      i = 1 << l;
    (t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i);
  }
}
function ya(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Et(n),
      l = 1 << r;
    (l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l);
  }
}
var le = 0;
function Qd(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1;
}
var Xd,
  wa,
  qd,
  Yd,
  Kd,
  Ss = !1,
  Vl = [],
  pn = null,
  hn = null,
  mn = null,
  cl = new Map(),
  dl = new Map(),
  sn = [],
  o1 =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Au(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      pn = null;
      break;
    case "dragenter":
    case "dragleave":
      hn = null;
      break;
    case "mouseover":
    case "mouseout":
      mn = null;
      break;
    case "pointerover":
    case "pointerout":
      cl.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      dl.delete(t.pointerId);
  }
}
function Ir(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [l],
      }),
      t !== null && ((t = Nl(t)), t !== null && wa(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function s1(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return (pn = Ir(pn, e, t, n, r, l)), !0;
    case "dragenter":
      return (hn = Ir(hn, e, t, n, r, l)), !0;
    case "mouseover":
      return (mn = Ir(mn, e, t, n, r, l)), !0;
    case "pointerover":
      var i = l.pointerId;
      return cl.set(i, Ir(cl.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return (
        (i = l.pointerId), dl.set(i, Ir(dl.get(i) || null, e, t, n, r, l)), !0
      );
  }
  return !1;
}
function Jd(e) {
  var t = $n(e.target);
  if (t !== null) {
    var n = Xn(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Bd(n)), t !== null)) {
          (e.blockedOn = t),
            Kd(e.priority, function () {
              qd(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function oi(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = xs(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (gs = r), n.target.dispatchEvent(r), (gs = null);
    } else return (t = Nl(n)), t !== null && wa(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function Fu(e, t, n) {
  oi(e) && n.delete(t);
}
function a1() {
  (Ss = !1),
    pn !== null && oi(pn) && (pn = null),
    hn !== null && oi(hn) && (hn = null),
    mn !== null && oi(mn) && (mn = null),
    cl.forEach(Fu),
    dl.forEach(Fu);
}
function jr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Ss ||
      ((Ss = !0),
      nt.unstable_scheduleCallback(nt.unstable_NormalPriority, a1)));
}
function fl(e) {
  function t(l) {
    return jr(l, e);
  }
  if (0 < Vl.length) {
    jr(Vl[0], e);
    for (var n = 1; n < Vl.length; n++) {
      var r = Vl[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    pn !== null && jr(pn, e),
      hn !== null && jr(hn, e),
      mn !== null && jr(mn, e),
      cl.forEach(t),
      dl.forEach(t),
      n = 0;
    n < sn.length;
    n++
  )
    (r = sn[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < sn.length && ((n = sn[0]), n.blockedOn === null); )
    Jd(n), n.blockedOn === null && sn.shift();
}
var gr = Kt.ReactCurrentBatchConfig,
  Si = !0;
function u1(e, t, n, r) {
  var l = le,
    i = gr.transition;
  gr.transition = null;
  try {
    (le = 1), _a(e, t, n, r);
  } finally {
    (le = l), (gr.transition = i);
  }
}
function c1(e, t, n, r) {
  var l = le,
    i = gr.transition;
  gr.transition = null;
  try {
    (le = 4), _a(e, t, n, r);
  } finally {
    (le = l), (gr.transition = i);
  }
}
function _a(e, t, n, r) {
  if (Si) {
    var l = xs(e, t, n, r);
    if (l === null) jo(e, t, r, xi, n), Au(e, r);
    else if (s1(l, e, t, n, r)) r.stopPropagation();
    else if ((Au(e, r), t & 4 && -1 < o1.indexOf(e))) {
      for (; l !== null; ) {
        var i = Nl(l);
        if (
          (i !== null && Xd(i),
          (i = xs(e, t, n, r)),
          i === null && jo(e, t, r, xi, n),
          i === l)
        )
          break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else jo(e, t, r, null, n);
  }
}
var xi = null;
function xs(e, t, n, r) {
  if (((xi = null), (e = va(r)), (e = $n(e)), e !== null))
    if (((t = Xn(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Bd(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (xi = e), null;
}
function bd(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Kp()) {
        case ga:
          return 1;
        case Wd:
          return 4;
        case _i:
        case Jp:
          return 16;
        case Gd:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var cn = null,
  Ea = null,
  si = null;
function ef() {
  if (si) return si;
  var e,
    t = Ea,
    n = t.length,
    r,
    l = "value" in cn ? cn.value : cn.textContent,
    i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++);
  return (si = l.slice(e, 1 < r ? 1 - r : void 0));
}
function ai(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Ul() {
  return !0;
}
function Mu() {
  return !1;
}
function lt(e) {
  function t(n, r, l, i, o) {
    (this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null);
    for (var s in e)
      e.hasOwnProperty(s) && ((n = e[s]), (this[s] = n ? n(i) : i[s]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Ul
        : Mu),
      (this.isPropagationStopped = Mu),
      this
    );
  }
  return (
    ye(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Ul));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Ul));
      },
      persist: function () {},
      isPersistent: Ul,
    }),
    t
  );
}
var Tr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Sa = lt(Tr),
  Ll = ye({}, Tr, { view: 0, detail: 0 }),
  d1 = lt(Ll),
  To,
  Po,
  zr,
  Xi = ye({}, Ll, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: xa,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== zr &&
            (zr && e.type === "mousemove"
              ? ((To = e.screenX - zr.screenX), (Po = e.screenY - zr.screenY))
              : (Po = To = 0),
            (zr = e)),
          To);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Po;
    },
  }),
  $u = lt(Xi),
  f1 = ye({}, Xi, { dataTransfer: 0 }),
  p1 = lt(f1),
  h1 = ye({}, Ll, { relatedTarget: 0 }),
  Ro = lt(h1),
  m1 = ye({}, Tr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  v1 = lt(m1),
  g1 = ye({}, Tr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  y1 = lt(g1),
  w1 = ye({}, Tr, { data: 0 }),
  Iu = lt(w1),
  _1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  E1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  S1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function x1(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = S1[e]) ? !!t[e] : !1;
}
function xa() {
  return x1;
}
var k1 = ye({}, Ll, {
    key: function (e) {
      if (e.key) {
        var t = _1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = ai(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? E1[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: xa,
    charCode: function (e) {
      return e.type === "keypress" ? ai(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? ai(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  C1 = lt(k1),
  L1 = ye({}, Xi, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  ju = lt(L1),
  N1 = ye({}, Ll, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: xa,
  }),
  T1 = lt(N1),
  P1 = ye({}, Tr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  R1 = lt(P1),
  O1 = ye({}, Xi, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  A1 = lt(O1),
  F1 = [9, 13, 27, 32],
  ka = Qt && "CompositionEvent" in window,
  Kr = null;
Qt && "documentMode" in document && (Kr = document.documentMode);
var M1 = Qt && "TextEvent" in window && !Kr,
  tf = Qt && (!ka || (Kr && 8 < Kr && 11 >= Kr)),
  zu = " ",
  Du = !1;
function nf(e, t) {
  switch (e) {
    case "keyup":
      return F1.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function rf(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var lr = !1;
function $1(e, t) {
  switch (e) {
    case "compositionend":
      return rf(t);
    case "keypress":
      return t.which !== 32 ? null : ((Du = !0), zu);
    case "textInput":
      return (e = t.data), e === zu && Du ? null : e;
    default:
      return null;
  }
}
function I1(e, t) {
  if (lr)
    return e === "compositionend" || (!ka && nf(e, t))
      ? ((e = ef()), (si = Ea = cn = null), (lr = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return tf && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var j1 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Bu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!j1[e.type] : t === "textarea";
}
function lf(e, t, n, r) {
  $d(r),
    (t = ki(t, "onChange")),
    0 < t.length &&
      ((n = new Sa("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Jr = null,
  pl = null;
function z1(e) {
  vf(e, 0);
}
function qi(e) {
  var t = sr(e);
  if (Td(t)) return e;
}
function D1(e, t) {
  if (e === "change") return t;
}
var of = !1;
if (Qt) {
  var Oo;
  if (Qt) {
    var Ao = "oninput" in document;
    if (!Ao) {
      var Hu = document.createElement("div");
      Hu.setAttribute("oninput", "return;"),
        (Ao = typeof Hu.oninput == "function");
    }
    Oo = Ao;
  } else Oo = !1;
  of = Oo && (!document.documentMode || 9 < document.documentMode);
}
function Vu() {
  Jr && (Jr.detachEvent("onpropertychange", sf), (pl = Jr = null));
}
function sf(e) {
  if (e.propertyName === "value" && qi(pl)) {
    var t = [];
    lf(t, pl, e, va(e)), Dd(z1, t);
  }
}
function B1(e, t, n) {
  e === "focusin"
    ? (Vu(), (Jr = t), (pl = n), Jr.attachEvent("onpropertychange", sf))
    : e === "focusout" && Vu();
}
function H1(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return qi(pl);
}
function V1(e, t) {
  if (e === "click") return qi(t);
}
function U1(e, t) {
  if (e === "input" || e === "change") return qi(t);
}
function W1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var xt = typeof Object.is == "function" ? Object.is : W1;
function hl(e, t) {
  if (xt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!is.call(t, l) || !xt(e[l], t[l])) return !1;
  }
  return !0;
}
function Uu(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Wu(e, t) {
  var n = Uu(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Uu(n);
  }
}
function af(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? af(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function uf() {
  for (var e = window, t = gi(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = gi(e.document);
  }
  return t;
}
function Ca(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function G1(e) {
  var t = uf(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    af(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Ca(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          i = Math.min(r.start, l);
        (r = r.end === void 0 ? i : Math.min(r.end, l)),
          !e.extend && i > r && ((l = r), (r = i), (i = l)),
          (l = Wu(n, i));
        var o = Wu(n, r);
        l &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var Z1 = Qt && "documentMode" in document && 11 >= document.documentMode,
  ir = null,
  ks = null,
  br = null,
  Cs = !1;
function Gu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Cs ||
    ir == null ||
    ir !== gi(r) ||
    ((r = ir),
    "selectionStart" in r && Ca(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (br && hl(br, r)) ||
      ((br = r),
      (r = ki(ks, "onSelect")),
      0 < r.length &&
        ((t = new Sa("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = ir))));
}
function Wl(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var or = {
    animationend: Wl("Animation", "AnimationEnd"),
    animationiteration: Wl("Animation", "AnimationIteration"),
    animationstart: Wl("Animation", "AnimationStart"),
    transitionend: Wl("Transition", "TransitionEnd"),
  },
  Fo = {},
  cf = {};
Qt &&
  ((cf = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete or.animationend.animation,
    delete or.animationiteration.animation,
    delete or.animationstart.animation),
  "TransitionEvent" in window || delete or.transitionend.transition);
function Yi(e) {
  if (Fo[e]) return Fo[e];
  if (!or[e]) return e;
  var t = or[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in cf) return (Fo[e] = t[n]);
  return e;
}
var df = Yi("animationend"),
  ff = Yi("animationiteration"),
  pf = Yi("animationstart"),
  hf = Yi("transitionend"),
  mf = new Map(),
  Zu =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function xn(e, t) {
  mf.set(e, t), Qn(t, [e]);
}
for (var Mo = 0; Mo < Zu.length; Mo++) {
  var $o = Zu[Mo],
    Q1 = $o.toLowerCase(),
    X1 = $o[0].toUpperCase() + $o.slice(1);
  xn(Q1, "on" + X1);
}
xn(df, "onAnimationEnd");
xn(ff, "onAnimationIteration");
xn(pf, "onAnimationStart");
xn("dblclick", "onDoubleClick");
xn("focusin", "onFocus");
xn("focusout", "onBlur");
xn(hf, "onTransitionEnd");
_r("onMouseEnter", ["mouseout", "mouseover"]);
_r("onMouseLeave", ["mouseout", "mouseover"]);
_r("onPointerEnter", ["pointerout", "pointerover"]);
_r("onPointerLeave", ["pointerout", "pointerover"]);
Qn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Qn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Qn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Qn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Qn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Qn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var Qr =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  q1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(Qr));
function Qu(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), Qp(r, t, void 0, e), (e.currentTarget = null);
}
function vf(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var s = r[o],
            a = s.instance,
            u = s.currentTarget;
          if (((s = s.listener), a !== i && l.isPropagationStopped())) break e;
          Qu(l, s, u), (i = a);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((s = r[o]),
            (a = s.instance),
            (u = s.currentTarget),
            (s = s.listener),
            a !== i && l.isPropagationStopped())
          )
            break e;
          Qu(l, s, u), (i = a);
        }
    }
  }
  if (wi) throw ((e = _s), (wi = !1), (_s = null), e);
}
function ce(e, t) {
  var n = t[Rs];
  n === void 0 && (n = t[Rs] = new Set());
  var r = e + "__bubble";
  n.has(r) || (gf(t, e, 2, !1), n.add(r));
}
function Io(e, t, n) {
  var r = 0;
  t && (r |= 4), gf(n, e, r, t);
}
var Gl = "_reactListening" + Math.random().toString(36).slice(2);
function ml(e) {
  if (!e[Gl]) {
    (e[Gl] = !0),
      xd.forEach(function (n) {
        n !== "selectionchange" && (q1.has(n) || Io(n, !1, e), Io(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Gl] || ((t[Gl] = !0), Io("selectionchange", !1, t));
  }
}
function gf(e, t, n, r) {
  switch (bd(t)) {
    case 1:
      var l = u1;
      break;
    case 4:
      l = c1;
      break;
    default:
      l = _a;
  }
  (n = l.bind(null, t, n, e)),
    (l = void 0),
    !ws ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
        ? e.addEventListener(t, n, { passive: l })
        : e.addEventListener(t, n, !1);
}
function jo(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var s = r.stateNode.containerInfo;
        if (s === l || (s.nodeType === 8 && s.parentNode === l)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var a = o.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = o.stateNode.containerInfo),
              a === l || (a.nodeType === 8 && a.parentNode === l))
            )
              return;
            o = o.return;
          }
        for (; s !== null; ) {
          if (((o = $n(s)), o === null)) return;
          if (((a = o.tag), a === 5 || a === 6)) {
            r = i = o;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
  Dd(function () {
    var u = i,
      f = va(n),
      c = [];
    e: {
      var m = mf.get(e);
      if (m !== void 0) {
        var v = Sa,
          _ = e;
        switch (e) {
          case "keypress":
            if (ai(n) === 0) break e;
          case "keydown":
          case "keyup":
            v = C1;
            break;
          case "focusin":
            (_ = "focus"), (v = Ro);
            break;
          case "focusout":
            (_ = "blur"), (v = Ro);
            break;
          case "beforeblur":
          case "afterblur":
            v = Ro;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = $u;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = p1;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = T1;
            break;
          case df:
          case ff:
          case pf:
            v = v1;
            break;
          case hf:
            v = R1;
            break;
          case "scroll":
            v = d1;
            break;
          case "wheel":
            v = A1;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = y1;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = ju;
        }
        var S = (t & 4) !== 0,
          N = !S && e === "scroll",
          d = S ? (m !== null ? m + "Capture" : null) : m;
        S = [];
        for (var p = u, h; p !== null; ) {
          h = p;
          var E = h.stateNode;
          if (
            (h.tag === 5 &&
              E !== null &&
              ((h = E),
              d !== null && ((E = ul(p, d)), E != null && S.push(vl(p, E, h)))),
            N)
          )
            break;
          p = p.return;
        }
        0 < S.length &&
          ((m = new v(m, _, null, n, f)), c.push({ event: m, listeners: S }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((m = e === "mouseover" || e === "pointerover"),
          (v = e === "mouseout" || e === "pointerout"),
          m &&
            n !== gs &&
            (_ = n.relatedTarget || n.fromElement) &&
            ($n(_) || _[Xt]))
        )
          break e;
        if (
          (v || m) &&
          ((m =
            f.window === f
              ? f
              : (m = f.ownerDocument)
                ? m.defaultView || m.parentWindow
                : window),
          v
            ? ((_ = n.relatedTarget || n.toElement),
              (v = u),
              (_ = _ ? $n(_) : null),
              _ !== null &&
                ((N = Xn(_)), _ !== N || (_.tag !== 5 && _.tag !== 6)) &&
                (_ = null))
            : ((v = null), (_ = u)),
          v !== _)
        ) {
          if (
            ((S = $u),
            (E = "onMouseLeave"),
            (d = "onMouseEnter"),
            (p = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((S = ju),
              (E = "onPointerLeave"),
              (d = "onPointerEnter"),
              (p = "pointer")),
            (N = v == null ? m : sr(v)),
            (h = _ == null ? m : sr(_)),
            (m = new S(E, p + "leave", v, n, f)),
            (m.target = N),
            (m.relatedTarget = h),
            (E = null),
            $n(f) === u &&
              ((S = new S(d, p + "enter", _, n, f)),
              (S.target = h),
              (S.relatedTarget = N),
              (E = S)),
            (N = E),
            v && _)
          )
            t: {
              for (S = v, d = _, p = 0, h = S; h; h = Kn(h)) p++;
              for (h = 0, E = d; E; E = Kn(E)) h++;
              for (; 0 < p - h; ) (S = Kn(S)), p--;
              for (; 0 < h - p; ) (d = Kn(d)), h--;
              for (; p--; ) {
                if (S === d || (d !== null && S === d.alternate)) break t;
                (S = Kn(S)), (d = Kn(d));
              }
              S = null;
            }
          else S = null;
          v !== null && Xu(c, m, v, S, !1),
            _ !== null && N !== null && Xu(c, N, _, S, !0);
        }
      }
      e: {
        if (
          ((m = u ? sr(u) : window),
          (v = m.nodeName && m.nodeName.toLowerCase()),
          v === "select" || (v === "input" && m.type === "file"))
        )
          var C = D1;
        else if (Bu(m))
          if (of) C = U1;
          else {
            C = H1;
            var R = B1;
          }
        else
          (v = m.nodeName) &&
            v.toLowerCase() === "input" &&
            (m.type === "checkbox" || m.type === "radio") &&
            (C = V1);
        if (C && (C = C(e, u))) {
          lf(c, C, n, f);
          break e;
        }
        R && R(e, m, u),
          e === "focusout" &&
            (R = m._wrapperState) &&
            R.controlled &&
            m.type === "number" &&
            fs(m, "number", m.value);
      }
      switch (((R = u ? sr(u) : window), e)) {
        case "focusin":
          (Bu(R) || R.contentEditable === "true") &&
            ((ir = R), (ks = u), (br = null));
          break;
        case "focusout":
          br = ks = ir = null;
          break;
        case "mousedown":
          Cs = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Cs = !1), Gu(c, n, f);
          break;
        case "selectionchange":
          if (Z1) break;
        case "keydown":
        case "keyup":
          Gu(c, n, f);
      }
      var k;
      if (ka)
        e: {
          switch (e) {
            case "compositionstart":
              var P = "onCompositionStart";
              break e;
            case "compositionend":
              P = "onCompositionEnd";
              break e;
            case "compositionupdate":
              P = "onCompositionUpdate";
              break e;
          }
          P = void 0;
        }
      else
        lr
          ? nf(e, n) && (P = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (P = "onCompositionStart");
      P &&
        (tf &&
          n.locale !== "ko" &&
          (lr || P !== "onCompositionStart"
            ? P === "onCompositionEnd" && lr && (k = ef())
            : ((cn = f),
              (Ea = "value" in cn ? cn.value : cn.textContent),
              (lr = !0))),
        (R = ki(u, P)),
        0 < R.length &&
          ((P = new Iu(P, e, null, n, f)),
          c.push({ event: P, listeners: R }),
          k ? (P.data = k) : ((k = rf(n)), k !== null && (P.data = k)))),
        (k = M1 ? $1(e, n) : I1(e, n)) &&
          ((u = ki(u, "onBeforeInput")),
          0 < u.length &&
            ((f = new Iu("onBeforeInput", "beforeinput", null, n, f)),
            c.push({ event: f, listeners: u }),
            (f.data = k)));
    }
    vf(c, t);
  });
}
function vl(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function ki(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e,
      i = l.stateNode;
    l.tag === 5 &&
      i !== null &&
      ((l = i),
      (i = ul(e, n)),
      i != null && r.unshift(vl(e, i, l)),
      (i = ul(e, t)),
      i != null && r.push(vl(e, i, l))),
      (e = e.return);
  }
  return r;
}
function Kn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Xu(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var s = n,
      a = s.alternate,
      u = s.stateNode;
    if (a !== null && a === r) break;
    s.tag === 5 &&
      u !== null &&
      ((s = u),
      l
        ? ((a = ul(n, i)), a != null && o.unshift(vl(n, a, s)))
        : l || ((a = ul(n, i)), a != null && o.push(vl(n, a, s)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Y1 = /\r\n?/g,
  K1 = /\u0000|\uFFFD/g;
function qu(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Y1,
      `
`,
    )
    .replace(K1, "");
}
function Zl(e, t, n) {
  if (((t = qu(t)), qu(e) !== t && n)) throw Error(L(425));
}
function Ci() {}
var Ls = null,
  Ns = null;
function Ts(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Ps = typeof setTimeout == "function" ? setTimeout : void 0,
  J1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Yu = typeof Promise == "function" ? Promise : void 0,
  b1 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Yu < "u"
        ? function (e) {
            return Yu.resolve(null).then(e).catch(eh);
          }
        : Ps;
function eh(e) {
  setTimeout(function () {
    throw e;
  });
}
function zo(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(l), fl(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = l;
  } while (n);
  fl(t);
}
function vn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Ku(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Pr = Math.random().toString(36).slice(2),
  At = "__reactFiber$" + Pr,
  gl = "__reactProps$" + Pr,
  Xt = "__reactContainer$" + Pr,
  Rs = "__reactEvents$" + Pr,
  th = "__reactListeners$" + Pr,
  nh = "__reactHandles$" + Pr;
function $n(e) {
  var t = e[At];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Xt] || n[At])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Ku(e); e !== null; ) {
          if ((n = e[At])) return n;
          e = Ku(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Nl(e) {
  return (
    (e = e[At] || e[Xt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function sr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(L(33));
}
function Ki(e) {
  return e[gl] || null;
}
var Os = [],
  ar = -1;
function kn(e) {
  return { current: e };
}
function fe(e) {
  0 > ar || ((e.current = Os[ar]), (Os[ar] = null), ar--);
}
function se(e, t) {
  ar++, (Os[ar] = e.current), (e.current = t);
}
var Sn = {},
  ze = kn(Sn),
  Xe = kn(!1),
  Vn = Sn;
function Er(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Sn;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    i;
  for (i in n) l[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function qe(e) {
  return (e = e.childContextTypes), e != null;
}
function Li() {
  fe(Xe), fe(ze);
}
function Ju(e, t, n) {
  if (ze.current !== Sn) throw Error(L(168));
  se(ze, t), se(Xe, n);
}
function yf(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(L(108, Bp(e) || "Unknown", l));
  return ye({}, n, r);
}
function Ni(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Sn),
    (Vn = ze.current),
    se(ze, e),
    se(Xe, Xe.current),
    !0
  );
}
function bu(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(L(169));
  n
    ? ((e = yf(e, t, Vn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      fe(Xe),
      fe(ze),
      se(ze, e))
    : fe(Xe),
    se(Xe, n);
}
var Ht = null,
  Ji = !1,
  Do = !1;
function wf(e) {
  Ht === null ? (Ht = [e]) : Ht.push(e);
}
function rh(e) {
  (Ji = !0), wf(e);
}
function Cn() {
  if (!Do && Ht !== null) {
    Do = !0;
    var e = 0,
      t = le;
    try {
      var n = Ht;
      for (le = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Ht = null), (Ji = !1);
    } catch (l) {
      throw (Ht !== null && (Ht = Ht.slice(e + 1)), Ud(ga, Cn), l);
    } finally {
      (le = t), (Do = !1);
    }
  }
  return null;
}
var ur = [],
  cr = 0,
  Ti = null,
  Pi = 0,
  at = [],
  ut = 0,
  Un = null,
  Ut = 1,
  Wt = "";
function Fn(e, t) {
  (ur[cr++] = Pi), (ur[cr++] = Ti), (Ti = e), (Pi = t);
}
function _f(e, t, n) {
  (at[ut++] = Ut), (at[ut++] = Wt), (at[ut++] = Un), (Un = e);
  var r = Ut;
  e = Wt;
  var l = 32 - Et(r) - 1;
  (r &= ~(1 << l)), (n += 1);
  var i = 32 - Et(t) + l;
  if (30 < i) {
    var o = l - (l % 5);
    (i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (l -= o),
      (Ut = (1 << (32 - Et(t) + l)) | (n << l) | r),
      (Wt = i + e);
  } else (Ut = (1 << i) | (n << l) | r), (Wt = e);
}
function La(e) {
  e.return !== null && (Fn(e, 1), _f(e, 1, 0));
}
function Na(e) {
  for (; e === Ti; )
    (Ti = ur[--cr]), (ur[cr] = null), (Pi = ur[--cr]), (ur[cr] = null);
  for (; e === Un; )
    (Un = at[--ut]),
      (at[ut] = null),
      (Wt = at[--ut]),
      (at[ut] = null),
      (Ut = at[--ut]),
      (at[ut] = null);
}
var tt = null,
  et = null,
  me = !1,
  _t = null;
function Ef(e, t) {
  var n = ct(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function ec(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (tt = e), (et = vn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (tt = e), (et = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Un !== null ? { id: Ut, overflow: Wt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = ct(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (tt = e),
            (et = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function As(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Fs(e) {
  if (me) {
    var t = et;
    if (t) {
      var n = t;
      if (!ec(e, t)) {
        if (As(e)) throw Error(L(418));
        t = vn(n.nextSibling);
        var r = tt;
        t && ec(e, t)
          ? Ef(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (me = !1), (tt = e));
      }
    } else {
      if (As(e)) throw Error(L(418));
      (e.flags = (e.flags & -4097) | 2), (me = !1), (tt = e);
    }
  }
}
function tc(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  tt = e;
}
function Ql(e) {
  if (e !== tt) return !1;
  if (!me) return tc(e), (me = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Ts(e.type, e.memoizedProps))),
    t && (t = et))
  ) {
    if (As(e)) throw (Sf(), Error(L(418)));
    for (; t; ) Ef(e, t), (t = vn(t.nextSibling));
  }
  if ((tc(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(L(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              et = vn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      et = null;
    }
  } else et = tt ? vn(e.stateNode.nextSibling) : null;
  return !0;
}
function Sf() {
  for (var e = et; e; ) e = vn(e.nextSibling);
}
function Sr() {
  (et = tt = null), (me = !1);
}
function Ta(e) {
  _t === null ? (_t = [e]) : _t.push(e);
}
var lh = Kt.ReactCurrentBatchConfig;
function Dr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(L(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(L(147, e));
      var l = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (o) {
            var s = l.refs;
            o === null ? delete s[i] : (s[i] = o);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(L(284));
    if (!n._owner) throw Error(L(290, e));
  }
  return e;
}
function Xl(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      L(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    ))
  );
}
function nc(e) {
  var t = e._init;
  return t(e._payload);
}
function xf(e) {
  function t(d, p) {
    if (e) {
      var h = d.deletions;
      h === null ? ((d.deletions = [p]), (d.flags |= 16)) : h.push(p);
    }
  }
  function n(d, p) {
    if (!e) return null;
    for (; p !== null; ) t(d, p), (p = p.sibling);
    return null;
  }
  function r(d, p) {
    for (d = new Map(); p !== null; )
      p.key !== null ? d.set(p.key, p) : d.set(p.index, p), (p = p.sibling);
    return d;
  }
  function l(d, p) {
    return (d = _n(d, p)), (d.index = 0), (d.sibling = null), d;
  }
  function i(d, p, h) {
    return (
      (d.index = h),
      e
        ? ((h = d.alternate),
          h !== null
            ? ((h = h.index), h < p ? ((d.flags |= 2), p) : h)
            : ((d.flags |= 2), p))
        : ((d.flags |= 1048576), p)
    );
  }
  function o(d) {
    return e && d.alternate === null && (d.flags |= 2), d;
  }
  function s(d, p, h, E) {
    return p === null || p.tag !== 6
      ? ((p = Zo(h, d.mode, E)), (p.return = d), p)
      : ((p = l(p, h)), (p.return = d), p);
  }
  function a(d, p, h, E) {
    var C = h.type;
    return C === rr
      ? f(d, p, h.props.children, E, h.key)
      : p !== null &&
          (p.elementType === C ||
            (typeof C == "object" &&
              C !== null &&
              C.$$typeof === ln &&
              nc(C) === p.type))
        ? ((E = l(p, h.props)), (E.ref = Dr(d, p, h)), (E.return = d), E)
        : ((E = mi(h.type, h.key, h.props, null, d.mode, E)),
          (E.ref = Dr(d, p, h)),
          (E.return = d),
          E);
  }
  function u(d, p, h, E) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== h.containerInfo ||
      p.stateNode.implementation !== h.implementation
      ? ((p = Qo(h, d.mode, E)), (p.return = d), p)
      : ((p = l(p, h.children || [])), (p.return = d), p);
  }
  function f(d, p, h, E, C) {
    return p === null || p.tag !== 7
      ? ((p = Bn(h, d.mode, E, C)), (p.return = d), p)
      : ((p = l(p, h)), (p.return = d), p);
  }
  function c(d, p, h) {
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return (p = Zo("" + p, d.mode, h)), (p.return = d), p;
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case jl:
          return (
            (h = mi(p.type, p.key, p.props, null, d.mode, h)),
            (h.ref = Dr(d, null, p)),
            (h.return = d),
            h
          );
        case nr:
          return (p = Qo(p, d.mode, h)), (p.return = d), p;
        case ln:
          var E = p._init;
          return c(d, E(p._payload), h);
      }
      if (Gr(p) || Mr(p))
        return (p = Bn(p, d.mode, h, null)), (p.return = d), p;
      Xl(d, p);
    }
    return null;
  }
  function m(d, p, h, E) {
    var C = p !== null ? p.key : null;
    if ((typeof h == "string" && h !== "") || typeof h == "number")
      return C !== null ? null : s(d, p, "" + h, E);
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case jl:
          return h.key === C ? a(d, p, h, E) : null;
        case nr:
          return h.key === C ? u(d, p, h, E) : null;
        case ln:
          return (C = h._init), m(d, p, C(h._payload), E);
      }
      if (Gr(h) || Mr(h)) return C !== null ? null : f(d, p, h, E, null);
      Xl(d, h);
    }
    return null;
  }
  function v(d, p, h, E, C) {
    if ((typeof E == "string" && E !== "") || typeof E == "number")
      return (d = d.get(h) || null), s(p, d, "" + E, C);
    if (typeof E == "object" && E !== null) {
      switch (E.$$typeof) {
        case jl:
          return (d = d.get(E.key === null ? h : E.key) || null), a(p, d, E, C);
        case nr:
          return (d = d.get(E.key === null ? h : E.key) || null), u(p, d, E, C);
        case ln:
          var R = E._init;
          return v(d, p, h, R(E._payload), C);
      }
      if (Gr(E) || Mr(E)) return (d = d.get(h) || null), f(p, d, E, C, null);
      Xl(p, E);
    }
    return null;
  }
  function _(d, p, h, E) {
    for (
      var C = null, R = null, k = p, P = (p = 0), j = null;
      k !== null && P < h.length;
      P++
    ) {
      k.index > P ? ((j = k), (k = null)) : (j = k.sibling);
      var $ = m(d, k, h[P], E);
      if ($ === null) {
        k === null && (k = j);
        break;
      }
      e && k && $.alternate === null && t(d, k),
        (p = i($, p, P)),
        R === null ? (C = $) : (R.sibling = $),
        (R = $),
        (k = j);
    }
    if (P === h.length) return n(d, k), me && Fn(d, P), C;
    if (k === null) {
      for (; P < h.length; P++)
        (k = c(d, h[P], E)),
          k !== null &&
            ((p = i(k, p, P)), R === null ? (C = k) : (R.sibling = k), (R = k));
      return me && Fn(d, P), C;
    }
    for (k = r(d, k); P < h.length; P++)
      (j = v(k, d, P, h[P], E)),
        j !== null &&
          (e && j.alternate !== null && k.delete(j.key === null ? P : j.key),
          (p = i(j, p, P)),
          R === null ? (C = j) : (R.sibling = j),
          (R = j));
    return (
      e &&
        k.forEach(function (y) {
          return t(d, y);
        }),
      me && Fn(d, P),
      C
    );
  }
  function S(d, p, h, E) {
    var C = Mr(h);
    if (typeof C != "function") throw Error(L(150));
    if (((h = C.call(h)), h == null)) throw Error(L(151));
    for (
      var R = (C = null), k = p, P = (p = 0), j = null, $ = h.next();
      k !== null && !$.done;
      P++, $ = h.next()
    ) {
      k.index > P ? ((j = k), (k = null)) : (j = k.sibling);
      var y = m(d, k, $.value, E);
      if (y === null) {
        k === null && (k = j);
        break;
      }
      e && k && y.alternate === null && t(d, k),
        (p = i(y, p, P)),
        R === null ? (C = y) : (R.sibling = y),
        (R = y),
        (k = j);
    }
    if ($.done) return n(d, k), me && Fn(d, P), C;
    if (k === null) {
      for (; !$.done; P++, $ = h.next())
        ($ = c(d, $.value, E)),
          $ !== null &&
            ((p = i($, p, P)), R === null ? (C = $) : (R.sibling = $), (R = $));
      return me && Fn(d, P), C;
    }
    for (k = r(d, k); !$.done; P++, $ = h.next())
      ($ = v(k, d, P, $.value, E)),
        $ !== null &&
          (e && $.alternate !== null && k.delete($.key === null ? P : $.key),
          (p = i($, p, P)),
          R === null ? (C = $) : (R.sibling = $),
          (R = $));
    return (
      e &&
        k.forEach(function (ne) {
          return t(d, ne);
        }),
      me && Fn(d, P),
      C
    );
  }
  function N(d, p, h, E) {
    if (
      (typeof h == "object" &&
        h !== null &&
        h.type === rr &&
        h.key === null &&
        (h = h.props.children),
      typeof h == "object" && h !== null)
    ) {
      switch (h.$$typeof) {
        case jl:
          e: {
            for (var C = h.key, R = p; R !== null; ) {
              if (R.key === C) {
                if (((C = h.type), C === rr)) {
                  if (R.tag === 7) {
                    n(d, R.sibling),
                      (p = l(R, h.props.children)),
                      (p.return = d),
                      (d = p);
                    break e;
                  }
                } else if (
                  R.elementType === C ||
                  (typeof C == "object" &&
                    C !== null &&
                    C.$$typeof === ln &&
                    nc(C) === R.type)
                ) {
                  n(d, R.sibling),
                    (p = l(R, h.props)),
                    (p.ref = Dr(d, R, h)),
                    (p.return = d),
                    (d = p);
                  break e;
                }
                n(d, R);
                break;
              } else t(d, R);
              R = R.sibling;
            }
            h.type === rr
              ? ((p = Bn(h.props.children, d.mode, E, h.key)),
                (p.return = d),
                (d = p))
              : ((E = mi(h.type, h.key, h.props, null, d.mode, E)),
                (E.ref = Dr(d, p, h)),
                (E.return = d),
                (d = E));
          }
          return o(d);
        case nr:
          e: {
            for (R = h.key; p !== null; ) {
              if (p.key === R)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === h.containerInfo &&
                  p.stateNode.implementation === h.implementation
                ) {
                  n(d, p.sibling),
                    (p = l(p, h.children || [])),
                    (p.return = d),
                    (d = p);
                  break e;
                } else {
                  n(d, p);
                  break;
                }
              else t(d, p);
              p = p.sibling;
            }
            (p = Qo(h, d.mode, E)), (p.return = d), (d = p);
          }
          return o(d);
        case ln:
          return (R = h._init), N(d, p, R(h._payload), E);
      }
      if (Gr(h)) return _(d, p, h, E);
      if (Mr(h)) return S(d, p, h, E);
      Xl(d, h);
    }
    return (typeof h == "string" && h !== "") || typeof h == "number"
      ? ((h = "" + h),
        p !== null && p.tag === 6
          ? (n(d, p.sibling), (p = l(p, h)), (p.return = d), (d = p))
          : (n(d, p), (p = Zo(h, d.mode, E)), (p.return = d), (d = p)),
        o(d))
      : n(d, p);
  }
  return N;
}
var xr = xf(!0),
  kf = xf(!1),
  Ri = kn(null),
  Oi = null,
  dr = null,
  Pa = null;
function Ra() {
  Pa = dr = Oi = null;
}
function Oa(e) {
  var t = Ri.current;
  fe(Ri), (e._currentValue = t);
}
function Ms(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function yr(e, t) {
  (Oi = e),
    (Pa = dr = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (Qe = !0), (e.firstContext = null));
}
function ft(e) {
  var t = e._currentValue;
  if (Pa !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), dr === null)) {
      if (Oi === null) throw Error(L(308));
      (dr = e), (Oi.dependencies = { lanes: 0, firstContext: e });
    } else dr = dr.next = e;
  return t;
}
var In = null;
function Aa(e) {
  In === null ? (In = [e]) : In.push(e);
}
function Cf(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), Aa(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    qt(e, r)
  );
}
function qt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var on = !1;
function Fa(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Lf(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function Gt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function gn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), b & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      qt(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), Aa(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    qt(e, n)
  );
}
function ui(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), ya(e, n);
  }
}
function rc(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        i === null ? (l = i = o) : (i = i.next = o), (n = n.next);
      } while (n !== null);
      i === null ? (l = i = t) : (i = i.next = t);
    } else l = i = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function Ai(e, t, n, r) {
  var l = e.updateQueue;
  on = !1;
  var i = l.firstBaseUpdate,
    o = l.lastBaseUpdate,
    s = l.shared.pending;
  if (s !== null) {
    l.shared.pending = null;
    var a = s,
      u = a.next;
    (a.next = null), o === null ? (i = u) : (o.next = u), (o = a);
    var f = e.alternate;
    f !== null &&
      ((f = f.updateQueue),
      (s = f.lastBaseUpdate),
      s !== o &&
        (s === null ? (f.firstBaseUpdate = u) : (s.next = u),
        (f.lastBaseUpdate = a)));
  }
  if (i !== null) {
    var c = l.baseState;
    (o = 0), (f = u = a = null), (s = i);
    do {
      var m = s.lane,
        v = s.eventTime;
      if ((r & m) === m) {
        f !== null &&
          (f = f.next =
            {
              eventTime: v,
              lane: 0,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            });
        e: {
          var _ = e,
            S = s;
          switch (((m = t), (v = n), S.tag)) {
            case 1:
              if (((_ = S.payload), typeof _ == "function")) {
                c = _.call(v, c, m);
                break e;
              }
              c = _;
              break e;
            case 3:
              _.flags = (_.flags & -65537) | 128;
            case 0:
              if (
                ((_ = S.payload),
                (m = typeof _ == "function" ? _.call(v, c, m) : _),
                m == null)
              )
                break e;
              c = ye({}, c, m);
              break e;
            case 2:
              on = !0;
          }
        }
        s.callback !== null &&
          s.lane !== 0 &&
          ((e.flags |= 64),
          (m = l.effects),
          m === null ? (l.effects = [s]) : m.push(s));
      } else
        (v = {
          eventTime: v,
          lane: m,
          tag: s.tag,
          payload: s.payload,
          callback: s.callback,
          next: null,
        }),
          f === null ? ((u = f = v), (a = c)) : (f = f.next = v),
          (o |= m);
      if (((s = s.next), s === null)) {
        if (((s = l.shared.pending), s === null)) break;
        (m = s),
          (s = m.next),
          (m.next = null),
          (l.lastBaseUpdate = m),
          (l.shared.pending = null);
      }
    } while (!0);
    if (
      (f === null && (a = c),
      (l.baseState = a),
      (l.firstBaseUpdate = u),
      (l.lastBaseUpdate = f),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do (o |= l.lane), (l = l.next);
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    (Gn |= o), (e.lanes = o), (e.memoizedState = c);
  }
}
function lc(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != "function"))
          throw Error(L(191, l));
        l.call(r);
      }
    }
}
var Tl = {},
  $t = kn(Tl),
  yl = kn(Tl),
  wl = kn(Tl);
function jn(e) {
  if (e === Tl) throw Error(L(174));
  return e;
}
function Ma(e, t) {
  switch ((se(wl, t), se(yl, e), se($t, Tl), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : hs(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = hs(t, e));
  }
  fe($t), se($t, t);
}
function kr() {
  fe($t), fe(yl), fe(wl);
}
function Nf(e) {
  jn(wl.current);
  var t = jn($t.current),
    n = hs(t, e.type);
  t !== n && (se(yl, e), se($t, n));
}
function $a(e) {
  yl.current === e && (fe($t), fe(yl));
}
var ve = kn(0);
function Fi(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var Bo = [];
function Ia() {
  for (var e = 0; e < Bo.length; e++)
    Bo[e]._workInProgressVersionPrimary = null;
  Bo.length = 0;
}
var ci = Kt.ReactCurrentDispatcher,
  Ho = Kt.ReactCurrentBatchConfig,
  Wn = 0,
  ge = null,
  Ce = null,
  Te = null,
  Mi = !1,
  el = !1,
  _l = 0,
  ih = 0;
function $e() {
  throw Error(L(321));
}
function ja(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!xt(e[n], t[n])) return !1;
  return !0;
}
function za(e, t, n, r, l, i) {
  if (
    ((Wn = i),
    (ge = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (ci.current = e === null || e.memoizedState === null ? uh : ch),
    (e = n(r, l)),
    el)
  ) {
    i = 0;
    do {
      if (((el = !1), (_l = 0), 25 <= i)) throw Error(L(301));
      (i += 1),
        (Te = Ce = null),
        (t.updateQueue = null),
        (ci.current = dh),
        (e = n(r, l));
    } while (el);
  }
  if (
    ((ci.current = $i),
    (t = Ce !== null && Ce.next !== null),
    (Wn = 0),
    (Te = Ce = ge = null),
    (Mi = !1),
    t)
  )
    throw Error(L(300));
  return e;
}
function Da() {
  var e = _l !== 0;
  return (_l = 0), e;
}
function Ot() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Te === null ? (ge.memoizedState = Te = e) : (Te = Te.next = e), Te;
}
function pt() {
  if (Ce === null) {
    var e = ge.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Ce.next;
  var t = Te === null ? ge.memoizedState : Te.next;
  if (t !== null) (Te = t), (Ce = e);
  else {
    if (e === null) throw Error(L(310));
    (Ce = e),
      (e = {
        memoizedState: Ce.memoizedState,
        baseState: Ce.baseState,
        baseQueue: Ce.baseQueue,
        queue: Ce.queue,
        next: null,
      }),
      Te === null ? (ge.memoizedState = Te = e) : (Te = Te.next = e);
  }
  return Te;
}
function El(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Vo(e) {
  var t = pt(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var r = Ce,
    l = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var o = l.next;
      (l.next = i.next), (i.next = o);
    }
    (r.baseQueue = l = i), (n.pending = null);
  }
  if (l !== null) {
    (i = l.next), (r = r.baseState);
    var s = (o = null),
      a = null,
      u = i;
    do {
      var f = u.lane;
      if ((Wn & f) === f)
        a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action));
      else {
        var c = {
          lane: f,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        a === null ? ((s = a = c), (o = r)) : (a = a.next = c),
          (ge.lanes |= f),
          (Gn |= f);
      }
      u = u.next;
    } while (u !== null && u !== i);
    a === null ? (o = r) : (a.next = s),
      xt(r, t.memoizedState) || (Qe = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = a),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do (i = l.lane), (ge.lanes |= i), (Gn |= i), (l = l.next);
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Uo(e) {
  var t = pt(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = (l = l.next);
    do (i = e(i, o.action)), (o = o.next);
    while (o !== l);
    xt(i, t.memoizedState) || (Qe = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i);
  }
  return [i, r];
}
function Tf() {}
function Pf(e, t) {
  var n = ge,
    r = pt(),
    l = t(),
    i = !xt(r.memoizedState, l);
  if (
    (i && ((r.memoizedState = l), (Qe = !0)),
    (r = r.queue),
    Ba(Af.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (Te !== null && Te.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      Sl(9, Of.bind(null, n, r, l, t), void 0, null),
      Pe === null)
    )
      throw Error(L(349));
    Wn & 30 || Rf(n, t, l);
  }
  return l;
}
function Rf(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = ge.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ge.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Of(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Ff(t) && Mf(e);
}
function Af(e, t, n) {
  return n(function () {
    Ff(t) && Mf(e);
  });
}
function Ff(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !xt(e, n);
  } catch {
    return !0;
  }
}
function Mf(e) {
  var t = qt(e, 1);
  t !== null && St(t, e, 1, -1);
}
function ic(e) {
  var t = Ot();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: El,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = ah.bind(null, ge, e)),
    [t.memoizedState, e]
  );
}
function Sl(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = ge.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ge.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function $f() {
  return pt().memoizedState;
}
function di(e, t, n, r) {
  var l = Ot();
  (ge.flags |= e),
    (l.memoizedState = Sl(1 | t, n, void 0, r === void 0 ? null : r));
}
function bi(e, t, n, r) {
  var l = pt();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Ce !== null) {
    var o = Ce.memoizedState;
    if (((i = o.destroy), r !== null && ja(r, o.deps))) {
      l.memoizedState = Sl(t, n, i, r);
      return;
    }
  }
  (ge.flags |= e), (l.memoizedState = Sl(1 | t, n, i, r));
}
function oc(e, t) {
  return di(8390656, 8, e, t);
}
function Ba(e, t) {
  return bi(2048, 8, e, t);
}
function If(e, t) {
  return bi(4, 2, e, t);
}
function jf(e, t) {
  return bi(4, 4, e, t);
}
function zf(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Df(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), bi(4, 4, zf.bind(null, t, e), n)
  );
}
function Ha() {}
function Bf(e, t) {
  var n = pt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ja(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Hf(e, t) {
  var n = pt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ja(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Vf(e, t, n) {
  return Wn & 21
    ? (xt(n, t) || ((n = Zd()), (ge.lanes |= n), (Gn |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (Qe = !0)), (e.memoizedState = n));
}
function oh(e, t) {
  var n = le;
  (le = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = Ho.transition;
  Ho.transition = {};
  try {
    e(!1), t();
  } finally {
    (le = n), (Ho.transition = r);
  }
}
function Uf() {
  return pt().memoizedState;
}
function sh(e, t, n) {
  var r = wn(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Wf(e))
  )
    Gf(t, n);
  else if (((n = Cf(e, t, n, r)), n !== null)) {
    var l = He();
    St(n, e, r, l), Zf(n, t, r);
  }
}
function ah(e, t, n) {
  var r = wn(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Wf(e)) Gf(t, l);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var o = t.lastRenderedState,
          s = i(o, n);
        if (((l.hasEagerState = !0), (l.eagerState = s), xt(s, o))) {
          var a = t.interleaved;
          a === null
            ? ((l.next = l), Aa(t))
            : ((l.next = a.next), (a.next = l)),
            (t.interleaved = l);
          return;
        }
      } catch {
      } finally {
      }
    (n = Cf(e, t, l, r)),
      n !== null && ((l = He()), St(n, e, r, l), Zf(n, t, r));
  }
}
function Wf(e) {
  var t = e.alternate;
  return e === ge || (t !== null && t === ge);
}
function Gf(e, t) {
  el = Mi = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Zf(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), ya(e, n);
  }
}
var $i = {
    readContext: ft,
    useCallback: $e,
    useContext: $e,
    useEffect: $e,
    useImperativeHandle: $e,
    useInsertionEffect: $e,
    useLayoutEffect: $e,
    useMemo: $e,
    useReducer: $e,
    useRef: $e,
    useState: $e,
    useDebugValue: $e,
    useDeferredValue: $e,
    useTransition: $e,
    useMutableSource: $e,
    useSyncExternalStore: $e,
    useId: $e,
    unstable_isNewReconciler: !1,
  },
  uh = {
    readContext: ft,
    useCallback: function (e, t) {
      return (Ot().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: ft,
    useEffect: oc,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        di(4194308, 4, zf.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return di(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return di(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Ot();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = Ot();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = sh.bind(null, ge, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Ot();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: ic,
    useDebugValue: Ha,
    useDeferredValue: function (e) {
      return (Ot().memoizedState = e);
    },
    useTransition: function () {
      var e = ic(!1),
        t = e[0];
      return (e = oh.bind(null, e[1])), (Ot().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = ge,
        l = Ot();
      if (me) {
        if (n === void 0) throw Error(L(407));
        n = n();
      } else {
        if (((n = t()), Pe === null)) throw Error(L(349));
        Wn & 30 || Rf(r, t, n);
      }
      l.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (l.queue = i),
        oc(Af.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        Sl(9, Of.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Ot(),
        t = Pe.identifierPrefix;
      if (me) {
        var n = Wt,
          r = Ut;
        (n = (r & ~(1 << (32 - Et(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = _l++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = ih++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  ch = {
    readContext: ft,
    useCallback: Bf,
    useContext: ft,
    useEffect: Ba,
    useImperativeHandle: Df,
    useInsertionEffect: If,
    useLayoutEffect: jf,
    useMemo: Hf,
    useReducer: Vo,
    useRef: $f,
    useState: function () {
      return Vo(El);
    },
    useDebugValue: Ha,
    useDeferredValue: function (e) {
      var t = pt();
      return Vf(t, Ce.memoizedState, e);
    },
    useTransition: function () {
      var e = Vo(El)[0],
        t = pt().memoizedState;
      return [e, t];
    },
    useMutableSource: Tf,
    useSyncExternalStore: Pf,
    useId: Uf,
    unstable_isNewReconciler: !1,
  },
  dh = {
    readContext: ft,
    useCallback: Bf,
    useContext: ft,
    useEffect: Ba,
    useImperativeHandle: Df,
    useInsertionEffect: If,
    useLayoutEffect: jf,
    useMemo: Hf,
    useReducer: Uo,
    useRef: $f,
    useState: function () {
      return Uo(El);
    },
    useDebugValue: Ha,
    useDeferredValue: function (e) {
      var t = pt();
      return Ce === null ? (t.memoizedState = e) : Vf(t, Ce.memoizedState, e);
    },
    useTransition: function () {
      var e = Uo(El)[0],
        t = pt().memoizedState;
      return [e, t];
    },
    useMutableSource: Tf,
    useSyncExternalStore: Pf,
    useId: Uf,
    unstable_isNewReconciler: !1,
  };
function yt(e, t) {
  if (e && e.defaultProps) {
    (t = ye({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function $s(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : ye({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var eo = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Xn(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = He(),
      l = wn(e),
      i = Gt(r, l);
    (i.payload = t),
      n != null && (i.callback = n),
      (t = gn(e, i, l)),
      t !== null && (St(t, e, l, r), ui(t, e, l));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = He(),
      l = wn(e),
      i = Gt(r, l);
    (i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = gn(e, i, l)),
      t !== null && (St(t, e, l, r), ui(t, e, l));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = He(),
      r = wn(e),
      l = Gt(n, r);
    (l.tag = 2),
      t != null && (l.callback = t),
      (t = gn(e, l, r)),
      t !== null && (St(t, e, r, n), ui(t, e, r));
  },
};
function sc(e, t, n, r, l, i, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !hl(n, r) || !hl(l, i)
        : !0
  );
}
function Qf(e, t, n) {
  var r = !1,
    l = Sn,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = ft(i))
      : ((l = qe(t) ? Vn : ze.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? Er(e, l) : Sn)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = eo),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function ac(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && eo.enqueueReplaceState(t, t.state, null);
}
function Is(e, t, n, r) {
  var l = e.stateNode;
  (l.props = n), (l.state = e.memoizedState), (l.refs = {}), Fa(e);
  var i = t.contextType;
  typeof i == "object" && i !== null
    ? (l.context = ft(i))
    : ((i = qe(t) ? Vn : ze.current), (l.context = Er(e, i))),
    (l.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && ($s(e, t, i, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function" ||
      (typeof l.UNSAFE_componentWillMount != "function" &&
        typeof l.componentWillMount != "function") ||
      ((t = l.state),
      typeof l.componentWillMount == "function" && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == "function" &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && eo.enqueueReplaceState(l, l.state, null),
      Ai(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function Cr(e, t) {
  try {
    var n = "",
      r = t;
    do (n += Dp(r)), (r = r.return);
    while (r);
    var l = n;
  } catch (i) {
    l =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function Wo(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function js(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var fh = typeof WeakMap == "function" ? WeakMap : Map;
function Xf(e, t, n) {
  (n = Gt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      ji || ((ji = !0), (Qs = r)), js(e, t);
    }),
    n
  );
}
function qf(e, t, n) {
  (n = Gt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    (n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        js(e, t);
      });
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        js(e, t),
          typeof r != "function" &&
            (yn === null ? (yn = new Set([this])) : yn.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function uc(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new fh();
    var l = new Set();
    r.set(t, l);
  } else (l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l));
  l.has(n) || (l.add(n), (e = Lh.bind(null, e, t, n)), t.then(e, e));
}
function cc(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function dc(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Gt(-1, 1)), (t.tag = 2), gn(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var ph = Kt.ReactCurrentOwner,
  Qe = !1;
function Be(e, t, n, r) {
  t.child = e === null ? kf(t, null, n, r) : xr(t, e.child, n, r);
}
function fc(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return (
    yr(t, l),
    (r = za(e, t, n, r, i, l)),
    (n = Da()),
    e !== null && !Qe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        Yt(e, t, l))
      : (me && n && La(t), (t.flags |= 1), Be(e, t, r, l), t.child)
  );
}
function pc(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !qa(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), Yf(e, t, i, r, l))
      : ((e = mi(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & l))) {
    var o = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : hl), n(o, r) && e.ref === t.ref)
    )
      return Yt(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = _n(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Yf(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (hl(i, r) && e.ref === t.ref)
      if (((Qe = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
        e.flags & 131072 && (Qe = !0);
      else return (t.lanes = e.lanes), Yt(e, t, l);
  }
  return zs(e, t, n, r, l);
}
function Kf(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        se(pr, Je),
        (Je |= n);
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          se(pr, Je),
          (Je |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        se(pr, Je),
        (Je |= r);
    }
  else
    i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      se(pr, Je),
      (Je |= r);
  return Be(e, t, l, n), t.child;
}
function Jf(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function zs(e, t, n, r, l) {
  var i = qe(n) ? Vn : ze.current;
  return (
    (i = Er(t, i)),
    yr(t, l),
    (n = za(e, t, n, r, i, l)),
    (r = Da()),
    e !== null && !Qe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        Yt(e, t, l))
      : (me && r && La(t), (t.flags |= 1), Be(e, t, n, l), t.child)
  );
}
function hc(e, t, n, r, l) {
  if (qe(n)) {
    var i = !0;
    Ni(t);
  } else i = !1;
  if ((yr(t, l), t.stateNode === null))
    fi(e, t), Qf(t, n, r), Is(t, n, r, l), (r = !0);
  else if (e === null) {
    var o = t.stateNode,
      s = t.memoizedProps;
    o.props = s;
    var a = o.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = ft(u))
      : ((u = qe(n) ? Vn : ze.current), (u = Er(t, u)));
    var f = n.getDerivedStateFromProps,
      c =
        typeof f == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    c ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((s !== r || a !== u) && ac(t, o, r, u)),
      (on = !1);
    var m = t.memoizedState;
    (o.state = m),
      Ai(t, r, o, l),
      (a = t.memoizedState),
      s !== r || m !== a || Xe.current || on
        ? (typeof f == "function" && ($s(t, n, f, r), (a = t.memoizedState)),
          (s = on || sc(t, n, s, r, m, a, u))
            ? (c ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = a)),
          (o.props = r),
          (o.state = a),
          (o.context = u),
          (r = s))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (o = t.stateNode),
      Lf(e, t),
      (s = t.memoizedProps),
      (u = t.type === t.elementType ? s : yt(t.type, s)),
      (o.props = u),
      (c = t.pendingProps),
      (m = o.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = ft(a))
        : ((a = qe(n) ? Vn : ze.current), (a = Er(t, a)));
    var v = n.getDerivedStateFromProps;
    (f =
      typeof v == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((s !== c || m !== a) && ac(t, o, r, a)),
      (on = !1),
      (m = t.memoizedState),
      (o.state = m),
      Ai(t, r, o, l);
    var _ = t.memoizedState;
    s !== c || m !== _ || Xe.current || on
      ? (typeof v == "function" && ($s(t, n, v, r), (_ = t.memoizedState)),
        (u = on || sc(t, n, u, r, m, _, a) || !1)
          ? (f ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, _, a),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, _, a)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (s === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (s === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = _)),
        (o.props = r),
        (o.state = _),
        (o.context = a),
        (r = u))
      : (typeof o.componentDidUpdate != "function" ||
          (s === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (s === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Ds(e, t, n, r, i, l);
}
function Ds(e, t, n, r, l, i) {
  Jf(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && bu(t, n, !1), Yt(e, t, i);
  (r = t.stateNode), (ph.current = t);
  var s =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = xr(t, e.child, null, i)), (t.child = xr(t, null, s, i)))
      : Be(e, t, s, i),
    (t.memoizedState = r.state),
    l && bu(t, n, !0),
    t.child
  );
}
function bf(e) {
  var t = e.stateNode;
  t.pendingContext
    ? Ju(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Ju(e, t.context, !1),
    Ma(e, t.containerInfo);
}
function mc(e, t, n, r, l) {
  return Sr(), Ta(l), (t.flags |= 256), Be(e, t, n, r), t.child;
}
var Bs = { dehydrated: null, treeContext: null, retryLane: 0 };
function Hs(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function e0(e, t, n) {
  var r = t.pendingProps,
    l = ve.current,
    i = !1,
    o = (t.flags & 128) !== 0,
    s;
  if (
    ((s = o) ||
      (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    s
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    se(ve, l & 1),
    e === null)
  )
    return (
      Fs(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = ro(o, r, 0, null)),
              (e = Bn(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = Hs(n)),
              (t.memoizedState = Bs),
              e)
            : Va(t, o))
    );
  if (((l = e.memoizedState), l !== null && ((s = l.dehydrated), s !== null)))
    return hh(e, t, o, r, s, l, n);
  if (i) {
    (i = r.fallback), (o = t.mode), (l = e.child), (s = l.sibling);
    var a = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (t.deletions = null))
        : ((r = _n(l, a)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      s !== null ? (i = _n(s, i)) : ((i = Bn(i, o, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Hs(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (i.memoizedState = o),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = Bs),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = _n(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Va(e, t) {
  return (
    (t = ro({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function ql(e, t, n, r) {
  return (
    r !== null && Ta(r),
    xr(t, e.child, null, n),
    (e = Va(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function hh(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = Wo(Error(L(422)))), ql(e, t, o, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (l = t.mode),
          (r = ro({ mode: "visible", children: r.children }, l, 0, null)),
          (i = Bn(i, l, o, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && xr(t, e.child, null, o),
          (t.child.memoizedState = Hs(o)),
          (t.memoizedState = Bs),
          i);
  if (!(t.mode & 1)) return ql(e, t, o, null);
  if (l.data === "$!") {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var s = r.dgst;
    return (r = s), (i = Error(L(419))), (r = Wo(i, r, void 0)), ql(e, t, o, r);
  }
  if (((s = (o & e.childLanes) !== 0), Qe || s)) {
    if (((r = Pe), r !== null)) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      (l = l & (r.suspendedLanes | o) ? 0 : l),
        l !== 0 &&
          l !== i.retryLane &&
          ((i.retryLane = l), qt(e, l), St(r, e, l, -1));
    }
    return Xa(), (r = Wo(Error(L(421)))), ql(e, t, o, r);
  }
  return l.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Nh.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (et = vn(l.nextSibling)),
      (tt = t),
      (me = !0),
      (_t = null),
      e !== null &&
        ((at[ut++] = Ut),
        (at[ut++] = Wt),
        (at[ut++] = Un),
        (Ut = e.id),
        (Wt = e.overflow),
        (Un = t)),
      (t = Va(t, r.children)),
      (t.flags |= 4096),
      t);
}
function vc(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Ms(e.return, t, n);
}
function Go(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = l));
}
function t0(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    i = r.tail;
  if ((Be(e, t, r.children, n), (r = ve.current), r & 2))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && vc(e, n, t);
        else if (e.tag === 19) vc(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((se(ve, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; )
          (e = n.alternate),
            e !== null && Fi(e) === null && (l = n),
            (n = n.sibling);
        (n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          Go(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && Fi(e) === null)) {
            t.child = l;
            break;
          }
          (e = l.sibling), (l.sibling = n), (n = l), (l = e);
        }
        Go(t, !0, n, null, i);
        break;
      case "together":
        Go(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function fi(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Yt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Gn |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(L(153));
  if (t.child !== null) {
    for (
      e = t.child, n = _n(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = _n(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function mh(e, t, n) {
  switch (t.tag) {
    case 3:
      bf(t), Sr();
      break;
    case 5:
      Nf(t);
      break;
    case 1:
      qe(t.type) && Ni(t);
      break;
    case 4:
      Ma(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      se(Ri, r._currentValue), (r._currentValue = l);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (se(ve, ve.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? e0(e, t, n)
            : (se(ve, ve.current & 1),
              (e = Yt(e, t, n)),
              e !== null ? e.sibling : null);
      se(ve, ve.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return t0(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        se(ve, ve.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Kf(e, t, n);
  }
  return Yt(e, t, n);
}
var n0, Vs, r0, l0;
n0 = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
Vs = function () {};
r0 = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    (e = t.stateNode), jn($t.current);
    var i = null;
    switch (n) {
      case "input":
        (l = cs(e, l)), (r = cs(e, r)), (i = []);
        break;
      case "select":
        (l = ye({}, l, { value: void 0 })),
          (r = ye({}, r, { value: void 0 })),
          (i = []);
        break;
      case "textarea":
        (l = ps(e, l)), (r = ps(e, r)), (i = []);
        break;
      default:
        typeof l.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Ci);
    }
    ms(n, r);
    var o;
    n = null;
    for (u in l)
      if (!r.hasOwnProperty(u) && l.hasOwnProperty(u) && l[u] != null)
        if (u === "style") {
          var s = l[u];
          for (o in s) s.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (sl.hasOwnProperty(u)
              ? i || (i = [])
              : (i = i || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (
        ((s = l != null ? l[u] : void 0),
        r.hasOwnProperty(u) && a !== s && (a != null || s != null))
      )
        if (u === "style")
          if (s) {
            for (o in s)
              !s.hasOwnProperty(o) ||
                (a && a.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in a)
              a.hasOwnProperty(o) &&
                s[o] !== a[o] &&
                (n || (n = {}), (n[o] = a[o]));
          } else n || (i || (i = []), i.push(u, n)), (n = a);
        else
          u === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (s = s ? s.__html : void 0),
              a != null && s !== a && (i = i || []).push(u, a))
            : u === "children"
              ? (typeof a != "string" && typeof a != "number") ||
                (i = i || []).push(u, "" + a)
              : u !== "suppressContentEditableWarning" &&
                u !== "suppressHydrationWarning" &&
                (sl.hasOwnProperty(u)
                  ? (a != null && u === "onScroll" && ce("scroll", e),
                    i || s === a || (i = []))
                  : (i = i || []).push(u, a));
    }
    n && (i = i || []).push("style", n);
    var u = i;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
l0 = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Br(e, t) {
  if (!me)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Ie(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      (n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling);
  else
    for (l = e.child; l !== null; )
      (n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function vh(e, t, n) {
  var r = t.pendingProps;
  switch ((Na(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Ie(t), null;
    case 1:
      return qe(t.type) && Li(), Ie(t), null;
    case 3:
      return (
        (r = t.stateNode),
        kr(),
        fe(Xe),
        fe(ze),
        Ia(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ql(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), _t !== null && (Ys(_t), (_t = null)))),
        Vs(e, t),
        Ie(t),
        null
      );
    case 5:
      $a(t);
      var l = jn(wl.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        r0(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(L(166));
          return Ie(t), null;
        }
        if (((e = jn($t.current)), Ql(t))) {
          (r = t.stateNode), (n = t.type);
          var i = t.memoizedProps;
          switch (((r[At] = t), (r[gl] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              ce("cancel", r), ce("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              ce("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Qr.length; l++) ce(Qr[l], r);
              break;
            case "source":
              ce("error", r);
              break;
            case "img":
            case "image":
            case "link":
              ce("error", r), ce("load", r);
              break;
            case "details":
              ce("toggle", r);
              break;
            case "input":
              Cu(r, i), ce("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!i.multiple }),
                ce("invalid", r);
              break;
            case "textarea":
              Nu(r, i), ce("invalid", r);
          }
          ms(n, i), (l = null);
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var s = i[o];
              o === "children"
                ? typeof s == "string"
                  ? r.textContent !== s &&
                    (i.suppressHydrationWarning !== !0 &&
                      Zl(r.textContent, s, e),
                    (l = ["children", s]))
                  : typeof s == "number" &&
                    r.textContent !== "" + s &&
                    (i.suppressHydrationWarning !== !0 &&
                      Zl(r.textContent, s, e),
                    (l = ["children", "" + s]))
                : sl.hasOwnProperty(o) &&
                  s != null &&
                  o === "onScroll" &&
                  ce("scroll", r);
            }
          switch (n) {
            case "input":
              zl(r), Lu(r, i, !0);
              break;
            case "textarea":
              zl(r), Tu(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Ci);
          }
          (r = l), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (o = l.nodeType === 9 ? l : l.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Od(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = o.createElement(n, { is: r.is }))
                  : ((e = o.createElement(n)),
                    n === "select" &&
                      ((o = e),
                      r.multiple
                        ? (o.multiple = !0)
                        : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[At] = t),
            (e[gl] = r),
            n0(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = vs(n, r)), n)) {
              case "dialog":
                ce("cancel", e), ce("close", e), (l = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ce("load", e), (l = r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Qr.length; l++) ce(Qr[l], e);
                l = r;
                break;
              case "source":
                ce("error", e), (l = r);
                break;
              case "img":
              case "image":
              case "link":
                ce("error", e), ce("load", e), (l = r);
                break;
              case "details":
                ce("toggle", e), (l = r);
                break;
              case "input":
                Cu(e, r), (l = cs(e, r)), ce("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = ye({}, r, { value: void 0 })),
                  ce("invalid", e);
                break;
              case "textarea":
                Nu(e, r), (l = ps(e, r)), ce("invalid", e);
                break;
              default:
                l = r;
            }
            ms(n, l), (s = l);
            for (i in s)
              if (s.hasOwnProperty(i)) {
                var a = s[i];
                i === "style"
                  ? Md(e, a)
                  : i === "dangerouslySetInnerHTML"
                    ? ((a = a ? a.__html : void 0), a != null && Ad(e, a))
                    : i === "children"
                      ? typeof a == "string"
                        ? (n !== "textarea" || a !== "") && al(e, a)
                        : typeof a == "number" && al(e, "" + a)
                      : i !== "suppressContentEditableWarning" &&
                        i !== "suppressHydrationWarning" &&
                        i !== "autoFocus" &&
                        (sl.hasOwnProperty(i)
                          ? a != null && i === "onScroll" && ce("scroll", e)
                          : a != null && fa(e, i, a, o));
              }
            switch (n) {
              case "input":
                zl(e), Lu(e, r, !1);
                break;
              case "textarea":
                zl(e), Tu(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + En(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? hr(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      hr(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = Ci);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return Ie(t), null;
    case 6:
      if (e && t.stateNode != null) l0(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(L(166));
        if (((n = jn(wl.current)), jn($t.current), Ql(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[At] = t),
            (i = r.nodeValue !== n) && ((e = tt), e !== null))
          )
            switch (e.tag) {
              case 3:
                Zl(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Zl(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[At] = t),
            (t.stateNode = r);
      }
      return Ie(t), null;
    case 13:
      if (
        (fe(ve),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (me && et !== null && t.mode & 1 && !(t.flags & 128))
          Sf(), Sr(), (t.flags |= 98560), (i = !1);
        else if (((i = Ql(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(L(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(L(317));
            i[At] = t;
          } else
            Sr(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          Ie(t), (i = !1);
        } else _t !== null && (Ys(_t), (_t = null)), (i = !0);
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || ve.current & 1 ? Le === 0 && (Le = 3) : Xa())),
          t.updateQueue !== null && (t.flags |= 4),
          Ie(t),
          null);
    case 4:
      return (
        kr(), Vs(e, t), e === null && ml(t.stateNode.containerInfo), Ie(t), null
      );
    case 10:
      return Oa(t.type._context), Ie(t), null;
    case 17:
      return qe(t.type) && Li(), Ie(t), null;
    case 19:
      if ((fe(ve), (i = t.memoizedState), i === null)) return Ie(t), null;
      if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) Br(i, !1);
        else {
          if (Le !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = Fi(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Br(i, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (e = o.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return se(ve, (ve.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          i.tail !== null &&
            Ee() > Lr &&
            ((t.flags |= 128), (r = !0), Br(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Fi(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Br(i, !0),
              i.tail === null && i.tailMode === "hidden" && !o.alternate && !me)
            )
              return Ie(t), null;
          } else
            2 * Ee() - i.renderingStartTime > Lr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Br(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = i.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (i.last = o));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = Ee()),
          (t.sibling = null),
          (n = ve.current),
          se(ve, r ? (n & 1) | 2 : n & 1),
          t)
        : (Ie(t), null);
    case 22:
    case 23:
      return (
        Qa(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Je & 1073741824 && (Ie(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Ie(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(L(156, t.tag));
}
function gh(e, t) {
  switch ((Na(t), t.tag)) {
    case 1:
      return (
        qe(t.type) && Li(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        kr(),
        fe(Xe),
        fe(ze),
        Ia(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return $a(t), null;
    case 13:
      if (
        (fe(ve), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(L(340));
        Sr();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return fe(ve), null;
    case 4:
      return kr(), null;
    case 10:
      return Oa(t.type._context), null;
    case 22:
    case 23:
      return Qa(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Yl = !1,
  je = !1,
  yh = typeof WeakSet == "function" ? WeakSet : Set,
  M = null;
function fr(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        _e(e, t, r);
      }
    else n.current = null;
}
function Us(e, t, n) {
  try {
    n();
  } catch (r) {
    _e(e, t, r);
  }
}
var gc = !1;
function wh(e, t) {
  if (((Ls = Si), (e = uf()), Ca(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            s = -1,
            a = -1,
            u = 0,
            f = 0,
            c = e,
            m = null;
          t: for (;;) {
            for (
              var v;
              c !== n || (l !== 0 && c.nodeType !== 3) || (s = o + l),
                c !== i || (r !== 0 && c.nodeType !== 3) || (a = o + r),
                c.nodeType === 3 && (o += c.nodeValue.length),
                (v = c.firstChild) !== null;

            )
              (m = c), (c = v);
            for (;;) {
              if (c === e) break t;
              if (
                (m === n && ++u === l && (s = o),
                m === i && ++f === r && (a = o),
                (v = c.nextSibling) !== null)
              )
                break;
              (c = m), (m = c.parentNode);
            }
            c = v;
          }
          n = s === -1 || a === -1 ? null : { start: s, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Ns = { focusedElem: e, selectionRange: n }, Si = !1, M = t; M !== null; )
    if (((t = M), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (M = e);
    else
      for (; M !== null; ) {
        t = M;
        try {
          var _ = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (_ !== null) {
                  var S = _.memoizedProps,
                    N = _.memoizedState,
                    d = t.stateNode,
                    p = d.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? S : yt(t.type, S),
                      N,
                    );
                  d.__reactInternalSnapshotBeforeUpdate = p;
                }
                break;
              case 3:
                var h = t.stateNode.containerInfo;
                h.nodeType === 1
                  ? (h.textContent = "")
                  : h.nodeType === 9 &&
                    h.documentElement &&
                    h.removeChild(h.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(L(163));
            }
        } catch (E) {
          _e(t, t.return, E);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (M = e);
          break;
        }
        M = t.return;
      }
  return (_ = gc), (gc = !1), _;
}
function tl(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        (l.destroy = void 0), i !== void 0 && Us(t, n, i);
      }
      l = l.next;
    } while (l !== r);
  }
}
function to(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Ws(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function i0(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), i0(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[At], delete t[gl], delete t[Rs], delete t[th], delete t[nh])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function o0(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function yc(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || o0(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Gs(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = Ci));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Gs(e, t, n), e = e.sibling; e !== null; ) Gs(e, t, n), (e = e.sibling);
}
function Zs(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Zs(e, t, n), e = e.sibling; e !== null; ) Zs(e, t, n), (e = e.sibling);
}
var Oe = null,
  wt = !1;
function nn(e, t, n) {
  for (n = n.child; n !== null; ) s0(e, t, n), (n = n.sibling);
}
function s0(e, t, n) {
  if (Mt && typeof Mt.onCommitFiberUnmount == "function")
    try {
      Mt.onCommitFiberUnmount(Qi, n);
    } catch {}
  switch (n.tag) {
    case 5:
      je || fr(n, t);
    case 6:
      var r = Oe,
        l = wt;
      (Oe = null),
        nn(e, t, n),
        (Oe = r),
        (wt = l),
        Oe !== null &&
          (wt
            ? ((e = Oe),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Oe.removeChild(n.stateNode));
      break;
    case 18:
      Oe !== null &&
        (wt
          ? ((e = Oe),
            (n = n.stateNode),
            e.nodeType === 8
              ? zo(e.parentNode, n)
              : e.nodeType === 1 && zo(e, n),
            fl(e))
          : zo(Oe, n.stateNode));
      break;
    case 4:
      (r = Oe),
        (l = wt),
        (Oe = n.stateNode.containerInfo),
        (wt = !0),
        nn(e, t, n),
        (Oe = r),
        (wt = l);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !je &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var i = l,
            o = i.destroy;
          (i = i.tag),
            o !== void 0 && (i & 2 || i & 4) && Us(n, t, o),
            (l = l.next);
        } while (l !== r);
      }
      nn(e, t, n);
      break;
    case 1:
      if (
        !je &&
        (fr(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (s) {
          _e(n, t, s);
        }
      nn(e, t, n);
      break;
    case 21:
      nn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((je = (r = je) || n.memoizedState !== null), nn(e, t, n), (je = r))
        : nn(e, t, n);
      break;
    default:
      nn(e, t, n);
  }
}
function wc(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new yh()),
      t.forEach(function (r) {
        var l = Th.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
  }
}
function gt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e,
          o = t,
          s = o;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              (Oe = s.stateNode), (wt = !1);
              break e;
            case 3:
              (Oe = s.stateNode.containerInfo), (wt = !0);
              break e;
            case 4:
              (Oe = s.stateNode.containerInfo), (wt = !0);
              break e;
          }
          s = s.return;
        }
        if (Oe === null) throw Error(L(160));
        s0(i, o, l), (Oe = null), (wt = !1);
        var a = l.alternate;
        a !== null && (a.return = null), (l.return = null);
      } catch (u) {
        _e(l, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) a0(t, e), (t = t.sibling);
}
function a0(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((gt(t, e), Pt(e), r & 4)) {
        try {
          tl(3, e, e.return), to(3, e);
        } catch (S) {
          _e(e, e.return, S);
        }
        try {
          tl(5, e, e.return);
        } catch (S) {
          _e(e, e.return, S);
        }
      }
      break;
    case 1:
      gt(t, e), Pt(e), r & 512 && n !== null && fr(n, n.return);
      break;
    case 5:
      if (
        (gt(t, e),
        Pt(e),
        r & 512 && n !== null && fr(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          al(l, "");
        } catch (S) {
          _e(e, e.return, S);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var i = e.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          s = e.type,
          a = e.updateQueue;
        if (((e.updateQueue = null), a !== null))
          try {
            s === "input" && i.type === "radio" && i.name != null && Pd(l, i),
              vs(s, o);
            var u = vs(s, i);
            for (o = 0; o < a.length; o += 2) {
              var f = a[o],
                c = a[o + 1];
              f === "style"
                ? Md(l, c)
                : f === "dangerouslySetInnerHTML"
                  ? Ad(l, c)
                  : f === "children"
                    ? al(l, c)
                    : fa(l, f, c, u);
            }
            switch (s) {
              case "input":
                ds(l, i);
                break;
              case "textarea":
                Rd(l, i);
                break;
              case "select":
                var m = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var v = i.value;
                v != null
                  ? hr(l, !!i.multiple, v, !1)
                  : m !== !!i.multiple &&
                    (i.defaultValue != null
                      ? hr(l, !!i.multiple, i.defaultValue, !0)
                      : hr(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[gl] = i;
          } catch (S) {
            _e(e, e.return, S);
          }
      }
      break;
    case 6:
      if ((gt(t, e), Pt(e), r & 4)) {
        if (e.stateNode === null) throw Error(L(162));
        (l = e.stateNode), (i = e.memoizedProps);
        try {
          l.nodeValue = i;
        } catch (S) {
          _e(e, e.return, S);
        }
      }
      break;
    case 3:
      if (
        (gt(t, e), Pt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          fl(t.containerInfo);
        } catch (S) {
          _e(e, e.return, S);
        }
      break;
    case 4:
      gt(t, e), Pt(e);
      break;
    case 13:
      gt(t, e),
        Pt(e),
        (l = e.child),
        l.flags & 8192 &&
          ((i = l.memoizedState !== null),
          (l.stateNode.isHidden = i),
          !i ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (Ga = Ee())),
        r & 4 && wc(e);
      break;
    case 22:
      if (
        ((f = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((je = (u = je) || f), gt(t, e), (je = u)) : gt(t, e),
        Pt(e),
        r & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !f && e.mode & 1)
        )
          for (M = e, f = e.child; f !== null; ) {
            for (c = M = f; M !== null; ) {
              switch (((m = M), (v = m.child), m.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  tl(4, m, m.return);
                  break;
                case 1:
                  fr(m, m.return);
                  var _ = m.stateNode;
                  if (typeof _.componentWillUnmount == "function") {
                    (r = m), (n = m.return);
                    try {
                      (t = r),
                        (_.props = t.memoizedProps),
                        (_.state = t.memoizedState),
                        _.componentWillUnmount();
                    } catch (S) {
                      _e(r, n, S);
                    }
                  }
                  break;
                case 5:
                  fr(m, m.return);
                  break;
                case 22:
                  if (m.memoizedState !== null) {
                    Ec(c);
                    continue;
                  }
              }
              v !== null ? ((v.return = m), (M = v)) : Ec(c);
            }
            f = f.sibling;
          }
        e: for (f = null, c = e; ; ) {
          if (c.tag === 5) {
            if (f === null) {
              f = c;
              try {
                (l = c.stateNode),
                  u
                    ? ((i = l.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((s = c.stateNode),
                      (a = c.memoizedProps.style),
                      (o =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (s.style.display = Fd("display", o)));
              } catch (S) {
                _e(e, e.return, S);
              }
            }
          } else if (c.tag === 6) {
            if (f === null)
              try {
                c.stateNode.nodeValue = u ? "" : c.memoizedProps;
              } catch (S) {
                _e(e, e.return, S);
              }
          } else if (
            ((c.tag !== 22 && c.tag !== 23) ||
              c.memoizedState === null ||
              c === e) &&
            c.child !== null
          ) {
            (c.child.return = c), (c = c.child);
            continue;
          }
          if (c === e) break e;
          for (; c.sibling === null; ) {
            if (c.return === null || c.return === e) break e;
            f === c && (f = null), (c = c.return);
          }
          f === c && (f = null), (c.sibling.return = c.return), (c = c.sibling);
        }
      }
      break;
    case 19:
      gt(t, e), Pt(e), r & 4 && wc(e);
      break;
    case 21:
      break;
    default:
      gt(t, e), Pt(e);
  }
}
function Pt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (o0(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(L(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (al(l, ""), (r.flags &= -33));
          var i = yc(e);
          Zs(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            s = yc(e);
          Gs(e, s, o);
          break;
        default:
          throw Error(L(161));
      }
    } catch (a) {
      _e(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function _h(e, t, n) {
  (M = e), u0(e);
}
function u0(e, t, n) {
  for (var r = (e.mode & 1) !== 0; M !== null; ) {
    var l = M,
      i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || Yl;
      if (!o) {
        var s = l.alternate,
          a = (s !== null && s.memoizedState !== null) || je;
        s = Yl;
        var u = je;
        if (((Yl = o), (je = a) && !u))
          for (M = l; M !== null; )
            (o = M),
              (a = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Sc(l)
                : a !== null
                  ? ((a.return = o), (M = a))
                  : Sc(l);
        for (; i !== null; ) (M = i), u0(i), (i = i.sibling);
        (M = l), (Yl = s), (je = u);
      }
      _c(e);
    } else
      l.subtreeFlags & 8772 && i !== null ? ((i.return = l), (M = i)) : _c(e);
  }
}
function _c(e) {
  for (; M !== null; ) {
    var t = M;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              je || to(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !je)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : yt(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var i = t.updateQueue;
              i !== null && lc(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                lc(t, o, n);
              }
              break;
            case 5:
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
                var a = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var f = u.memoizedState;
                  if (f !== null) {
                    var c = f.dehydrated;
                    c !== null && fl(c);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(L(163));
          }
        je || (t.flags & 512 && Ws(t));
      } catch (m) {
        _e(t, t.return, m);
      }
    }
    if (t === e) {
      M = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (M = n);
      break;
    }
    M = t.return;
  }
}
function Ec(e) {
  for (; M !== null; ) {
    var t = M;
    if (t === e) {
      M = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (M = n);
      break;
    }
    M = t.return;
  }
}
function Sc(e) {
  for (; M !== null; ) {
    var t = M;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            to(4, t);
          } catch (a) {
            _e(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              _e(t, l, a);
            }
          }
          var i = t.return;
          try {
            Ws(t);
          } catch (a) {
            _e(t, i, a);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Ws(t);
          } catch (a) {
            _e(t, o, a);
          }
      }
    } catch (a) {
      _e(t, t.return, a);
    }
    if (t === e) {
      M = null;
      break;
    }
    var s = t.sibling;
    if (s !== null) {
      (s.return = t.return), (M = s);
      break;
    }
    M = t.return;
  }
}
var Eh = Math.ceil,
  Ii = Kt.ReactCurrentDispatcher,
  Ua = Kt.ReactCurrentOwner,
  dt = Kt.ReactCurrentBatchConfig,
  b = 0,
  Pe = null,
  ke = null,
  Fe = 0,
  Je = 0,
  pr = kn(0),
  Le = 0,
  xl = null,
  Gn = 0,
  no = 0,
  Wa = 0,
  nl = null,
  Ze = null,
  Ga = 0,
  Lr = 1 / 0,
  Dt = null,
  ji = !1,
  Qs = null,
  yn = null,
  Kl = !1,
  dn = null,
  zi = 0,
  rl = 0,
  Xs = null,
  pi = -1,
  hi = 0;
function He() {
  return b & 6 ? Ee() : pi !== -1 ? pi : (pi = Ee());
}
function wn(e) {
  return e.mode & 1
    ? b & 2 && Fe !== 0
      ? Fe & -Fe
      : lh.transition !== null
        ? (hi === 0 && (hi = Zd()), hi)
        : ((e = le),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : bd(e.type))),
          e)
    : 1;
}
function St(e, t, n, r) {
  if (50 < rl) throw ((rl = 0), (Xs = null), Error(L(185)));
  Cl(e, n, r),
    (!(b & 2) || e !== Pe) &&
      (e === Pe && (!(b & 2) && (no |= n), Le === 4 && an(e, Fe)),
      Ye(e, r),
      n === 1 && b === 0 && !(t.mode & 1) && ((Lr = Ee() + 500), Ji && Cn()));
}
function Ye(e, t) {
  var n = e.callbackNode;
  l1(e, t);
  var r = Ei(e, e === Pe ? Fe : 0);
  if (r === 0)
    n !== null && Ou(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Ou(n), t === 1))
      e.tag === 0 ? rh(xc.bind(null, e)) : wf(xc.bind(null, e)),
        b1(function () {
          !(b & 6) && Cn();
        }),
        (n = null);
    else {
      switch (Qd(r)) {
        case 1:
          n = ga;
          break;
        case 4:
          n = Wd;
          break;
        case 16:
          n = _i;
          break;
        case 536870912:
          n = Gd;
          break;
        default:
          n = _i;
      }
      n = g0(n, c0.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function c0(e, t) {
  if (((pi = -1), (hi = 0), b & 6)) throw Error(L(327));
  var n = e.callbackNode;
  if (wr() && e.callbackNode !== n) return null;
  var r = Ei(e, e === Pe ? Fe : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Di(e, r);
  else {
    t = r;
    var l = b;
    b |= 2;
    var i = f0();
    (Pe !== e || Fe !== t) && ((Dt = null), (Lr = Ee() + 500), Dn(e, t));
    do
      try {
        kh();
        break;
      } catch (s) {
        d0(e, s);
      }
    while (!0);
    Ra(),
      (Ii.current = i),
      (b = l),
      ke !== null ? (t = 0) : ((Pe = null), (Fe = 0), (t = Le));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = Es(e)), l !== 0 && ((r = l), (t = qs(e, l)))), t === 1)
    )
      throw ((n = xl), Dn(e, 0), an(e, r), Ye(e, Ee()), n);
    if (t === 6) an(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !Sh(l) &&
          ((t = Di(e, r)),
          t === 2 && ((i = Es(e)), i !== 0 && ((r = i), (t = qs(e, i)))),
          t === 1))
      )
        throw ((n = xl), Dn(e, 0), an(e, r), Ye(e, Ee()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(L(345));
        case 2:
          Mn(e, Ze, Dt);
          break;
        case 3:
          if (
            (an(e, r), (r & 130023424) === r && ((t = Ga + 500 - Ee()), 10 < t))
          ) {
            if (Ei(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              He(), (e.pingedLanes |= e.suspendedLanes & l);
              break;
            }
            e.timeoutHandle = Ps(Mn.bind(null, e, Ze, Dt), t);
            break;
          }
          Mn(e, Ze, Dt);
          break;
        case 4:
          if ((an(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - Et(r);
            (i = 1 << o), (o = t[o]), o > l && (l = o), (r &= ~i);
          }
          if (
            ((r = l),
            (r = Ee() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * Eh(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Ps(Mn.bind(null, e, Ze, Dt), r);
            break;
          }
          Mn(e, Ze, Dt);
          break;
        case 5:
          Mn(e, Ze, Dt);
          break;
        default:
          throw Error(L(329));
      }
    }
  }
  return Ye(e, Ee()), e.callbackNode === n ? c0.bind(null, e) : null;
}
function qs(e, t) {
  var n = nl;
  return (
    e.current.memoizedState.isDehydrated && (Dn(e, t).flags |= 256),
    (e = Di(e, t)),
    e !== 2 && ((t = Ze), (Ze = n), t !== null && Ys(t)),
    e
  );
}
function Ys(e) {
  Ze === null ? (Ze = e) : Ze.push.apply(Ze, e);
}
function Sh(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = l.getSnapshot;
          l = l.value;
          try {
            if (!xt(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function an(e, t) {
  for (
    t &= ~Wa,
      t &= ~no,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - Et(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function xc(e) {
  if (b & 6) throw Error(L(327));
  wr();
  var t = Ei(e, 0);
  if (!(t & 1)) return Ye(e, Ee()), null;
  var n = Di(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Es(e);
    r !== 0 && ((t = r), (n = qs(e, r)));
  }
  if (n === 1) throw ((n = xl), Dn(e, 0), an(e, t), Ye(e, Ee()), n);
  if (n === 6) throw Error(L(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Mn(e, Ze, Dt),
    Ye(e, Ee()),
    null
  );
}
function Za(e, t) {
  var n = b;
  b |= 1;
  try {
    return e(t);
  } finally {
    (b = n), b === 0 && ((Lr = Ee() + 500), Ji && Cn());
  }
}
function Zn(e) {
  dn !== null && dn.tag === 0 && !(b & 6) && wr();
  var t = b;
  b |= 1;
  var n = dt.transition,
    r = le;
  try {
    if (((dt.transition = null), (le = 1), e)) return e();
  } finally {
    (le = r), (dt.transition = n), (b = t), !(b & 6) && Cn();
  }
}
function Qa() {
  (Je = pr.current), fe(pr);
}
function Dn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), J1(n)), ke !== null))
    for (n = ke.return; n !== null; ) {
      var r = n;
      switch ((Na(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Li();
          break;
        case 3:
          kr(), fe(Xe), fe(ze), Ia();
          break;
        case 5:
          $a(r);
          break;
        case 4:
          kr();
          break;
        case 13:
          fe(ve);
          break;
        case 19:
          fe(ve);
          break;
        case 10:
          Oa(r.type._context);
          break;
        case 22:
        case 23:
          Qa();
      }
      n = n.return;
    }
  if (
    ((Pe = e),
    (ke = e = _n(e.current, null)),
    (Fe = Je = t),
    (Le = 0),
    (xl = null),
    (Wa = no = Gn = 0),
    (Ze = nl = null),
    In !== null)
  ) {
    for (t = 0; t < In.length; t++)
      if (((n = In[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          (i.next = l), (r.next = o);
        }
        n.pending = r;
      }
    In = null;
  }
  return e;
}
function d0(e, t) {
  do {
    var n = ke;
    try {
      if ((Ra(), (ci.current = $i), Mi)) {
        for (var r = ge.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), (r = r.next);
        }
        Mi = !1;
      }
      if (
        ((Wn = 0),
        (Te = Ce = ge = null),
        (el = !1),
        (_l = 0),
        (Ua.current = null),
        n === null || n.return === null)
      ) {
        (Le = 1), (xl = t), (ke = null);
        break;
      }
      e: {
        var i = e,
          o = n.return,
          s = n,
          a = t;
        if (
          ((t = Fe),
          (s.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var u = a,
            f = s,
            c = f.tag;
          if (!(f.mode & 1) && (c === 0 || c === 11 || c === 15)) {
            var m = f.alternate;
            m
              ? ((f.updateQueue = m.updateQueue),
                (f.memoizedState = m.memoizedState),
                (f.lanes = m.lanes))
              : ((f.updateQueue = null), (f.memoizedState = null));
          }
          var v = cc(o);
          if (v !== null) {
            (v.flags &= -257),
              dc(v, o, s, i, t),
              v.mode & 1 && uc(i, u, t),
              (t = v),
              (a = u);
            var _ = t.updateQueue;
            if (_ === null) {
              var S = new Set();
              S.add(a), (t.updateQueue = S);
            } else _.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              uc(i, u, t), Xa();
              break e;
            }
            a = Error(L(426));
          }
        } else if (me && s.mode & 1) {
          var N = cc(o);
          if (N !== null) {
            !(N.flags & 65536) && (N.flags |= 256),
              dc(N, o, s, i, t),
              Ta(Cr(a, s));
            break e;
          }
        }
        (i = a = Cr(a, s)),
          Le !== 4 && (Le = 2),
          nl === null ? (nl = [i]) : nl.push(i),
          (i = o);
        do {
          switch (i.tag) {
            case 3:
              (i.flags |= 65536), (t &= -t), (i.lanes |= t);
              var d = Xf(i, a, t);
              rc(i, d);
              break e;
            case 1:
              s = a;
              var p = i.type,
                h = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof p.getDerivedStateFromError == "function" ||
                  (h !== null &&
                    typeof h.componentDidCatch == "function" &&
                    (yn === null || !yn.has(h))))
              ) {
                (i.flags |= 65536), (t &= -t), (i.lanes |= t);
                var E = qf(i, s, t);
                rc(i, E);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      h0(n);
    } catch (C) {
      (t = C), ke === n && n !== null && (ke = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function f0() {
  var e = Ii.current;
  return (Ii.current = $i), e === null ? $i : e;
}
function Xa() {
  (Le === 0 || Le === 3 || Le === 2) && (Le = 4),
    Pe === null || (!(Gn & 268435455) && !(no & 268435455)) || an(Pe, Fe);
}
function Di(e, t) {
  var n = b;
  b |= 2;
  var r = f0();
  (Pe !== e || Fe !== t) && ((Dt = null), Dn(e, t));
  do
    try {
      xh();
      break;
    } catch (l) {
      d0(e, l);
    }
  while (!0);
  if ((Ra(), (b = n), (Ii.current = r), ke !== null)) throw Error(L(261));
  return (Pe = null), (Fe = 0), Le;
}
function xh() {
  for (; ke !== null; ) p0(ke);
}
function kh() {
  for (; ke !== null && !qp(); ) p0(ke);
}
function p0(e) {
  var t = v0(e.alternate, e, Je);
  (e.memoizedProps = e.pendingProps),
    t === null ? h0(e) : (ke = t),
    (Ua.current = null);
}
function h0(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = gh(n, t)), n !== null)) {
        (n.flags &= 32767), (ke = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (Le = 6), (ke = null);
        return;
      }
    } else if (((n = vh(n, t, Je)), n !== null)) {
      ke = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      ke = t;
      return;
    }
    ke = t = e;
  } while (t !== null);
  Le === 0 && (Le = 5);
}
function Mn(e, t, n) {
  var r = le,
    l = dt.transition;
  try {
    (dt.transition = null), (le = 1), Ch(e, t, n, r);
  } finally {
    (dt.transition = l), (le = r);
  }
  return null;
}
function Ch(e, t, n, r) {
  do wr();
  while (dn !== null);
  if (b & 6) throw Error(L(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(L(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var i = n.lanes | n.childLanes;
  if (
    (i1(e, i),
    e === Pe && ((ke = Pe = null), (Fe = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Kl ||
      ((Kl = !0),
      g0(_i, function () {
        return wr(), null;
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    (i = dt.transition), (dt.transition = null);
    var o = le;
    le = 1;
    var s = b;
    (b |= 4),
      (Ua.current = null),
      wh(e, n),
      a0(n, e),
      G1(Ns),
      (Si = !!Ls),
      (Ns = Ls = null),
      (e.current = n),
      _h(n),
      Yp(),
      (b = s),
      (le = o),
      (dt.transition = i);
  } else e.current = n;
  if (
    (Kl && ((Kl = !1), (dn = e), (zi = l)),
    (i = e.pendingLanes),
    i === 0 && (yn = null),
    bp(n.stateNode),
    Ye(e, Ee()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest });
  if (ji) throw ((ji = !1), (e = Qs), (Qs = null), e);
  return (
    zi & 1 && e.tag !== 0 && wr(),
    (i = e.pendingLanes),
    i & 1 ? (e === Xs ? rl++ : ((rl = 0), (Xs = e))) : (rl = 0),
    Cn(),
    null
  );
}
function wr() {
  if (dn !== null) {
    var e = Qd(zi),
      t = dt.transition,
      n = le;
    try {
      if (((dt.transition = null), (le = 16 > e ? 16 : e), dn === null))
        var r = !1;
      else {
        if (((e = dn), (dn = null), (zi = 0), b & 6)) throw Error(L(331));
        var l = b;
        for (b |= 4, M = e.current; M !== null; ) {
          var i = M,
            o = i.child;
          if (M.flags & 16) {
            var s = i.deletions;
            if (s !== null) {
              for (var a = 0; a < s.length; a++) {
                var u = s[a];
                for (M = u; M !== null; ) {
                  var f = M;
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      tl(8, f, i);
                  }
                  var c = f.child;
                  if (c !== null) (c.return = f), (M = c);
                  else
                    for (; M !== null; ) {
                      f = M;
                      var m = f.sibling,
                        v = f.return;
                      if ((i0(f), f === u)) {
                        M = null;
                        break;
                      }
                      if (m !== null) {
                        (m.return = v), (M = m);
                        break;
                      }
                      M = v;
                    }
                }
              }
              var _ = i.alternate;
              if (_ !== null) {
                var S = _.child;
                if (S !== null) {
                  _.child = null;
                  do {
                    var N = S.sibling;
                    (S.sibling = null), (S = N);
                  } while (S !== null);
                }
              }
              M = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) (o.return = i), (M = o);
          else
            e: for (; M !== null; ) {
              if (((i = M), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    tl(9, i, i.return);
                }
              var d = i.sibling;
              if (d !== null) {
                (d.return = i.return), (M = d);
                break e;
              }
              M = i.return;
            }
        }
        var p = e.current;
        for (M = p; M !== null; ) {
          o = M;
          var h = o.child;
          if (o.subtreeFlags & 2064 && h !== null) (h.return = o), (M = h);
          else
            e: for (o = p; M !== null; ) {
              if (((s = M), s.flags & 2048))
                try {
                  switch (s.tag) {
                    case 0:
                    case 11:
                    case 15:
                      to(9, s);
                  }
                } catch (C) {
                  _e(s, s.return, C);
                }
              if (s === o) {
                M = null;
                break e;
              }
              var E = s.sibling;
              if (E !== null) {
                (E.return = s.return), (M = E);
                break e;
              }
              M = s.return;
            }
        }
        if (
          ((b = l), Cn(), Mt && typeof Mt.onPostCommitFiberRoot == "function")
        )
          try {
            Mt.onPostCommitFiberRoot(Qi, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (le = n), (dt.transition = t);
    }
  }
  return !1;
}
function kc(e, t, n) {
  (t = Cr(n, t)),
    (t = Xf(e, t, 1)),
    (e = gn(e, t, 1)),
    (t = He()),
    e !== null && (Cl(e, 1, t), Ye(e, t));
}
function _e(e, t, n) {
  if (e.tag === 3) kc(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        kc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (yn === null || !yn.has(r)))
        ) {
          (e = Cr(n, e)),
            (e = qf(t, e, 1)),
            (t = gn(t, e, 1)),
            (e = He()),
            t !== null && (Cl(t, 1, e), Ye(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function Lh(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = He()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Pe === e &&
      (Fe & n) === n &&
      (Le === 4 || (Le === 3 && (Fe & 130023424) === Fe && 500 > Ee() - Ga)
        ? Dn(e, 0)
        : (Wa |= n)),
    Ye(e, t);
}
function m0(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Hl), (Hl <<= 1), !(Hl & 130023424) && (Hl = 4194304))
      : (t = 1));
  var n = He();
  (e = qt(e, t)), e !== null && (Cl(e, t, n), Ye(e, n));
}
function Nh(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), m0(e, n);
}
function Th(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(L(314));
  }
  r !== null && r.delete(t), m0(e, n);
}
var v0;
v0 = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Xe.current) Qe = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (Qe = !1), mh(e, t, n);
      Qe = !!(e.flags & 131072);
    }
  else (Qe = !1), me && t.flags & 1048576 && _f(t, Pi, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      fi(e, t), (e = t.pendingProps);
      var l = Er(t, ze.current);
      yr(t, n), (l = za(null, t, r, e, l, n));
      var i = Da();
      return (
        (t.flags |= 1),
        typeof l == "object" &&
        l !== null &&
        typeof l.render == "function" &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            qe(r) ? ((i = !0), Ni(t)) : (i = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            Fa(t),
            (l.updater = eo),
            (t.stateNode = l),
            (l._reactInternals = t),
            Is(t, r, e, n),
            (t = Ds(null, t, r, !0, i, n)))
          : ((t.tag = 0), me && i && La(t), Be(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (fi(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = Rh(r)),
          (e = yt(r, e)),
          l)
        ) {
          case 0:
            t = zs(null, t, r, e, n);
            break e;
          case 1:
            t = hc(null, t, r, e, n);
            break e;
          case 11:
            t = fc(null, t, r, e, n);
            break e;
          case 14:
            t = pc(null, t, r, yt(r.type, e), n);
            break e;
        }
        throw Error(L(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : yt(r, l)),
        zs(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : yt(r, l)),
        hc(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((bf(t), e === null)) throw Error(L(387));
        (r = t.pendingProps),
          (i = t.memoizedState),
          (l = i.element),
          Lf(e, t),
          Ai(t, r, null, n);
        var o = t.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            (l = Cr(Error(L(423)), t)), (t = mc(e, t, r, n, l));
            break e;
          } else if (r !== l) {
            (l = Cr(Error(L(424)), t)), (t = mc(e, t, r, n, l));
            break e;
          } else
            for (
              et = vn(t.stateNode.containerInfo.firstChild),
                tt = t,
                me = !0,
                _t = null,
                n = kf(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Sr(), r === l)) {
            t = Yt(e, t, n);
            break e;
          }
          Be(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Nf(t),
        e === null && Fs(t),
        (r = t.type),
        (l = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (o = l.children),
        Ts(r, l) ? (o = null) : i !== null && Ts(r, i) && (t.flags |= 32),
        Jf(e, t),
        Be(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && Fs(t), null;
    case 13:
      return e0(e, t, n);
    case 4:
      return (
        Ma(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = xr(t, null, r, n)) : Be(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : yt(r, l)),
        fc(e, t, r, l, n)
      );
    case 7:
      return Be(e, t, t.pendingProps, n), t.child;
    case 8:
      return Be(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Be(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (i = t.memoizedProps),
          (o = l.value),
          se(Ri, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if (xt(i.value, o)) {
            if (i.children === l.children && !Xe.current) {
              t = Yt(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var s = i.dependencies;
              if (s !== null) {
                o = i.child;
                for (var a = s.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (i.tag === 1) {
                      (a = Gt(-1, n & -n)), (a.tag = 2);
                      var u = i.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var f = u.pending;
                        f === null
                          ? (a.next = a)
                          : ((a.next = f.next), (f.next = a)),
                          (u.pending = a);
                      }
                    }
                    (i.lanes |= n),
                      (a = i.alternate),
                      a !== null && (a.lanes |= n),
                      Ms(i.return, n, t),
                      (s.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(L(341));
                (o.lanes |= n),
                  (s = o.alternate),
                  s !== null && (s.lanes |= n),
                  Ms(o, n, t),
                  (o = i.sibling);
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    (i.return = o.return), (o = i);
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        Be(e, t, l.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        yr(t, n),
        (l = ft(l)),
        (r = r(l)),
        (t.flags |= 1),
        Be(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = yt(r, t.pendingProps)),
        (l = yt(r.type, l)),
        pc(e, t, r, l, n)
      );
    case 15:
      return Yf(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : yt(r, l)),
        fi(e, t),
        (t.tag = 1),
        qe(r) ? ((e = !0), Ni(t)) : (e = !1),
        yr(t, n),
        Qf(t, r, l),
        Is(t, r, l, n),
        Ds(null, t, r, !0, e, n)
      );
    case 19:
      return t0(e, t, n);
    case 22:
      return Kf(e, t, n);
  }
  throw Error(L(156, t.tag));
};
function g0(e, t) {
  return Ud(e, t);
}
function Ph(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function ct(e, t, n, r) {
  return new Ph(e, t, n, r);
}
function qa(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function Rh(e) {
  if (typeof e == "function") return qa(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === ha)) return 11;
    if (e === ma) return 14;
  }
  return 2;
}
function _n(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = ct(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function mi(e, t, n, r, l, i) {
  var o = 2;
  if (((r = e), typeof e == "function")) qa(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case rr:
        return Bn(n.children, l, i, t);
      case pa:
        (o = 8), (l |= 8);
        break;
      case os:
        return (
          (e = ct(12, n, t, l | 2)), (e.elementType = os), (e.lanes = i), e
        );
      case ss:
        return (e = ct(13, n, t, l)), (e.elementType = ss), (e.lanes = i), e;
      case as:
        return (e = ct(19, n, t, l)), (e.elementType = as), (e.lanes = i), e;
      case Ld:
        return ro(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case kd:
              o = 10;
              break e;
            case Cd:
              o = 9;
              break e;
            case ha:
              o = 11;
              break e;
            case ma:
              o = 14;
              break e;
            case ln:
              (o = 16), (r = null);
              break e;
          }
        throw Error(L(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = ct(o, n, t, l)), (t.elementType = e), (t.type = r), (t.lanes = i), t
  );
}
function Bn(e, t, n, r) {
  return (e = ct(7, e, r, t)), (e.lanes = n), e;
}
function ro(e, t, n, r) {
  return (
    (e = ct(22, e, r, t)),
    (e.elementType = Ld),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Zo(e, t, n) {
  return (e = ct(6, e, null, t)), (e.lanes = n), e;
}
function Qo(e, t, n) {
  return (
    (t = ct(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Oh(e, t, n, r, l) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = No(0)),
    (this.expirationTimes = No(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = No(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null);
}
function Ya(e, t, n, r, l, i, o, s, a) {
  return (
    (e = new Oh(e, t, n, s, a)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = ct(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Fa(i),
    e
  );
}
function Ah(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: nr,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function y0(e) {
  if (!e) return Sn;
  e = e._reactInternals;
  e: {
    if (Xn(e) !== e || e.tag !== 1) throw Error(L(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (qe(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(L(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (qe(n)) return yf(e, n, t);
  }
  return t;
}
function w0(e, t, n, r, l, i, o, s, a) {
  return (
    (e = Ya(n, r, !0, e, l, i, o, s, a)),
    (e.context = y0(null)),
    (n = e.current),
    (r = He()),
    (l = wn(n)),
    (i = Gt(r, l)),
    (i.callback = t ?? null),
    gn(n, i, l),
    (e.current.lanes = l),
    Cl(e, l, r),
    Ye(e, r),
    e
  );
}
function lo(e, t, n, r) {
  var l = t.current,
    i = He(),
    o = wn(l);
  return (
    (n = y0(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Gt(i, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = gn(l, t, o)),
    e !== null && (St(e, l, o, i), ui(e, l, o)),
    o
  );
}
function Bi(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Cc(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Ka(e, t) {
  Cc(e, t), (e = e.alternate) && Cc(e, t);
}
function Fh() {
  return null;
}
var _0 =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Ja(e) {
  this._internalRoot = e;
}
io.prototype.render = Ja.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(L(409));
  lo(e, t, null, null);
};
io.prototype.unmount = Ja.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Zn(function () {
      lo(null, e, null, null);
    }),
      (t[Xt] = null);
  }
};
function io(e) {
  this._internalRoot = e;
}
io.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Yd();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < sn.length && t !== 0 && t < sn[n].priority; n++);
    sn.splice(n, 0, e), n === 0 && Jd(e);
  }
};
function ba(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function oo(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Lc() {}
function Mh(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var u = Bi(o);
        i.call(u);
      };
    }
    var o = w0(t, r, e, 0, null, !1, !1, "", Lc);
    return (
      (e._reactRootContainer = o),
      (e[Xt] = o.current),
      ml(e.nodeType === 8 ? e.parentNode : e),
      Zn(),
      o
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == "function") {
    var s = r;
    r = function () {
      var u = Bi(a);
      s.call(u);
    };
  }
  var a = Ya(e, 0, !1, null, null, !1, !1, "", Lc);
  return (
    (e._reactRootContainer = a),
    (e[Xt] = a.current),
    ml(e.nodeType === 8 ? e.parentNode : e),
    Zn(function () {
      lo(t, a, n, r);
    }),
    a
  );
}
function so(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var s = l;
      l = function () {
        var a = Bi(o);
        s.call(a);
      };
    }
    lo(t, o, e, l);
  } else o = Mh(n, t, e, l, r);
  return Bi(o);
}
Xd = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Zr(t.pendingLanes);
        n !== 0 &&
          (ya(t, n | 1), Ye(t, Ee()), !(b & 6) && ((Lr = Ee() + 500), Cn()));
      }
      break;
    case 13:
      Zn(function () {
        var r = qt(e, 1);
        if (r !== null) {
          var l = He();
          St(r, e, 1, l);
        }
      }),
        Ka(e, 1);
  }
};
wa = function (e) {
  if (e.tag === 13) {
    var t = qt(e, 134217728);
    if (t !== null) {
      var n = He();
      St(t, e, 134217728, n);
    }
    Ka(e, 134217728);
  }
};
qd = function (e) {
  if (e.tag === 13) {
    var t = wn(e),
      n = qt(e, t);
    if (n !== null) {
      var r = He();
      St(n, e, t, r);
    }
    Ka(e, t);
  }
};
Yd = function () {
  return le;
};
Kd = function (e, t) {
  var n = le;
  try {
    return (le = e), t();
  } finally {
    le = n;
  }
};
ys = function (e, t, n) {
  switch (t) {
    case "input":
      if ((ds(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Ki(r);
            if (!l) throw Error(L(90));
            Td(r), ds(r, l);
          }
        }
      }
      break;
    case "textarea":
      Rd(e, n);
      break;
    case "select":
      (t = n.value), t != null && hr(e, !!n.multiple, t, !1);
  }
};
jd = Za;
zd = Zn;
var $h = { usingClientEntryPoint: !1, Events: [Nl, sr, Ki, $d, Id, Za] },
  Hr = {
    findFiberByHostInstance: $n,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  Ih = {
    bundleType: Hr.bundleType,
    version: Hr.version,
    rendererPackageName: Hr.rendererPackageName,
    rendererConfig: Hr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Kt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Hd(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Hr.findFiberByHostInstance || Fh,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Jl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Jl.isDisabled && Jl.supportsFiber)
    try {
      (Qi = Jl.inject(Ih)), (Mt = Jl);
    } catch {}
}
rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $h;
rt.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!ba(t)) throw Error(L(200));
  return Ah(e, t, null, n);
};
rt.createRoot = function (e, t) {
  if (!ba(e)) throw Error(L(299));
  var n = !1,
    r = "",
    l = _0;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = Ya(e, 1, !1, null, null, n, !1, r, l)),
    (e[Xt] = t.current),
    ml(e.nodeType === 8 ? e.parentNode : e),
    new Ja(t)
  );
};
rt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(L(188))
      : ((e = Object.keys(e).join(",")), Error(L(268, e)));
  return (e = Hd(t)), (e = e === null ? null : e.stateNode), e;
};
rt.flushSync = function (e) {
  return Zn(e);
};
rt.hydrate = function (e, t, n) {
  if (!oo(t)) throw Error(L(200));
  return so(null, e, t, !0, n);
};
rt.hydrateRoot = function (e, t, n) {
  if (!ba(e)) throw Error(L(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    i = "",
    o = _0;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = w0(t, null, e, 1, n ?? null, l, !1, i, o)),
    (e[Xt] = t.current),
    ml(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l);
  return new io(t);
};
rt.render = function (e, t, n) {
  if (!oo(t)) throw Error(L(200));
  return so(null, e, t, !1, n);
};
rt.unmountComponentAtNode = function (e) {
  if (!oo(e)) throw Error(L(40));
  return e._reactRootContainer
    ? (Zn(function () {
        so(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Xt] = null);
        });
      }),
      !0)
    : !1;
};
rt.unstable_batchedUpdates = Za;
rt.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!oo(n)) throw Error(L(200));
  if (e == null || e._reactInternals === void 0) throw Error(L(38));
  return so(e, t, n, !1, r);
};
rt.version = "18.3.1-next-f1338f8080-20240426";
function E0() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(E0);
    } catch (e) {
      console.error(e);
    }
}
E0(), (_d.exports = rt);
var eu = _d.exports,
  Nc = eu;
(ls.createRoot = Nc.createRoot), (ls.hydrateRoot = Nc.hydrateRoot);
/**!
 * audioMotion-analyzer
 * High-resolution real-time graphic audio spectrum analyzer JS module
 *
 * @version 4.5.0
 * @author  Henrique Avila Vianna <hvianna@gmail.com> <https://henriquevianna.com>
 * @license AGPL-3.0-or-later
 */ const jh = "4.5.0",
  tu = Math.PI,
  Jn = 2 * tu,
  Xo = tu / 2,
  Tc = 8.17579892,
  Pc = "dual-combined",
  bl = "dual-horizontal",
  zt = "single",
  Rt = "dual-vertical",
  Rc = "bar-index",
  Oc = "bar-level",
  vi = "gradient",
  Ac = 60,
  Fc = "click",
  zh = "fullscreenchange",
  S0 = "resize",
  Dh = "#111",
  x0 = "",
  Mc = "A",
  $c = "B",
  Ic = "C",
  jc = "D",
  zc = "468",
  ei = "sans-serif",
  Bh = "#0f0",
  Hh = "#7f7f7f22",
  bn = 10,
  Dc = "create",
  Bc = "fschange",
  Vh = "lores",
  Uh = S0,
  qo = "user",
  Wh = "#000c",
  Hc = "#fff",
  Gh = "#4f4",
  Vc = "#888",
  Zh = "#555",
  Yo = "bark",
  Vr = "linear",
  tr = "log",
  Ko = "mel",
  Uc = [
    "#a35",
    "#c66",
    "#e94",
    "#ed0",
    "#9d5",
    "#4d8",
    "#2cb",
    "#0bc",
    "#09c",
    "#36b",
  ],
  k0 = [
    [
      "classic",
      {
        colorStops: [
          "red",
          { color: "yellow", level: 0.85, pos: 0.6 },
          { color: "lime", level: 0.475 },
        ],
      },
    ],
    ["prism", { colorStops: Uc }],
    ["rainbow", { dir: "h", colorStops: ["#817", ...Uc, "#639"] }],
    ["orangered", { bgColor: "#3e2f29", colorStops: ["OrangeRed"] }],
    ["steelblue", { bgColor: "#222c35", colorStops: ["SteelBlue"] }],
  ],
  Ur = {
    alphaBars: !1,
    ansiBands: !1,
    barSpace: 0.1,
    bgAlpha: 0.7,
    channelLayout: zt,
    colorMode: vi,
    fadePeaks: !1,
    fftSize: 8192,
    fillAlpha: 1,
    frequencyScale: tr,
    gradient: k0[0][0],
    gravity: 3.8,
    height: void 0,
    ledBars: !1,
    linearAmplitude: !1,
    linearBoost: 1,
    lineWidth: 0,
    loRes: !1,
    lumiBars: !1,
    maxDecibels: -25,
    maxFPS: 0,
    maxFreq: 22e3,
    minDecibels: -85,
    minFreq: 20,
    mirror: 0,
    mode: 0,
    noteLabels: !1,
    outlineBars: !1,
    overlay: !1,
    peakFadeTime: 750,
    peakHoldTime: 500,
    peakLine: !1,
    radial: !1,
    radialInvert: !1,
    radius: 0.3,
    reflexAlpha: 0.15,
    reflexBright: 1,
    reflexFit: !0,
    reflexRatio: 0,
    roundBars: !1,
    showBgColor: !0,
    showFPS: !1,
    showPeaks: !0,
    showScaleX: !0,
    showScaleY: !1,
    smoothing: 0.5,
    spinSpeed: 0,
    splitGradient: !1,
    start: !0,
    trueLeds: !1,
    useCanvas: !0,
    volume: 1,
    weightingFilter: x0,
    width: void 0,
  },
  Qh = [
    "ERR_AUDIO_CONTEXT_FAIL",
    "Could not create audio context. Web Audio API not supported?",
  ],
  Xh = ["ERR_INVALID_AUDIO_CONTEXT", "Provided audio context is not valid"],
  qh = ["ERR_UNKNOWN_GRADIENT", "Unknown gradient"],
  Jo = ["ERR_FREQUENCY_TOO_LOW", "Frequency values must be >= 1"],
  Yh = ["ERR_INVALID_MODE", "Invalid mode"],
  Kh = ["ERR_REFLEX_OUT_OF_RANGE", "Reflex ratio must be >= 0 and < 1"],
  Jh = [
    "ERR_INVALID_AUDIO_SOURCE",
    "Audio source must be an instance of HTMLMediaElement or AudioNode",
  ],
  bh = [
    "ERR_GRADIENT_INVALID_NAME",
    "Gradient name must be a non-empty string",
  ],
  em = ["ERR_GRADIENT_NOT_AN_OBJECT", "Gradient options must be an object"],
  tm = [
    "ERR_GRADIENT_MISSING_COLOR",
    "Gradient colorStops must be a non-empty array",
  ];
class st extends Error {
  constructor(t, n) {
    const [r, l] = t;
    super(l + (n !== void 0 ? `: ${n}` : "")),
      (this.name = "AudioMotionError"),
      (this.code = r);
  }
}
const Wc = (e, t) => console.warn(`${e} is deprecated. Use ${t} instead.`),
  Gc = (e) => {
    for (const t in e) return !1;
    return !0;
  },
  ti = (e, t, n = "toLowerCase") => t[Math.max(0, t.indexOf(("" + e)[n]()))],
  nm = (e, t, n, r, l) => t + ((r - t) * (l - e)) / (n - e);
Array.prototype.findLastIndex ||
  (Array.prototype.findLastIndex = function (e) {
    let t = this.length;
    for (; t-- > 0; ) if (e(this[t])) return t;
    return -1;
  });
class rm {
  constructor(t, n = {}) {
    (this._ready = !1),
      (this._aux = {}),
      (this._canvasGradients = []),
      (this._destroyed = !1),
      (this._energy = { val: 0, peak: 0, hold: 0 }),
      (this._flg = {}),
      (this._fps = 0),
      (this._gradients = {}),
      (this._last = 0),
      (this._outNodes = []),
      (this._ownContext = !1),
      (this._selectedGrads = []),
      (this._sources = []),
      t instanceof Element || (Gc(n) && !Gc(t) && (n = t), (t = null)),
      (this._ownCanvas = !(n.canvas instanceof HTMLCanvasElement));
    const r = this._ownCanvas ? document.createElement("canvas") : n.canvas;
    (r.style = "max-width: 100%;"), (this._ctx = r.getContext("2d"));
    for (const [c, m] of k0) this.registerGradient(c, m);
    (this._container =
      t || (!this._ownCanvas && r.parentElement) || document.body),
      (this._defaultWidth = this._container.clientWidth || 640),
      (this._defaultHeight = this._container.clientHeight || 270);
    let l;
    if (!(n.source && (l = n.source.context))) {
      if (!(l = n.audioCtx))
        try {
          (l = new (window.AudioContext || window.webkitAudioContext)()),
            (this._ownContext = !0);
        } catch {
          throw new st(Qh);
        }
    }
    if (!l.createGain) throw new st(Xh);
    const i = (this._analyzer = [l.createAnalyser(), l.createAnalyser()]),
      o = (this._splitter = l.createChannelSplitter(2)),
      s = (this._merger = l.createChannelMerger(2));
    (this._input = l.createGain()),
      (this._output = l.createGain()),
      n.source && this.connectInput(n.source);
    for (const c of [0, 1]) o.connect(i[c], c);
    s.connect(this._output), n.connectSpeakers !== !1 && this.connectOutput();
    for (const c of ["_scaleX", "_scaleR"])
      this[c] = document.createElement("canvas").getContext("2d");
    this._fsEl = n.fsElement || r;
    const a = () => {
      this._fsTimeout ||
        (this._fsTimeout = window.setTimeout(() => {
          this._fsChanging || (this._setCanvas(Uh), (this._fsTimeout = 0));
        }, Ac));
    };
    window.ResizeObserver &&
      ((this._observer = new ResizeObserver(a)),
      this._observer.observe(this._container)),
      (this._controller = new AbortController());
    const u = this._controller.signal;
    window.addEventListener(S0, a, { signal: u }),
      r.addEventListener(
        zh,
        () => {
          (this._fsChanging = !0),
            this._fsTimeout && window.clearTimeout(this._fsTimeout),
            this._setCanvas(Bc),
            (this._fsTimeout = window.setTimeout(() => {
              (this._fsChanging = !1), (this._fsTimeout = 0);
            }, Ac));
        },
        { signal: u },
      );
    const f = () => {
      l.state == "suspended" && l.resume(), window.removeEventListener(Fc, f);
    };
    window.addEventListener(Fc, f),
      document.addEventListener(
        "visibilitychange",
        () => {
          document.visibilityState != "hidden" &&
            ((this._frames = 0), (this._time = performance.now()));
        },
        { signal: u },
      ),
      this._setProps(n, !0),
      this.useCanvas && this._ownCanvas && this._container.appendChild(r),
      (this._ready = !0),
      this._setCanvas(Dc);
  }
  get alphaBars() {
    return this._alphaBars;
  }
  set alphaBars(t) {
    (this._alphaBars = !!t), this._calcBars();
  }
  get ansiBands() {
    return this._ansiBands;
  }
  set ansiBands(t) {
    (this._ansiBands = !!t), this._calcBars();
  }
  get barSpace() {
    return this._barSpace;
  }
  set barSpace(t) {
    (this._barSpace = +t || 0), this._calcBars();
  }
  get channelLayout() {
    return this._chLayout;
  }
  set channelLayout(t) {
    (this._chLayout = ti(t, [zt, bl, Rt, Pc])),
      this._input.disconnect(),
      this._input.connect(
        this._chLayout != zt ? this._splitter : this._analyzer[0],
      ),
      this._analyzer[0].disconnect(),
      this._outNodes.length &&
        this._analyzer[0].connect(
          this._chLayout != zt ? this._merger : this._output,
        ),
      this._calcBars(),
      this._makeGrad();
  }
  get colorMode() {
    return this._colorMode;
  }
  set colorMode(t) {
    this._colorMode = ti(t, [vi, Rc, Oc]);
  }
  get fadePeaks() {
    return this._fadePeaks;
  }
  set fadePeaks(t) {
    this._fadePeaks = !!t;
  }
  get fftSize() {
    return this._analyzer[0].fftSize;
  }
  set fftSize(t) {
    for (const r of [0, 1]) this._analyzer[r].fftSize = t;
    const n = this._analyzer[0].frequencyBinCount;
    (this._fftData = [new Float32Array(n), new Float32Array(n)]),
      this._calcBars();
  }
  get frequencyScale() {
    return this._frequencyScale;
  }
  set frequencyScale(t) {
    (this._frequencyScale = ti(t, [tr, Yo, Ko, Vr])), this._calcBars();
  }
  get gradient() {
    return this._selectedGrads[0];
  }
  set gradient(t) {
    this._setGradient(t);
  }
  get gradientLeft() {
    return this._selectedGrads[0];
  }
  set gradientLeft(t) {
    this._setGradient(t, 0);
  }
  get gradientRight() {
    return this._selectedGrads[1];
  }
  set gradientRight(t) {
    this._setGradient(t, 1);
  }
  get gravity() {
    return this._gravity;
  }
  set gravity(t) {
    this._gravity = t > 0 ? +t : this._gravity || Ur.gravity;
  }
  get height() {
    return this._height;
  }
  set height(t) {
    (this._height = t), this._setCanvas(qo);
  }
  get ledBars() {
    return this._showLeds;
  }
  set ledBars(t) {
    (this._showLeds = !!t), this._calcBars();
  }
  get linearAmplitude() {
    return this._linearAmplitude;
  }
  set linearAmplitude(t) {
    this._linearAmplitude = !!t;
  }
  get linearBoost() {
    return this._linearBoost;
  }
  set linearBoost(t) {
    this._linearBoost = t >= 1 ? +t : 1;
  }
  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(t) {
    this._lineWidth = +t || 0;
  }
  get loRes() {
    return this._loRes;
  }
  set loRes(t) {
    (this._loRes = !!t), this._setCanvas(Vh);
  }
  get lumiBars() {
    return this._lumiBars;
  }
  set lumiBars(t) {
    (this._lumiBars = !!t), this._calcBars(), this._makeGrad();
  }
  get maxDecibels() {
    return this._analyzer[0].maxDecibels;
  }
  set maxDecibels(t) {
    for (const n of [0, 1]) this._analyzer[n].maxDecibels = t;
  }
  get maxFPS() {
    return this._maxFPS;
  }
  set maxFPS(t) {
    this._maxFPS = t < 0 ? 0 : +t || 0;
  }
  get maxFreq() {
    return this._maxFreq;
  }
  set maxFreq(t) {
    if (t < 1) throw new st(Jo);
    (this._maxFreq = Math.min(t, this.audioCtx.sampleRate / 2)),
      this._calcBars();
  }
  get minDecibels() {
    return this._analyzer[0].minDecibels;
  }
  set minDecibels(t) {
    for (const n of [0, 1]) this._analyzer[n].minDecibels = t;
  }
  get minFreq() {
    return this._minFreq;
  }
  set minFreq(t) {
    if (t < 1) throw new st(Jo);
    (this._minFreq = +t), this._calcBars();
  }
  get mirror() {
    return this._mirror;
  }
  set mirror(t) {
    (this._mirror = Math.sign(t) | 0), this._calcBars(), this._makeGrad();
  }
  get mode() {
    return this._mode;
  }
  set mode(t) {
    const n = t | 0;
    if (n >= 0 && n <= 10 && n != 9)
      (this._mode = n), this._calcBars(), this._makeGrad();
    else throw new st(Yh, t);
  }
  get noteLabels() {
    return this._noteLabels;
  }
  set noteLabels(t) {
    (this._noteLabels = !!t), this._createScales();
  }
  get outlineBars() {
    return this._outlineBars;
  }
  set outlineBars(t) {
    (this._outlineBars = !!t), this._calcBars();
  }
  get peakFadeTime() {
    return this._peakFadeTime;
  }
  set peakFadeTime(t) {
    this._peakFadeTime = t >= 0 ? +t : this._peakFadeTime || Ur.peakFadeTime;
  }
  get peakHoldTime() {
    return this._peakHoldTime;
  }
  set peakHoldTime(t) {
    this._peakHoldTime = +t || 0;
  }
  get peakLine() {
    return this._peakLine;
  }
  set peakLine(t) {
    this._peakLine = !!t;
  }
  get radial() {
    return this._radial;
  }
  set radial(t) {
    (this._radial = !!t), this._calcBars(), this._makeGrad();
  }
  get radialInvert() {
    return this._radialInvert;
  }
  set radialInvert(t) {
    (this._radialInvert = !!t), this._calcBars(), this._makeGrad();
  }
  get radius() {
    return this._radius;
  }
  set radius(t) {
    (this._radius = +t || 0), this._calcBars(), this._makeGrad();
  }
  get reflexRatio() {
    return this._reflexRatio;
  }
  set reflexRatio(t) {
    if (((t = +t || 0), t < 0 || t >= 1)) throw new st(Kh);
    (this._reflexRatio = t), this._calcBars(), this._makeGrad();
  }
  get roundBars() {
    return this._roundBars;
  }
  set roundBars(t) {
    (this._roundBars = !!t), this._calcBars();
  }
  get smoothing() {
    return this._analyzer[0].smoothingTimeConstant;
  }
  set smoothing(t) {
    for (const n of [0, 1]) this._analyzer[n].smoothingTimeConstant = t;
  }
  get spinSpeed() {
    return this._spinSpeed;
  }
  set spinSpeed(t) {
    (t = +t || 0),
      (this._spinSpeed === void 0 || t == 0) && (this._spinAngle = -Xo),
      (this._spinSpeed = t);
  }
  get splitGradient() {
    return this._splitGradient;
  }
  set splitGradient(t) {
    (this._splitGradient = !!t), this._makeGrad();
  }
  get stereo() {
    return Wc("stereo", "channelLayout"), this._chLayout != zt;
  }
  set stereo(t) {
    Wc("stereo", "channelLayout"), (this.channelLayout = t ? Rt : zt);
  }
  get trueLeds() {
    return this._trueLeds;
  }
  set trueLeds(t) {
    this._trueLeds = !!t;
  }
  get volume() {
    return this._output.gain.value;
  }
  set volume(t) {
    this._output.gain.value = t;
  }
  get weightingFilter() {
    return this._weightingFilter;
  }
  set weightingFilter(t) {
    this._weightingFilter = ti(t, [x0, Mc, $c, Ic, jc, zc], "toUpperCase");
  }
  get width() {
    return this._width;
  }
  set width(t) {
    (this._width = t), this._setCanvas(qo);
  }
  get audioCtx() {
    return this._input.context;
  }
  get canvas() {
    return this._ctx.canvas;
  }
  get canvasCtx() {
    return this._ctx;
  }
  get connectedSources() {
    return this._sources;
  }
  get connectedTo() {
    return this._outNodes;
  }
  get fps() {
    return this._fps;
  }
  get fsHeight() {
    return this._fsHeight;
  }
  get fsWidth() {
    return this._fsWidth;
  }
  get isAlphaBars() {
    return this._flg.isAlpha;
  }
  get isBandsMode() {
    return this._flg.isBands;
  }
  get isDestroyed() {
    return this._destroyed;
  }
  get isFullscreen() {
    return (
      this._fsEl &&
      (document.fullscreenElement || document.webkitFullscreenElement) ===
        this._fsEl
    );
  }
  get isLedBars() {
    return this._flg.isLeds;
  }
  get isLumiBars() {
    return this._flg.isLumi;
  }
  get isOctaveBands() {
    return this._flg.isOctaves;
  }
  get isOn() {
    return !!this._runId;
  }
  get isOutlineBars() {
    return this._flg.isOutline;
  }
  get pixelRatio() {
    return this._pixelRatio;
  }
  get isRoundBars() {
    return this._flg.isRound;
  }
  static get version() {
    return jh;
  }
  connectInput(t) {
    const n = t instanceof HTMLMediaElement;
    if (!(n || t.connect)) throw new st(Jh);
    const r = n ? this.audioCtx.createMediaElementSource(t) : t;
    return (
      this._sources.includes(r) ||
        (r.connect(this._input), this._sources.push(r)),
      r
    );
  }
  connectOutput(t = this.audioCtx.destination) {
    if (
      !this._outNodes.includes(t) &&
      (this._output.connect(t),
      this._outNodes.push(t),
      this._outNodes.length == 1)
    )
      for (const n of [0, 1])
        this._analyzer[n].connect(
          this._chLayout == zt && !n ? this._output : this._merger,
          0,
          n,
        );
  }
  destroy() {
    if (!this._ready) return;
    const {
      audioCtx: t,
      canvas: n,
      _controller: r,
      _input: l,
      _merger: i,
      _observer: o,
      _ownCanvas: s,
      _ownContext: a,
      _splitter: u,
    } = this;
    (this._destroyed = !0),
      (this._ready = !1),
      this.stop(),
      r.abort(),
      o && o.disconnect(),
      (this.onCanvasResize = null),
      (this.onCanvasDraw = null),
      (this._fsEl = null),
      this.disconnectInput(),
      this.disconnectOutput(),
      l.disconnect(),
      u.disconnect(),
      i.disconnect(),
      a && t.close(),
      s && n.remove(),
      this._calcBars();
  }
  disconnectInput(t, n) {
    t ? Array.isArray(t) || (t = [t]) : (t = Array.from(this._sources));
    for (const r of t) {
      const l = this._sources.indexOf(r);
      if (n && r.mediaStream)
        for (const i of r.mediaStream.getAudioTracks()) i.stop();
      l >= 0 && (r.disconnect(this._input), this._sources.splice(l, 1));
    }
  }
  disconnectOutput(t) {
    if (
      !(t && !this._outNodes.includes(t)) &&
      (this._output.disconnect(t),
      (this._outNodes = t ? this._outNodes.filter((n) => n !== t) : []),
      this._outNodes.length == 0)
    )
      for (const n of [0, 1]) this._analyzer[n].disconnect();
  }
  getBars() {
    return Array.from(
      this._bars,
      ({
        posX: t,
        freq: n,
        freqLo: r,
        freqHi: l,
        hold: i,
        peak: o,
        value: s,
      }) => ({
        posX: t,
        freq: n,
        freqLo: r,
        freqHi: l,
        hold: i,
        peak: o,
        value: s,
      }),
    );
  }
  getEnergy(t, n) {
    if (t === void 0) return this._energy.val;
    if (t != +t) {
      if (t == "peak") return this._energy.peak;
      const s = {
        bass: [20, 250],
        lowMid: [250, 500],
        mid: [500, 2e3],
        highMid: [2e3, 4e3],
        treble: [4e3, 16e3],
      };
      if (!s[t]) return null;
      [t, n] = s[t];
    }
    const r = this._freqToBin(t),
      l = n ? this._freqToBin(n) : r,
      i = this._chLayout == zt ? 1 : 2;
    let o = 0;
    for (let s = 0; s < i; s++)
      for (let a = r; a <= l; a++) o += this._normalizedB(this._fftData[s][a]);
    return o / (l - r + 1) / i;
  }
  getOptions(t) {
    Array.isArray(t) || (t = [t]);
    let n = {};
    for (const r of Object.keys(Ur))
      t.includes(r) ||
        (r == "gradient" && this.gradientLeft != this.gradientRight
          ? ((n.gradientLeft = this.gradientLeft),
            (n.gradientRight = this.gradientRight))
          : r != "start" && (n[r] = this[r]));
    return n;
  }
  registerGradient(t, n) {
    if (typeof t != "string" || t.trim().length == 0) throw new st(bh);
    if (typeof n != "object") throw new st(em);
    const { colorStops: r } = n;
    if (!Array.isArray(r) || !r.length) throw new st(tm);
    const l = r.length,
      i = (o) => +o != o || o < 0 || o > 1;
    r.forEach((o, s) => {
      const a = s / Math.max(1, l - 1);
      typeof o != "object"
        ? (r[s] = { pos: a, color: o })
        : i(o.pos) && (o.pos = a),
        i(o.level) && (r[s].level = 1 - s / l);
    }),
      r.sort((o, s) => (o.level < s.level ? 1 : o.level > s.level ? -1 : 0)),
      (r[0].level = 1),
      (this._gradients[t] = {
        bgColor: n.bgColor || Dh,
        dir: n.dir,
        colorStops: r,
      }),
      this._selectedGrads.includes(t) && this._makeGrad();
  }
  setCanvasSize(t, n) {
    (this._width = t), (this._height = n), this._setCanvas(qo);
  }
  setFreqRange(t, n) {
    if (t < 1 || n < 1) throw new st(Jo);
    (this._minFreq = Math.min(t, n)), (this.maxFreq = Math.max(t, n));
  }
  setLedParams(t) {
    let n, r, l;
    t && ((n = t.maxLeds | 0), (r = +t.spaceV), (l = +t.spaceH)),
      (this._ledParams = n > 0 && r > 0 && l >= 0 ? [n, r, l] : void 0),
      this._calcBars();
  }
  setOptions(t) {
    this._setProps(t);
  }
  setSensitivity(t, n) {
    for (const r of [0, 1])
      (this._analyzer[r].minDecibels = Math.min(t, n)),
        (this._analyzer[r].maxDecibels = Math.max(t, n));
  }
  start() {
    this.toggleAnalyzer(!0);
  }
  stop() {
    this.toggleAnalyzer(!1);
  }
  toggleAnalyzer(t) {
    const n = this.isOn;
    return (
      t === void 0 && (t = !n),
      n && !t
        ? (cancelAnimationFrame(this._runId), (this._runId = 0))
        : !n &&
          t &&
          !this._destroyed &&
          ((this._frames = 0),
          (this._time = performance.now()),
          (this._runId = requestAnimationFrame((r) => this._draw(r)))),
      this.isOn
    );
  }
  toggleFullscreen() {
    if (this.isFullscreen)
      document.exitFullscreen
        ? document.exitFullscreen()
        : document.webkitExitFullscreen && document.webkitExitFullscreen();
    else {
      const t = this._fsEl;
      if (!t) return;
      t.requestFullscreen
        ? t.requestFullscreen()
        : t.webkitRequestFullscreen && t.webkitRequestFullscreen();
    }
  }
  _binToFreq(t) {
    return (t * this.audioCtx.sampleRate) / this.fftSize || 1;
  }
  _calcBars() {
    const t = (this._bars = []);
    if (!this._ready) {
      this._flg = {
        isAlpha: !1,
        isBands: !1,
        isLeds: !1,
        isLumi: !1,
        isOctaves: !1,
        isOutline: !1,
        isRound: !1,
        noLedGap: !1,
      };
      return;
    }
    const {
        _ansiBands: n,
        _barSpace: r,
        canvas: l,
        _chLayout: i,
        _maxFreq: o,
        _minFreq: s,
        _mirror: a,
        _mode: u,
        _radial: f,
        _radialInvert: c,
        _reflexRatio: m,
      } = this,
      v = l.width >> 1,
      _ = l.height >> 1,
      S = i == Rt && !f,
      N = i == bl,
      d = u % 10 != 0,
      p = d && this._frequencyScale == tr,
      h = this._showLeds && d && !f,
      E = this._lumiBars && d && !f,
      C = this._alphaBars && !E && u != bn,
      R = this._outlineBars && d && !E && !h,
      k = this._roundBars && d && !E && !h,
      P = i != Rt || (m > 0 && !E),
      j = (l.height - (S && !h ? 0.5 : 0)) >> S,
      $ = (j * (E || f ? 1 : 1 - m)) | 0,
      y = l.width - v * (N || a != 0),
      ne = S ? l.height - j * 2 : 0,
      ae = v * (a == -1 && !N && !f);
    let we =
        (Math.min(l.width, l.height) * 0.375 * (i == Rt ? 1 : this._radius)) |
        0,
      Y = Math.min(v, _);
    c && i != Rt && ([we, Y] = [Y, we]);
    const K = (q) =>
        t.push({ ...q, peak: [0, 0], hold: [0], alpha: [0], value: [0] }),
      Z = (q) => {
        const V = this._freqToBin(q, "floor"),
          I = this._binToFreq(V),
          D = this._binToFreq(V + 1),
          ie = Math.log2(q / I) / Math.log2(D / I);
        return [V, ie];
      };
    let x, O, A;
    if (p) {
      const q = (ee, he, re) =>
          +ee.toPrecision(re ? Math.max(he, (1 + Math.log10(ee)) | 0) : he),
        V = (ee) => {
          const he = [
              1, 1.12, 1.25, 1.4, 1.6, 1.8, 2, 2.24, 2.5, 2.8, 3.15, 3.55, 4,
              4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10,
            ],
            re = Math.log10(ee) | 0,
            Ct = ee / 10 ** re;
          let mt = 1;
          for (; mt < he.length && Ct > he[mt]; ) mt++;
          return (
            Ct - he[mt - 1] < he[mt] - Ct && mt--,
            ((he[mt] * 10 ** (re + 5)) | 0) / 1e5
          );
        },
        I = [0, 24, 12, 8, 6, 4, 3, 2, 1][u],
        D = n ? 10 ** (3 / (I * 10)) : 2 ** (1 / I),
        ie = D ** 0.5;
      let Se = n ? 7.94328235 / (I % 2 ? 1 : ie) : Tc;
      do {
        let ee = Se;
        const he = q(ee / ie, 4, !0),
          re = q(ee * ie, 4, !0),
          [Ct, mt] = Z(he),
          [Rr, Lt] = Z(re);
        n
          ? (ee = I < 4 ? V(ee) : q(ee, ee.toString()[0] < 5 ? 3 : 2))
          : (ee = q(ee, 4, !0)),
          ee >= s &&
            K({
              posX: 0,
              freq: ee,
              freqLo: he,
              freqHi: re,
              binLo: Ct,
              binHi: Rr,
              ratioLo: mt,
              ratioHi: Lt,
            }),
          (Se *= D);
      } while (Se <= o);
      (x = y / t.length), t.forEach((ee, he) => (ee.posX = ae + he * x));
      const U = t[0],
        pe = t[t.length - 1];
      (O = this._freqScaling(U.freqLo)),
        (A = y / (this._freqScaling(pe.freqHi) - O)),
        U.freqLo < s && ((U.freqLo = s), ([U.binLo, U.ratioLo] = Z(s))),
        pe.freqHi > o && ((pe.freqHi = o), ([pe.binHi, pe.ratioHi] = Z(o)));
    } else if (d) {
      const q = [0, 24, 12, 8, 6, 4, 3, 2, 1][u] * 10,
        V = (I) => {
          switch (this._frequencyScale) {
            case Yo:
              return 1960 / (26.81 / (I + 0.53) - 1);
            case Ko:
              return 700 * (2 ** I - 1);
            case Vr:
              return I;
          }
        };
      (x = y / q),
        (O = this._freqScaling(s)),
        (A = y / (this._freqScaling(o) - O));
      for (let I = 0, D = 0; I < q; I++, D += x) {
        const ie = V(O + D / A),
          Se = V(O + (D + x / 2) / A),
          U = V(O + (D + x) / A),
          [pe, ee] = Z(ie),
          [he, re] = Z(U);
        K({
          posX: ae + D,
          freq: Se,
          freqLo: ie,
          freqHi: U,
          binLo: pe,
          binHi: he,
          ratioLo: ee,
          ratioHi: re,
        });
      }
    } else {
      (x = 1), (O = this._freqScaling(s)), (A = y / (this._freqScaling(o) - O));
      const q = this._freqToBin(s, "floor"),
        V = this._freqToBin(o);
      let I = -999;
      for (let D = q; D <= V; D++) {
        const ie = this._binToFreq(D),
          Se = ae + Math.round(A * (this._freqScaling(ie) - O));
        if (Se > I)
          K({
            posX: Se,
            freq: ie,
            freqLo: ie,
            freqHi: ie,
            binLo: D,
            binHi: D,
            ratioLo: 0,
            ratioHi: 0,
          }),
            (I = Se);
        else if (t.length) {
          const U = t[t.length - 1];
          (U.binHi = D), (U.freqHi = ie), (U.freq = (U.freqLo * ie) ** 0.5);
        }
      }
    }
    let Q = 0,
      H = 0;
    if (h) {
      const q =
          this._pixelRatio /
          (window.devicePixelRatio > 1 && window.screen.height <= 540 ? 2 : 1),
        V = [
          [],
          [128, 3, 0.45],
          [128, 4, 0.225],
          [96, 6, 0.225],
          [80, 6, 0.225],
          [80, 6, 0.125],
          [64, 6, 0.125],
          [48, 8, 0.125],
          [24, 16, 0.125],
        ],
        I = this._ledParams,
        [D, ie, Se] = I || V[u];
      let U,
        pe = $;
      if (I) {
        const ee = 2 * q;
        let he;
        U = D + 1;
        do U--, (he = pe / U / (1 + ie)), (H = he * ie);
        while ((he < ee || H < ee) && U > 1);
      } else {
        const ee = 540 / ie;
        H = Math.min(ie * q, Math.max(2, (pe / ee + 0.1) | 0));
      }
      P && (pe += H),
        I || (U = Math.min(D, (pe / (H * 2)) | 0)),
        (Q = Se >= 1 ? Se : x * Se),
        (this._leds = [U, Q, H, pe / U - H]);
    }
    const G = Math.min(x - 1, r * (r > 0 && r < 1 ? x : 1));
    d && (x -= Math.max(h ? Q : 0, G)),
      t.forEach((q, V) => {
        let I = q.posX,
          D = x;
        d &&
          (r == 0 && !h
            ? ((I |= 0),
              (D |= 0),
              V > 0 && I > t[V - 1].posX + t[V - 1].width && (I--, D++))
            : (I += Math.max(h ? Q : 0, G) / 2),
          (q.posX = I)),
          (q.barCenter = I + (x == 1 ? 0 : D / 2)),
          (q.width = D);
      });
    const te = [];
    for (const q of [0, 1]) {
      const V = i == Rt ? (j + ne) * q : 0,
        I = V + j,
        D = V + $ - (!h || P ? 0 : H);
      te.push({ channelTop: V, channelBottom: I, analyzerBottom: D });
    }
    (this._aux = {
      analyzerHeight: $,
      analyzerWidth: y,
      centerX: v,
      centerY: _,
      channelCoords: te,
      channelHeight: j,
      channelGap: ne,
      initialX: ae,
      innerRadius: we,
      outerRadius: Y,
      scaleMin: O,
      unitWidth: A,
    }),
      (this._flg = {
        isAlpha: C,
        isBands: d,
        isLeds: h,
        isLumi: E,
        isOctaves: p,
        isOutline: R,
        isRound: k,
        noLedGap: P,
      }),
      this._createScales();
  }
  _createScales() {
    if (!this._ready) return;
    const {
        analyzerWidth: t,
        initialX: n,
        innerRadius: r,
        scaleMin: l,
        unitWidth: i,
      } = this._aux,
      {
        canvas: o,
        _frequencyScale: s,
        _mirror: a,
        _noteLabels: u,
        _radial: f,
        _scaleX: c,
        _scaleR: m,
      } = this,
      v = c.canvas,
      _ = m.canvas,
      S = [],
      N = this._chLayout == bl,
      d = this._chLayout == Rt,
      p = Math.min(o.width, o.height),
      h = ["C", , "D", , "E", "F", , "G", , "A", , "B"],
      E = (p / 34) | 0,
      C = v.height >> 1,
      R = E >> 1,
      k = C * (u ? 0.7 : 1.5),
      P = R * (u ? 1 : 2),
      j = 2 ** (1 / 12);
    if (!u && (this._ansiBands || s != tr))
      S.push(16, 31.5, 63, 125, 250, 500, 1e3, 2e3, 4e3),
        s == Vr
          ? S.push(6e3, 8e3, 1e4, 12e3, 14e3, 16e3, 18e3, 2e4, 22e3)
          : S.push(8e3, 16e3);
    else {
      let Y = Tc;
      for (let K = -1; K < 11; K++)
        for (let Z = 0; Z < 12; Z++) {
          if (Y >= this._minFreq && Y <= this._maxFreq) {
            const x = h[Z],
              O = x == "C";
            ((x && u && !a && !N) || O) &&
              S.push(u ? [Y, x + (O ? K : "")] : Y);
          }
          Y *= j;
        }
    }
    _.width = _.height = Math.max(p * 0.15, (r << 1) + d * E);
    const $ = _.width >> 1,
      y = $ - E * 0.7,
      ne = (Y, K) => {
        const Z = Jn * (Y / o.width),
          x = Z - Xo,
          O = y * Math.cos(x),
          A = y * Math.sin(x);
        m.save(),
          m.translate($ + O, $ + A),
          m.rotate(Z),
          m.fillText(K, 0, 0),
          m.restore();
      };
    (v.width |= 0),
      (c.fillStyle = m.strokeStyle = Wh),
      c.fillRect(0, 0, v.width, v.height),
      m.arc($, $, $ - E / 2, 0, Jn),
      (m.lineWidth = E),
      m.stroke(),
      (c.fillStyle = m.fillStyle = Hc),
      (c.font = `${C}px ${ei}`),
      (m.font = `${R}px ${ei}`),
      (c.textAlign = m.textAlign = "center");
    let ae = -k / 4,
      we = -P;
    for (const Y of S) {
      const [K, Z] = Array.isArray(Y)
          ? Y
          : [Y, Y < 1e3 ? Y | 0 : `${((Y / 100) | 0) / 10}k`],
        x = i * (this._freqScaling(K) - l),
        O = v.height * 0.75,
        A = Z[0] == "C",
        Q = C * (u && !a && !N ? (A ? 1.2 : 0.6) : 3);
      if (((c.fillStyle = m.fillStyle = A && !a && !N ? Gh : Hc), u)) {
        const H = s == tr,
          G = s == Vr;
        let te = ["C"];
        if (
          ((H ||
            K > 2e3 ||
            (!G && K > 250) ||
            ((!f || d) && ((!G && K > 125) || K > 1e3))) &&
            te.push("G"),
          (H ||
            K > 4e3 ||
            (!G && K > 500) ||
            ((!f || d) && ((!G && K > 250) || K > 2e3))) &&
            te.push("E"),
          ((G && K > 4e3) ||
            ((!f || d) && (H || K > 2e3 || (!G && K > 500)))) &&
            te.push("D", "F", "A", "B"),
          !te.includes(Z[0]))
        )
          continue;
      }
      x >= ae + k / 2 &&
        x <= t &&
        (c.fillText(Z, N && a == -1 ? t - x : n + x, O, Q),
        (N || (a && (x > k || a == 1))) &&
          c.fillText(Z, N && a != 1 ? t + x : (n || o.width) - x, O, Q),
        (ae = x + Math.min(Q, c.measureText(Z).width) / 2)),
        x >= we + P &&
          x < t - P &&
          (ne(N && a == 1 ? t - x : x, Z),
          (N || (a && (x > P || a == 1))) && ne(N && a != -1 ? t + x : -x, Z),
          (we = x));
    }
  }
  _draw(t) {
    this._runId = requestAnimationFrame((F) => this._draw(F));
    const n = t - this._time,
      r = t - this._last,
      l = this._maxFPS ? 975 / this._maxFPS : 0;
    if (r < l) return;
    (this._last = t - (l ? r % l : 0)),
      this._frames++,
      n >= 1e3 &&
        ((this._fps = (this._frames / n) * 1e3),
        (this._frames = 0),
        (this._time = t));
    const {
        isAlpha: i,
        isBands: o,
        isLeds: s,
        isLumi: a,
        isOctaves: u,
        isOutline: f,
        isRound: c,
        noLedGap: m,
      } = this._flg,
      {
        analyzerHeight: v,
        centerX: _,
        centerY: S,
        channelCoords: N,
        channelHeight: d,
        channelGap: p,
        initialX: h,
        innerRadius: E,
        outerRadius: C,
      } = this._aux,
      {
        _bars: R,
        canvas: k,
        _canvasGradients: P,
        _chLayout: j,
        _colorMode: $,
        _ctx: y,
        _energy: ne,
        _fadePeaks: ae,
        fillAlpha: we,
        _fps: Y,
        _linearAmplitude: K,
        _lineWidth: Z,
        maxDecibels: x,
        minDecibels: O,
        _mirror: A,
        _mode: Q,
        overlay: H,
        _radial: G,
        showBgColor: te,
        showPeaks: q,
        useCanvas: V,
        _weightingFilter: I,
      } = this,
      D = this._scaleX.canvas,
      ie = this._scaleR.canvas,
      Se = (Y * this._peakFadeTime) / 1e3,
      U = Y ** 2,
      pe = this._gravity * 1e3,
      ee = (Y * this._peakHoldTime) / 1e3,
      he = j == Pc,
      re = j == bl,
      Ct = j == Rt,
      mt = j == zt,
      Rr = s && this._trueLeds && $ == vi,
      Lt = G ? k.width : this._aux.analyzerWidth,
      ho = h + Lt,
      Or = q && this._peakLine && Q == bn,
      Jt = G ? C - E : v,
      np = Jt / this._pixelRatio,
      [rp, Qg, Ar, mo] = this._leds || [];
    ne.val > 0 && Y > 0 && (this._spinAngle += (this._spinSpeed * Jn) / 60 / Y);
    const lp = (F) => {
        if (this._reflexRatio > 0 && !a && !G) {
          let J, Nt;
          this.reflexFit || Ct
            ? ((J = Ct && F == 0 ? d + p : 0), (Nt = d - v))
            : ((J = k.height - v * 2), (Nt = v)),
            y.save(),
            (y.globalAlpha = this.reflexAlpha),
            this.reflexBright != 1 &&
              (y.filter = `brightness(${this.reflexBright})`),
            y.setTransform(1, 0, 0, -1, 0, k.height),
            y.drawImage(k, 0, N[F].channelTop, k.width, v, 0, J, k.width, Nt),
            y.restore();
        }
      },
      ip = () => {
        this.showScaleX &&
          (G
            ? (y.save(),
              y.translate(_, S),
              this._spinSpeed && y.rotate(this._spinAngle + Xo),
              y.drawImage(ie, -ie.width >> 1, -ie.width >> 1),
              y.restore())
            : y.drawImage(D, 0, k.height - D.height));
      },
      op = (F) => {
        const J = F ** 2,
          Nt = 424.36,
          Re = 11599.29,
          Fl = 25122.25,
          bt = 544496.41,
          jt = 148693636,
          Tn = (Pn) => 20 * Math.log10(Pn);
        switch (I) {
          case Mc:
            const Pn =
              (jt * J ** 2) /
              ((J + Nt) * Math.sqrt((J + Re) * (J + bt)) * (J + jt));
            return 2 + Tn(Pn);
          case $c:
            const Rn = (jt * J * F) / ((J + Nt) * Math.sqrt(J + Fl) * (J + jt));
            return 0.17 + Tn(Rn);
          case Ic:
            const yo = (jt * J) / ((J + Nt) * (J + jt));
            return 0.06 + Tn(yo);
          case jc:
            const Ml =
                ((103791848e-2 - J) ** 2 + 108076816e-2 * J) /
                ((9837328 - J) ** 2 + 11723776 * J),
              wo =
                (F / 68966888496476e-18) *
                Math.sqrt(Ml / ((J + 79919.29) * (J + 1345600)));
            return Tn(wo);
          case zc:
            const $l =
                -4737338981378384e-39 * F ** 6 +
                2043828333606125e-30 * F ** 4 -
                1363894795463638e-22 * J +
                1,
              On =
                1306612257412824e-34 * F ** 5 -
                2118150887518656e-26 * F ** 3 +
                0.0005559488023498642 * F,
              Ke = (0.0001246332637532143 * F) / Math.hypot($l, On);
            return 18.2 + Tn(Ke);
        }
        return 0;
      },
      vo = (F, J, Nt) => {
        y.beginPath(), y.moveTo(F, J), y.lineTo(F, Nt), y.stroke();
      },
      go = (F) => {
        if (F && Z) {
          const J = y.globalAlpha;
          (y.globalAlpha = 1), y.stroke(), (y.globalAlpha = J);
        }
      },
      Nn = (F) => Math.max(0, ((F * rp) | 0) * (mo + Ar) - Ar),
      sp = (F) => {
        (ne.val = F),
          ne.peak > 0 &&
            (ne.hold--,
            ne.hold < 0 &&
              (ne.peak += ((ne.hold * pe) / U / k.height) * this._pixelRatio)),
          F >= ne.peak && ((ne.peak = F), (ne.hold = ee));
      };
    H && y.clearRect(0, 0, k.width, k.height);
    let pu = 0;
    const hu = R.length,
      mu = mt ? 1 : 2;
    for (let F = 0; F < mu; F++) {
      const { channelTop: J, channelBottom: Nt, analyzerBottom: Re } = N[F],
        Fl = this._gradients[this._selectedGrads[F]],
        bt = Fl.colorStops,
        jt = bt.length,
        Tn = !te || (s && !H) ? "#000" : Fl.bgColor,
        Pn = Ct && G && F ? -1 : 1,
        Rn = (!F && A == -1) || (F && A == 1),
        yo = !re || (F && A != 1) ? 0 : Lt >> (F || !Rn),
        Ml = re && Rn ? -1 : 1,
        wo = () => {
          const z = D.height,
            B = z >> 1,
            W = K ? 100 : x,
            ue = K ? 0 : O,
            xe = K ? 20 : 5,
            Ge = v / (W - ue),
            Tt = A != -1 && (!re || F == 0 || A == 1),
            en = A != 1 && (!re || F != A);
          y.save(),
            (y.fillStyle = Vc),
            (y.font = `${B}px ${ei}`),
            (y.textAlign = "right"),
            (y.lineWidth = 1);
          for (let tn = W; tn > ue; tn -= xe) {
            const qn = J + (W - tn) * Ge,
              Ne = (tn % 2 == 0) | 0;
            if (Ne) {
              const De = qn + B * (qn == J ? 0.8 : 0.35);
              Tt && y.fillText(tn, z * 0.85, De),
                en && y.fillText(tn, (re ? Lt : k.width) - z * 0.1, De),
                (y.strokeStyle = Vc),
                y.setLineDash([2, 4]),
                (y.lineDashOffset = 0);
            } else
              (y.strokeStyle = Zh),
                y.setLineDash([2, 8]),
                (y.lineDashOffset = 1);
            y.beginPath(),
              y.moveTo(h + z * Ne * Tt, ~~qn + 0.5),
              y.lineTo(ho - z * Ne * en, ~~qn + 0.5),
              y.stroke();
          }
          y.restore();
        },
        $l = (z, B) => {
          const W = vt[z] + (z < vt.length - 1 ? (vt[z + 1] - vt[z]) * B : 0);
          return isNaN(W) ? -1 / 0 : W;
        },
        On = (z, B = Ml) => B * Jn * ((z + yo) / k.width) + this._spinAngle,
        Ke = (z, B, W) => {
          const ue = E + B * Pn,
            xe = On(z, W);
          return [_ + ue * Math.cos(xe), S + ue * Math.sin(xe)];
        },
        _o = (z, B, W, ue, xe) => {
          y.beginPath();
          for (const Ge of A && !re ? [1, -1] : [Ml]) {
            const [Tt, en] = c ? [On(z, Ge), On(z + W, Ge)] : [];
            y.moveTo(...Ke(z, B, Ge)),
              y.lineTo(...Ke(z, B + ue, Ge)),
              c
                ? y.arc(_, S, E + (B + ue) * Pn, Tt, en, Ge != 1)
                : y.lineTo(...Ke(z + W, B + ue, Ge)),
              y.lineTo(...Ke(z + W, B, Ge)),
              c && !xe && y.arc(_, S, E + B * Pn, en, Tt, Ge == 1);
          }
          go(xe), y.fill();
        },
        Eo = (z = 0, B = 0) => {
          let W;
          if (($ == vi && !Rr) || Q == bn) W = P[F];
          else {
            const ue =
              $ == Rc
                ? B % jt
                : bt.findLastIndex((xe) =>
                    s ? Nn(z) <= Nn(xe.level) : z <= xe.level,
                  );
            W = bt[ue].color;
          }
          y.fillStyle = y.strokeStyle = W;
        };
      if (V) {
        if (re && !G) {
          const z = Lt * (F + Rn),
            B = Rn ? -1 : 1;
          y.setTransform(B, 0, 0, 1, z, 0);
        }
        if (
          ((!H || te) &&
            (H && (y.globalAlpha = this.bgAlpha),
            (y.fillStyle = Tn),
            (F == 0 || (!G && !he)) &&
              y.fillRect(
                h,
                J - p,
                Lt,
                (H && this.reflexAlpha == 1 ? v : d) + p,
              ),
            (y.globalAlpha = 1)),
          this.showScaleY && !a && !G && (F == 0 || !he) && wo(),
          s
            ? (y.setLineDash([mo, Ar]), (y.lineWidth = R[0].width))
            : (y.lineWidth = f ? Math.min(Z, R[0].width / 2) : Z),
          y.save(),
          !G)
        ) {
          const z = new Path2D();
          z.rect(0, J, k.width, v), y.clip(z);
        }
      }
      let vt = this._fftData[F];
      this._analyzer[F].getFloatFrequencyData(vt),
        I && (vt = vt.map((z, B) => z + op(this._binToFreq(B)))),
        y.beginPath();
      let Fr = [];
      for (let z = 0; z < hu; z++) {
        const B = R[z],
          {
            posX: W,
            barCenter: ue,
            width: xe,
            freq: Ge,
            binLo: Tt,
            binHi: en,
            ratioLo: tn,
            ratioHi: qn,
          } = B;
        let Ne = Math.max($l(Tt, tn), $l(en, qn));
        for (let oe = Tt + 1; oe < en; oe++) vt[oe] > Ne && (Ne = vt[oe]);
        if (
          ((Ne = this._normalizedB(Ne)),
          (B.value[F] = Ne),
          (pu += Ne),
          B.peak[F] > 0 && B.alpha[F] > 0 && (B.hold[F]--, B.hold[F] < 0))
        ) {
          if (ae && !Or) {
            const oe = !i || (f && Z > 0) ? 1 : i ? B.peak[F] : we;
            B.alpha[F] = oe * (1 + B.hold[F] / Se);
          } else B.peak[F] += (B.hold[F] * pe) / U / np;
          B.alpha[F] <= 0 && (B.peak[F] = 0);
        }
        if (
          (Ne >= B.peak[F] &&
            ((B.peak[F] = Ne),
            (B.hold[F] = ee),
            (B.alpha[F] = !i || (f && Z > 0) ? 1 : i ? Ne : we)),
          !V)
        )
          continue;
        (y.globalAlpha = a || i ? Ne : f ? we : 1), Eo(Ne, z);
        const De = a ? Jt : s ? Nn(Ne) : (Ne * Jt) | 0;
        if (Q == bn) {
          const oe = z ? 0 : (this._normalizedB(vt[R[1].binLo]) * Jt + De) / 2;
          if (G) {
            if (
              (z == 0 &&
                (re && y.moveTo(...Ke(0, 0)),
                y.lineTo(...Ke(0, W < 0 ? oe : De))),
              W >= 0)
            ) {
              const it = [W, De];
              y.lineTo(...Ke(...it)), Fr.push(it);
            }
          } else {
            if (z == 0)
              if (A == -1 && !re) y.moveTo(h, Re - (W < h ? oe : De));
              else {
                const it = Tt ? this._normalizedB(vt[Tt - 1]) * Jt : De;
                y.moveTo(h - Z, Re - it);
              }
            (re || A != -1 || W >= h) && y.lineTo(W, Re - De);
          }
        } else if (s) {
          if (te && !H && (F == 0 || !he)) {
            const oe = y.globalAlpha;
            (y.strokeStyle = Hh),
              (y.globalAlpha = 1),
              vo(ue, J, Re),
              (y.strokeStyle = y.fillStyle),
              (y.globalAlpha = oe);
          }
          if (Rr) {
            const oe = a ? 0 : bt.findLastIndex((An) => Nn(Ne) <= Nn(An.level));
            let it = Re;
            for (let An = jt - 1; An >= oe; An--) {
              y.strokeStyle = bt[An].color;
              let gu = Re - (An == oe ? De : Nn(bt[An].level));
              vo(ue, it, gu), (it = gu - Ar);
            }
          } else vo(ue, Re, Re - De);
        } else if (W >= h)
          if (G) _o(W, 0, xe, De, f);
          else if (c) {
            const oe = xe / 2,
              it = Re + oe;
            y.beginPath(),
              y.moveTo(W, it),
              y.lineTo(W, it - De),
              y.arc(ue, it - De, oe, tu, Jn),
              y.lineTo(W + xe, it),
              go(f),
              y.fill();
          } else {
            const oe = f ? y.lineWidth : 0;
            y.beginPath(), y.rect(W, Re + oe, xe, -De - oe), go(f), y.fill();
          }
        const Yn = B.peak[F],
          vu = B.alpha[F];
        if (Yn > 0 && vu > 0 && q && !Or && !a && W >= h && W < ho) {
          if (
            (ae
              ? (y.globalAlpha = vu)
              : f && Z > 0
                ? (y.globalAlpha = 1)
                : i && (y.globalAlpha = Yn),
            ($ == Oc || Rr) && Eo(Yn),
            s)
          ) {
            const oe = Nn(Yn);
            oe >= Ar && y.fillRect(W, Re - oe, xe, mo);
          } else if (!G) y.fillRect(W, Re - Yn * Jt, xe, 2);
          else if (Q != bn) {
            const oe = Yn * Jt;
            _o(W, oe, xe, !this._radialInvert || Ct || oe + E >= 2 ? -2 : 2);
          }
        }
      }
      if (V) {
        if (((y.globalAlpha = 1), Q == bn)) {
          if ((Eo(), G && !re)) {
            if (A) {
              let z;
              for (; (z = Fr.pop()); ) y.lineTo(...Ke(...z, -1));
            }
            y.closePath();
          }
          if ((Z > 0 && y.stroke(), we > 0)) {
            if (G) {
              const z = re ? On(Lt >> 1) : 0,
                B = re ? On(Lt) : Jn;
              y.moveTo(...Ke(re ? Lt >> 1 : 0, 0)),
                y.arc(_, S, E, z, B, re ? !Rn : !0);
            } else y.lineTo(ho, Re), y.lineTo(h, Re);
            (y.globalAlpha = we), y.fill(), (y.globalAlpha = 1);
          }
          if (
            (Or || (G && q)) &&
            ((Fr = []),
            y.beginPath(),
            R.forEach((z, B) => {
              let W = z.posX,
                ue = z.peak[F],
                xe = B ? "lineTo" : "moveTo";
              if (G && W < 0) {
                const Ge = R[B + 1];
                (ue = nm(W, ue, Ge.posX, Ge.peak[F], 0)), (W = 0);
              }
              (ue *= Jt),
                Or
                  ? (y[xe](...(G ? Ke(W, ue) : [W, Re - ue])),
                    G && A && !re && Fr.push([W, ue]))
                  : ue > 0 && _o(W, ue, 1, -2);
            }),
            Or)
          ) {
            let z;
            for (; (z = Fr.pop()); ) y.lineTo(...Ke(...z, -1));
            (y.lineWidth = 1), y.stroke();
          }
        }
        y.restore(),
          re && !G && y.setTransform(1, 0, 0, 1, 0, 0),
          ((!re && !he) || F) && lp(F);
      }
    }
    if (
      (sp(pu / (hu << (mu - 1))),
      V &&
        (A &&
          !G &&
          !re &&
          (y.setTransform(-1, 0, 0, 1, k.width - h, 0),
          y.drawImage(k, h, 0, _, k.height, 0, 0, _, k.height),
          y.setTransform(1, 0, 0, 1, 0, 0)),
        y.setLineDash([]),
        ip()),
      this.showFPS)
    ) {
      const F = D.height;
      (y.font = `bold ${F}px ${ei}`),
        (y.fillStyle = Bh),
        (y.textAlign = "right"),
        y.fillText(Math.round(Y), k.width - F, F * 2);
    }
    this.onCanvasDraw &&
      (y.save(),
      (y.fillStyle = y.strokeStyle = P[0]),
      this.onCanvasDraw(this, { timestamp: t, canvasGradients: P }),
      y.restore());
  }
  _freqScaling(t) {
    switch (this._frequencyScale) {
      case tr:
        return Math.log2(t);
      case Yo:
        return (26.81 * t) / (1960 + t) - 0.53;
      case Ko:
        return Math.log2(1 + t / 700);
      case Vr:
        return t;
    }
  }
  _freqToBin(t, n = "round") {
    const r = this._analyzer[0].frequencyBinCount - 1,
      l = Math[n]((t * this.fftSize) / this.audioCtx.sampleRate);
    return l < r ? l : r;
  }
  _makeGrad() {
    if (!this._ready) return;
    const { canvas: t, _ctx: n, _radial: r, _reflexRatio: l } = this,
      {
        analyzerWidth: i,
        centerX: o,
        centerY: s,
        initialX: a,
        innerRadius: u,
        outerRadius: f,
      } = this._aux,
      { isLumi: c } = this._flg,
      m = this._chLayout == Rt,
      v = 1 - l,
      _ = c ? t.height : (t.height * (1 - l * !m)) | 0;
    for (const S of [0, 1]) {
      const N = this._gradients[this._selectedGrads[S]],
        d = N.colorStops,
        p = N.dir == "h";
      let h;
      if (
        (r
          ? (h = n.createRadialGradient(o, s, f, o, s, u - (f - u) * m))
          : (h = n.createLinearGradient(
              ...(p ? [a, 0, a + i, 0] : [0, 0, 0, _]),
            )),
        d)
      ) {
        const E = m && !this._splitGradient && (!p || r);
        for (let C = 0; C < 1 + E; C++) {
          const R = d.length - 1;
          d.forEach((k, P) => {
            let j = k.pos;
            if (
              (E && (j /= 2),
              m &&
                !c &&
                !r &&
                !p &&
                ((j *= v), !E && j > 0.5 * v && (j += 0.5 * l)),
              C == 1)
            )
              if (r || c) {
                const $ = R - P;
                (k = d[$]), (j = 1 - k.pos / 2);
              } else
                P == 0 && j > 0 && h.addColorStop(0.5, k.color), (j += 0.5);
            h.addColorStop(j, k.color),
              m && P == R && j < 0.5 && h.addColorStop(0.5, k.color);
          });
        }
      }
      this._canvasGradients[S] = h;
    }
  }
  _normalizedB(t) {
    const n = this._linearAmplitude,
      r = n ? 1 / this._linearBoost : 1,
      l = (a, u, f) => (a <= u ? u : a >= f ? f : a),
      i = (a) => 10 ** (a / 20);
    let o = this.maxDecibels,
      s = this.minDecibels;
    return (
      n && ((o = i(o)), (s = i(s)), (t = i(t) ** r)),
      l((t - s) / (o - s) ** r, 0, 1)
    );
  }
  _setCanvas(t) {
    if (!this._ready) return;
    const { canvas: n, _ctx: r } = this,
      l = this._scaleX.canvas,
      i = window.devicePixelRatio / (this._loRes + 1);
    let o = window.screen.width * i,
      s = window.screen.height * i;
    Math.abs(window.orientation) == 90 && o < s && ([o, s] = [s, o]);
    const a = this.isFullscreen,
      u = a && this._fsEl == n,
      f = u
        ? o
        : ((this._width || this._container.clientWidth || this._defaultWidth) *
            i) |
          0,
      c = u
        ? s
        : ((this._height ||
            this._container.clientHeight ||
            this._defaultHeight) *
            i) |
          0;
    (this._pixelRatio = i),
      (this._fsWidth = o),
      (this._fsHeight = s),
      !(t != Dc && n.width == f && n.height == c) &&
        ((n.width = f),
        (n.height = c),
        this.overlay || ((r.fillStyle = "#000"), r.fillRect(0, 0, f, c)),
        (r.lineJoin = "bevel"),
        (l.width = f),
        (l.height = Math.max(20 * i, (Math.min(f, c) / 32) | 0)),
        this._calcBars(),
        this._makeGrad(),
        this._fsStatus !== void 0 && this._fsStatus !== a && (t = Bc),
        (this._fsStatus = a),
        this.onCanvasResize && this.onCanvasResize(t, this));
  }
  _setGradient(t, n) {
    if (!this._gradients.hasOwnProperty(t)) throw new st(qh, t);
    [0, 1].includes(n) || ((this._selectedGrads[1] = t), (n = 0)),
      (this._selectedGrads[n] = t),
      this._makeGrad();
  }
  _setProps(t, n) {
    const r = ["onCanvasDraw", "onCanvasResize"],
      l = ["gradientLeft", "gradientRight", "stereo"],
      i = Object.keys(Ur)
        .filter((o) => o != "start")
        .concat(r, l);
    (n || t === void 0) && (t = { ...Ur, ...t });
    for (const o of Object.keys(t))
      r.includes(o) && typeof t[o] != "function"
        ? (this[o] = void 0)
        : i.includes(o) && (this[o] = t[o]);
    t.start !== void 0 && this.toggleAnalyzer(t.start);
  }
}
const lm = new Map([
    [
      "bold",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z",
        }),
      ),
    ],
    [
      "duotone",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", { d: "M200,112H56l72-72Z", opacity: "0.2" }),
        w.createElement("path", {
          d: "M205.66,106.34l-72-72a8,8,0,0,0-11.32,0l-72,72A8,8,0,0,0,56,120h64v96a8,8,0,0,0,16,0V120h64a8,8,0,0,0,5.66-13.66ZM75.31,104,128,51.31,180.69,104Z",
        }),
      ),
    ],
    [
      "fill",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M207.39,115.06A8,8,0,0,1,200,120H136v96a8,8,0,0,1-16,0V120H56a8,8,0,0,1-5.66-13.66l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,207.39,115.06Z",
        }),
      ),
    ],
    [
      "light",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M204.24,116.24a6,6,0,0,1-8.48,0L134,54.49V216a6,6,0,0,1-12,0V54.49L60.24,116.24a6,6,0,0,1-8.48-8.48l72-72a6,6,0,0,1,8.48,0l72,72A6,6,0,0,1,204.24,116.24Z",
        }),
      ),
    ],
    [
      "regular",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z",
        }),
      ),
    ],
    [
      "thin",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M202.83,114.83a4,4,0,0,1-5.66,0L132,49.66V216a4,4,0,0,1-8,0V49.66L58.83,114.83a4,4,0,0,1-5.66-5.66l72-72a4,4,0,0,1,5.66,0l72,72A4,4,0,0,1,202.83,114.83Z",
        }),
      ),
    ],
  ]),
  im = new Map([
    [
      "bold",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M140,80v41.21l34.17,20.5a12,12,0,1,1-12.34,20.58l-40-24A12,12,0,0,1,116,128V80a12,12,0,0,1,24,0ZM128,28A99.38,99.38,0,0,0,57.24,57.34c-4.69,4.74-9,9.37-13.24,14V64a12,12,0,0,0-24,0v40a12,12,0,0,0,12,12H72a12,12,0,0,0,0-24H57.77C63,86,68.37,80.22,74.26,74.26a76,76,0,1,1,1.58,109,12,12,0,0,0-16.48,17.46A100,100,0,1,0,128,28Z",
        }),
      ),
    ],
    [
      "duotone",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z",
          opacity: "0.2",
        }),
        w.createElement("path", {
          d: "M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z",
        }),
      ),
    ],
    [
      "fill",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z",
        }),
      ),
    ],
    [
      "light",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M134,80v44.6l37.09,22.25a6,6,0,0,1-6.18,10.3l-40-24A6,6,0,0,1,122,128V80a6,6,0,0,1,12,0Zm-6-46A93.4,93.4,0,0,0,61.51,61.56c-8.58,8.68-16,17-23.51,25.8V64a6,6,0,0,0-12,0v40a6,6,0,0,0,6,6H72a6,6,0,0,0,0-12H44.73C52.86,88.29,60.79,79.35,70,70a82,82,0,1,1,1.7,117.62,6,6,0,1,0-8.24,8.72A94,94,0,1,0,128,34Z",
        }),
      ),
    ],
    [
      "regular",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z",
        }),
      ),
    ],
    [
      "thin",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M132,80v45.74l38.06,22.83a4,4,0,0,1-4.12,6.86l-40-24A4,4,0,0,1,124,128V80a4,4,0,0,1,8,0Zm-4-44A91.42,91.42,0,0,0,62.93,63C53.05,73,44.66,82.47,36,92.86V64a4,4,0,0,0-8,0v40a4,4,0,0,0,4,4H72a4,4,0,0,0,0-8H40.47C49.61,89,58.3,79,68.6,68.6a84,84,0,1,1,1.75,120.49,4,4,0,1,0-5.5,5.82A92,92,0,1,0,128,36Z",
        }),
      ),
    ],
  ]),
  om = new Map([
    [
      "bold",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z",
        }),
      ),
    ],
    [
      "duotone",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",
          opacity: "0.2",
        }),
        w.createElement("path", {
          d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z",
        }),
      ),
    ],
    [
      "fill",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z",
        }),
      ),
    ],
    [
      "light",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z",
        }),
      ),
    ],
    [
      "regular",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z",
        }),
      ),
    ],
    [
      "thin",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0Zm-94.83,2.83a4,4,0,0,0,5.66,0l40-40a4,4,0,1,0-5.66-5.66L132,134.34V32a4,4,0,0,0-8,0V134.34L90.83,101.17a4,4,0,0,0-5.66,5.66Z",
        }),
      ),
    ],
  ]),
  sm = new Map([
    [
      "bold",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z",
        }),
      ),
    ],
    [
      "duotone",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M228.23,134.69,84.15,222.81A8,8,0,0,1,72,216.12V39.88a8,8,0,0,1,12.15-6.69l144.08,88.12A7.82,7.82,0,0,1,228.23,134.69Z",
          opacity: "0.2",
        }),
        w.createElement("path", {
          d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z",
        }),
      ),
    ],
    [
      "fill",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z",
        }),
      ),
    ],
    [
      "light",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M231.36,116.19,87.28,28.06a14,14,0,0,0-14.18-.27A13.69,13.69,0,0,0,66,39.87V216.13a13.69,13.69,0,0,0,7.1,12.08,14,14,0,0,0,14.18-.27l144.08-88.13a13.82,13.82,0,0,0,0-23.62Zm-6.26,13.38L81,217.7a2,2,0,0,1-2.06,0,1.78,1.78,0,0,1-1-1.61V39.87a1.78,1.78,0,0,1,1-1.61A2.06,2.06,0,0,1,80,38a2,2,0,0,1,1,.31L225.1,126.43a1.82,1.82,0,0,1,0,3.14Z",
        }),
      ),
    ],
    [
      "regular",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z",
        }),
      ),
    ],
    [
      "thin",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M230.32,117.9,86.24,29.79a11.91,11.91,0,0,0-12.17-.23A11.71,11.71,0,0,0,68,39.89V216.11a11.71,11.71,0,0,0,6.07,10.33,11.91,11.91,0,0,0,12.17-.23L230.32,138.1a11.82,11.82,0,0,0,0-20.2Zm-4.18,13.37L82.06,219.39a4,4,0,0,1-4.07.07,3.77,3.77,0,0,1-2-3.35V39.89a3.77,3.77,0,0,1,2-3.35,4,4,0,0,1,4.07.07l144.08,88.12a3.8,3.8,0,0,1,0,6.54Z",
        }),
      ),
    ],
  ]),
  am = new Map([
    [
      "bold",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M152.5,164.53a72,72,0,1,0-89,0,124.08,124.08,0,0,0-48.69,35.75,12,12,0,0,0,18.38,15.44C46.88,199.42,71,180,108,180s61.12,19.42,74.81,35.72a12,12,0,1,0,18.38-15.44A124,124,0,0,0,152.5,164.53ZM60,108a48,48,0,1,1,48,48A48.05,48.05,0,0,1,60,108Zm192,0a143.09,143.09,0,0,1-11.61,56.73,12,12,0,1,1-22-9.46,120.48,120.48,0,0,0,0-94.54,12,12,0,1,1,22-9.46A143.09,143.09,0,0,1,252,108ZM207,64.76a108.26,108.26,0,0,1,0,86.48,12,12,0,0,1-22-9.62,84.35,84.35,0,0,0,0-67.24,12,12,0,1,1,22-9.62Z",
        }),
      ),
    ],
    [
      "duotone",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M168,108a60,60,0,1,1-60-60A60,60,0,0,1,168,108Z",
          opacity: "0.2",
        }),
        w.createElement("path", {
          d: "M144,165.68a68,68,0,1,0-71.9,0c-20.65,6.76-39.23,19.39-54.17,37.17a8,8,0,0,0,12.25,10.3C50.25,189.19,77.91,176,108,176s57.75,13.19,77.88,37.15a8,8,0,1,0,12.25-10.3C183.18,185.07,164.6,172.44,144,165.68ZM56,108a52,52,0,1,1,52,52A52.06,52.06,0,0,1,56,108ZM207.36,65.6a108.36,108.36,0,0,1,0,84.8,8,8,0,0,1-7.36,4.86,8,8,0,0,1-7.36-11.15,92.26,92.26,0,0,0,0-72.22,8,8,0,0,1,14.72-6.29ZM248,108a139,139,0,0,1-11.29,55.15,8,8,0,0,1-14.7-6.3,124.43,124.43,0,0,0,0-97.7,8,8,0,1,1,14.7-6.3A139,139,0,0,1,248,108Z",
        }),
      ),
    ],
    [
      "fill",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M198.13,202.85A8,8,0,0,1,192,216H24a8,8,0,0,1-6.12-13.15c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,172.44,183.18,185.07,198.13,202.85ZM196.86,61.39a8,8,0,0,0-4.22,10.5,92.26,92.26,0,0,1,0,72.22,8,8,0,1,0,14.72,6.29,108.36,108.36,0,0,0,0-84.8A8,8,0,0,0,196.86,61.39Zm39.85-8.54a8,8,0,1,0-14.7,6.3,124.43,124.43,0,0,1,0,97.7,8,8,0,1,0,14.7,6.3,140.34,140.34,0,0,0,0-110.3Z",
        }),
      ),
    ],
    [
      "light",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M139,166.26a66,66,0,1,0-62,0c-22,6.22-41.88,19.15-57.61,37.88a6,6,0,0,0,9.18,7.72C49.11,187.45,77.31,174,108,174s58.9,13.45,79.41,37.86a6,6,0,1,0,9.18-7.72C180.86,185.41,161,172.48,139,166.26ZM54,108a54,54,0,1,1,54,54A54.06,54.06,0,0,1,54,108ZM205.52,66.39a106.33,106.33,0,0,1,0,83.22,6,6,0,0,1-11-4.71,94.29,94.29,0,0,0,0-73.8,6,6,0,0,1,11-4.71ZM246,108a137.16,137.16,0,0,1-11.12,54.37,6,6,0,0,1-11-4.74,126.41,126.41,0,0,0,0-99.26,6,6,0,0,1,11-4.74A137.16,137.16,0,0,1,246,108Z",
        }),
      ),
    ],
    [
      "regular",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M144,165.68a68,68,0,1,0-71.9,0c-20.65,6.76-39.23,19.39-54.17,37.17a8,8,0,0,0,12.25,10.3C50.25,189.19,77.91,176,108,176s57.75,13.19,77.88,37.15a8,8,0,1,0,12.25-10.3C183.18,185.07,164.6,172.44,144,165.68ZM56,108a52,52,0,1,1,52,52A52.06,52.06,0,0,1,56,108ZM207.36,65.6a108.36,108.36,0,0,1,0,84.8,8,8,0,0,1-7.36,4.86,8,8,0,0,1-7.36-11.15,92.26,92.26,0,0,0,0-72.22,8,8,0,0,1,14.72-6.29ZM248,108a139,139,0,0,1-11.29,55.15,8,8,0,0,1-14.7-6.3,124.43,124.43,0,0,0,0-97.7,8,8,0,1,1,14.7-6.3A139,139,0,0,1,248,108Z",
        }),
      ),
    ],
    [
      "thin",
      w.createElement(
        w.Fragment,
        null,
        w.createElement("path", {
          d: "M133.17,166.84a64,64,0,1,0-50.34,0c-23.76,5.46-45.18,18.69-61.89,38.59a4,4,0,1,0,6.12,5.14C48,185.7,76.71,172,108,172s60,13.7,80.94,38.57a4,4,0,0,0,6.12-5.14C178.35,185.53,156.93,172.3,133.17,166.84ZM52,108a56,56,0,1,1,56,56A56.06,56.06,0,0,1,52,108ZM203.68,67.17a104.35,104.35,0,0,1,0,81.66,4,4,0,0,1-3.68,2.43,4.12,4.12,0,0,1-1.57-.32,4,4,0,0,1-2.11-5.25,96.32,96.32,0,0,0,0-75.38,4,4,0,0,1,7.36-3.14ZM244,108a135.2,135.2,0,0,1-11,53.58,4,4,0,0,1-3.68,2.42,3.94,3.94,0,0,1-1.57-.32,4,4,0,0,1-2.1-5.26,128.44,128.44,0,0,0,0-100.84A4,4,0,1,1,233,54.42,135.2,135.2,0,0,1,244,108Z",
        }),
      ),
    ],
  ]),
  um = g.createContext({
    color: "currentColor",
    size: "1em",
    weight: "regular",
    mirrored: !1,
  });
var cm = Object.defineProperty,
  Hi = Object.getOwnPropertySymbols,
  C0 = Object.prototype.hasOwnProperty,
  L0 = Object.prototype.propertyIsEnumerable,
  Zc = (e, t, n) =>
    t in e
      ? cm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  Qc = (e, t) => {
    for (var n in t || (t = {})) C0.call(t, n) && Zc(e, n, t[n]);
    if (Hi) for (var n of Hi(t)) L0.call(t, n) && Zc(e, n, t[n]);
    return e;
  },
  Xc = (e, t) => {
    var n = {};
    for (var r in e) C0.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && Hi)
      for (var r of Hi(e)) t.indexOf(r) < 0 && L0.call(e, r) && (n[r] = e[r]);
    return n;
  };
const N0 = g.forwardRef((e, t) => {
  const n = e,
    {
      alt: r,
      color: l,
      size: i,
      weight: o,
      mirrored: s,
      children: a,
      weights: u,
    } = n,
    f = Xc(n, [
      "alt",
      "color",
      "size",
      "weight",
      "mirrored",
      "children",
      "weights",
    ]),
    c = g.useContext(um),
    {
      color: m = "currentColor",
      size: v,
      weight: _ = "regular",
      mirrored: S = !1,
    } = c,
    N = Xc(c, ["color", "size", "weight", "mirrored"]);
  return w.createElement(
    "svg",
    Qc(
      Qc(
        {
          ref: t,
          xmlns: "http://www.w3.org/2000/svg",
          width: i ?? v,
          height: i ?? v,
          fill: l ?? m,
          viewBox: "0 0 256 256",
          transform: s || S ? "scale(-1, 1)" : void 0,
        },
        N,
      ),
      f,
    ),
    !!r && w.createElement("title", null, r),
    a,
    u.get(o ?? _),
  );
});
N0.displayName = "IconBase";
const Pl = N0;
var dm = Object.defineProperty,
  fm = Object.defineProperties,
  pm = Object.getOwnPropertyDescriptors,
  qc = Object.getOwnPropertySymbols,
  hm = Object.prototype.hasOwnProperty,
  mm = Object.prototype.propertyIsEnumerable,
  Yc = (e, t, n) =>
    t in e
      ? dm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  vm = (e, t) => {
    for (var n in t || (t = {})) hm.call(t, n) && Yc(e, n, t[n]);
    if (qc) for (var n of qc(t)) mm.call(t, n) && Yc(e, n, t[n]);
    return e;
  },
  gm = (e, t) => fm(e, pm(t));
const T0 = g.forwardRef((e, t) =>
  w.createElement(Pl, gm(vm({ ref: t }, e), { weights: lm })),
);
T0.displayName = "ArrowUp";
var ym = Object.defineProperty,
  wm = Object.defineProperties,
  _m = Object.getOwnPropertyDescriptors,
  Kc = Object.getOwnPropertySymbols,
  Em = Object.prototype.hasOwnProperty,
  Sm = Object.prototype.propertyIsEnumerable,
  Jc = (e, t, n) =>
    t in e
      ? ym(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  xm = (e, t) => {
    for (var n in t || (t = {})) Em.call(t, n) && Jc(e, n, t[n]);
    if (Kc) for (var n of Kc(t)) Sm.call(t, n) && Jc(e, n, t[n]);
    return e;
  },
  km = (e, t) => wm(e, _m(t));
const P0 = g.forwardRef((e, t) =>
  w.createElement(Pl, km(xm({ ref: t }, e), { weights: im })),
);
P0.displayName = "ClockCounterClockwise";
var Cm = Object.defineProperty,
  Lm = Object.defineProperties,
  Nm = Object.getOwnPropertyDescriptors,
  bc = Object.getOwnPropertySymbols,
  Tm = Object.prototype.hasOwnProperty,
  Pm = Object.prototype.propertyIsEnumerable,
  ed = (e, t, n) =>
    t in e
      ? Cm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  Rm = (e, t) => {
    for (var n in t || (t = {})) Tm.call(t, n) && ed(e, n, t[n]);
    if (bc) for (var n of bc(t)) Pm.call(t, n) && ed(e, n, t[n]);
    return e;
  },
  Om = (e, t) => Lm(e, Nm(t));
const R0 = g.forwardRef((e, t) =>
  w.createElement(Pl, Om(Rm({ ref: t }, e), { weights: om })),
);
R0.displayName = "DownloadSimple";
var Am = Object.defineProperty,
  Fm = Object.defineProperties,
  Mm = Object.getOwnPropertyDescriptors,
  td = Object.getOwnPropertySymbols,
  $m = Object.prototype.hasOwnProperty,
  Im = Object.prototype.propertyIsEnumerable,
  nd = (e, t, n) =>
    t in e
      ? Am(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  jm = (e, t) => {
    for (var n in t || (t = {})) $m.call(t, n) && nd(e, n, t[n]);
    if (td) for (var n of td(t)) Im.call(t, n) && nd(e, n, t[n]);
    return e;
  },
  zm = (e, t) => Fm(e, Mm(t));
const nu = g.forwardRef((e, t) =>
  w.createElement(Pl, zm(jm({ ref: t }, e), { weights: sm })),
);
nu.displayName = "Play";
var Dm = Object.defineProperty,
  Bm = Object.defineProperties,
  Hm = Object.getOwnPropertyDescriptors,
  rd = Object.getOwnPropertySymbols,
  Vm = Object.prototype.hasOwnProperty,
  Um = Object.prototype.propertyIsEnumerable,
  ld = (e, t, n) =>
    t in e
      ? Dm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  Wm = (e, t) => {
    for (var n in t || (t = {})) Vm.call(t, n) && ld(e, n, t[n]);
    if (rd) for (var n of rd(t)) Um.call(t, n) && ld(e, n, t[n]);
    return e;
  },
  Gm = (e, t) => Bm(e, Hm(t));
const O0 = g.forwardRef((e, t) =>
  w.createElement(Pl, Gm(Wm({ ref: t }, e), { weights: am })),
);
O0.displayName = "UserSound";
const Zm = ({ value: e, onChange: t, onSubmit: n, isLoading: r }) => {
    const l = g.useRef(null),
      i = () => {
        const a = l.current;
        a !== null &&
          ((a.style.height = "5px"), (a.style.height = a.scrollHeight + "px"));
      },
      o = (a) => {
        a.key === "Enter" && !a.shiftKey && (a.preventDefault(), n());
      },
      s = () => {
        l.current && l.current.focus();
      };
    return (
      g.useEffect(() => {
        i();
      }, [l, e]),
      T.jsxs("div", {
        className:
          "flex flex-row items-center relative w-full px-4 py-3 flex mt-10 border border-opacity-10 border-black cursor-text",
        onClick: s,
        children: [
          T.jsx("textarea", {
            ref: l,
            onChange: (a) => t(a.target.value),
            onKeyDown: o,
            value: e,
            rows: 1,
            className: "outline-none overflow-hidden resize-none w-full pr-2",
            placeholder: "Text here...",
          }),
          T.jsx("button", {
            onClick: n,
            className:
              "group flex items-center justify-center w-[35px] min-h-[35px] bottom-[15px] right-[15px] bg-black text-white rounded-md h-fit",
            children: r
              ? T.jsx(Qm, {})
              : T.jsx(T0, {
                  size: 20,
                  className: "transition group-hover:scale-[1.2]",
                }),
          }),
        ],
      })
    );
  },
  Qm = () =>
    T.jsxs("svg", {
      className: "animate-spin h-5 w-5 text-white",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      children: [
        T.jsx("circle", {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4",
        }),
        T.jsx("path", {
          className: "opacity-100",
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
        }),
      ],
    });
var Xm = Object.defineProperty,
  qm = (e, t, n) =>
    t in e
      ? Xm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  bo = (e, t, n) => (qm(e, typeof t != "symbol" ? t + "" : t, n), n);
let Ym = class {
    constructor() {
      bo(this, "current", this.detect()),
        bo(this, "handoffState", "pending"),
        bo(this, "currentId", 0);
    }
    set(t) {
      this.current !== t &&
        ((this.handoffState = "pending"),
        (this.currentId = 0),
        (this.current = t));
    }
    reset() {
      this.set(this.detect());
    }
    nextId() {
      return ++this.currentId;
    }
    get isServer() {
      return this.current === "server";
    }
    get isClient() {
      return this.current === "client";
    }
    detect() {
      return typeof window > "u" || typeof document > "u" ? "server" : "client";
    }
    handoff() {
      this.handoffState === "pending" && (this.handoffState = "complete");
    }
    get isHandoffComplete() {
      return this.handoffState === "complete";
    }
  },
  Hn = new Ym();
function ru(e) {
  return Hn.isServer
    ? null
    : e instanceof Node
      ? e.ownerDocument
      : e != null && e.hasOwnProperty("current") && e.current instanceof Node
        ? e.current.ownerDocument
        : document;
}
function ao(e) {
  typeof queueMicrotask == "function"
    ? queueMicrotask(e)
    : Promise.resolve()
        .then(e)
        .catch((t) =>
          setTimeout(() => {
            throw t;
          }),
        );
}
function Ln() {
  let e = [],
    t = {
      addEventListener(n, r, l, i) {
        return (
          n.addEventListener(r, l, i),
          t.add(() => n.removeEventListener(r, l, i))
        );
      },
      requestAnimationFrame(...n) {
        let r = requestAnimationFrame(...n);
        return t.add(() => cancelAnimationFrame(r));
      },
      nextFrame(...n) {
        return t.requestAnimationFrame(() => t.requestAnimationFrame(...n));
      },
      setTimeout(...n) {
        let r = setTimeout(...n);
        return t.add(() => clearTimeout(r));
      },
      microTask(...n) {
        let r = { current: !0 };
        return (
          ao(() => {
            r.current && n[0]();
          }),
          t.add(() => {
            r.current = !1;
          })
        );
      },
      style(n, r, l) {
        let i = n.style.getPropertyValue(r);
        return (
          Object.assign(n.style, { [r]: l }),
          this.add(() => {
            Object.assign(n.style, { [r]: i });
          })
        );
      },
      group(n) {
        let r = Ln();
        return n(r), this.add(() => r.dispose());
      },
      add(n) {
        return (
          e.includes(n) || e.push(n),
          () => {
            let r = e.indexOf(n);
            if (r >= 0) for (let l of e.splice(r, 1)) l();
          }
        );
      },
      dispose() {
        for (let n of e.splice(0)) n();
      },
    };
  return t;
}
function lu() {
  let [e] = g.useState(Ln);
  return g.useEffect(() => () => e.dispose(), [e]), e;
}
let Ve = (e, t) => {
  Hn.isServer ? g.useEffect(e, t) : g.useLayoutEffect(e, t);
};
function Ft(e) {
  let t = g.useRef(e);
  return (
    Ve(() => {
      t.current = e;
    }, [e]),
    t
  );
}
let de = function (e) {
    let t = Ft(e);
    return w.useCallback((...n) => t.current(...n), [t]);
  },
  Km = g.createContext(void 0);
function Jm() {
  return g.useContext(Km);
}
function ll(...e) {
  return Array.from(
    new Set(e.flatMap((t) => (typeof t == "string" ? t.split(" ") : []))),
  )
    .filter(Boolean)
    .join(" ");
}
function Ae(e, t, ...n) {
  if (e in t) {
    let l = t[e];
    return typeof l == "function" ? l(...n) : l;
  }
  let r = new Error(
    `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      t,
    )
      .map((l) => `"${l}"`)
      .join(", ")}.`,
  );
  throw (Error.captureStackTrace && Error.captureStackTrace(r, Ae), r);
}
var Vi = ((e) => (
    (e[(e.None = 0)] = "None"),
    (e[(e.RenderStrategy = 1)] = "RenderStrategy"),
    (e[(e.Static = 2)] = "Static"),
    e
  ))(Vi || {}),
  fn = ((e) => (
    (e[(e.Unmount = 0)] = "Unmount"), (e[(e.Hidden = 1)] = "Hidden"), e
  ))(fn || {});
function kt({
  ourProps: e,
  theirProps: t,
  slot: n,
  defaultTag: r,
  features: l,
  visible: i = !0,
  name: o,
  mergeRefs: s,
}) {
  s = s ?? bm;
  let a = A0(t, e);
  if (i) return ni(a, n, r, o, s);
  let u = l ?? 0;
  if (u & 2) {
    let { static: f = !1, ...c } = a;
    if (f) return ni(c, n, r, o, s);
  }
  if (u & 1) {
    let { unmount: f = !0, ...c } = a;
    return Ae(f ? 0 : 1, {
      0() {
        return null;
      },
      1() {
        return ni({ ...c, hidden: !0, style: { display: "none" } }, n, r, o, s);
      },
    });
  }
  return ni(a, n, r, o, s);
}
function ni(e, t = {}, n, r, l) {
  let {
      as: i = n,
      children: o,
      refName: s = "ref",
      ...a
    } = es(e, ["unmount", "static"]),
    u = e.ref !== void 0 ? { [s]: e.ref } : {},
    f = typeof o == "function" ? o(t) : o;
  "className" in a &&
    a.className &&
    typeof a.className == "function" &&
    (a.className = a.className(t)),
    a["aria-labelledby"] &&
      a["aria-labelledby"] === a.id &&
      (a["aria-labelledby"] = void 0);
  let c = {};
  if (t) {
    let m = !1,
      v = [];
    for (let [_, S] of Object.entries(t))
      typeof S == "boolean" && (m = !0),
        S === !0 && v.push(_.replace(/([A-Z])/g, (N) => `-${N.toLowerCase()}`));
    if (m) {
      c["data-headlessui-state"] = v.join(" ");
      for (let _ of v) c[`data-${_}`] = "";
    }
  }
  if (
    i === g.Fragment &&
    (Object.keys(er(a)).length > 0 || Object.keys(er(c)).length > 0)
  )
    if (!g.isValidElement(f) || (Array.isArray(f) && f.length > 1)) {
      if (Object.keys(er(a)).length > 0)
        throw new Error(
          [
            'Passing props on "Fragment"!',
            "",
            `The current component <${r} /> is rendering a "Fragment".`,
            "However we need to passthrough the following props:",
            Object.keys(er(a))
              .concat(Object.keys(er(c)))
              .map((m) => `  - ${m}`).join(`
`),
            "",
            "You can apply a few solutions:",
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
              "Render a single element as the child so that we can forward the props onto that element.",
            ].map((m) => `  - ${m}`).join(`
`),
          ].join(`
`),
        );
    } else {
      let m = f.props,
        v = m == null ? void 0 : m.className,
        _ =
          typeof v == "function"
            ? (...d) => ll(v(...d), a.className)
            : ll(v, a.className),
        S = _ ? { className: _ } : {},
        N = A0(f.props, er(es(a, ["ref"])));
      for (let d in c) d in N && delete c[d];
      return g.cloneElement(
        f,
        Object.assign({}, N, c, u, { ref: l(f.ref, u.ref) }, S),
      );
    }
  return g.createElement(
    i,
    Object.assign(
      {},
      es(a, ["ref"]),
      i !== g.Fragment && u,
      i !== g.Fragment && c,
    ),
    f,
  );
}
function bm(...e) {
  return e.every((t) => t == null)
    ? void 0
    : (t) => {
        for (let n of e)
          n != null && (typeof n == "function" ? n(t) : (n.current = t));
      };
}
function A0(...e) {
  if (e.length === 0) return {};
  if (e.length === 1) return e[0];
  let t = {},
    n = {};
  for (let r of e)
    for (let l in r)
      l.startsWith("on") && typeof r[l] == "function"
        ? (n[l] != null || (n[l] = []), n[l].push(r[l]))
        : (t[l] = r[l]);
  if (t.disabled || t["aria-disabled"])
    for (let r in n)
      /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(r) &&
        (n[r] = [
          (l) => {
            var i;
            return (i = l == null ? void 0 : l.preventDefault) == null
              ? void 0
              : i.call(l);
          },
        ]);
  for (let r in n)
    Object.assign(t, {
      [r](l, ...i) {
        let o = n[r];
        for (let s of o) {
          if (
            (l instanceof Event ||
              (l == null ? void 0 : l.nativeEvent) instanceof Event) &&
            l.defaultPrevented
          )
            return;
          s(l, ...i);
        }
      },
    });
  return t;
}
function ht(e) {
  var t;
  return Object.assign(g.forwardRef(e), {
    displayName: (t = e.displayName) != null ? t : e.name,
  });
}
function er(e) {
  let t = Object.assign({}, e);
  for (let n in t) t[n] === void 0 && delete t[n];
  return t;
}
function es(e, t = []) {
  let n = Object.assign({}, e);
  for (let r of t) r in n && delete n[r];
  return n;
}
let ev = "div";
var Ui = ((e) => (
  (e[(e.None = 1)] = "None"),
  (e[(e.Focusable = 2)] = "Focusable"),
  (e[(e.Hidden = 4)] = "Hidden"),
  e
))(Ui || {});
function tv(e, t) {
  var n;
  let { features: r = 1, ...l } = e,
    i = {
      ref: t,
      "aria-hidden":
        (r & 2) === 2 ? !0 : (n = l["aria-hidden"]) != null ? n : void 0,
      hidden: (r & 4) === 4 ? !0 : void 0,
      style: {
        position: "fixed",
        top: 1,
        left: 1,
        width: 1,
        height: 0,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
        ...((r & 4) === 4 && (r & 2) !== 2 && { display: "none" }),
      },
    };
  return kt({
    ourProps: i,
    theirProps: l,
    slot: {},
    defaultTag: ev,
    name: "Hidden",
  });
}
let Ks = ht(tv),
  nv = g.createContext(null);
function rv({ children: e }) {
  let t = g.useContext(nv);
  if (!t) return w.createElement(w.Fragment, null, e);
  let { target: n } = t;
  return n ? eu.createPortal(w.createElement(w.Fragment, null, e), n) : null;
}
let F0 = Symbol();
function lv(e, t = !0) {
  return Object.assign(e, { [F0]: t });
}
function It(...e) {
  let t = g.useRef(e);
  g.useEffect(() => {
    t.current = e;
  }, [e]);
  let n = de((r) => {
    for (let l of t.current)
      l != null && (typeof l == "function" ? l(r) : (l.current = r));
  });
  return e.every((r) => r == null || (r == null ? void 0 : r[F0])) ? void 0 : n;
}
let iu = g.createContext(null);
iu.displayName = "DescriptionContext";
function M0() {
  let e = g.useContext(iu);
  if (e === null) {
    let t = new Error(
      "You used a <Description /> component, but it is not inside a relevant parent.",
    );
    throw (Error.captureStackTrace && Error.captureStackTrace(t, M0), t);
  }
  return e;
}
function iv() {
  let [e, t] = g.useState([]);
  return [
    e.length > 0 ? e.join(" ") : void 0,
    g.useMemo(
      () =>
        function (n) {
          let r = de(
              (i) => (
                t((o) => [...o, i]),
                () =>
                  t((o) => {
                    let s = o.slice(),
                      a = s.indexOf(i);
                    return a !== -1 && s.splice(a, 1), s;
                  })
              ),
            ),
            l = g.useMemo(
              () => ({
                register: r,
                slot: n.slot,
                name: n.name,
                props: n.props,
                value: n.value,
              }),
              [r, n.slot, n.name, n.props, n.value],
            );
          return w.createElement(iu.Provider, { value: l }, n.children);
        },
      [t],
    ),
  ];
}
let ov = "p";
function sv(e, t) {
  let n = g.useId(),
    r = Jm(),
    { id: l = `headlessui-description-${n}`, ...i } = e,
    o = M0(),
    s = It(t);
  Ve(() => o.register(l), [l, o.register]);
  let a = r || !1,
    u = g.useMemo(() => ({ ...o.slot, disabled: a }), [o.slot, a]),
    f = { ref: s, ...o.props, id: l };
  return kt({
    ourProps: f,
    theirProps: i,
    slot: u,
    defaultTag: ov,
    name: o.name || "Description",
  });
}
let av = ht(sv),
  uv = Object.assign(av, {});
var $0 = ((e) => (
  (e.Space = " "),
  (e.Enter = "Enter"),
  (e.Escape = "Escape"),
  (e.Backspace = "Backspace"),
  (e.Delete = "Delete"),
  (e.ArrowLeft = "ArrowLeft"),
  (e.ArrowUp = "ArrowUp"),
  (e.ArrowRight = "ArrowRight"),
  (e.ArrowDown = "ArrowDown"),
  (e.Home = "Home"),
  (e.End = "End"),
  (e.PageUp = "PageUp"),
  (e.PageDown = "PageDown"),
  (e.Tab = "Tab"),
  e
))($0 || {});
let cv = g.createContext(() => {});
function dv({ value: e, children: t }) {
  return w.createElement(cv.Provider, { value: e }, t);
}
let Js = new Map(),
  il = new Map();
function id(e) {
  var t;
  let n = (t = il.get(e)) != null ? t : 0;
  return (
    il.set(e, n + 1),
    n !== 0
      ? () => od(e)
      : (Js.set(e, {
          "aria-hidden": e.getAttribute("aria-hidden"),
          inert: e.inert,
        }),
        e.setAttribute("aria-hidden", "true"),
        (e.inert = !0),
        () => od(e))
  );
}
function od(e) {
  var t;
  let n = (t = il.get(e)) != null ? t : 1;
  if ((n === 1 ? il.delete(e) : il.set(e, n - 1), n !== 1)) return;
  let r = Js.get(e);
  r &&
    (r["aria-hidden"] === null
      ? e.removeAttribute("aria-hidden")
      : e.setAttribute("aria-hidden", r["aria-hidden"]),
    (e.inert = r.inert),
    Js.delete(e));
}
function fv({ allowed: e, disallowed: t } = {}, n = !0) {
  Ve(() => {
    var r, l;
    if (!n) return;
    let i = Ln();
    for (let s of (r = t == null ? void 0 : t()) != null ? r : [])
      s && i.add(id(s));
    let o = (l = e == null ? void 0 : e()) != null ? l : [];
    for (let s of o) {
      if (!s) continue;
      let a = ru(s);
      if (!a) continue;
      let u = s.parentElement;
      for (; u && u !== a.body; ) {
        for (let f of u.children) o.some((c) => f.contains(c)) || i.add(id(f));
        u = u.parentElement;
      }
    }
    return i.dispose;
  }, [n, e, t]);
}
function I0(e, t, n = !0) {
  let r = Ft((l) => {
    let i = l.getBoundingClientRect();
    i.x === 0 && i.y === 0 && i.width === 0 && i.height === 0 && t();
  });
  g.useEffect(() => {
    if (!n) return;
    let l = e === null ? null : e instanceof HTMLElement ? e : e.current;
    if (!l) return;
    let i = Ln();
    if (typeof ResizeObserver < "u") {
      let o = new ResizeObserver(() => r.current(l));
      o.observe(l), i.add(() => o.disconnect());
    }
    if (typeof IntersectionObserver < "u") {
      let o = new IntersectionObserver(() => r.current(l));
      o.observe(l), i.add(() => o.disconnect());
    }
    return () => i.dispose();
  }, [e, r, n]);
}
let bs = [
    "[contentEditable=true]",
    "[tabindex]",
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "iframe",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
  ]
    .map((e) => `${e}:not([tabindex='-1'])`)
    .join(","),
  pv = ["[data-autofocus]"].map((e) => `${e}:not([tabindex='-1'])`).join(",");
var Vt = ((e) => (
    (e[(e.First = 1)] = "First"),
    (e[(e.Previous = 2)] = "Previous"),
    (e[(e.Next = 4)] = "Next"),
    (e[(e.Last = 8)] = "Last"),
    (e[(e.WrapAround = 16)] = "WrapAround"),
    (e[(e.NoScroll = 32)] = "NoScroll"),
    (e[(e.AutoFocus = 64)] = "AutoFocus"),
    e
  ))(Vt || {}),
  ea = ((e) => (
    (e[(e.Error = 0)] = "Error"),
    (e[(e.Overflow = 1)] = "Overflow"),
    (e[(e.Success = 2)] = "Success"),
    (e[(e.Underflow = 3)] = "Underflow"),
    e
  ))(ea || {}),
  hv = ((e) => (
    (e[(e.Previous = -1)] = "Previous"), (e[(e.Next = 1)] = "Next"), e
  ))(hv || {});
function mv(e = document.body) {
  return e == null
    ? []
    : Array.from(e.querySelectorAll(bs)).sort((t, n) =>
        Math.sign(
          (t.tabIndex || Number.MAX_SAFE_INTEGER) -
            (n.tabIndex || Number.MAX_SAFE_INTEGER),
        ),
      );
}
function vv(e = document.body) {
  return e == null
    ? []
    : Array.from(e.querySelectorAll(pv)).sort((t, n) =>
        Math.sign(
          (t.tabIndex || Number.MAX_SAFE_INTEGER) -
            (n.tabIndex || Number.MAX_SAFE_INTEGER),
        ),
      );
}
var j0 = ((e) => (
  (e[(e.Strict = 0)] = "Strict"), (e[(e.Loose = 1)] = "Loose"), e
))(j0 || {});
function gv(e, t = 0) {
  var n;
  return e === ((n = ru(e)) == null ? void 0 : n.body)
    ? !1
    : Ae(t, {
        0() {
          return e.matches(bs);
        },
        1() {
          let r = e;
          for (; r !== null; ) {
            if (r.matches(bs)) return !0;
            r = r.parentElement;
          }
          return !1;
        },
      });
}
var yv = ((e) => (
  (e[(e.Keyboard = 0)] = "Keyboard"), (e[(e.Mouse = 1)] = "Mouse"), e
))(yv || {});
typeof window < "u" &&
  typeof document < "u" &&
  (document.addEventListener(
    "keydown",
    (e) => {
      e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        (document.documentElement.dataset.headlessuiFocusVisible = "");
    },
    !0,
  ),
  document.addEventListener(
    "click",
    (e) => {
      e.detail === 1
        ? delete document.documentElement.dataset.headlessuiFocusVisible
        : e.detail === 0 &&
          (document.documentElement.dataset.headlessuiFocusVisible = "");
    },
    !0,
  ));
function Zt(e) {
  e == null || e.focus({ preventScroll: !0 });
}
let wv = ["textarea", "input"].join(",");
function _v(e) {
  var t, n;
  return (n =
    (t = e == null ? void 0 : e.matches) == null ? void 0 : t.call(e, wv)) !=
    null
    ? n
    : !1;
}
function Ev(e, t = (n) => n) {
  return e.slice().sort((n, r) => {
    let l = t(n),
      i = t(r);
    if (l === null || i === null) return 0;
    let o = l.compareDocumentPosition(i);
    return o & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : o & Node.DOCUMENT_POSITION_PRECEDING
        ? 1
        : 0;
  });
}
function ol(
  e,
  t,
  { sorted: n = !0, relativeTo: r = null, skipElements: l = [] } = {},
) {
  let i = Array.isArray(e)
      ? e.length > 0
        ? e[0].ownerDocument
        : document
      : e.ownerDocument,
    o = Array.isArray(e) ? (n ? Ev(e) : e) : t & 64 ? vv(e) : mv(e);
  l.length > 0 &&
    o.length > 1 &&
    (o = o.filter(
      (v) =>
        !l.some((_) =>
          _ != null && "current" in _
            ? (_ == null ? void 0 : _.current) === v
            : _ === v,
        ),
    )),
    (r = r ?? i.activeElement);
  let s = (() => {
      if (t & 5) return 1;
      if (t & 10) return -1;
      throw new Error(
        "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
      );
    })(),
    a = (() => {
      if (t & 1) return 0;
      if (t & 2) return Math.max(0, o.indexOf(r)) - 1;
      if (t & 4) return Math.max(0, o.indexOf(r)) + 1;
      if (t & 8) return o.length - 1;
      throw new Error(
        "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
      );
    })(),
    u = t & 32 ? { preventScroll: !0 } : {},
    f = 0,
    c = o.length,
    m;
  do {
    if (f >= c || f + c <= 0) return 0;
    let v = a + f;
    if (t & 16) v = (v + c) % c;
    else {
      if (v < 0) return 3;
      if (v >= c) return 1;
    }
    (m = o[v]), m == null || m.focus(u), (f += s);
  } while (m !== i.activeElement);
  return t & 6 && _v(m) && m.select(), 2;
}
function z0() {
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) &&
      window.navigator.maxTouchPoints > 0)
  );
}
function Sv() {
  return /Android/gi.test(window.navigator.userAgent);
}
function xv() {
  return z0() || Sv();
}
function ri(e, t, n) {
  let r = Ft(t);
  g.useEffect(() => {
    function l(i) {
      r.current(i);
    }
    return (
      document.addEventListener(e, l, n),
      () => document.removeEventListener(e, l, n)
    );
  }, [e, n]);
}
function D0(e, t, n) {
  let r = Ft(t);
  g.useEffect(() => {
    function l(i) {
      r.current(i);
    }
    return (
      window.addEventListener(e, l, n),
      () => window.removeEventListener(e, l, n)
    );
  }, [e, n]);
}
function kv(e, t, n = !0) {
  let r = g.useRef(!1);
  g.useEffect(() => {
    requestAnimationFrame(() => {
      r.current = n;
    });
  }, [n]);
  function l(o, s) {
    if (!r.current || o.defaultPrevented) return;
    let a = s(o);
    if (a === null || !a.getRootNode().contains(a) || !a.isConnected) return;
    let u = (function f(c) {
      return typeof c == "function"
        ? f(c())
        : Array.isArray(c) || c instanceof Set
          ? c
          : [c];
    })(e);
    for (let f of u) {
      if (f === null) continue;
      let c = f instanceof HTMLElement ? f : f.current;
      if (
        (c != null && c.contains(a)) ||
        (o.composed && o.composedPath().includes(c))
      )
        return;
    }
    return !gv(a, j0.Loose) && a.tabIndex !== -1 && o.preventDefault(), t(o, a);
  }
  let i = g.useRef(null);
  ri(
    "pointerdown",
    (o) => {
      var s, a;
      r.current &&
        (i.current =
          ((a = (s = o.composedPath) == null ? void 0 : s.call(o)) == null
            ? void 0
            : a[0]) || o.target);
    },
    !0,
  ),
    ri(
      "mousedown",
      (o) => {
        var s, a;
        r.current &&
          (i.current =
            ((a = (s = o.composedPath) == null ? void 0 : s.call(o)) == null
              ? void 0
              : a[0]) || o.target);
      },
      !0,
    ),
    ri(
      "click",
      (o) => {
        xv() || (i.current && (l(o, () => i.current), (i.current = null)));
      },
      !0,
    ),
    ri(
      "touchend",
      (o) => l(o, () => (o.target instanceof HTMLElement ? o.target : null)),
      !0,
    ),
    D0(
      "blur",
      (o) =>
        l(o, () =>
          window.document.activeElement instanceof HTMLIFrameElement
            ? window.document.activeElement
            : null,
        ),
      !0,
    );
}
function Rl(...e) {
  return g.useMemo(() => ru(...e), [...e]);
}
function B0(e, t, n, r) {
  let l = Ft(n);
  g.useEffect(() => {
    e = e ?? window;
    function i(o) {
      l.current(o);
    }
    return e.addEventListener(t, i, r), () => e.removeEventListener(t, i, r);
  }, [e, t, r]);
}
function Cv(e) {
  return g.useSyncExternalStore(e.subscribe, e.getSnapshot, e.getSnapshot);
}
function Lv(e, t) {
  let n = e(),
    r = new Set();
  return {
    getSnapshot() {
      return n;
    },
    subscribe(l) {
      return r.add(l), () => r.delete(l);
    },
    dispatch(l, ...i) {
      let o = t[l].call(n, ...i);
      o && ((n = o), r.forEach((s) => s()));
    },
  };
}
function Nv() {
  let e;
  return {
    before({ doc: t }) {
      var n;
      let r = t.documentElement,
        l = (n = t.defaultView) != null ? n : window;
      e = Math.max(0, l.innerWidth - r.clientWidth);
    },
    after({ doc: t, d: n }) {
      let r = t.documentElement,
        l = Math.max(0, r.clientWidth - r.offsetWidth),
        i = Math.max(0, e - l);
      n.style(r, "paddingRight", `${i}px`);
    },
  };
}
function Tv() {
  return z0()
    ? {
        before({ doc: e, d: t, meta: n }) {
          function r(l) {
            return n.containers.flatMap((i) => i()).some((i) => i.contains(l));
          }
          t.microTask(() => {
            var l;
            if (
              window.getComputedStyle(e.documentElement).scrollBehavior !==
              "auto"
            ) {
              let s = Ln();
              s.style(e.documentElement, "scrollBehavior", "auto"),
                t.add(() => t.microTask(() => s.dispose()));
            }
            let i = (l = window.scrollY) != null ? l : window.pageYOffset,
              o = null;
            t.addEventListener(
              e,
              "click",
              (s) => {
                if (s.target instanceof HTMLElement)
                  try {
                    let a = s.target.closest("a");
                    if (!a) return;
                    let { hash: u } = new URL(a.href),
                      f = e.querySelector(u);
                    f && !r(f) && (o = f);
                  } catch {}
              },
              !0,
            ),
              t.addEventListener(e, "touchstart", (s) => {
                if (s.target instanceof HTMLElement)
                  if (r(s.target)) {
                    let a = s.target;
                    for (; a.parentElement && r(a.parentElement); )
                      a = a.parentElement;
                    t.style(a, "overscrollBehavior", "contain");
                  } else t.style(s.target, "touchAction", "none");
              }),
              t.addEventListener(
                e,
                "touchmove",
                (s) => {
                  if (s.target instanceof HTMLElement) {
                    if (s.target.tagName === "INPUT") return;
                    if (r(s.target)) {
                      let a = s.target;
                      for (
                        ;
                        a.parentElement &&
                        a.dataset.headlessuiPortal !== "" &&
                        !(
                          a.scrollHeight > a.clientHeight ||
                          a.scrollWidth > a.clientWidth
                        );

                      )
                        a = a.parentElement;
                      a.dataset.headlessuiPortal === "" && s.preventDefault();
                    } else s.preventDefault();
                  }
                },
                { passive: !1 },
              ),
              t.add(() => {
                var s;
                let a = (s = window.scrollY) != null ? s : window.pageYOffset;
                i !== a && window.scrollTo(0, i),
                  o &&
                    o.isConnected &&
                    (o.scrollIntoView({ block: "nearest" }), (o = null));
              });
          });
        },
      }
    : {};
}
function Pv() {
  return {
    before({ doc: e, d: t }) {
      t.style(e.documentElement, "overflow", "hidden");
    },
  };
}
function Rv(e) {
  let t = {};
  for (let n of e) Object.assign(t, n(t));
  return t;
}
let zn = Lv(() => new Map(), {
  PUSH(e, t) {
    var n;
    let r =
      (n = this.get(e)) != null
        ? n
        : { doc: e, count: 0, d: Ln(), meta: new Set() };
    return r.count++, r.meta.add(t), this.set(e, r), this;
  },
  POP(e, t) {
    let n = this.get(e);
    return n && (n.count--, n.meta.delete(t)), this;
  },
  SCROLL_PREVENT({ doc: e, d: t, meta: n }) {
    let r = { doc: e, d: t, meta: Rv(n) },
      l = [Tv(), Nv(), Pv()];
    l.forEach(({ before: i }) => (i == null ? void 0 : i(r))),
      l.forEach(({ after: i }) => (i == null ? void 0 : i(r)));
  },
  SCROLL_ALLOW({ d: e }) {
    e.dispose();
  },
  TEARDOWN({ doc: e }) {
    this.delete(e);
  },
});
zn.subscribe(() => {
  let e = zn.getSnapshot(),
    t = new Map();
  for (let [n] of e) t.set(n, n.documentElement.style.overflow);
  for (let n of e.values()) {
    let r = t.get(n.doc) === "hidden",
      l = n.count !== 0;
    ((l && !r) || (!l && r)) &&
      zn.dispatch(n.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", n),
      n.count === 0 && zn.dispatch("TEARDOWN", n);
  }
});
function Ov(e, t, n = () => ({ containers: [] })) {
  let r = Cv(zn),
    l = e ? r.get(e) : void 0,
    i = l ? l.count > 0 : !1;
  return (
    Ve(() => {
      if (!(!e || !t))
        return zn.dispatch("PUSH", e, n), () => zn.dispatch("POP", e, n);
    }, [t, e]),
    i
  );
}
function Av(e, t, n = () => [document.body]) {
  Ov(e, t, (r) => {
    var l;
    return { containers: [...((l = r.containers) != null ? l : []), n] };
  });
}
function ou(e, t) {
  let n = g.useRef([]),
    r = de(e);
  g.useEffect(() => {
    let l = [...n.current];
    for (let [i, o] of t.entries())
      if (n.current[i] !== o) {
        let s = r(t, l);
        return (n.current = t), s;
      }
  }, [r, ...t]);
}
let su = g.createContext(null);
su.displayName = "OpenClosedContext";
var be = ((e) => (
  (e[(e.Open = 1)] = "Open"),
  (e[(e.Closed = 2)] = "Closed"),
  (e[(e.Closing = 4)] = "Closing"),
  (e[(e.Opening = 8)] = "Opening"),
  e
))(be || {});
function au() {
  return g.useContext(su);
}
function Fv({ value: e, children: t }) {
  return w.createElement(su.Provider, { value: e }, t);
}
function Mv(e) {
  function t() {
    document.readyState !== "loading" &&
      (e(), document.removeEventListener("DOMContentLoaded", t));
  }
  typeof window < "u" &&
    typeof document < "u" &&
    (document.addEventListener("DOMContentLoaded", t), t());
}
let un = [];
Mv(() => {
  function e(t) {
    t.target instanceof HTMLElement &&
      t.target !== document.body &&
      un[0] !== t.target &&
      (un.unshift(t.target),
      (un = un.filter((n) => n != null && n.isConnected)),
      un.splice(10));
  }
  window.addEventListener("click", e, { capture: !0 }),
    window.addEventListener("mousedown", e, { capture: !0 }),
    window.addEventListener("focus", e, { capture: !0 }),
    document.body.addEventListener("click", e, { capture: !0 }),
    document.body.addEventListener("mousedown", e, { capture: !0 }),
    document.body.addEventListener("focus", e, { capture: !0 });
});
function H0(e) {
  let t = de(e),
    n = g.useRef(!1);
  g.useEffect(
    () => (
      (n.current = !1),
      () => {
        (n.current = !0),
          ao(() => {
            n.current && t();
          });
      }
    ),
    [t],
  );
}
function $v() {
  let e = typeof document > "u";
  return "useSyncExternalStore" in Eu
    ? ((t) => t.useSyncExternalStore)(Eu)(
        () => () => {},
        () => !1,
        () => !e,
      )
    : !1;
}
function Ol() {
  let e = $v(),
    [t, n] = g.useState(Hn.isHandoffComplete);
  return (
    t && Hn.isHandoffComplete === !1 && n(!1),
    g.useEffect(() => {
      t !== !0 && n(!0);
    }, [t]),
    g.useEffect(() => Hn.handoff(), []),
    e ? !1 : t
  );
}
let V0 = g.createContext(!1);
function Iv() {
  return g.useContext(V0);
}
function sd(e) {
  return w.createElement(V0.Provider, { value: e.force }, e.children);
}
function jv(e) {
  let t = Iv(),
    n = g.useContext(W0),
    r = Rl(e),
    [l, i] = g.useState(() => {
      var o;
      if (!t && n !== null) return (o = n.current) != null ? o : null;
      if (Hn.isServer) return null;
      let s = r == null ? void 0 : r.getElementById("headlessui-portal-root");
      if (s) return s;
      if (r === null) return null;
      let a = r.createElement("div");
      return (
        a.setAttribute("id", "headlessui-portal-root"), r.body.appendChild(a)
      );
    });
  return (
    g.useEffect(() => {
      l !== null &&
        ((r != null && r.body.contains(l)) ||
          r == null ||
          r.body.appendChild(l));
    }, [l, r]),
    g.useEffect(() => {
      t || (n !== null && i(n.current));
    }, [n, i, t]),
    l
  );
}
let U0 = g.Fragment,
  zv = ht(function (e, t) {
    let n = e,
      r = g.useRef(null),
      l = It(
        lv((f) => {
          r.current = f;
        }),
        t,
      ),
      i = Rl(r),
      o = jv(r),
      [s] = g.useState(() => {
        var f;
        return Hn.isServer
          ? null
          : (f = i == null ? void 0 : i.createElement("div")) != null
            ? f
            : null;
      }),
      a = g.useContext(ta),
      u = Ol();
    return (
      Ve(() => {
        !o ||
          !s ||
          o.contains(s) ||
          (s.setAttribute("data-headlessui-portal", ""), o.appendChild(s));
      }, [o, s]),
      Ve(() => {
        if (s && a) return a.register(s);
      }, [a, s]),
      H0(() => {
        var f;
        !o ||
          !s ||
          (s instanceof Node && o.contains(s) && o.removeChild(s),
          o.childNodes.length <= 0 &&
            ((f = o.parentElement) == null || f.removeChild(o)));
      }),
      u
        ? !o || !s
          ? null
          : eu.createPortal(
              kt({
                ourProps: { ref: l },
                theirProps: n,
                slot: {},
                defaultTag: U0,
                name: "Portal",
              }),
              s,
            )
        : null
    );
  });
function Dv(e, t) {
  let n = It(t),
    { enabled: r = !0, ...l } = e;
  return r
    ? w.createElement(zv, { ...l, ref: n })
    : kt({
        ourProps: { ref: n },
        theirProps: l,
        slot: {},
        defaultTag: U0,
        name: "Portal",
      });
}
let Bv = g.Fragment,
  W0 = g.createContext(null);
function Hv(e, t) {
  let { target: n, ...r } = e,
    l = { ref: It(t) };
  return w.createElement(
    W0.Provider,
    { value: n },
    kt({ ourProps: l, theirProps: r, defaultTag: Bv, name: "Popover.Group" }),
  );
}
let ta = g.createContext(null);
function Vv() {
  let e = g.useContext(ta),
    t = g.useRef([]),
    n = de((i) => (t.current.push(i), e && e.register(i), () => r(i))),
    r = de((i) => {
      let o = t.current.indexOf(i);
      o !== -1 && t.current.splice(o, 1), e && e.unregister(i);
    }),
    l = g.useMemo(
      () => ({ register: n, unregister: r, portals: t }),
      [n, r, t],
    );
  return [
    t,
    g.useMemo(
      () =>
        function ({ children: i }) {
          return w.createElement(ta.Provider, { value: l }, i);
        },
      [l],
    ),
  ];
}
let Uv = ht(Dv),
  Wv = ht(Hv),
  ad = Object.assign(Uv, { Group: Wv });
function Gv() {
  var e;
  let [t] = g.useState(() =>
      typeof window < "u" && typeof window.matchMedia == "function"
        ? window.matchMedia("(pointer: coarse)")
        : null,
    ),
    [n, r] = g.useState((e = t == null ? void 0 : t.matches) != null ? e : !1);
  return (
    Ve(() => {
      if (!t) return;
      function l(i) {
        r(i.matches);
      }
      return (
        t.addEventListener("change", l),
        () => t.removeEventListener("change", l)
      );
    }, [t]),
    n
  );
}
function Zv({
  defaultContainers: e = [],
  portals: t,
  mainTreeNodeRef: n,
} = {}) {
  var r;
  let l = g.useRef((r = n == null ? void 0 : n.current) != null ? r : null),
    i = Rl(l),
    o = de(() => {
      var s, a, u;
      let f = [];
      for (let c of e)
        c !== null &&
          (c instanceof HTMLElement
            ? f.push(c)
            : "current" in c &&
              c.current instanceof HTMLElement &&
              f.push(c.current));
      if (t != null && t.current) for (let c of t.current) f.push(c);
      for (let c of (s =
        i == null ? void 0 : i.querySelectorAll("html > *, body > *")) != null
        ? s
        : [])
        c !== document.body &&
          c !== document.head &&
          c instanceof HTMLElement &&
          c.id !== "headlessui-portal-root" &&
          (c.contains(l.current) ||
            c.contains(
              (u = (a = l.current) == null ? void 0 : a.getRootNode()) == null
                ? void 0
                : u.host,
            ) ||
            f.some((m) => c.contains(m)) ||
            f.push(c));
      return f;
    });
  return {
    resolveContainers: o,
    contains: de((s) => o().some((a) => a.contains(s))),
    mainTreeNodeRef: l,
    MainTreeNode: g.useMemo(
      () =>
        function () {
          return n != null
            ? null
            : w.createElement(Ks, { features: Ui.Hidden, ref: l });
        },
      [l, n],
    ),
  };
}
let uu = g.createContext(() => {});
uu.displayName = "StackContext";
var na = ((e) => ((e[(e.Add = 0)] = "Add"), (e[(e.Remove = 1)] = "Remove"), e))(
  na || {},
);
function Qv() {
  return g.useContext(uu);
}
function Xv({ children: e, onUpdate: t, type: n, element: r, enabled: l }) {
  let i = Qv(),
    o = de((...s) => {
      t == null || t(...s), i(...s);
    });
  return (
    Ve(() => {
      let s = l === void 0 || l === !0;
      return (
        s && o(0, n, r),
        () => {
          s && o(1, n, r);
        }
      );
    }, [o, n, r, l]),
    w.createElement(uu.Provider, { value: o }, e)
  );
}
function Al() {
  let e = g.useRef(!1);
  return (
    Ve(
      () => (
        (e.current = !0),
        () => {
          e.current = !1;
        }
      ),
      [],
    ),
    e
  );
}
var Xr = ((e) => (
  (e[(e.Forwards = 0)] = "Forwards"), (e[(e.Backwards = 1)] = "Backwards"), e
))(Xr || {});
function qv() {
  let e = g.useRef(0);
  return (
    D0(
      "keydown",
      (t) => {
        t.key === "Tab" && (e.current = t.shiftKey ? 1 : 0);
      },
      !0,
    ),
    e
  );
}
function G0(e) {
  if (!e) return new Set();
  if (typeof e == "function") return new Set(e());
  let t = new Set();
  for (let n of e.current) n.current instanceof HTMLElement && t.add(n.current);
  return t;
}
let Yv = "div";
var Bt = ((e) => (
  (e[(e.None = 1)] = "None"),
  (e[(e.InitialFocus = 2)] = "InitialFocus"),
  (e[(e.TabLock = 4)] = "TabLock"),
  (e[(e.FocusLock = 8)] = "FocusLock"),
  (e[(e.RestoreFocus = 16)] = "RestoreFocus"),
  (e[(e.AutoFocus = 32)] = "AutoFocus"),
  (e[(e.All = 30)] = "All"),
  e
))(Bt || {});
function Kv(e, t) {
  let n = g.useRef(null),
    r = It(n, t),
    {
      initialFocus: l,
      initialFocusFallback: i,
      containers: o,
      features: s = 30,
      ...a
    } = e;
  Ol() || (s = 1);
  let u = Rl(n);
  tg({ ownerDocument: u }, !!(s & 16));
  let f = ng(
    {
      ownerDocument: u,
      container: n,
      initialFocus: l,
      initialFocusFallback: i,
    },
    s,
  );
  rg(
    { ownerDocument: u, container: n, containers: o, previousActiveElement: f },
    !!(s & 8),
  );
  let c = qv(),
    m = de((N) => {
      let d = n.current;
      d &&
        ((p) => p())(() => {
          Ae(c.current, {
            [Xr.Forwards]: () => {
              ol(d, Vt.First, { skipElements: [N.relatedTarget, i] });
            },
            [Xr.Backwards]: () => {
              ol(d, Vt.Last, { skipElements: [N.relatedTarget, i] });
            },
          });
        });
    }),
    v = lu(),
    _ = g.useRef(!1),
    S = {
      ref: r,
      onKeyDown(N) {
        N.key == "Tab" &&
          ((_.current = !0),
          v.requestAnimationFrame(() => {
            _.current = !1;
          }));
      },
      onBlur(N) {
        if (!(s & 8)) return;
        let d = G0(o);
        n.current instanceof HTMLElement && d.add(n.current);
        let p = N.relatedTarget;
        p instanceof HTMLElement &&
          p.dataset.headlessuiFocusGuard !== "true" &&
          (Z0(d, p) ||
            (_.current
              ? ol(
                  n.current,
                  Ae(c.current, {
                    [Xr.Forwards]: () => Vt.Next,
                    [Xr.Backwards]: () => Vt.Previous,
                  }) | Vt.WrapAround,
                  { relativeTo: N.target },
                )
              : N.target instanceof HTMLElement && Zt(N.target)));
      },
    };
  return w.createElement(
    w.Fragment,
    null,
    !!(s & 4) &&
      w.createElement(Ks, {
        as: "button",
        type: "button",
        "data-headlessui-focus-guard": !0,
        onFocus: m,
        features: Ui.Focusable,
      }),
    kt({ ourProps: S, theirProps: a, defaultTag: Yv, name: "FocusTrap" }),
    !!(s & 4) &&
      w.createElement(Ks, {
        as: "button",
        type: "button",
        "data-headlessui-focus-guard": !0,
        onFocus: m,
        features: Ui.Focusable,
      }),
  );
}
let Jv = ht(Kv),
  bv = Object.assign(Jv, { features: Bt });
function eg(e = !0) {
  let t = g.useRef(un.slice());
  return (
    ou(
      ([n], [r]) => {
        r === !0 &&
          n === !1 &&
          ao(() => {
            t.current.splice(0);
          }),
          r === !1 && n === !0 && (t.current = un.slice());
      },
      [e, un, t],
    ),
    de(() => {
      var n;
      return (n = t.current.find((r) => r != null && r.isConnected)) != null
        ? n
        : null;
    })
  );
}
function tg({ ownerDocument: e }, t) {
  let n = eg(t);
  ou(() => {
    t ||
      ((e == null ? void 0 : e.activeElement) ===
        (e == null ? void 0 : e.body) &&
        Zt(n()));
  }, [t]),
    H0(() => {
      t && Zt(n());
    });
}
function ng(
  { ownerDocument: e, container: t, initialFocus: n, initialFocusFallback: r },
  l,
) {
  let i = !!(l & 2),
    o = g.useRef(null),
    s = Al();
  return (
    ou(() => {
      if (!i) {
        r != null && r.current && Zt(r.current);
        return;
      }
      let a = t.current;
      a &&
        ao(() => {
          if (!s.current) return;
          let u = e == null ? void 0 : e.activeElement;
          if (n != null && n.current) {
            if ((n == null ? void 0 : n.current) === u) {
              o.current = u;
              return;
            }
          } else if (a.contains(u)) {
            o.current = u;
            return;
          }
          if (n != null && n.current) Zt(n.current);
          else {
            if (l & 32) {
              if (ol(a, Vt.First | Vt.AutoFocus) !== ea.Error) return;
            } else if (ol(a, Vt.First) !== ea.Error) return;
            if (
              r != null &&
              r.current &&
              (Zt(r.current),
              (e == null ? void 0 : e.activeElement) === r.current)
            )
              return;
            console.warn(
              "There are no focusable elements inside the <FocusTrap />",
            );
          }
          o.current = e == null ? void 0 : e.activeElement;
        });
    }, [r, i, l]),
    o
  );
}
function rg(
  { ownerDocument: e, container: t, containers: n, previousActiveElement: r },
  l,
) {
  let i = Al();
  B0(
    e == null ? void 0 : e.defaultView,
    "focus",
    (o) => {
      if (!l || !i.current) return;
      let s = G0(n);
      t.current instanceof HTMLElement && s.add(t.current);
      let a = r.current;
      if (!a) return;
      let u = o.target;
      u && u instanceof HTMLElement
        ? Z0(s, u)
          ? ((r.current = u), Zt(u))
          : (o.preventDefault(), o.stopPropagation(), Zt(a))
        : Zt(r.current);
    },
    !0,
  );
}
function Z0(e, t) {
  for (let n of e) if (n.contains(t)) return !0;
  return !1;
}
var lg = ((e) => (
    (e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e
  ))(lg || {}),
  ig = ((e) => ((e[(e.SetTitleId = 0)] = "SetTitleId"), e))(ig || {});
let og = {
    0(e, t) {
      return e.titleId === t.id ? e : { ...e, titleId: t.id };
    },
  },
  Wi = g.createContext(null);
Wi.displayName = "DialogContext";
function cu(e) {
  let t = g.useContext(Wi);
  if (t === null) {
    let n = new Error(`<${e} /> is missing a parent <Dialog /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(n, cu), n);
  }
  return t;
}
function sg(e, t) {
  return Ae(t.type, og, e, t);
}
let ag = "div",
  ug = Vi.RenderStrategy | Vi.Static;
function cg(e, t) {
  let n = g.useId(),
    {
      id: r = `headlessui-dialog-${n}`,
      open: l,
      onClose: i,
      initialFocus: o,
      role: s = "dialog",
      autoFocus: a = !0,
      __demoMode: u = !1,
      ...f
    } = e,
    [c, m] = g.useState(0),
    v = g.useRef(!1);
  s = (function () {
    return s === "dialog" || s === "alertdialog"
      ? s
      : (v.current ||
          ((v.current = !0),
          console.warn(
            `Invalid role [${s}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`,
          )),
        "dialog");
  })();
  let _ = au();
  l === void 0 && _ !== null && (l = (_ & be.Open) === be.Open);
  let S = g.useRef(null),
    N = It(S, t),
    d = Rl(S),
    p = e.hasOwnProperty("open") || _ !== null,
    h = e.hasOwnProperty("onClose");
  if (!p && !h)
    throw new Error(
      "You have to provide an `open` and an `onClose` prop to the `Dialog` component.",
    );
  if (!p)
    throw new Error(
      "You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.",
    );
  if (!h)
    throw new Error(
      "You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.",
    );
  if (typeof l != "boolean")
    throw new Error(
      `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${l}`,
    );
  if (typeof i != "function")
    throw new Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${i}`,
    );
  let E = l ? 0 : 1,
    [C, R] = g.useReducer(sg, {
      titleId: null,
      descriptionId: null,
      panelRef: g.createRef(),
    }),
    k = de(() => i(!1)),
    P = de((U) => R({ type: 0, id: U })),
    j = Ol() ? E === 0 : !1,
    $ = c > 1,
    y = g.useContext(Wi) !== null,
    [ne, ae] = Vv(),
    we = {
      get current() {
        var U;
        return (U = C.panelRef.current) != null ? U : S.current;
      },
    },
    {
      resolveContainers: Y,
      mainTreeNodeRef: K,
      MainTreeNode: Z,
    } = Zv({ portals: ne, defaultContainers: [we] }),
    x = $ ? "parent" : "leaf",
    O = _ !== null ? (_ & be.Closing) === be.Closing : !1,
    A = $ || O ? !1 : j;
  fv(
    {
      allowed: de(() => {
        var U, pe;
        return [
          (pe =
            (U = S.current) == null
              ? void 0
              : U.closest("[data-headlessui-portal]")) != null
            ? pe
            : null,
        ];
      }),
      disallowed: de(() => {
        var U, pe;
        return [
          (pe =
            (U = K.current) == null
              ? void 0
              : U.closest("body > *:not(#headlessui-portal-root)")) != null
            ? pe
            : null,
        ];
      }),
    },
    u ? !1 : A,
  ),
    kv(
      Y,
      (U) => {
        U.preventDefault(), k();
      },
      !(!j || $),
    );
  let H = !($ || E !== 0);
  B0(d == null ? void 0 : d.defaultView, "keydown", (U) => {
    H &&
      (U.defaultPrevented ||
        (U.key === $0.Escape &&
          (U.preventDefault(),
          U.stopPropagation(),
          document.activeElement &&
            "blur" in document.activeElement &&
            typeof document.activeElement.blur == "function" &&
            document.activeElement.blur(),
          k())));
  }),
    Av(d, u ? !1 : !(O || E !== 0 || y), Y),
    I0(S, k, E === 0);
  let [te, q] = iv(),
    V = g.useMemo(
      () => [{ dialogState: E, close: k, setTitleId: P }, C],
      [E, C, k, P],
    ),
    I = g.useMemo(() => ({ open: E === 0 }), [E]),
    D = {
      ref: N,
      id: r,
      role: s,
      tabIndex: -1,
      "aria-modal": u ? void 0 : E === 0 ? !0 : void 0,
      "aria-labelledby": C.titleId,
      "aria-describedby": te,
    },
    ie = !Gv(),
    Se = j
      ? Ae(x, { parent: Bt.RestoreFocus, leaf: Bt.All & ~Bt.FocusLock })
      : Bt.None;
  return (
    a && (Se |= Bt.AutoFocus),
    ie || (Se &= ~Bt.InitialFocus),
    u && (Se = Bt.None),
    w.createElement(
      Xv,
      {
        type: "Dialog",
        enabled: E === 0,
        element: S,
        onUpdate: de((U, pe) => {
          pe === "Dialog" &&
            Ae(U, {
              [na.Add]: () => m((ee) => ee + 1),
              [na.Remove]: () => m((ee) => ee - 1),
            });
        }),
      },
      w.createElement(
        sd,
        { force: !0 },
        w.createElement(
          ad,
          null,
          w.createElement(
            Wi.Provider,
            { value: V },
            w.createElement(
              ad.Group,
              { target: S },
              w.createElement(
                sd,
                { force: !1 },
                w.createElement(
                  q,
                  { slot: I, name: "Dialog.Description" },
                  w.createElement(
                    ae,
                    null,
                    w.createElement(
                      bv,
                      {
                        initialFocus: o,
                        initialFocusFallback: u ? void 0 : S,
                        containers: Y,
                        features: Se,
                      },
                      w.createElement(
                        dv,
                        { value: k },
                        kt({
                          ourProps: D,
                          theirProps: f,
                          slot: I,
                          defaultTag: ag,
                          features: ug,
                          visible: E === 0,
                          name: "Dialog",
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      w.createElement(rv, null, w.createElement(Z, null)),
    )
  );
}
let dg = "div";
function fg(e, t) {
  let n = g.useId(),
    { id: r = `headlessui-dialog-panel-${n}`, ...l } = e,
    [{ dialogState: i }, o] = cu("Dialog.Panel"),
    s = It(t, o.panelRef),
    a = g.useMemo(() => ({ open: i === 0 }), [i]),
    u = de((f) => {
      f.stopPropagation();
    });
  return kt({
    ourProps: { ref: s, id: r, onClick: u },
    theirProps: l,
    slot: a,
    defaultTag: dg,
    name: "Dialog.Panel",
  });
}
let pg = "h2";
function hg(e, t) {
  let n = g.useId(),
    { id: r = `headlessui-dialog-title-${n}`, ...l } = e,
    [{ dialogState: i, setTitleId: o }] = cu("Dialog.Title"),
    s = It(t);
  g.useEffect(() => (o(r), () => o(null)), [r, o]);
  let a = g.useMemo(() => ({ open: i === 0 }), [i]);
  return kt({
    ourProps: { ref: s, id: r },
    theirProps: l,
    slot: a,
    defaultTag: pg,
    name: "Dialog.Title",
  });
}
let mg = ht(cg),
  du = ht(fg),
  fu = ht(hg),
  vg = Object.assign(mg, { Panel: du, Title: fu, Description: uv });
function gg(e = 0) {
  let [t, n] = g.useState(e),
    r = Al(),
    l = g.useCallback(
      (a) => {
        r.current && n((u) => u | a);
      },
      [t, r],
    ),
    i = g.useCallback((a) => !!(t & a), [t]),
    o = g.useCallback(
      (a) => {
        r.current && n((u) => u & ~a);
      },
      [n, r],
    ),
    s = g.useCallback(
      (a) => {
        r.current && n((u) => u ^ a);
      },
      [n],
    );
  return { flags: t, addFlag: l, hasFlag: i, removeFlag: o, toggleFlag: s };
}
function Q0(e) {
  let t = { called: !1 };
  return (...n) => {
    if (!t.called) return (t.called = !0), e(...n);
  };
}
function ts(e, ...t) {
  e && t.length > 0 && e.classList.add(...t);
}
function ns(e, ...t) {
  e && t.length > 0 && e.classList.remove(...t);
}
function yg(e, t) {
  let n = Q0(t),
    r = Ln();
  if (!e) return r.dispose;
  let { transitionDuration: l, transitionDelay: i } = getComputedStyle(e),
    [o, s] = [l, i].map((u) => {
      let [f = 0] = u
        .split(",")
        .filter(Boolean)
        .map((c) => (c.includes("ms") ? parseFloat(c) : parseFloat(c) * 1e3))
        .sort((c, m) => m - c);
      return f;
    }),
    a = o + s;
  if (a !== 0) {
    let u = r.group((f) => {
      let c = f.setTimeout(() => {
        n(), f.dispose();
      }, a);
      f.addEventListener(e, "transitionrun", (m) => {
        m.target === m.currentTarget &&
          (c(),
          f.addEventListener(e, "transitioncancel", (v) => {
            v.target === v.currentTarget && (n(), u());
          }));
      });
    });
    r.addEventListener(e, "transitionend", (f) => {
      f.target === f.currentTarget && (n(), r.dispose());
    });
  } else n();
  return r.dispose;
}
function wg(e, { direction: t, done: n, classes: r, inFlight: l }) {
  let i = Ln(),
    o = n !== void 0 ? Q0(n) : () => {};
  t === "enter" && (e.removeAttribute("hidden"), (e.style.display = ""));
  let s = Ae(t, { enter: () => r.enter, leave: () => r.leave }),
    a = Ae(t, { enter: () => r.enterTo, leave: () => r.leaveTo }),
    u = Ae(t, { enter: () => r.enterFrom, leave: () => r.leaveFrom });
  return (
    _g(e, {
      prepare() {
        ns(
          e,
          ...r.base,
          ...r.enter,
          ...r.enterTo,
          ...r.enterFrom,
          ...r.leave,
          ...r.leaveFrom,
          ...r.leaveTo,
          ...r.entered,
        ),
          ts(e, ...r.base, ...s, ...u);
      },
      inFlight: l,
    }),
    l && (l.current = !0),
    i.nextFrame(() => {
      i.add(
        yg(
          e,
          () => (
            ns(e, ...r.base, ...s),
            ts(e, ...r.base, ...r.entered, ...a),
            l && (l.current = !1),
            o()
          ),
        ),
      ),
        ns(e, ...r.base, ...s, ...u),
        ts(e, ...r.base, ...s, ...a);
    }),
    i.dispose
  );
}
function _g(e, { inFlight: t, prepare: n }) {
  if (t != null && t.current) {
    n();
    return;
  }
  let r = e.style.transition;
  (e.style.transition = "none"), n(), e.offsetHeight, (e.style.transition = r);
}
function Eg({ container: e, direction: t, classes: n, onStart: r, onStop: l }) {
  let i = Al(),
    o = lu(),
    s = g.useRef(!1);
  Ve(() => {
    if (t === "idle" || !i.current) return;
    r.current(t);
    let a = e.current;
    return (
      a
        ? o.add(
            wg(a, {
              direction: t,
              classes: n.current,
              inFlight: s,
              done() {
                l.current(t);
              },
            }),
          )
        : l.current(t),
      o.dispose
    );
  }, [t]);
}
function rn(e = "") {
  return e.split(/\s+/).filter((t) => t.length > 1);
}
function X0(e) {
  var t;
  return (
    !!(
      e.enter ||
      e.enterFrom ||
      e.enterTo ||
      e.leave ||
      e.leaveFrom ||
      e.leaveTo
    ) ||
    ((t = e.as) != null ? t : Y0) !== g.Fragment ||
    w.Children.count(e.children) === 1
  );
}
let uo = g.createContext(null);
uo.displayName = "TransitionContext";
var Sg = ((e) => ((e.Visible = "visible"), (e.Hidden = "hidden"), e))(Sg || {});
function xg() {
  let e = g.useContext(uo);
  if (e === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.",
    );
  return e;
}
function kg() {
  let e = g.useContext(co);
  if (e === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.",
    );
  return e;
}
let co = g.createContext(null);
co.displayName = "NestingContext";
function fo(e) {
  return "children" in e
    ? fo(e.children)
    : e.current
        .filter(({ el: t }) => t.current !== null)
        .filter(({ state: t }) => t === "visible").length > 0;
}
function q0(e, t) {
  let n = Ft(e),
    r = g.useRef([]),
    l = Al(),
    i = lu(),
    o = de((v, _ = fn.Hidden) => {
      let S = r.current.findIndex(({ el: N }) => N === v);
      S !== -1 &&
        (Ae(_, {
          [fn.Unmount]() {
            r.current.splice(S, 1);
          },
          [fn.Hidden]() {
            r.current[S].state = "hidden";
          },
        }),
        i.microTask(() => {
          var N;
          !fo(r) && l.current && ((N = n.current) == null || N.call(n));
        }));
    }),
    s = de((v) => {
      let _ = r.current.find(({ el: S }) => S === v);
      return (
        _
          ? _.state !== "visible" && (_.state = "visible")
          : r.current.push({ el: v, state: "visible" }),
        () => o(v, fn.Unmount)
      );
    }),
    a = g.useRef([]),
    u = g.useRef(Promise.resolve()),
    f = g.useRef({ enter: [], leave: [], idle: [] }),
    c = de((v, _, S) => {
      a.current.splice(0),
        t &&
          (t.chains.current[_] = t.chains.current[_].filter(([N]) => N !== v)),
        t == null ||
          t.chains.current[_].push([
            v,
            new Promise((N) => {
              a.current.push(N);
            }),
          ]),
        t == null ||
          t.chains.current[_].push([
            v,
            new Promise((N) => {
              Promise.all(f.current[_].map(([d, p]) => p)).then(() => N());
            }),
          ]),
        _ === "enter"
          ? (u.current = u.current
              .then(() => (t == null ? void 0 : t.wait.current))
              .then(() => S(_)))
          : S(_);
    }),
    m = de((v, _, S) => {
      Promise.all(f.current[_].splice(0).map(([N, d]) => d))
        .then(() => {
          var N;
          (N = a.current.shift()) == null || N();
        })
        .then(() => S(_));
    });
  return g.useMemo(
    () => ({
      children: r,
      register: s,
      unregister: o,
      onStart: c,
      onStop: m,
      wait: u,
      chains: f,
    }),
    [s, o, r, c, m, f, u],
  );
}
let Y0 = g.Fragment,
  K0 = Vi.RenderStrategy;
function Cg(e, t) {
  var n, r, l;
  let {
      beforeEnter: i,
      afterEnter: o,
      beforeLeave: s,
      afterLeave: a,
      enter: u,
      enterFrom: f,
      enterTo: c,
      entered: m,
      leave: v,
      leaveFrom: _,
      leaveTo: S,
      ...N
    } = e,
    d = g.useRef(null),
    p = X0(e),
    h = It(...(p ? [d, t] : t === null ? [] : [t])),
    E = (n = N.unmount) == null || n ? fn.Unmount : fn.Hidden,
    { show: C, appear: R, initial: k } = xg(),
    [P, j] = g.useState(C ? "visible" : "hidden"),
    $ = kg(),
    { register: y, unregister: ne } = $;
  Ve(() => y(d), [y, d]),
    Ve(() => {
      if (E === fn.Hidden && d.current) {
        if (C && P !== "visible") {
          j("visible");
          return;
        }
        return Ae(P, { hidden: () => ne(d), visible: () => y(d) });
      }
    }, [P, d, y, ne, C, E]);
  let ae = Ft({
      base: rn(N.className),
      enter: rn(u),
      enterFrom: rn(f),
      enterTo: rn(c),
      entered: rn(m),
      leave: rn(v),
      leaveFrom: rn(_),
      leaveTo: rn(S),
    }),
    we = Ft({ beforeEnter: i, afterEnter: o, beforeLeave: s, afterLeave: a }),
    Y = Ol();
  Ve(() => {
    if (p && Y && P === "visible" && d.current === null)
      throw new Error(
        "Did you forget to passthrough the `ref` to the actual DOM node?",
      );
  }, [d, P, Y, p]);
  let K = k && !R,
    Z = R && C && k,
    x = Z ? "enter" : !Y || K ? "idle" : C ? "enter" : "leave",
    O = gg(0),
    A = de((V) =>
      Ae(V, {
        enter: () => {
          var I, D;
          O.addFlag(be.Opening),
            (D = (I = we.current).beforeEnter) == null || D.call(I);
        },
        leave: () => {
          var I, D;
          O.addFlag(be.Closing),
            (D = (I = we.current).beforeLeave) == null || D.call(I);
        },
        idle: () => {},
      }),
    ),
    Q = de((V) =>
      Ae(V, {
        enter: () => {
          var I, D;
          O.removeFlag(be.Opening),
            (D = (I = we.current).afterEnter) == null || D.call(I);
        },
        leave: () => {
          var I, D;
          O.removeFlag(be.Closing),
            (D = (I = we.current).afterLeave) == null || D.call(I);
        },
        idle: () => {},
      }),
    ),
    H = g.useRef(!1),
    G = q0(() => {
      H.current || (j("hidden"), ne(d));
    }, $);
  Eg({
    container: d,
    classes: ae,
    direction: x,
    onStart: Ft((V) => {
      (H.current = !0), G.onStart(d, V, A);
    }),
    onStop: Ft((V) => {
      (H.current = !1),
        G.onStop(d, V, Q),
        V === "leave" && !fo(G) && (j("hidden"), ne(d));
    }),
  });
  let te = N,
    q = { ref: h };
  return (
    Z
      ? (te = {
          ...te,
          className: ll(
            N.className,
            ...ae.current.enter,
            ...ae.current.enterFrom,
          ),
        })
      : H.current
        ? ((te.className = ll(
            N.className,
            (r = d.current) == null ? void 0 : r.className,
          )),
          te.className === "" && delete te.className)
        : ((te.className = ll(
            N.className,
            (l = d.current) == null ? void 0 : l.className,
            ...Ae(x, {
              enter: [...ae.current.enterTo, ...ae.current.entered],
              leave: ae.current.leaveTo,
              idle: [],
            }),
          )),
          te.className === "" && delete te.className),
    w.createElement(
      co.Provider,
      { value: G },
      w.createElement(
        Fv,
        { value: Ae(P, { visible: be.Open, hidden: be.Closed }) | O.flags },
        kt({
          ourProps: q,
          theirProps: te,
          defaultTag: Y0,
          features: K0,
          visible: P === "visible",
          name: "Transition.Child",
        }),
      ),
    )
  );
}
function Lg(e, t) {
  let { show: n, appear: r = !1, unmount: l = !0, ...i } = e,
    o = g.useRef(null),
    s = X0(e),
    a = It(...(s ? [o, t] : t === null ? [] : [t]));
  Ol();
  let u = au();
  if (
    (n === void 0 && u !== null && (n = (u & be.Open) === be.Open),
    n === void 0)
  )
    throw new Error(
      "A <Transition /> is used but it is missing a `show={true | false}` prop.",
    );
  let [f, c] = g.useState(n ? "visible" : "hidden"),
    m = q0(() => {
      n || c("hidden");
    }),
    [v, _] = g.useState(!0),
    S = g.useRef([n]);
  Ve(() => {
    v !== !1 &&
      S.current[S.current.length - 1] !== n &&
      (S.current.push(n), _(!1));
  }, [S, n]);
  let N = g.useMemo(() => ({ show: n, appear: r, initial: v }), [n, r, v]);
  I0(o, () => c("hidden")),
    Ve(() => {
      n ? c("visible") : !fo(m) && o.current !== null && c("hidden");
    }, [n, m]);
  let d = { unmount: l },
    p = de(() => {
      var E;
      v && _(!1), (E = e.beforeEnter) == null || E.call(e);
    }),
    h = de(() => {
      var E;
      v && _(!1), (E = e.beforeLeave) == null || E.call(e);
    });
  return w.createElement(
    co.Provider,
    { value: m },
    w.createElement(
      uo.Provider,
      { value: N },
      kt({
        ourProps: {
          ...d,
          as: g.Fragment,
          children: w.createElement(J0, {
            ref: a,
            ...d,
            ...i,
            beforeEnter: p,
            beforeLeave: h,
          }),
        },
        theirProps: {},
        defaultTag: g.Fragment,
        features: K0,
        visible: f === "visible",
        name: "Transition",
      }),
    ),
  );
}
function Ng(e, t) {
  let n = g.useContext(uo) !== null,
    r = au() !== null;
  return w.createElement(
    w.Fragment,
    null,
    !n && r
      ? w.createElement(ra, { ref: t, ...e })
      : w.createElement(J0, { ref: t, ...e }),
  );
}
let ra = ht(Lg),
  J0 = ht(Cg),
  b0 = ht(Ng),
  Tg = Object.assign(ra, { Child: b0, Root: ra });
const po = w.createContext({}),
  ep = ({ children: e, show: t, setShow: n }) =>
    T.jsx(Tg, {
      as: g.Fragment,
      show: t,
      children: T.jsxs(vg, {
        className: "relative z-10 transition",
        onClose: n,
        children: [
          T.jsx("div", { className: "fixed inset-0" }),
          T.jsx("div", {
            className: "fixed inset-0 overflow-hidden",
            children: T.jsx("div", {
              className: "absolute inset-0 overflow-hidden",
              children: T.jsx("div", {
                className:
                  "pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10",
                children: T.jsx(b0, {
                  as: g.Fragment,
                  enter:
                    "transform transition ease-in-out duration-500 sm:duration-700",
                  enterFrom: "translate-x-full",
                  enterTo: "translate-x-0",
                  leave:
                    "transform transition ease-in-out duration-500 sm:duration-700",
                  leaveFrom: "translate-x-0",
                  leaveTo: "translate-x-full",
                  children: e,
                }),
              }),
            }),
          }),
        ],
      }),
    }),
  Pg = (e) => {
    new Audio(e).play();
  },
  Rg = ({ setShow: e, show: t, setVoice: n }) => {
    const r = g.useContext(po),
      [l, i] = g.useState([]);
    return (
      g.useEffect(() => {
        (async () => {
          await r.elevenlabs
            .getVoices()
            .then((s) => {
              i(s.voices);
            })
            .catch((s) => {
              console.error(s);
            });
        })();
      }, []),
      T.jsx(ep, {
        show: t,
        setShow: e,
        children: T.jsx(du, {
          className: "pointer-events-auto w-screen max-w-md",
          children: T.jsxs("div", {
            className:
              "flex h-full flex-col overflow-y-scroll bg-white shadow-xl",
            children: [
              T.jsxs("div", {
                className: "sticky top-0 z-10 bg-black px-4 py-6 sm:px-6",
                children: [
                  T.jsx("div", {
                    className: "flex items-center justify-between",
                    children: T.jsx(fu, {
                      className: "text-base font-semibold leading-6 text-white",
                      children: "Voice selection",
                    }),
                  }),
                  T.jsx("div", {
                    className: "mt-1",
                    children: T.jsx("p", {
                      className: "text-sm text-white text-opacity-70",
                      children: "Pick from a selection of pre-defined voices.",
                    }),
                  }),
                ],
              }),
              T.jsx("div", {
                className: "relative flex-1 px-4 py-6 sm:px-3",
                children: T.jsx("ul", {
                  className: "space-y-2",
                  children: l.map((o) => {
                    const s = Object.values(o.labels);
                    return T.jsxs(
                      "li",
                      {
                        className:
                          "flex flex-col hover:bg-black hover:bg-opacity-5 py-2 px-3 cursor-pointer",
                        onClick: () => {
                          n(o), e(!1);
                        },
                        children: [
                          T.jsxs("div", {
                            className: "flex space-x-2 items-center",
                            children: [
                              T.jsx("div", {
                                className:
                                  "rounded-full flex items-center justify-center bg-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]",
                                onClick: (a) => {
                                  a.stopPropagation(), Pg(o.preview_url);
                                },
                                children: T.jsx(nu, {
                                  color: "white",
                                  size: "11",
                                  weight: "fill",
                                }),
                              }),
                              T.jsx("p", {
                                className: "font-semibold",
                                children: o.name,
                              }),
                            ],
                          }),
                          T.jsx("div", {
                            className: "space-x-2",
                            children: s.map((a) =>
                              T.jsx(
                                "span",
                                {
                                  className: "text-sm opacity-70",
                                  children: a,
                                },
                                a,
                              ),
                            ),
                          }),
                        ],
                      },
                      o.id,
                    );
                  }),
                }),
              }),
            ],
          }),
        }),
      })
    );
  },
  Og = {
    colorMode: "bar-level",
    height: 300,
    mode: 2,
    channelLayout: "single",
    gradient: "prism",
    gradientLeft: "prism",
    gradientRight: "prism",
    showPeaks: !1,
    roundBars: !0,
    linearAmplitude: !0,
    reflexRatio: 0.5,
    reflexAlpha: 1,
    reflexBright: 1,
    alphaBars: !1,
    ansiBands: !1,
    barSpace: 0.25,
    frequencyScale: "log",
    ledBars: !1,
    linearBoost: 1.6,
    lumiBars: !1,
    maxFreq: 16e3,
    minFreq: 30,
    mirror: 0,
    radial: !1,
    showScaleX: !1,
    smoothing: 0.7,
    weightingFilter: "D",
    showBgColor: !1,
    overlay: !0,
  },
  Ag = [
    {
      voice: "Rachel",
      text: "Have you ever wondered what lies beyond the stars? What mysteries does the universe hold?",
    },
    {
      voice: "Paul",
      text: "The sunset painted the sky in hues of orange and pink, casting a warm glow over the tranquil sea.",
    },
    {
      voice: "George",
      text: "Imagine a world where every child has access to quality education. Together, we can make this dream a reality by supporting educational initiatives.",
    },
    {
      voice: "Nicole",
      text: "Once upon a time, in a land far, far away, there lived a brave knight who embarked on an epic journey to rescue the captured princess.",
    },
    {
      voice: "Drew",
      text: "Take a deep breath in, hold it for a moment, and then slowly exhale. Let all your stress melt away.",
    },
    {
      voice: "Mimi",
      text: "Wow, did you hear about the latest tech gadget? It's revolutionizing the way we interact with our devices!",
    },
    {
      voice: "Bill",
      text: "To bake the perfect chocolate cake, start by preheating your oven to 350 degrees Fahrenheit and gathering all your ingredients.",
    },
    {
      voice: "Glinda",
      text: "Good evening, ladies and gentlemen. We are gathered here today to celebrate the remarkable achievements of our distinguished guests.",
    },
    {
      voice: "Serena",
      text: "Hey, have you ever tried that new café downtown? Their coffee is amazing, and they have the best pastries.",
    },
    {
      voice: "Lily",
      text: "In a quiet village nestled between rolling hills, a young girl named Emma discovered a hidden path that led to an enchanted forest.",
    },
  ],
  Fg = ({ onSelect: e }) => {
    const t = g.useMemo(
      () => Ag.sort(() => 0.5 - Math.random()).slice(0, 4),
      [],
    );
    return T.jsx("div", {
      className: "grid grid-cols-2 gap-4 group",
      children: t.map((n) =>
        T.jsx(
          Mg,
          {
            onClick: () => {
              e(n);
            },
            voice: n.voice,
            text: n.text,
          },
          n.voice,
        ),
      ),
    });
  },
  Mg = ({ text: e, voice: t, onClick: n }) =>
    T.jsxs("div", {
      onClick: n,
      className:
        "flex flex-col text-left p-4 py-2 cursor-pointer bg-white border rounded-sm border-black border-opacity-20 opacity-70 transition hover:opacity-100 hover:bg-black hover:bg-opacity-5",
      children: [
        T.jsx("p", { className: "font-semibold text-sm", children: t }),
        T.jsx("p", { className: "text-xs", children: e }),
      ],
    }),
  rs = ({
    title: e,
    minDesc: t,
    maxDesc: n,
    min: r,
    max: l,
    value: i,
    setValue: o,
  }) =>
    T.jsxs("div", {
      className: "flex flex-col text-left space-y-1 w-[250px]",
      children: [
        T.jsx("label", { htmlFor: e, children: e }),
        T.jsxs("div", {
          className: "w-full flex justify-between text-xs opacity-50",
          children: [
            T.jsx("span", { children: t }),
            T.jsx("span", { children: n }),
          ],
        }),
        T.jsx("input", {
          id: e,
          className: "w-full range accent-black",
          type: "range",
          min: r,
          max: l,
          value: i,
          onChange: (s) => o(parseInt(s.target.value)),
        }),
      ],
    }),
  $g = ({ setShow: e, show: t }) => {
    const n = g.useContext(po),
      [r, l] = g.useState([]),
      i = async (s) => {
        const a = new AudioContext(),
          u = await n.elevenlabs.getHistoryItemAudio("GET", s),
          f = await a.decodeAudioData(await u.arrayBuffer()),
          c = a.createBufferSource();
        (c.buffer = f), c.connect(a.destination), c.start();
      },
      o = async (s) => {
        const a = await n.elevenlabs.getHistoryItemAudio("GET", s),
          u = new Blob([await a.arrayBuffer()], { type: "audio/mpeg" }),
          f = document.createElement("a");
        (f.href = URL.createObjectURL(u)), (f.download = s + ".mp3"), f.click();
      };
    return (
      g.useEffect(() => {
        (async () => {
          await n.elevenlabs
            .getHistory()
            .then((a) => {
              l(a.history);
            })
            .catch((a) => {
              console.error(a);
            });
        })();
      }, [t]),
      T.jsx(ep, {
        show: t,
        setShow: e,
        children: T.jsx(du, {
          className: "pointer-events-auto w-screen max-w-md",
          children: T.jsxs("div", {
            className:
              "flex h-full flex-col overflow-y-scroll bg-white shadow-xl",
            children: [
              T.jsxs("div", {
                className: "sticky top-0 z-10 bg-black px-4 py-6 sm:px-6",
                children: [
                  T.jsx("div", {
                    className: "flex items-center justify-between",
                    children: T.jsx(fu, {
                      className: "text-base font-semibold leading-6 text-white",
                      children: "Speech Synthesis History",
                    }),
                  }),
                  T.jsx("div", {
                    className: "mt-1",
                    children: T.jsx("p", {
                      className: "text-sm text-white text-opacity-70",
                      children: "Play or download previously generated items.",
                    }),
                  }),
                ],
              }),
              T.jsx("div", {
                className: "relative flex-1 px-4 py-6 sm:px-3",
                children: T.jsx("ul", {
                  className: "space-y-2",
                  children: r.map((s) =>
                    T.jsxs(
                      "li",
                      {
                        className: "flex flex-col py-2 px-3",
                        children: [
                          T.jsxs("div", {
                            className: "flex space-x-2 items-center",
                            children: [
                              T.jsx("div", {
                                className:
                                  "rounded-full flex items-center justify-center bg-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]",
                                onClick: (a) => {
                                  a.stopPropagation(), i(s.history_item_id);
                                },
                                children: T.jsx(nu, {
                                  color: "white",
                                  size: "11",
                                  weight: "fill",
                                }),
                              }),
                              T.jsx("div", {
                                className:
                                  "rounded-full flex items-center justify-center border border-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]",
                                onClick: (a) => {
                                  a.stopPropagation(), o(s.history_item_id);
                                },
                                children: T.jsx(R0, {
                                  size: "14",
                                  weight: "bold",
                                }),
                              }),
                              T.jsx("p", {
                                className: "font-semibold",
                                children: s.voice_name,
                              }),
                            ],
                          }),
                          T.jsx("div", {
                            className: "text-sm opacity-70",
                            children: s.text,
                          }),
                        ],
                      },
                      s.history_item_id,
                    ),
                  ),
                }),
              }),
            ],
          }),
        }),
      })
    );
  },
  Ig =
    "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cpath%20d='M12%200c-6.626%200-12%205.373-12%2012%200%205.302%203.438%209.8%208.207%2011.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729%201.205.084%201.839%201.237%201.839%201.237%201.07%201.834%202.807%201.304%203.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931%200-1.311.469-2.381%201.236-3.221-.124-.303-.535-1.524.117-3.176%200%200%201.008-.322%203.301%201.23.957-.266%201.983-.399%203.003-.404%201.02.005%202.047.138%203.006.404%202.291-1.552%203.297-1.23%203.297-1.23.653%201.653.242%202.874.118%203.176.77.84%201.235%201.911%201.235%203.221%200%204.609-2.807%205.624-5.479%205.921.43.372.823%201.102.823%202.222v3.293c0%20.319.192.694.801.576%204.765-1.589%208.199-6.086%208.199-11.386%200-6.627-5.373-12-12-12z'/%3e%3c/svg%3e",
  jg = "/assets/poweredby-BmXagwOe.png";
function zg() {
  const e = g.useContext(po),
    [t, n] = g.useState(""),
    [r, l] = g.useState(!1),
    [i, o] = g.useState(),
    [s, a] = g.useState(!1),
    [u, f] = g.useState(!1),
    [c, m] = g.useState("Rachel"),
    [v, _] = g.useState(50),
    [S, N] = g.useState(75),
    [d, p] = g.useState(0),
    h = g.useRef(null),
    E = async () => {
      l(!0);
      const C = new AudioContext(),
        R = JSON.stringify({
          text: t,
          voice: c,
          voice_settings: {
            stability: v / 100,
            similarity: S / 100,
            exaggeration: d / 100,
          },
        });
      await e.elevenlabs
        .generateVoiceAudio("POST", R)
        .then((k) => k.arrayBuffer())
        .then((k) => C.decodeAudioData(k))
        .then((k) => {
          const P = C.createBufferSource();
          (P.buffer = k), P.connect(C.destination), o(P);
        })
        .finally(() => {
          l(!1);
        });
    };
  return (
    g.useEffect(() => {
      if (!i) return;
      const C = new rm(h.current, { source: i, ...Og });
      return (
        i.start(),
        () => {
          C.destroy();
        }
      );
    }, [i]),
    T.jsxs("main", {
      className: "flex flex-col items-center",
      children: [
        T.jsx(Rg, { show: s, setShow: a, setVoice: (C) => m(C.name) }),
        T.jsx($g, { show: u, setShow: f }),
        T.jsx("div", { className: "h-[250px]", ref: h }),
        T.jsxs("div", {
          className: "relative w-[700px] space-y-8",
          children: [
            T.jsx("div", {
              className: "w-full flex justify-end",
              children: T.jsxs("button", {
                className:
                  "flex items-center text-xs space-x-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-1 border border-gray-400 rounded shadow",
                onClick: () => f(!0),
                children: [
                  T.jsx(P0, { size: 20 }),
                  T.jsx("span", { children: "History" }),
                ],
              }),
            }),
            T.jsx(Fg, {
              onSelect: ({ voice: C, text: R }) => {
                m(C), n(R);
              },
            }),
            T.jsx(Zm, { value: t, onChange: n, onSubmit: E, isLoading: r }),
            T.jsx("div", {
              className: "w-fit flex mx-auto",
              children: T.jsxs("button", {
                className:
                  "flex items-center space-x-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow",
                onClick: () => a(!0),
                children: [
                  T.jsx(O0, { size: 20 }),
                  T.jsx("span", { children: c }),
                ],
              }),
            }),
            T.jsxs("div", {
              className: "w-full flex items-center space-x-10",
              children: [
                T.jsx(rs, {
                  title: "Stability",
                  minDesc: "More variable",
                  maxDesc: "More stable",
                  min: 0,
                  max: 100,
                  value: v,
                  setValue: _,
                }),
                T.jsx(rs, {
                  title: "Similarity",
                  minDesc: "Low",
                  maxDesc: "High",
                  min: 0,
                  max: 100,
                  value: S,
                  setValue: N,
                }),
                T.jsx(rs, {
                  title: "Style Exaggeration",
                  minDesc: "None",
                  maxDesc: "Exaggerated",
                  min: 0,
                  max: 100,
                  value: d,
                  setValue: p,
                }),
              ],
            }),
          ],
        }),
        T.jsxs("div", {
          className: "flex space-x-4 absolute bottom-5 right-5",
          children: [
            T.jsx("img", { src: Ig, alt: "GitHub", className: "h-[50px]" }),
            T.jsx("a", {
              href: "https://encore.dev",
              target: "_blank",
              children: T.jsx("img", {
                src: jg,
                alt: "Powered by Encore",
                className: "h-[50px]",
              }),
            }),
          ],
        }),
      ],
    })
  );
}
class Dg {
  constructor(t, n) {
    ot(this, "elevenlabs");
    ot(this, "frontend");
    const r = new Vg(t, n ?? {});
    (this.elevenlabs = new la.ServiceClient(r)),
      (this.frontend = new ia.ServiceClient(r));
  }
}
var la;
((e) => {
  class t {
    constructor(r) {
      ot(this, "baseClient");
      this.baseClient = r;
    }
    async generateVoiceAudio(r, l, i) {
      return this.baseClient.callAPI(r, "/generate", l, i);
    }
    async getHistory() {
      return await (await this.baseClient.callAPI("GET", "/history")).json();
    }
    async getHistoryItemAudio(r, l, i, o) {
      return this.baseClient.callAPI(
        r,
        `/history/${encodeURIComponent(l)}`,
        i,
        o,
      );
    }
    async getVoices() {
      return await (await this.baseClient.callAPI("GET", "/voices")).json();
    }
  }
  e.ServiceClient = t;
})(la || (la = {}));
var ia;
((e) => {
  class t {
    constructor(r) {
      ot(this, "baseClient");
      this.baseClient = r;
    }
    async serveFrontend(r, l, i, o) {
      return this.baseClient.callAPI(
        r,
        `/${l.map(encodeURIComponent).join("/")}`,
        i,
        o,
      );
    }
  }
  e.ServiceClient = t;
})(ia || (ia = {}));
function Bg(e) {
  const t = [];
  for (const n in e) {
    const r = Array.isArray(e[n]) ? e[n] : [e[n]];
    for (const l of r) t.push(`${n}=${encodeURIComponent(l)}`);
  }
  return t.join("&");
}
const Hg = fetch.bind(void 0);
class Vg {
  constructor(t, n) {
    ot(this, "baseURL");
    ot(this, "fetcher");
    ot(this, "headers");
    ot(this, "requestInit");
    (this.baseURL = t),
      (this.headers = { "Content-Type": "application/json" }),
      typeof window > "u" &&
        (this.headers["User-Agent"] =
          "{{ENCORE_APP_ID}}-Generated-TS-Client (Encore/v1.37.7)"),
      (this.requestInit = n.requestInit ?? {}),
      n.fetcher !== void 0 ? (this.fetcher = n.fetcher) : (this.fetcher = Hg);
  }
  async callAPI(t, n, r, l) {
    let { query: i, headers: o, ...s } = l ?? {};
    const a = { ...this.requestInit, ...s, method: t, body: r ?? null };
    a.headers = { ...this.headers, ...a.headers, ...o };
    const u = i ? "?" + Bg(i) : "",
      f = await this.fetcher(this.baseURL + n + u, a);
    if (!f.ok) {
      let c = {
        code: "unknown",
        message: `request failed: status ${f.status}`,
      };
      try {
        const m = await f.text();
        try {
          const v = JSON.parse(m);
          Ug(v) ? (c = v) : (c.message += ": " + JSON.stringify(v));
        } catch {
          c.message += ": " + m;
        }
      } catch (m) {
        c.message += ": " + String(m);
      }
      throw new Gi(f.status, c);
    }
    return f;
  }
}
function Ug(e) {
  return (
    e != null &&
    Wg(e.code) &&
    typeof e.message == "string" &&
    (e.details === void 0 || e.details === null || typeof e.details == "object")
  );
}
function Wg(e) {
  return e !== void 0 && Object.values(tp).includes(e);
}
class Gi extends Error {
  constructor(n, r) {
    super(r.message);
    ot(this, "status");
    ot(this, "code");
    ot(this, "details");
    Object.defineProperty(this, "name", {
      value: "APIError",
      enumerable: !1,
      configurable: !0,
    }),
      Object.setPrototypeOf == null
        ? (this.__proto__ = Gi.prototype)
        : Object.setPrototypeOf(this, Gi.prototype),
      Error.captureStackTrace !== void 0 &&
        Error.captureStackTrace(this, this.constructor),
      (this.status = n),
      (this.code = r.code),
      (this.details = r.details);
  }
}
var tp = ((e) => (
  (e.OK = "ok"),
  (e.Canceled = "canceled"),
  (e.Unknown = "unknown"),
  (e.InvalidArgument = "invalid_argument"),
  (e.DeadlineExceeded = "deadline_exceeded"),
  (e.NotFound = "not_found"),
  (e.AlreadyExists = "already_exists"),
  (e.PermissionDenied = "permission_denied"),
  (e.ResourceExhausted = "resource_exhausted"),
  (e.FailedPrecondition = "failed_precondition"),
  (e.Aborted = "aborted"),
  (e.OutOfRange = "out_of_range"),
  (e.Unimplemented = "unimplemented"),
  (e.Internal = "internal"),
  (e.Unavailable = "unavailable"),
  (e.DataLoss = "data_loss"),
  (e.Unauthenticated = "unauthenticated"),
  e
))(tp || {});
const Gg = window.location.origin,
  Zg = new Dg(Gg);
ls.createRoot(document.getElementById("root")).render(
  T.jsx(w.StrictMode, {
    children: T.jsx(po.Provider, { value: Zg, children: T.jsx(zg, {}) }),
  }),
);
