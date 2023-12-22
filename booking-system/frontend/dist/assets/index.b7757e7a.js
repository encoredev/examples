var Fg = Object.defineProperty;
var Ug = (e, t, n) =>
  t in e
    ? Fg(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var Nt = (e, t, n) => (Ug(e, typeof t != "symbol" ? t + "" : t, n), n),
  Ks = (e, t, n) => {
    if (!t.has(e)) throw TypeError("Cannot " + n);
  };
var x = (e, t, n) => (
    Ks(e, t, "read from private field"), n ? n.call(e) : t.get(e)
  ),
  z = (e, t, n) => {
    if (t.has(e))
      throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(e) : t.set(e, n);
  },
  L = (e, t, n, r) => (
    Ks(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n
  ),
  Wo = (e, t, n, r) => ({
    set _(i) {
      L(e, t, i, n);
    },
    get _() {
      return x(e, t, r);
    },
  }),
  J = (e, t, n) => (Ks(e, t, "access private method"), n);
function Bp(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const i in r)
        if (i !== "default" && !(i in e)) {
          const a = Object.getOwnPropertyDescriptor(r, i);
          a &&
            Object.defineProperty(
              e,
              i,
              a.get ? a : { enumerable: !0, get: () => r[i] },
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
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver((i) => {
    for (const a of i)
      if (a.type === "childList")
        for (const o of a.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const a = {};
    return (
      i.integrity && (a.integrity = i.integrity),
      i.referrerpolicy && (a.referrerPolicy = i.referrerpolicy),
      i.crossorigin === "use-credentials"
        ? (a.credentials = "include")
        : i.crossorigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function r(i) {
    if (i.ep) return;
    i.ep = !0;
    const a = n(i);
    fetch(i.href, a);
  }
})();
function Qp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var Fu = {},
  Mo = { exports: {} },
  Ft = {},
  S = { exports: {} },
  ie = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Oo = Symbol.for("react.element"),
  Ag = Symbol.for("react.portal"),
  Ig = Symbol.for("react.fragment"),
  $g = Symbol.for("react.strict_mode"),
  jg = Symbol.for("react.profiler"),
  zg = Symbol.for("react.provider"),
  Hg = Symbol.for("react.context"),
  Wg = Symbol.for("react.forward_ref"),
  Bg = Symbol.for("react.suspense"),
  Qg = Symbol.for("react.memo"),
  Yg = Symbol.for("react.lazy"),
  _f = Symbol.iterator;
function Vg(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (_f && e[_f]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Yp = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Vp = Object.assign,
  qp = {};
function oa(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = qp),
    (this.updater = n || Yp);
}
oa.prototype.isReactComponent = {};
oa.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
oa.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Kp() {}
Kp.prototype = oa.prototype;
function ad(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = qp),
    (this.updater = n || Yp);
}
var od = (ad.prototype = new Kp());
od.constructor = ad;
Vp(od, oa.prototype);
od.isPureReactComponent = !0;
var Lf = Array.isArray,
  Gp = Object.prototype.hasOwnProperty,
  ld = { current: null },
  Xp = { key: !0, ref: !0, __self: !0, __source: !0 };
function Jp(e, t, n) {
  var r,
    i = {},
    a = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (a = "" + t.key),
    t))
      Gp.call(t, r) && !Xp.hasOwnProperty(r) && (i[r] = t[r]);
  var l = arguments.length - 2;
  if (l === 1) i.children = n;
  else if (1 < l) {
    for (var s = Array(l), u = 0; u < l; u++) s[u] = arguments[u + 2];
    i.children = s;
  }
  if (e && e.defaultProps)
    for (r in ((l = e.defaultProps), l)) i[r] === void 0 && (i[r] = l[r]);
  return {
    $$typeof: Oo,
    type: e,
    key: a,
    ref: o,
    props: i,
    _owner: ld.current,
  };
}
function qg(e, t) {
  return {
    $$typeof: Oo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function sd(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Oo;
}
function Kg(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var Ff = /\/+/g;
function Gs(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Kg("" + e.key)
    : t.toString(36);
}
function dl(e, t, n, r, i) {
  var a = typeof e;
  (a === "undefined" || a === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (a) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Oo:
          case Ag:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (i = i(o)),
      (e = r === "" ? "." + Gs(o, 0) : r),
      Lf(i)
        ? ((n = ""),
          e != null && (n = e.replace(Ff, "$&/") + "/"),
          dl(i, t, n, "", function (u) {
            return u;
          }))
        : i != null &&
          (sd(i) &&
            (i = qg(
              i,
              n +
                (!i.key || (o && o.key === i.key)
                  ? ""
                  : ("" + i.key).replace(Ff, "$&/") + "/") +
                e,
            )),
          t.push(i)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), Lf(e)))
    for (var l = 0; l < e.length; l++) {
      a = e[l];
      var s = r + Gs(a, l);
      o += dl(a, t, n, s, i);
    }
  else if (((s = Vg(e)), typeof s == "function"))
    for (e = s.call(e), l = 0; !(a = e.next()).done; )
      (a = a.value), (s = r + Gs(a, l++)), (o += dl(a, t, n, s, i));
  else if (a === "object")
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
function Bo(e, t, n) {
  if (e == null) return e;
  var r = [],
    i = 0;
  return (
    dl(e, r, "", "", function (a) {
      return t.call(n, a, i++);
    }),
    r
  );
}
function Gg(e) {
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
var yt = { current: null },
  fl = { transition: null },
  Xg = {
    ReactCurrentDispatcher: yt,
    ReactCurrentBatchConfig: fl,
    ReactCurrentOwner: ld,
  };
ie.Children = {
  map: Bo,
  forEach: function (e, t, n) {
    Bo(
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
      Bo(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Bo(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!sd(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
ie.Component = oa;
ie.Fragment = Ig;
ie.Profiler = jg;
ie.PureComponent = ad;
ie.StrictMode = $g;
ie.Suspense = Bg;
ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Xg;
ie.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Vp({}, e.props),
    i = e.key,
    a = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((a = t.ref), (o = ld.current)),
      t.key !== void 0 && (i = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var l = e.type.defaultProps;
    for (s in t)
      Gp.call(t, s) &&
        !Xp.hasOwnProperty(s) &&
        (r[s] = t[s] === void 0 && l !== void 0 ? l[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    l = Array(s);
    for (var u = 0; u < s; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: Oo, type: e.type, key: i, ref: a, props: r, _owner: o };
};
ie.createContext = function (e) {
  return (
    (e = {
      $$typeof: Hg,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: zg, _context: e }),
    (e.Consumer = e)
  );
};
ie.createElement = Jp;
ie.createFactory = function (e) {
  var t = Jp.bind(null, e);
  return (t.type = e), t;
};
ie.createRef = function () {
  return { current: null };
};
ie.forwardRef = function (e) {
  return { $$typeof: Wg, render: e };
};
ie.isValidElement = sd;
ie.lazy = function (e) {
  return { $$typeof: Yg, _payload: { _status: -1, _result: e }, _init: Gg };
};
ie.memo = function (e, t) {
  return { $$typeof: Qg, type: e, compare: t === void 0 ? null : t };
};
ie.startTransition = function (e) {
  var t = fl.transition;
  fl.transition = {};
  try {
    e();
  } finally {
    fl.transition = t;
  }
};
ie.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
ie.useCallback = function (e, t) {
  return yt.current.useCallback(e, t);
};
ie.useContext = function (e) {
  return yt.current.useContext(e);
};
ie.useDebugValue = function () {};
ie.useDeferredValue = function (e) {
  return yt.current.useDeferredValue(e);
};
ie.useEffect = function (e, t) {
  return yt.current.useEffect(e, t);
};
ie.useId = function () {
  return yt.current.useId();
};
ie.useImperativeHandle = function (e, t, n) {
  return yt.current.useImperativeHandle(e, t, n);
};
ie.useInsertionEffect = function (e, t) {
  return yt.current.useInsertionEffect(e, t);
};
ie.useLayoutEffect = function (e, t) {
  return yt.current.useLayoutEffect(e, t);
};
ie.useMemo = function (e, t) {
  return yt.current.useMemo(e, t);
};
ie.useReducer = function (e, t, n) {
  return yt.current.useReducer(e, t, n);
};
ie.useRef = function (e) {
  return yt.current.useRef(e);
};
ie.useState = function (e) {
  return yt.current.useState(e);
};
ie.useSyncExternalStore = function (e, t, n) {
  return yt.current.useSyncExternalStore(e, t, n);
};
ie.useTransition = function () {
  return yt.current.useTransition();
};
ie.version = "18.2.0";
(function (e) {
  e.exports = ie;
})(S);
const rt = Qp(S.exports),
  Zp = Bp({ __proto__: null, default: rt }, [S.exports]);
var em = { exports: {} },
  tm = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(R, W) {
    var B = R.length;
    R.push(W);
    e: for (; 0 < B; ) {
      var ae = (B - 1) >>> 1,
        he = R[ae];
      if (0 < i(he, W)) (R[ae] = W), (R[B] = he), (B = ae);
      else break e;
    }
  }
  function n(R) {
    return R.length === 0 ? null : R[0];
  }
  function r(R) {
    if (R.length === 0) return null;
    var W = R[0],
      B = R.pop();
    if (B !== W) {
      R[0] = B;
      e: for (var ae = 0, he = R.length, Dt = he >>> 1; ae < Dt; ) {
        var _e = 2 * (ae + 1) - 1,
          wt = R[_e],
          Ke = _e + 1,
          bt = R[Ke];
        if (0 > i(wt, B))
          Ke < he && 0 > i(bt, wt)
            ? ((R[ae] = bt), (R[Ke] = B), (ae = Ke))
            : ((R[ae] = wt), (R[_e] = B), (ae = _e));
        else if (Ke < he && 0 > i(bt, B)) (R[ae] = bt), (R[Ke] = B), (ae = Ke);
        else break e;
      }
    }
    return W;
  }
  function i(R, W) {
    var B = R.sortIndex - W.sortIndex;
    return B !== 0 ? B : R.id - W.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var a = performance;
    e.unstable_now = function () {
      return a.now();
    };
  } else {
    var o = Date,
      l = o.now();
    e.unstable_now = function () {
      return o.now() - l;
    };
  }
  var s = [],
    u = [],
    c = 1,
    d = null,
    p = 3,
    v = !1,
    y = !1,
    C = !1,
    k = typeof setTimeout == "function" ? setTimeout : null,
    f = typeof clearTimeout == "function" ? clearTimeout : null,
    h = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function g(R) {
    for (var W = n(u); W !== null; ) {
      if (W.callback === null) r(u);
      else if (W.startTime <= R)
        r(u), (W.sortIndex = W.expirationTime), t(s, W);
      else break;
      W = n(u);
    }
  }
  function T(R) {
    if (((C = !1), g(R), !y))
      if (n(s) !== null) (y = !0), Z(M);
      else {
        var W = n(u);
        W !== null && X(T, W.startTime - R);
      }
  }
  function M(R, W) {
    (y = !1), C && ((C = !1), f(b), (b = -1)), (v = !0);
    var B = p;
    try {
      for (
        g(W), d = n(s);
        d !== null && (!(d.expirationTime > W) || (R && !G()));

      ) {
        var ae = d.callback;
        if (typeof ae == "function") {
          (d.callback = null), (p = d.priorityLevel);
          var he = ae(d.expirationTime <= W);
          (W = e.unstable_now()),
            typeof he == "function" ? (d.callback = he) : d === n(s) && r(s),
            g(W);
        } else r(s);
        d = n(s);
      }
      if (d !== null) var Dt = !0;
      else {
        var _e = n(u);
        _e !== null && X(T, _e.startTime - W), (Dt = !1);
      }
      return Dt;
    } finally {
      (d = null), (p = B), (v = !1);
    }
  }
  var w = !1,
    P = null,
    b = -1,
    _ = 5,
    I = -1;
  function G() {
    return !(e.unstable_now() - I < _);
  }
  function me() {
    if (P !== null) {
      var R = e.unstable_now();
      I = R;
      var W = !0;
      try {
        W = P(!0, R);
      } finally {
        W ? fe() : ((w = !1), (P = null));
      }
    } else w = !1;
  }
  var fe;
  if (typeof h == "function")
    fe = function () {
      h(me);
    };
  else if (typeof MessageChannel < "u") {
    var Ae = new MessageChannel(),
      ge = Ae.port2;
    (Ae.port1.onmessage = me),
      (fe = function () {
        ge.postMessage(null);
      });
  } else
    fe = function () {
      k(me, 0);
    };
  function Z(R) {
    (P = R), w || ((w = !0), fe());
  }
  function X(R, W) {
    b = k(function () {
      R(e.unstable_now());
    }, W);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (R) {
      R.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      y || v || ((y = !0), Z(M));
    }),
    (e.unstable_forceFrameRate = function (R) {
      0 > R || 125 < R
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (_ = 0 < R ? Math.floor(1e3 / R) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return p;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(s);
    }),
    (e.unstable_next = function (R) {
      switch (p) {
        case 1:
        case 2:
        case 3:
          var W = 3;
          break;
        default:
          W = p;
      }
      var B = p;
      p = W;
      try {
        return R();
      } finally {
        p = B;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (R, W) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var B = p;
      p = R;
      try {
        return W();
      } finally {
        p = B;
      }
    }),
    (e.unstable_scheduleCallback = function (R, W, B) {
      var ae = e.unstable_now();
      switch (
        (typeof B == "object" && B !== null
          ? ((B = B.delay), (B = typeof B == "number" && 0 < B ? ae + B : ae))
          : (B = ae),
        R)
      ) {
        case 1:
          var he = -1;
          break;
        case 2:
          he = 250;
          break;
        case 5:
          he = 1073741823;
          break;
        case 4:
          he = 1e4;
          break;
        default:
          he = 5e3;
      }
      return (
        (he = B + he),
        (R = {
          id: c++,
          callback: W,
          priorityLevel: R,
          startTime: B,
          expirationTime: he,
          sortIndex: -1,
        }),
        B > ae
          ? ((R.sortIndex = B),
            t(u, R),
            n(s) === null &&
              R === n(u) &&
              (C ? (f(b), (b = -1)) : (C = !0), X(T, B - ae)))
          : ((R.sortIndex = he), t(s, R), y || v || ((y = !0), Z(M))),
        R
      );
    }),
    (e.unstable_shouldYield = G),
    (e.unstable_wrapCallback = function (R) {
      var W = p;
      return function () {
        var B = p;
        p = W;
        try {
          return R.apply(this, arguments);
        } finally {
          p = B;
        }
      };
    });
})(tm);
(function (e) {
  e.exports = tm;
})(em);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nm = S.exports,
  Lt = em.exports;
function O(e) {
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
var rm = new Set(),
  Ka = {};
function ti(e, t) {
  Ki(e, t), Ki(e + "Capture", t);
}
function Ki(e, t) {
  for (Ka[e] = t, e = 0; e < t.length; e++) rm.add(t[e]);
}
var _n = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Uu = Object.prototype.hasOwnProperty,
  Jg =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Uf = {},
  Af = {};
function Zg(e) {
  return Uu.call(Af, e)
    ? !0
    : Uu.call(Uf, e)
    ? !1
    : Jg.test(e)
    ? (Af[e] = !0)
    : ((Uf[e] = !0), !1);
}
function e0(e, t, n, r) {
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
function t0(e, t, n, r) {
  if (t === null || typeof t > "u" || e0(e, t, n, r)) return !0;
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
function gt(e, t, n, r, i, a, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = a),
    (this.removeEmptyString = o);
}
var lt = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    lt[e] = new gt(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  lt[t] = new gt(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  lt[e] = new gt(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  lt[e] = new gt(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    lt[e] = new gt(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  lt[e] = new gt(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  lt[e] = new gt(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  lt[e] = new gt(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  lt[e] = new gt(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var ud = /[\-:]([a-z])/g;
function cd(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ud, cd);
    lt[t] = new gt(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ud, cd);
    lt[t] = new gt(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(ud, cd);
  lt[t] = new gt(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  lt[e] = new gt(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
lt.xlinkHref = new gt(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  lt[e] = new gt(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function dd(e, t, n, r) {
  var i = lt.hasOwnProperty(t) ? lt[t] : null;
  (i !== null
    ? i.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (t0(t, n, i, r) && (n = null),
    r || i === null
      ? Zg(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : i.mustUseProperty
      ? (e[i.propertyName] = n === null ? (i.type === 3 ? !1 : "") : n)
      : ((t = i.attributeName),
        (r = i.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((i = i.type),
            (n = i === 3 || (i === 4 && n === !0) ? "" : "" + n),
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var An = nm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Qo = Symbol.for("react.element"),
  di = Symbol.for("react.portal"),
  fi = Symbol.for("react.fragment"),
  fd = Symbol.for("react.strict_mode"),
  Au = Symbol.for("react.profiler"),
  im = Symbol.for("react.provider"),
  am = Symbol.for("react.context"),
  hd = Symbol.for("react.forward_ref"),
  Iu = Symbol.for("react.suspense"),
  $u = Symbol.for("react.suspense_list"),
  pd = Symbol.for("react.memo"),
  Kn = Symbol.for("react.lazy"),
  om = Symbol.for("react.offscreen"),
  If = Symbol.iterator;
function ya(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (If && e[If]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Re = Object.assign,
  Xs;
function _a(e) {
  if (Xs === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Xs = (t && t[1]) || "";
    }
  return (
    `
` +
    Xs +
    e
  );
}
var Js = !1;
function Zs(e, t) {
  if (!e || Js) return "";
  Js = !0;
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
        var i = u.stack.split(`
`),
          a = r.stack.split(`
`),
          o = i.length - 1,
          l = a.length - 1;
        1 <= o && 0 <= l && i[o] !== a[l];

      )
        l--;
      for (; 1 <= o && 0 <= l; o--, l--)
        if (i[o] !== a[l]) {
          if (o !== 1 || l !== 1)
            do
              if ((o--, l--, 0 > l || i[o] !== a[l])) {
                var s =
                  `
` + i[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    s.includes("<anonymous>") &&
                    (s = s.replace("<anonymous>", e.displayName)),
                  s
                );
              }
            while (1 <= o && 0 <= l);
          break;
        }
    }
  } finally {
    (Js = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? _a(e) : "";
}
function n0(e) {
  switch (e.tag) {
    case 5:
      return _a(e.type);
    case 16:
      return _a("Lazy");
    case 13:
      return _a("Suspense");
    case 19:
      return _a("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Zs(e.type, !1)), e;
    case 11:
      return (e = Zs(e.type.render, !1)), e;
    case 1:
      return (e = Zs(e.type, !0)), e;
    default:
      return "";
  }
}
function ju(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case fi:
      return "Fragment";
    case di:
      return "Portal";
    case Au:
      return "Profiler";
    case fd:
      return "StrictMode";
    case Iu:
      return "Suspense";
    case $u:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case am:
        return (e.displayName || "Context") + ".Consumer";
      case im:
        return (e._context.displayName || "Context") + ".Provider";
      case hd:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case pd:
        return (
          (t = e.displayName || null), t !== null ? t : ju(e.type) || "Memo"
        );
      case Kn:
        (t = e._payload), (e = e._init);
        try {
          return ju(e(t));
        } catch {}
    }
  return null;
}
function r0(e) {
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
      return ju(t);
    case 8:
      return t === fd ? "StrictMode" : "Mode";
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
function wr(e) {
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
function lm(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function i0(e) {
  var t = lm(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var i = n.get,
      a = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return i.call(this);
        },
        set: function (o) {
          (r = "" + o), a.call(this, o);
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
function Yo(e) {
  e._valueTracker || (e._valueTracker = i0(e));
}
function sm(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = lm(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Dl(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function zu(e, t) {
  var n = t.checked;
  return Re({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n != null ? n : e._wrapperState.initialChecked,
  });
}
function $f(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = wr(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function um(e, t) {
  (t = t.checked), t != null && dd(e, "checked", t, !1);
}
function Hu(e, t) {
  um(e, t);
  var n = wr(t.value),
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
    ? Wu(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Wu(e, t.type, wr(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function jf(e, t, n) {
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
function Wu(e, t, n) {
  (t !== "number" || Dl(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var La = Array.isArray;
function Ei(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
    for (n = 0; n < e.length; n++)
      (i = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== i && (e[n].selected = i),
        i && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + wr(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        (e[i].selected = !0), r && (e[i].defaultSelected = !0);
        return;
      }
      t !== null || e[i].disabled || (t = e[i]);
    }
    t !== null && (t.selected = !0);
  }
}
function Bu(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(O(91));
  return Re({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function zf(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(O(92));
      if (La(n)) {
        if (1 < n.length) throw Error(O(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: wr(n) };
}
function cm(e, t) {
  var n = wr(t.value),
    r = wr(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Hf(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function dm(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Qu(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? dm(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var Vo,
  fm = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, i);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Vo = Vo || document.createElement("div"),
          Vo.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Vo.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Ga(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Ia = {
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
  a0 = ["Webkit", "ms", "Moz", "O"];
Object.keys(Ia).forEach(function (e) {
  a0.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Ia[t] = Ia[e]);
  });
});
function hm(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (Ia.hasOwnProperty(e) && Ia[e])
    ? ("" + t).trim()
    : t + "px";
}
function pm(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        i = hm(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, i) : (e[n] = i);
    }
}
var o0 = Re(
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
function Yu(e, t) {
  if (t) {
    if (o0[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(O(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(O(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(O(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(O(62));
  }
}
function Vu(e, t) {
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
var qu = null;
function md(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Ku = null,
  Ti = null,
  Pi = null;
function Wf(e) {
  if ((e = Lo(e))) {
    if (typeof Ku != "function") throw Error(O(280));
    var t = e.stateNode;
    t && ((t = vs(t)), Ku(e.stateNode, e.type, t));
  }
}
function mm(e) {
  Ti ? (Pi ? Pi.push(e) : (Pi = [e])) : (Ti = e);
}
function vm() {
  if (Ti) {
    var e = Ti,
      t = Pi;
    if (((Pi = Ti = null), Wf(e), t)) for (e = 0; e < t.length; e++) Wf(t[e]);
  }
}
function ym(e, t) {
  return e(t);
}
function gm() {}
var eu = !1;
function wm(e, t, n) {
  if (eu) return e(t, n);
  eu = !0;
  try {
    return ym(e, t, n);
  } finally {
    (eu = !1), (Ti !== null || Pi !== null) && (gm(), vm());
  }
}
function Xa(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = vs(n);
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
  if (n && typeof n != "function") throw Error(O(231, t, typeof n));
  return n;
}
var Gu = !1;
if (_n)
  try {
    var ga = {};
    Object.defineProperty(ga, "passive", {
      get: function () {
        Gu = !0;
      },
    }),
      window.addEventListener("test", ga, ga),
      window.removeEventListener("test", ga, ga);
  } catch {
    Gu = !1;
  }
function l0(e, t, n, r, i, a, o, l, s) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var $a = !1,
  bl = null,
  Nl = !1,
  Xu = null,
  s0 = {
    onError: function (e) {
      ($a = !0), (bl = e);
    },
  };
function u0(e, t, n, r, i, a, o, l, s) {
  ($a = !1), (bl = null), l0.apply(s0, arguments);
}
function c0(e, t, n, r, i, a, o, l, s) {
  if ((u0.apply(this, arguments), $a)) {
    if ($a) {
      var u = bl;
      ($a = !1), (bl = null);
    } else throw Error(O(198));
    Nl || ((Nl = !0), (Xu = u));
  }
}
function ni(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function xm(e) {
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
function Bf(e) {
  if (ni(e) !== e) throw Error(O(188));
}
function d0(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = ni(e)), t === null)) throw Error(O(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var i = n.return;
    if (i === null) break;
    var a = i.alternate;
    if (a === null) {
      if (((r = i.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === a.child) {
      for (a = i.child; a; ) {
        if (a === n) return Bf(i), e;
        if (a === r) return Bf(i), t;
        a = a.sibling;
      }
      throw Error(O(188));
    }
    if (n.return !== r.return) (n = i), (r = a);
    else {
      for (var o = !1, l = i.child; l; ) {
        if (l === n) {
          (o = !0), (n = i), (r = a);
          break;
        }
        if (l === r) {
          (o = !0), (r = i), (n = a);
          break;
        }
        l = l.sibling;
      }
      if (!o) {
        for (l = a.child; l; ) {
          if (l === n) {
            (o = !0), (n = a), (r = i);
            break;
          }
          if (l === r) {
            (o = !0), (r = a), (n = i);
            break;
          }
          l = l.sibling;
        }
        if (!o) throw Error(O(189));
      }
    }
    if (n.alternate !== r) throw Error(O(190));
  }
  if (n.tag !== 3) throw Error(O(188));
  return n.stateNode.current === n ? e : t;
}
function Sm(e) {
  return (e = d0(e)), e !== null ? km(e) : null;
}
function km(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = km(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Cm = Lt.unstable_scheduleCallback,
  Qf = Lt.unstable_cancelCallback,
  f0 = Lt.unstable_shouldYield,
  h0 = Lt.unstable_requestPaint,
  $e = Lt.unstable_now,
  p0 = Lt.unstable_getCurrentPriorityLevel,
  vd = Lt.unstable_ImmediatePriority,
  Em = Lt.unstable_UserBlockingPriority,
  Ml = Lt.unstable_NormalPriority,
  m0 = Lt.unstable_LowPriority,
  Tm = Lt.unstable_IdlePriority,
  fs = null,
  kn = null;
function v0(e) {
  if (kn && typeof kn.onCommitFiberRoot == "function")
    try {
      kn.onCommitFiberRoot(fs, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var an = Math.clz32 ? Math.clz32 : w0,
  y0 = Math.log,
  g0 = Math.LN2;
function w0(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((y0(e) / g0) | 0)) | 0;
}
var qo = 64,
  Ko = 4194304;
function Fa(e) {
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
function Ol(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    i = e.suspendedLanes,
    a = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var l = o & ~i;
    l !== 0 ? (r = Fa(l)) : ((a &= o), a !== 0 && (r = Fa(a)));
  } else (o = n & ~i), o !== 0 ? (r = Fa(o)) : a !== 0 && (r = Fa(a));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    (t & i) === 0 &&
    ((i = r & -r), (a = t & -t), i >= a || (i === 16 && (a & 4194240) !== 0))
  )
    return t;
  if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - an(t)), (i = 1 << n), (r |= e[n]), (t &= ~i);
  return r;
}
function x0(e, t) {
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
function S0(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      i = e.expirationTimes,
      a = e.pendingLanes;
    0 < a;

  ) {
    var o = 31 - an(a),
      l = 1 << o,
      s = i[o];
    s === -1
      ? ((l & n) === 0 || (l & r) !== 0) && (i[o] = x0(l, t))
      : s <= t && (e.expiredLanes |= l),
      (a &= ~l);
  }
}
function Ju(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Pm() {
  var e = qo;
  return (qo <<= 1), (qo & 4194240) === 0 && (qo = 64), e;
}
function tu(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ro(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - an(t)),
    (e[t] = n);
}
function k0(e, t) {
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
    var i = 31 - an(n),
      a = 1 << i;
    (t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~a);
  }
}
function yd(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - an(n),
      i = 1 << r;
    (i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i);
  }
}
var ye = 0;
function Dm(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
  );
}
var bm,
  gd,
  Nm,
  Mm,
  Om,
  Zu = !1,
  Go = [],
  cr = null,
  dr = null,
  fr = null,
  Ja = new Map(),
  Za = new Map(),
  Xn = [],
  C0 =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Yf(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      cr = null;
      break;
    case "dragenter":
    case "dragleave":
      dr = null;
      break;
    case "mouseover":
    case "mouseout":
      fr = null;
      break;
    case "pointerover":
    case "pointerout":
      Ja.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Za.delete(t.pointerId);
  }
}
function wa(e, t, n, r, i, a) {
  return e === null || e.nativeEvent !== a
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: a,
        targetContainers: [i],
      }),
      t !== null && ((t = Lo(t)), t !== null && gd(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      i !== null && t.indexOf(i) === -1 && t.push(i),
      e);
}
function E0(e, t, n, r, i) {
  switch (t) {
    case "focusin":
      return (cr = wa(cr, e, t, n, r, i)), !0;
    case "dragenter":
      return (dr = wa(dr, e, t, n, r, i)), !0;
    case "mouseover":
      return (fr = wa(fr, e, t, n, r, i)), !0;
    case "pointerover":
      var a = i.pointerId;
      return Ja.set(a, wa(Ja.get(a) || null, e, t, n, r, i)), !0;
    case "gotpointercapture":
      return (
        (a = i.pointerId), Za.set(a, wa(Za.get(a) || null, e, t, n, r, i)), !0
      );
  }
  return !1;
}
function Rm(e) {
  var t = Mr(e.target);
  if (t !== null) {
    var n = ni(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = xm(n)), t !== null)) {
          (e.blockedOn = t),
            Om(e.priority, function () {
              Nm(n);
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
function hl(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = ec(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (qu = r), n.target.dispatchEvent(r), (qu = null);
    } else return (t = Lo(n)), t !== null && gd(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function Vf(e, t, n) {
  hl(e) && n.delete(t);
}
function T0() {
  (Zu = !1),
    cr !== null && hl(cr) && (cr = null),
    dr !== null && hl(dr) && (dr = null),
    fr !== null && hl(fr) && (fr = null),
    Ja.forEach(Vf),
    Za.forEach(Vf);
}
function xa(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Zu ||
      ((Zu = !0),
      Lt.unstable_scheduleCallback(Lt.unstable_NormalPriority, T0)));
}
function eo(e) {
  function t(i) {
    return xa(i, e);
  }
  if (0 < Go.length) {
    xa(Go[0], e);
    for (var n = 1; n < Go.length; n++) {
      var r = Go[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    cr !== null && xa(cr, e),
      dr !== null && xa(dr, e),
      fr !== null && xa(fr, e),
      Ja.forEach(t),
      Za.forEach(t),
      n = 0;
    n < Xn.length;
    n++
  )
    (r = Xn[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Xn.length && ((n = Xn[0]), n.blockedOn === null); )
    Rm(n), n.blockedOn === null && Xn.shift();
}
var Di = An.ReactCurrentBatchConfig,
  Rl = !0;
function P0(e, t, n, r) {
  var i = ye,
    a = Di.transition;
  Di.transition = null;
  try {
    (ye = 1), wd(e, t, n, r);
  } finally {
    (ye = i), (Di.transition = a);
  }
}
function D0(e, t, n, r) {
  var i = ye,
    a = Di.transition;
  Di.transition = null;
  try {
    (ye = 4), wd(e, t, n, r);
  } finally {
    (ye = i), (Di.transition = a);
  }
}
function wd(e, t, n, r) {
  if (Rl) {
    var i = ec(e, t, n, r);
    if (i === null) du(e, t, r, _l, n), Yf(e, r);
    else if (E0(i, e, t, n, r)) r.stopPropagation();
    else if ((Yf(e, r), t & 4 && -1 < C0.indexOf(e))) {
      for (; i !== null; ) {
        var a = Lo(i);
        if (
          (a !== null && bm(a),
          (a = ec(e, t, n, r)),
          a === null && du(e, t, r, _l, n),
          a === i)
        )
          break;
        i = a;
      }
      i !== null && r.stopPropagation();
    } else du(e, t, r, null, n);
  }
}
var _l = null;
function ec(e, t, n, r) {
  if (((_l = null), (e = md(r)), (e = Mr(e)), e !== null))
    if (((t = ni(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = xm(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (_l = e), null;
}
function _m(e) {
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
      switch (p0()) {
        case vd:
          return 1;
        case Em:
          return 4;
        case Ml:
        case m0:
          return 16;
        case Tm:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var sr = null,
  xd = null,
  pl = null;
function Lm() {
  if (pl) return pl;
  var e,
    t = xd,
    n = t.length,
    r,
    i = "value" in sr ? sr.value : sr.textContent,
    a = i.length;
  for (e = 0; e < n && t[e] === i[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
  return (pl = i.slice(e, 1 < r ? 1 - r : void 0));
}
function ml(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Xo() {
  return !0;
}
function qf() {
  return !1;
}
function Ut(e) {
  function t(n, r, i, a, o) {
    (this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = a),
      (this.target = o),
      (this.currentTarget = null);
    for (var l in e)
      e.hasOwnProperty(l) && ((n = e[l]), (this[l] = n ? n(a) : a[l]));
    return (
      (this.isDefaultPrevented = (
        a.defaultPrevented != null ? a.defaultPrevented : a.returnValue === !1
      )
        ? Xo
        : qf),
      (this.isPropagationStopped = qf),
      this
    );
  }
  return (
    Re(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Xo));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Xo));
      },
      persist: function () {},
      isPersistent: Xo,
    }),
    t
  );
}
var la = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Sd = Ut(la),
  _o = Re({}, la, { view: 0, detail: 0 }),
  b0 = Ut(_o),
  nu,
  ru,
  Sa,
  hs = Re({}, _o, {
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
    getModifierState: kd,
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
        : (e !== Sa &&
            (Sa && e.type === "mousemove"
              ? ((nu = e.screenX - Sa.screenX), (ru = e.screenY - Sa.screenY))
              : (ru = nu = 0),
            (Sa = e)),
          nu);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ru;
    },
  }),
  Kf = Ut(hs),
  N0 = Re({}, hs, { dataTransfer: 0 }),
  M0 = Ut(N0),
  O0 = Re({}, _o, { relatedTarget: 0 }),
  iu = Ut(O0),
  R0 = Re({}, la, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  _0 = Ut(R0),
  L0 = Re({}, la, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  F0 = Ut(L0),
  U0 = Re({}, la, { data: 0 }),
  Gf = Ut(U0),
  A0 = {
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
  I0 = {
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
  $0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function j0(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = $0[e]) ? !!t[e] : !1;
}
function kd() {
  return j0;
}
var z0 = Re({}, _o, {
    key: function (e) {
      if (e.key) {
        var t = A0[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = ml(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? I0[e.keyCode] || "Unidentified"
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
    getModifierState: kd,
    charCode: function (e) {
      return e.type === "keypress" ? ml(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? ml(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  H0 = Ut(z0),
  W0 = Re({}, hs, {
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
  Xf = Ut(W0),
  B0 = Re({}, _o, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: kd,
  }),
  Q0 = Ut(B0),
  Y0 = Re({}, la, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  V0 = Ut(Y0),
  q0 = Re({}, hs, {
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
  K0 = Ut(q0),
  G0 = [9, 13, 27, 32],
  Cd = _n && "CompositionEvent" in window,
  ja = null;
_n && "documentMode" in document && (ja = document.documentMode);
var X0 = _n && "TextEvent" in window && !ja,
  Fm = _n && (!Cd || (ja && 8 < ja && 11 >= ja)),
  Jf = String.fromCharCode(32),
  Zf = !1;
function Um(e, t) {
  switch (e) {
    case "keyup":
      return G0.indexOf(t.keyCode) !== -1;
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
function Am(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var hi = !1;
function J0(e, t) {
  switch (e) {
    case "compositionend":
      return Am(t);
    case "keypress":
      return t.which !== 32 ? null : ((Zf = !0), Jf);
    case "textInput":
      return (e = t.data), e === Jf && Zf ? null : e;
    default:
      return null;
  }
}
function Z0(e, t) {
  if (hi)
    return e === "compositionend" || (!Cd && Um(e, t))
      ? ((e = Lm()), (pl = xd = sr = null), (hi = !1), e)
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
      return Fm && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var ew = {
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
function eh(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!ew[e.type] : t === "textarea";
}
function Im(e, t, n, r) {
  mm(r),
    (t = Ll(t, "onChange")),
    0 < t.length &&
      ((n = new Sd("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var za = null,
  to = null;
function tw(e) {
  Km(e, 0);
}
function ps(e) {
  var t = vi(e);
  if (sm(t)) return e;
}
function nw(e, t) {
  if (e === "change") return t;
}
var $m = !1;
if (_n) {
  var au;
  if (_n) {
    var ou = "oninput" in document;
    if (!ou) {
      var th = document.createElement("div");
      th.setAttribute("oninput", "return;"),
        (ou = typeof th.oninput == "function");
    }
    au = ou;
  } else au = !1;
  $m = au && (!document.documentMode || 9 < document.documentMode);
}
function nh() {
  za && (za.detachEvent("onpropertychange", jm), (to = za = null));
}
function jm(e) {
  if (e.propertyName === "value" && ps(to)) {
    var t = [];
    Im(t, to, e, md(e)), wm(tw, t);
  }
}
function rw(e, t, n) {
  e === "focusin"
    ? (nh(), (za = t), (to = n), za.attachEvent("onpropertychange", jm))
    : e === "focusout" && nh();
}
function iw(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return ps(to);
}
function aw(e, t) {
  if (e === "click") return ps(t);
}
function ow(e, t) {
  if (e === "input" || e === "change") return ps(t);
}
function lw(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var ln = typeof Object.is == "function" ? Object.is : lw;
function no(e, t) {
  if (ln(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Uu.call(t, i) || !ln(e[i], t[i])) return !1;
  }
  return !0;
}
function rh(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function ih(e, t) {
  var n = rh(e);
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
    n = rh(n);
  }
}
function zm(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? zm(e, t.parentNode)
      : "contains" in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1;
}
function Hm() {
  for (var e = window, t = Dl(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Dl(e.document);
  }
  return t;
}
function Ed(e) {
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
function sw(e) {
  var t = Hm(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    zm(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Ed(n)) {
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
        var i = n.textContent.length,
          a = Math.min(r.start, i);
        (r = r.end === void 0 ? a : Math.min(r.end, i)),
          !e.extend && a > r && ((i = r), (r = a), (a = i)),
          (i = ih(n, a));
        var o = ih(n, r);
        i &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(i.node, i.offset),
          e.removeAllRanges(),
          a > r
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
var uw = _n && "documentMode" in document && 11 >= document.documentMode,
  pi = null,
  tc = null,
  Ha = null,
  nc = !1;
function ah(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  nc ||
    pi == null ||
    pi !== Dl(r) ||
    ((r = pi),
    "selectionStart" in r && Ed(r)
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
    (Ha && no(Ha, r)) ||
      ((Ha = r),
      (r = Ll(tc, "onSelect")),
      0 < r.length &&
        ((t = new Sd("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = pi))));
}
function Jo(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var mi = {
    animationend: Jo("Animation", "AnimationEnd"),
    animationiteration: Jo("Animation", "AnimationIteration"),
    animationstart: Jo("Animation", "AnimationStart"),
    transitionend: Jo("Transition", "TransitionEnd"),
  },
  lu = {},
  Wm = {};
_n &&
  ((Wm = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete mi.animationend.animation,
    delete mi.animationiteration.animation,
    delete mi.animationstart.animation),
  "TransitionEvent" in window || delete mi.transitionend.transition);
function ms(e) {
  if (lu[e]) return lu[e];
  if (!mi[e]) return e;
  var t = mi[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Wm) return (lu[e] = t[n]);
  return e;
}
var Bm = ms("animationend"),
  Qm = ms("animationiteration"),
  Ym = ms("animationstart"),
  Vm = ms("transitionend"),
  qm = new Map(),
  oh =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function Sr(e, t) {
  qm.set(e, t), ti(t, [e]);
}
for (var su = 0; su < oh.length; su++) {
  var uu = oh[su],
    cw = uu.toLowerCase(),
    dw = uu[0].toUpperCase() + uu.slice(1);
  Sr(cw, "on" + dw);
}
Sr(Bm, "onAnimationEnd");
Sr(Qm, "onAnimationIteration");
Sr(Ym, "onAnimationStart");
Sr("dblclick", "onDoubleClick");
Sr("focusin", "onFocus");
Sr("focusout", "onBlur");
Sr(Vm, "onTransitionEnd");
Ki("onMouseEnter", ["mouseout", "mouseover"]);
Ki("onMouseLeave", ["mouseout", "mouseover"]);
Ki("onPointerEnter", ["pointerout", "pointerover"]);
Ki("onPointerLeave", ["pointerout", "pointerover"]);
ti(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
ti(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
ti("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
ti(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
ti(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
ti(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var Ua =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  fw = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ua));
function lh(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), c0(r, t, void 0, e), (e.currentTarget = null);
}
function Km(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      i = r.event;
    r = r.listeners;
    e: {
      var a = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var l = r[o],
            s = l.instance,
            u = l.currentTarget;
          if (((l = l.listener), s !== a && i.isPropagationStopped())) break e;
          lh(i, l, u), (a = s);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((l = r[o]),
            (s = l.instance),
            (u = l.currentTarget),
            (l = l.listener),
            s !== a && i.isPropagationStopped())
          )
            break e;
          lh(i, l, u), (a = s);
        }
    }
  }
  if (Nl) throw ((e = Xu), (Nl = !1), (Xu = null), e);
}
function Ee(e, t) {
  var n = t[lc];
  n === void 0 && (n = t[lc] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Gm(t, e, 2, !1), n.add(r));
}
function cu(e, t, n) {
  var r = 0;
  t && (r |= 4), Gm(n, e, r, t);
}
var Zo = "_reactListening" + Math.random().toString(36).slice(2);
function ro(e) {
  if (!e[Zo]) {
    (e[Zo] = !0),
      rm.forEach(function (n) {
        n !== "selectionchange" && (fw.has(n) || cu(n, !1, e), cu(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Zo] || ((t[Zo] = !0), cu("selectionchange", !1, t));
  }
}
function Gm(e, t, n, r) {
  switch (_m(t)) {
    case 1:
      var i = P0;
      break;
    case 4:
      i = D0;
      break;
    default:
      i = wd;
  }
  (n = i.bind(null, t, n, e)),
    (i = void 0),
    !Gu ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (i = !0),
    r
      ? i !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: i })
        : e.addEventListener(t, n, !0)
      : i !== void 0
      ? e.addEventListener(t, n, { passive: i })
      : e.addEventListener(t, n, !1);
}
function du(e, t, n, r, i) {
  var a = r;
  if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var l = r.stateNode.containerInfo;
        if (l === i || (l.nodeType === 8 && l.parentNode === i)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var s = o.tag;
            if (
              (s === 3 || s === 4) &&
              ((s = o.stateNode.containerInfo),
              s === i || (s.nodeType === 8 && s.parentNode === i))
            )
              return;
            o = o.return;
          }
        for (; l !== null; ) {
          if (((o = Mr(l)), o === null)) return;
          if (((s = o.tag), s === 5 || s === 6)) {
            r = a = o;
            continue e;
          }
          l = l.parentNode;
        }
      }
      r = r.return;
    }
  wm(function () {
    var u = a,
      c = md(n),
      d = [];
    e: {
      var p = qm.get(e);
      if (p !== void 0) {
        var v = Sd,
          y = e;
        switch (e) {
          case "keypress":
            if (ml(n) === 0) break e;
          case "keydown":
          case "keyup":
            v = H0;
            break;
          case "focusin":
            (y = "focus"), (v = iu);
            break;
          case "focusout":
            (y = "blur"), (v = iu);
            break;
          case "beforeblur":
          case "afterblur":
            v = iu;
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
            v = Kf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = M0;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = Q0;
            break;
          case Bm:
          case Qm:
          case Ym:
            v = _0;
            break;
          case Vm:
            v = V0;
            break;
          case "scroll":
            v = b0;
            break;
          case "wheel":
            v = K0;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = F0;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = Xf;
        }
        var C = (t & 4) !== 0,
          k = !C && e === "scroll",
          f = C ? (p !== null ? p + "Capture" : null) : p;
        C = [];
        for (var h = u, g; h !== null; ) {
          g = h;
          var T = g.stateNode;
          if (
            (g.tag === 5 &&
              T !== null &&
              ((g = T),
              f !== null && ((T = Xa(h, f)), T != null && C.push(io(h, T, g)))),
            k)
          )
            break;
          h = h.return;
        }
        0 < C.length &&
          ((p = new v(p, y, null, n, c)), d.push({ event: p, listeners: C }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((p = e === "mouseover" || e === "pointerover"),
          (v = e === "mouseout" || e === "pointerout"),
          p &&
            n !== qu &&
            (y = n.relatedTarget || n.fromElement) &&
            (Mr(y) || y[Ln]))
        )
          break e;
        if (
          (v || p) &&
          ((p =
            c.window === c
              ? c
              : (p = c.ownerDocument)
              ? p.defaultView || p.parentWindow
              : window),
          v
            ? ((y = n.relatedTarget || n.toElement),
              (v = u),
              (y = y ? Mr(y) : null),
              y !== null &&
                ((k = ni(y)), y !== k || (y.tag !== 5 && y.tag !== 6)) &&
                (y = null))
            : ((v = null), (y = u)),
          v !== y)
        ) {
          if (
            ((C = Kf),
            (T = "onMouseLeave"),
            (f = "onMouseEnter"),
            (h = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((C = Xf),
              (T = "onPointerLeave"),
              (f = "onPointerEnter"),
              (h = "pointer")),
            (k = v == null ? p : vi(v)),
            (g = y == null ? p : vi(y)),
            (p = new C(T, h + "leave", v, n, c)),
            (p.target = k),
            (p.relatedTarget = g),
            (T = null),
            Mr(c) === u &&
              ((C = new C(f, h + "enter", y, n, c)),
              (C.target = g),
              (C.relatedTarget = k),
              (T = C)),
            (k = T),
            v && y)
          )
            t: {
              for (C = v, f = y, h = 0, g = C; g; g = si(g)) h++;
              for (g = 0, T = f; T; T = si(T)) g++;
              for (; 0 < h - g; ) (C = si(C)), h--;
              for (; 0 < g - h; ) (f = si(f)), g--;
              for (; h--; ) {
                if (C === f || (f !== null && C === f.alternate)) break t;
                (C = si(C)), (f = si(f));
              }
              C = null;
            }
          else C = null;
          v !== null && sh(d, p, v, C, !1),
            y !== null && k !== null && sh(d, k, y, C, !0);
        }
      }
      e: {
        if (
          ((p = u ? vi(u) : window),
          (v = p.nodeName && p.nodeName.toLowerCase()),
          v === "select" || (v === "input" && p.type === "file"))
        )
          var M = nw;
        else if (eh(p))
          if ($m) M = ow;
          else {
            M = iw;
            var w = rw;
          }
        else
          (v = p.nodeName) &&
            v.toLowerCase() === "input" &&
            (p.type === "checkbox" || p.type === "radio") &&
            (M = aw);
        if (M && (M = M(e, u))) {
          Im(d, M, n, c);
          break e;
        }
        w && w(e, p, u),
          e === "focusout" &&
            (w = p._wrapperState) &&
            w.controlled &&
            p.type === "number" &&
            Wu(p, "number", p.value);
      }
      switch (((w = u ? vi(u) : window), e)) {
        case "focusin":
          (eh(w) || w.contentEditable === "true") &&
            ((pi = w), (tc = u), (Ha = null));
          break;
        case "focusout":
          Ha = tc = pi = null;
          break;
        case "mousedown":
          nc = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (nc = !1), ah(d, n, c);
          break;
        case "selectionchange":
          if (uw) break;
        case "keydown":
        case "keyup":
          ah(d, n, c);
      }
      var P;
      if (Cd)
        e: {
          switch (e) {
            case "compositionstart":
              var b = "onCompositionStart";
              break e;
            case "compositionend":
              b = "onCompositionEnd";
              break e;
            case "compositionupdate":
              b = "onCompositionUpdate";
              break e;
          }
          b = void 0;
        }
      else
        hi
          ? Um(e, n) && (b = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
      b &&
        (Fm &&
          n.locale !== "ko" &&
          (hi || b !== "onCompositionStart"
            ? b === "onCompositionEnd" && hi && (P = Lm())
            : ((sr = c),
              (xd = "value" in sr ? sr.value : sr.textContent),
              (hi = !0))),
        (w = Ll(u, b)),
        0 < w.length &&
          ((b = new Gf(b, e, null, n, c)),
          d.push({ event: b, listeners: w }),
          P ? (b.data = P) : ((P = Am(n)), P !== null && (b.data = P)))),
        (P = X0 ? J0(e, n) : Z0(e, n)) &&
          ((u = Ll(u, "onBeforeInput")),
          0 < u.length &&
            ((c = new Gf("onBeforeInput", "beforeinput", null, n, c)),
            d.push({ event: c, listeners: u }),
            (c.data = P)));
    }
    Km(d, t);
  });
}
function io(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Ll(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var i = e,
      a = i.stateNode;
    i.tag === 5 &&
      a !== null &&
      ((i = a),
      (a = Xa(e, n)),
      a != null && r.unshift(io(e, a, i)),
      (a = Xa(e, t)),
      a != null && r.push(io(e, a, i))),
      (e = e.return);
  }
  return r;
}
function si(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function sh(e, t, n, r, i) {
  for (var a = t._reactName, o = []; n !== null && n !== r; ) {
    var l = n,
      s = l.alternate,
      u = l.stateNode;
    if (s !== null && s === r) break;
    l.tag === 5 &&
      u !== null &&
      ((l = u),
      i
        ? ((s = Xa(n, a)), s != null && o.unshift(io(n, s, l)))
        : i || ((s = Xa(n, a)), s != null && o.push(io(n, s, l)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var hw = /\r\n?/g,
  pw = /\u0000|\uFFFD/g;
function uh(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      hw,
      `
`,
    )
    .replace(pw, "");
}
function el(e, t, n) {
  if (((t = uh(t)), uh(e) !== t && n)) throw Error(O(425));
}
function Fl() {}
var rc = null,
  ic = null;
function ac(e, t) {
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
var oc = typeof setTimeout == "function" ? setTimeout : void 0,
  mw = typeof clearTimeout == "function" ? clearTimeout : void 0,
  ch = typeof Promise == "function" ? Promise : void 0,
  vw =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof ch < "u"
      ? function (e) {
          return ch.resolve(null).then(e).catch(yw);
        }
      : oc;
function yw(e) {
  setTimeout(function () {
    throw e;
  });
}
function fu(e, t) {
  var n = t,
    r = 0;
  do {
    var i = n.nextSibling;
    if ((e.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(i), eo(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = i;
  } while (n);
  eo(t);
}
function hr(e) {
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
function dh(e) {
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
var sa = Math.random().toString(36).slice(2),
  wn = "__reactFiber$" + sa,
  ao = "__reactProps$" + sa,
  Ln = "__reactContainer$" + sa,
  lc = "__reactEvents$" + sa,
  gw = "__reactListeners$" + sa,
  ww = "__reactHandles$" + sa;
function Mr(e) {
  var t = e[wn];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Ln] || n[wn])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = dh(e); e !== null; ) {
          if ((n = e[wn])) return n;
          e = dh(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Lo(e) {
  return (
    (e = e[wn] || e[Ln]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function vi(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(O(33));
}
function vs(e) {
  return e[ao] || null;
}
var sc = [],
  yi = -1;
function kr(e) {
  return { current: e };
}
function Te(e) {
  0 > yi || ((e.current = sc[yi]), (sc[yi] = null), yi--);
}
function Ce(e, t) {
  yi++, (sc[yi] = e.current), (e.current = t);
}
var xr = {},
  ht = kr(xr),
  Et = kr(!1),
  Yr = xr;
function Gi(e, t) {
  var n = e.type.contextTypes;
  if (!n) return xr;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var i = {},
    a;
  for (a in n) i[a] = t[a];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    i
  );
}
function Tt(e) {
  return (e = e.childContextTypes), e != null;
}
function Ul() {
  Te(Et), Te(ht);
}
function fh(e, t, n) {
  if (ht.current !== xr) throw Error(O(168));
  Ce(ht, t), Ce(Et, n);
}
function Xm(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in t)) throw Error(O(108, r0(e) || "Unknown", i));
  return Re({}, n, r);
}
function Al(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || xr),
    (Yr = ht.current),
    Ce(ht, e),
    Ce(Et, Et.current),
    !0
  );
}
function hh(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(O(169));
  n
    ? ((e = Xm(e, t, Yr)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      Te(Et),
      Te(ht),
      Ce(ht, e))
    : Te(Et),
    Ce(Et, n);
}
var Pn = null,
  ys = !1,
  hu = !1;
function Jm(e) {
  Pn === null ? (Pn = [e]) : Pn.push(e);
}
function xw(e) {
  (ys = !0), Jm(e);
}
function Cr() {
  if (!hu && Pn !== null) {
    hu = !0;
    var e = 0,
      t = ye;
    try {
      var n = Pn;
      for (ye = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Pn = null), (ys = !1);
    } catch (i) {
      throw (Pn !== null && (Pn = Pn.slice(e + 1)), Cm(vd, Cr), i);
    } finally {
      (ye = t), (hu = !1);
    }
  }
  return null;
}
var gi = [],
  wi = 0,
  Il = null,
  $l = 0,
  Qt = [],
  Yt = 0,
  Vr = null,
  bn = 1,
  Nn = "";
function Dr(e, t) {
  (gi[wi++] = $l), (gi[wi++] = Il), (Il = e), ($l = t);
}
function Zm(e, t, n) {
  (Qt[Yt++] = bn), (Qt[Yt++] = Nn), (Qt[Yt++] = Vr), (Vr = e);
  var r = bn;
  e = Nn;
  var i = 32 - an(r) - 1;
  (r &= ~(1 << i)), (n += 1);
  var a = 32 - an(t) + i;
  if (30 < a) {
    var o = i - (i % 5);
    (a = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (i -= o),
      (bn = (1 << (32 - an(t) + i)) | (n << i) | r),
      (Nn = a + e);
  } else (bn = (1 << a) | (n << i) | r), (Nn = e);
}
function Td(e) {
  e.return !== null && (Dr(e, 1), Zm(e, 1, 0));
}
function Pd(e) {
  for (; e === Il; )
    (Il = gi[--wi]), (gi[wi] = null), ($l = gi[--wi]), (gi[wi] = null);
  for (; e === Vr; )
    (Vr = Qt[--Yt]),
      (Qt[Yt] = null),
      (Nn = Qt[--Yt]),
      (Qt[Yt] = null),
      (bn = Qt[--Yt]),
      (Qt[Yt] = null);
}
var _t = null,
  Rt = null,
  De = !1,
  rn = null;
function ev(e, t) {
  var n = Vt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function ph(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (_t = e), (Rt = hr(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (_t = e), (Rt = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Vr !== null ? { id: bn, overflow: Nn } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Vt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (_t = e),
            (Rt = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function uc(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function cc(e) {
  if (De) {
    var t = Rt;
    if (t) {
      var n = t;
      if (!ph(e, t)) {
        if (uc(e)) throw Error(O(418));
        t = hr(n.nextSibling);
        var r = _t;
        t && ph(e, t)
          ? ev(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (De = !1), (_t = e));
      }
    } else {
      if (uc(e)) throw Error(O(418));
      (e.flags = (e.flags & -4097) | 2), (De = !1), (_t = e);
    }
  }
}
function mh(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  _t = e;
}
function tl(e) {
  if (e !== _t) return !1;
  if (!De) return mh(e), (De = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !ac(e.type, e.memoizedProps))),
    t && (t = Rt))
  ) {
    if (uc(e)) throw (tv(), Error(O(418)));
    for (; t; ) ev(e, t), (t = hr(t.nextSibling));
  }
  if ((mh(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(O(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Rt = hr(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Rt = null;
    }
  } else Rt = _t ? hr(e.stateNode.nextSibling) : null;
  return !0;
}
function tv() {
  for (var e = Rt; e; ) e = hr(e.nextSibling);
}
function Xi() {
  (Rt = _t = null), (De = !1);
}
function Dd(e) {
  rn === null ? (rn = [e]) : rn.push(e);
}
var Sw = An.ReactCurrentBatchConfig;
function Zt(e, t) {
  if (e && e.defaultProps) {
    (t = Re({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var jl = kr(null),
  zl = null,
  xi = null,
  bd = null;
function Nd() {
  bd = xi = zl = null;
}
function Md(e) {
  var t = jl.current;
  Te(jl), (e._currentValue = t);
}
function dc(e, t, n) {
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
function bi(e, t) {
  (zl = e),
    (bd = xi = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (Ct = !0), (e.firstContext = null));
}
function Kt(e) {
  var t = e._currentValue;
  if (bd !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), xi === null)) {
      if (zl === null) throw Error(O(308));
      (xi = e), (zl.dependencies = { lanes: 0, firstContext: e });
    } else xi = xi.next = e;
  return t;
}
var Or = null;
function Od(e) {
  Or === null ? (Or = [e]) : Or.push(e);
}
function nv(e, t, n, r) {
  var i = t.interleaved;
  return (
    i === null ? ((n.next = n), Od(t)) : ((n.next = i.next), (i.next = n)),
    (t.interleaved = n),
    Fn(e, r)
  );
}
function Fn(e, t) {
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
var Gn = !1;
function Rd(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function rv(e, t) {
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
function On(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function pr(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), (ue & 2) !== 0)) {
    var i = r.pending;
    return (
      i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
      (r.pending = t),
      Fn(e, n)
    );
  }
  return (
    (i = r.interleaved),
    i === null ? ((t.next = t), Od(r)) : ((t.next = i.next), (i.next = t)),
    (r.interleaved = t),
    Fn(e, n)
  );
}
function vl(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), yd(e, n);
  }
}
function vh(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var i = null,
      a = null;
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
        a === null ? (i = a = o) : (a = a.next = o), (n = n.next);
      } while (n !== null);
      a === null ? (i = a = t) : (a = a.next = t);
    } else i = a = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: a,
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
function Hl(e, t, n, r) {
  var i = e.updateQueue;
  Gn = !1;
  var a = i.firstBaseUpdate,
    o = i.lastBaseUpdate,
    l = i.shared.pending;
  if (l !== null) {
    i.shared.pending = null;
    var s = l,
      u = s.next;
    (s.next = null), o === null ? (a = u) : (o.next = u), (o = s);
    var c = e.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (l = c.lastBaseUpdate),
      l !== o &&
        (l === null ? (c.firstBaseUpdate = u) : (l.next = u),
        (c.lastBaseUpdate = s)));
  }
  if (a !== null) {
    var d = i.baseState;
    (o = 0), (c = u = s = null), (l = a);
    do {
      var p = l.lane,
        v = l.eventTime;
      if ((r & p) === p) {
        c !== null &&
          (c = c.next =
            {
              eventTime: v,
              lane: 0,
              tag: l.tag,
              payload: l.payload,
              callback: l.callback,
              next: null,
            });
        e: {
          var y = e,
            C = l;
          switch (((p = t), (v = n), C.tag)) {
            case 1:
              if (((y = C.payload), typeof y == "function")) {
                d = y.call(v, d, p);
                break e;
              }
              d = y;
              break e;
            case 3:
              y.flags = (y.flags & -65537) | 128;
            case 0:
              if (
                ((y = C.payload),
                (p = typeof y == "function" ? y.call(v, d, p) : y),
                p == null)
              )
                break e;
              d = Re({}, d, p);
              break e;
            case 2:
              Gn = !0;
          }
        }
        l.callback !== null &&
          l.lane !== 0 &&
          ((e.flags |= 64),
          (p = i.effects),
          p === null ? (i.effects = [l]) : p.push(l));
      } else
        (v = {
          eventTime: v,
          lane: p,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null,
        }),
          c === null ? ((u = c = v), (s = d)) : (c = c.next = v),
          (o |= p);
      if (((l = l.next), l === null)) {
        if (((l = i.shared.pending), l === null)) break;
        (p = l),
          (l = p.next),
          (p.next = null),
          (i.lastBaseUpdate = p),
          (i.shared.pending = null);
      }
    } while (1);
    if (
      (c === null && (s = d),
      (i.baseState = s),
      (i.firstBaseUpdate = u),
      (i.lastBaseUpdate = c),
      (t = i.shared.interleaved),
      t !== null)
    ) {
      i = t;
      do (o |= i.lane), (i = i.next);
      while (i !== t);
    } else a === null && (i.shared.lanes = 0);
    (Kr |= o), (e.lanes = o), (e.memoizedState = d);
  }
}
function yh(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        i = r.callback;
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != "function"))
          throw Error(O(191, i));
        i.call(r);
      }
    }
}
var iv = new nm.Component().refs;
function fc(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Re({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var gs = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? ni(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = vt(),
      i = vr(e),
      a = On(r, i);
    (a.payload = t),
      n != null && (a.callback = n),
      (t = pr(e, a, i)),
      t !== null && (on(t, e, i, r), vl(t, e, i));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = vt(),
      i = vr(e),
      a = On(r, i);
    (a.tag = 1),
      (a.payload = t),
      n != null && (a.callback = n),
      (t = pr(e, a, i)),
      t !== null && (on(t, e, i, r), vl(t, e, i));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = vt(),
      r = vr(e),
      i = On(n, r);
    (i.tag = 2),
      t != null && (i.callback = t),
      (t = pr(e, i, r)),
      t !== null && (on(t, e, r, n), vl(t, e, r));
  },
};
function gh(e, t, n, r, i, a, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, a, o)
      : t.prototype && t.prototype.isPureReactComponent
      ? !no(n, r) || !no(i, a)
      : !0
  );
}
function av(e, t, n) {
  var r = !1,
    i = xr,
    a = t.contextType;
  return (
    typeof a == "object" && a !== null
      ? (a = Kt(a))
      : ((i = Tt(t) ? Yr : ht.current),
        (r = t.contextTypes),
        (a = (r = r != null) ? Gi(e, i) : xr)),
    (t = new t(n, a)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = gs),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = a)),
    t
  );
}
function wh(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && gs.enqueueReplaceState(t, t.state, null);
}
function hc(e, t, n, r) {
  var i = e.stateNode;
  (i.props = n), (i.state = e.memoizedState), (i.refs = iv), Rd(e);
  var a = t.contextType;
  typeof a == "object" && a !== null
    ? (i.context = Kt(a))
    : ((a = Tt(t) ? Yr : ht.current), (i.context = Gi(e, a))),
    (i.state = e.memoizedState),
    (a = t.getDerivedStateFromProps),
    typeof a == "function" && (fc(e, t, a, n), (i.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function" ||
      (typeof i.UNSAFE_componentWillMount != "function" &&
        typeof i.componentWillMount != "function") ||
      ((t = i.state),
      typeof i.componentWillMount == "function" && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == "function" &&
        i.UNSAFE_componentWillMount(),
      t !== i.state && gs.enqueueReplaceState(i, i.state, null),
      Hl(e, n, i, r),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == "function" && (e.flags |= 4194308);
}
function ka(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(O(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(O(147, e));
      var i = r,
        a = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === a
        ? t.ref
        : ((t = function (o) {
            var l = i.refs;
            l === iv && (l = i.refs = {}),
              o === null ? delete l[a] : (l[a] = o);
          }),
          (t._stringRef = a),
          t);
    }
    if (typeof e != "string") throw Error(O(284));
    if (!n._owner) throw Error(O(290, e));
  }
  return e;
}
function nl(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      O(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    ))
  );
}
function xh(e) {
  var t = e._init;
  return t(e._payload);
}
function ov(e) {
  function t(f, h) {
    if (e) {
      var g = f.deletions;
      g === null ? ((f.deletions = [h]), (f.flags |= 16)) : g.push(h);
    }
  }
  function n(f, h) {
    if (!e) return null;
    for (; h !== null; ) t(f, h), (h = h.sibling);
    return null;
  }
  function r(f, h) {
    for (f = new Map(); h !== null; )
      h.key !== null ? f.set(h.key, h) : f.set(h.index, h), (h = h.sibling);
    return f;
  }
  function i(f, h) {
    return (f = yr(f, h)), (f.index = 0), (f.sibling = null), f;
  }
  function a(f, h, g) {
    return (
      (f.index = g),
      e
        ? ((g = f.alternate),
          g !== null
            ? ((g = g.index), g < h ? ((f.flags |= 2), h) : g)
            : ((f.flags |= 2), h))
        : ((f.flags |= 1048576), h)
    );
  }
  function o(f) {
    return e && f.alternate === null && (f.flags |= 2), f;
  }
  function l(f, h, g, T) {
    return h === null || h.tag !== 6
      ? ((h = xu(g, f.mode, T)), (h.return = f), h)
      : ((h = i(h, g)), (h.return = f), h);
  }
  function s(f, h, g, T) {
    var M = g.type;
    return M === fi
      ? c(f, h, g.props.children, T, g.key)
      : h !== null &&
        (h.elementType === M ||
          (typeof M == "object" &&
            M !== null &&
            M.$$typeof === Kn &&
            xh(M) === h.type))
      ? ((T = i(h, g.props)), (T.ref = ka(f, h, g)), (T.return = f), T)
      : ((T = kl(g.type, g.key, g.props, null, f.mode, T)),
        (T.ref = ka(f, h, g)),
        (T.return = f),
        T);
  }
  function u(f, h, g, T) {
    return h === null ||
      h.tag !== 4 ||
      h.stateNode.containerInfo !== g.containerInfo ||
      h.stateNode.implementation !== g.implementation
      ? ((h = Su(g, f.mode, T)), (h.return = f), h)
      : ((h = i(h, g.children || [])), (h.return = f), h);
  }
  function c(f, h, g, T, M) {
    return h === null || h.tag !== 7
      ? ((h = Qr(g, f.mode, T, M)), (h.return = f), h)
      : ((h = i(h, g)), (h.return = f), h);
  }
  function d(f, h, g) {
    if ((typeof h == "string" && h !== "") || typeof h == "number")
      return (h = xu("" + h, f.mode, g)), (h.return = f), h;
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Qo:
          return (
            (g = kl(h.type, h.key, h.props, null, f.mode, g)),
            (g.ref = ka(f, null, h)),
            (g.return = f),
            g
          );
        case di:
          return (h = Su(h, f.mode, g)), (h.return = f), h;
        case Kn:
          var T = h._init;
          return d(f, T(h._payload), g);
      }
      if (La(h) || ya(h))
        return (h = Qr(h, f.mode, g, null)), (h.return = f), h;
      nl(f, h);
    }
    return null;
  }
  function p(f, h, g, T) {
    var M = h !== null ? h.key : null;
    if ((typeof g == "string" && g !== "") || typeof g == "number")
      return M !== null ? null : l(f, h, "" + g, T);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case Qo:
          return g.key === M ? s(f, h, g, T) : null;
        case di:
          return g.key === M ? u(f, h, g, T) : null;
        case Kn:
          return (M = g._init), p(f, h, M(g._payload), T);
      }
      if (La(g) || ya(g)) return M !== null ? null : c(f, h, g, T, null);
      nl(f, g);
    }
    return null;
  }
  function v(f, h, g, T, M) {
    if ((typeof T == "string" && T !== "") || typeof T == "number")
      return (f = f.get(g) || null), l(h, f, "" + T, M);
    if (typeof T == "object" && T !== null) {
      switch (T.$$typeof) {
        case Qo:
          return (f = f.get(T.key === null ? g : T.key) || null), s(h, f, T, M);
        case di:
          return (f = f.get(T.key === null ? g : T.key) || null), u(h, f, T, M);
        case Kn:
          var w = T._init;
          return v(f, h, g, w(T._payload), M);
      }
      if (La(T) || ya(T)) return (f = f.get(g) || null), c(h, f, T, M, null);
      nl(h, T);
    }
    return null;
  }
  function y(f, h, g, T) {
    for (
      var M = null, w = null, P = h, b = (h = 0), _ = null;
      P !== null && b < g.length;
      b++
    ) {
      P.index > b ? ((_ = P), (P = null)) : (_ = P.sibling);
      var I = p(f, P, g[b], T);
      if (I === null) {
        P === null && (P = _);
        break;
      }
      e && P && I.alternate === null && t(f, P),
        (h = a(I, h, b)),
        w === null ? (M = I) : (w.sibling = I),
        (w = I),
        (P = _);
    }
    if (b === g.length) return n(f, P), De && Dr(f, b), M;
    if (P === null) {
      for (; b < g.length; b++)
        (P = d(f, g[b], T)),
          P !== null &&
            ((h = a(P, h, b)), w === null ? (M = P) : (w.sibling = P), (w = P));
      return De && Dr(f, b), M;
    }
    for (P = r(f, P); b < g.length; b++)
      (_ = v(P, f, b, g[b], T)),
        _ !== null &&
          (e && _.alternate !== null && P.delete(_.key === null ? b : _.key),
          (h = a(_, h, b)),
          w === null ? (M = _) : (w.sibling = _),
          (w = _));
    return (
      e &&
        P.forEach(function (G) {
          return t(f, G);
        }),
      De && Dr(f, b),
      M
    );
  }
  function C(f, h, g, T) {
    var M = ya(g);
    if (typeof M != "function") throw Error(O(150));
    if (((g = M.call(g)), g == null)) throw Error(O(151));
    for (
      var w = (M = null), P = h, b = (h = 0), _ = null, I = g.next();
      P !== null && !I.done;
      b++, I = g.next()
    ) {
      P.index > b ? ((_ = P), (P = null)) : (_ = P.sibling);
      var G = p(f, P, I.value, T);
      if (G === null) {
        P === null && (P = _);
        break;
      }
      e && P && G.alternate === null && t(f, P),
        (h = a(G, h, b)),
        w === null ? (M = G) : (w.sibling = G),
        (w = G),
        (P = _);
    }
    if (I.done) return n(f, P), De && Dr(f, b), M;
    if (P === null) {
      for (; !I.done; b++, I = g.next())
        (I = d(f, I.value, T)),
          I !== null &&
            ((h = a(I, h, b)), w === null ? (M = I) : (w.sibling = I), (w = I));
      return De && Dr(f, b), M;
    }
    for (P = r(f, P); !I.done; b++, I = g.next())
      (I = v(P, f, b, I.value, T)),
        I !== null &&
          (e && I.alternate !== null && P.delete(I.key === null ? b : I.key),
          (h = a(I, h, b)),
          w === null ? (M = I) : (w.sibling = I),
          (w = I));
    return (
      e &&
        P.forEach(function (me) {
          return t(f, me);
        }),
      De && Dr(f, b),
      M
    );
  }
  function k(f, h, g, T) {
    if (
      (typeof g == "object" &&
        g !== null &&
        g.type === fi &&
        g.key === null &&
        (g = g.props.children),
      typeof g == "object" && g !== null)
    ) {
      switch (g.$$typeof) {
        case Qo:
          e: {
            for (var M = g.key, w = h; w !== null; ) {
              if (w.key === M) {
                if (((M = g.type), M === fi)) {
                  if (w.tag === 7) {
                    n(f, w.sibling),
                      (h = i(w, g.props.children)),
                      (h.return = f),
                      (f = h);
                    break e;
                  }
                } else if (
                  w.elementType === M ||
                  (typeof M == "object" &&
                    M !== null &&
                    M.$$typeof === Kn &&
                    xh(M) === w.type)
                ) {
                  n(f, w.sibling),
                    (h = i(w, g.props)),
                    (h.ref = ka(f, w, g)),
                    (h.return = f),
                    (f = h);
                  break e;
                }
                n(f, w);
                break;
              } else t(f, w);
              w = w.sibling;
            }
            g.type === fi
              ? ((h = Qr(g.props.children, f.mode, T, g.key)),
                (h.return = f),
                (f = h))
              : ((T = kl(g.type, g.key, g.props, null, f.mode, T)),
                (T.ref = ka(f, h, g)),
                (T.return = f),
                (f = T));
          }
          return o(f);
        case di:
          e: {
            for (w = g.key; h !== null; ) {
              if (h.key === w)
                if (
                  h.tag === 4 &&
                  h.stateNode.containerInfo === g.containerInfo &&
                  h.stateNode.implementation === g.implementation
                ) {
                  n(f, h.sibling),
                    (h = i(h, g.children || [])),
                    (h.return = f),
                    (f = h);
                  break e;
                } else {
                  n(f, h);
                  break;
                }
              else t(f, h);
              h = h.sibling;
            }
            (h = Su(g, f.mode, T)), (h.return = f), (f = h);
          }
          return o(f);
        case Kn:
          return (w = g._init), k(f, h, w(g._payload), T);
      }
      if (La(g)) return y(f, h, g, T);
      if (ya(g)) return C(f, h, g, T);
      nl(f, g);
    }
    return (typeof g == "string" && g !== "") || typeof g == "number"
      ? ((g = "" + g),
        h !== null && h.tag === 6
          ? (n(f, h.sibling), (h = i(h, g)), (h.return = f), (f = h))
          : (n(f, h), (h = xu(g, f.mode, T)), (h.return = f), (f = h)),
        o(f))
      : n(f, h);
  }
  return k;
}
var Ji = ov(!0),
  lv = ov(!1),
  Fo = {},
  Cn = kr(Fo),
  oo = kr(Fo),
  lo = kr(Fo);
function Rr(e) {
  if (e === Fo) throw Error(O(174));
  return e;
}
function _d(e, t) {
  switch ((Ce(lo, t), Ce(oo, e), Ce(Cn, Fo), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Qu(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Qu(t, e));
  }
  Te(Cn), Ce(Cn, t);
}
function Zi() {
  Te(Cn), Te(oo), Te(lo);
}
function sv(e) {
  Rr(lo.current);
  var t = Rr(Cn.current),
    n = Qu(t, e.type);
  t !== n && (Ce(oo, e), Ce(Cn, n));
}
function Ld(e) {
  oo.current === e && (Te(Cn), Te(oo));
}
var Ne = kr(0);
function Wl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if ((t.flags & 128) !== 0) return t;
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
var pu = [];
function Fd() {
  for (var e = 0; e < pu.length; e++)
    pu[e]._workInProgressVersionPrimary = null;
  pu.length = 0;
}
var yl = An.ReactCurrentDispatcher,
  mu = An.ReactCurrentBatchConfig,
  qr = 0,
  Oe = null,
  Ye = null,
  et = null,
  Bl = !1,
  Wa = !1,
  so = 0,
  kw = 0;
function st() {
  throw Error(O(321));
}
function Ud(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!ln(e[n], t[n])) return !1;
  return !0;
}
function Ad(e, t, n, r, i, a) {
  if (
    ((qr = a),
    (Oe = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (yl.current = e === null || e.memoizedState === null ? Pw : Dw),
    (e = n(r, i)),
    Wa)
  ) {
    a = 0;
    do {
      if (((Wa = !1), (so = 0), 25 <= a)) throw Error(O(301));
      (a += 1),
        (et = Ye = null),
        (t.updateQueue = null),
        (yl.current = bw),
        (e = n(r, i));
    } while (Wa);
  }
  if (
    ((yl.current = Ql),
    (t = Ye !== null && Ye.next !== null),
    (qr = 0),
    (et = Ye = Oe = null),
    (Bl = !1),
    t)
  )
    throw Error(O(300));
  return e;
}
function Id() {
  var e = so !== 0;
  return (so = 0), e;
}
function pn() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return et === null ? (Oe.memoizedState = et = e) : (et = et.next = e), et;
}
function Gt() {
  if (Ye === null) {
    var e = Oe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Ye.next;
  var t = et === null ? Oe.memoizedState : et.next;
  if (t !== null) (et = t), (Ye = e);
  else {
    if (e === null) throw Error(O(310));
    (Ye = e),
      (e = {
        memoizedState: Ye.memoizedState,
        baseState: Ye.baseState,
        baseQueue: Ye.baseQueue,
        queue: Ye.queue,
        next: null,
      }),
      et === null ? (Oe.memoizedState = et = e) : (et = et.next = e);
  }
  return et;
}
function uo(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function vu(e) {
  var t = Gt(),
    n = t.queue;
  if (n === null) throw Error(O(311));
  n.lastRenderedReducer = e;
  var r = Ye,
    i = r.baseQueue,
    a = n.pending;
  if (a !== null) {
    if (i !== null) {
      var o = i.next;
      (i.next = a.next), (a.next = o);
    }
    (r.baseQueue = i = a), (n.pending = null);
  }
  if (i !== null) {
    (a = i.next), (r = r.baseState);
    var l = (o = null),
      s = null,
      u = a;
    do {
      var c = u.lane;
      if ((qr & c) === c)
        s !== null &&
          (s = s.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action));
      else {
        var d = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        s === null ? ((l = s = d), (o = r)) : (s = s.next = d),
          (Oe.lanes |= c),
          (Kr |= c);
      }
      u = u.next;
    } while (u !== null && u !== a);
    s === null ? (o = r) : (s.next = l),
      ln(r, t.memoizedState) || (Ct = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = s),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    i = e;
    do (a = i.lane), (Oe.lanes |= a), (Kr |= a), (i = i.next);
    while (i !== e);
  } else i === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function yu(e) {
  var t = Gt(),
    n = t.queue;
  if (n === null) throw Error(O(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    i = n.pending,
    a = t.memoizedState;
  if (i !== null) {
    n.pending = null;
    var o = (i = i.next);
    do (a = e(a, o.action)), (o = o.next);
    while (o !== i);
    ln(a, t.memoizedState) || (Ct = !0),
      (t.memoizedState = a),
      t.baseQueue === null && (t.baseState = a),
      (n.lastRenderedState = a);
  }
  return [a, r];
}
function uv() {}
function cv(e, t) {
  var n = Oe,
    r = Gt(),
    i = t(),
    a = !ln(r.memoizedState, i);
  if (
    (a && ((r.memoizedState = i), (Ct = !0)),
    (r = r.queue),
    $d(hv.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || a || (et !== null && et.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      co(9, fv.bind(null, n, r, i, t), void 0, null),
      nt === null)
    )
      throw Error(O(349));
    (qr & 30) !== 0 || dv(n, t, i);
  }
  return i;
}
function dv(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = Oe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Oe.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function fv(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), pv(t) && mv(e);
}
function hv(e, t, n) {
  return n(function () {
    pv(t) && mv(e);
  });
}
function pv(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !ln(e, n);
  } catch {
    return !0;
  }
}
function mv(e) {
  var t = Fn(e, 1);
  t !== null && on(t, e, 1, -1);
}
function Sh(e) {
  var t = pn();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: uo,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Tw.bind(null, Oe, e)),
    [t.memoizedState, e]
  );
}
function co(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = Oe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Oe.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function vv() {
  return Gt().memoizedState;
}
function gl(e, t, n, r) {
  var i = pn();
  (Oe.flags |= e),
    (i.memoizedState = co(1 | t, n, void 0, r === void 0 ? null : r));
}
function ws(e, t, n, r) {
  var i = Gt();
  r = r === void 0 ? null : r;
  var a = void 0;
  if (Ye !== null) {
    var o = Ye.memoizedState;
    if (((a = o.destroy), r !== null && Ud(r, o.deps))) {
      i.memoizedState = co(t, n, a, r);
      return;
    }
  }
  (Oe.flags |= e), (i.memoizedState = co(1 | t, n, a, r));
}
function kh(e, t) {
  return gl(8390656, 8, e, t);
}
function $d(e, t) {
  return ws(2048, 8, e, t);
}
function yv(e, t) {
  return ws(4, 2, e, t);
}
function gv(e, t) {
  return ws(4, 4, e, t);
}
function wv(e, t) {
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
function xv(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), ws(4, 4, wv.bind(null, t, e), n)
  );
}
function jd() {}
function Sv(e, t) {
  var n = Gt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ud(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function kv(e, t) {
  var n = Gt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ud(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Cv(e, t, n) {
  return (qr & 21) === 0
    ? (e.baseState && ((e.baseState = !1), (Ct = !0)), (e.memoizedState = n))
    : (ln(n, t) || ((n = Pm()), (Oe.lanes |= n), (Kr |= n), (e.baseState = !0)),
      t);
}
function Cw(e, t) {
  var n = ye;
  (ye = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = mu.transition;
  mu.transition = {};
  try {
    e(!1), t();
  } finally {
    (ye = n), (mu.transition = r);
  }
}
function Ev() {
  return Gt().memoizedState;
}
function Ew(e, t, n) {
  var r = vr(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Tv(e))
  )
    Pv(t, n);
  else if (((n = nv(e, t, n, r)), n !== null)) {
    var i = vt();
    on(n, e, r, i), Dv(n, t, r);
  }
}
function Tw(e, t, n) {
  var r = vr(e),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Tv(e)) Pv(t, i);
  else {
    var a = e.alternate;
    if (
      e.lanes === 0 &&
      (a === null || a.lanes === 0) &&
      ((a = t.lastRenderedReducer), a !== null)
    )
      try {
        var o = t.lastRenderedState,
          l = a(o, n);
        if (((i.hasEagerState = !0), (i.eagerState = l), ln(l, o))) {
          var s = t.interleaved;
          s === null
            ? ((i.next = i), Od(t))
            : ((i.next = s.next), (s.next = i)),
            (t.interleaved = i);
          return;
        }
      } catch {
      } finally {
      }
    (n = nv(e, t, i, r)),
      n !== null && ((i = vt()), on(n, e, r, i), Dv(n, t, r));
  }
}
function Tv(e) {
  var t = e.alternate;
  return e === Oe || (t !== null && t === Oe);
}
function Pv(e, t) {
  Wa = Bl = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Dv(e, t, n) {
  if ((n & 4194240) !== 0) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), yd(e, n);
  }
}
var Ql = {
    readContext: Kt,
    useCallback: st,
    useContext: st,
    useEffect: st,
    useImperativeHandle: st,
    useInsertionEffect: st,
    useLayoutEffect: st,
    useMemo: st,
    useReducer: st,
    useRef: st,
    useState: st,
    useDebugValue: st,
    useDeferredValue: st,
    useTransition: st,
    useMutableSource: st,
    useSyncExternalStore: st,
    useId: st,
    unstable_isNewReconciler: !1,
  },
  Pw = {
    readContext: Kt,
    useCallback: function (e, t) {
      return (pn().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: Kt,
    useEffect: kh,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        gl(4194308, 4, wv.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return gl(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return gl(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = pn();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = pn();
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
        (e = e.dispatch = Ew.bind(null, Oe, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = pn();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Sh,
    useDebugValue: jd,
    useDeferredValue: function (e) {
      return (pn().memoizedState = e);
    },
    useTransition: function () {
      var e = Sh(!1),
        t = e[0];
      return (e = Cw.bind(null, e[1])), (pn().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = Oe,
        i = pn();
      if (De) {
        if (n === void 0) throw Error(O(407));
        n = n();
      } else {
        if (((n = t()), nt === null)) throw Error(O(349));
        (qr & 30) !== 0 || dv(r, t, n);
      }
      i.memoizedState = n;
      var a = { value: n, getSnapshot: t };
      return (
        (i.queue = a),
        kh(hv.bind(null, r, a, e), [e]),
        (r.flags |= 2048),
        co(9, fv.bind(null, r, a, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = pn(),
        t = nt.identifierPrefix;
      if (De) {
        var n = Nn,
          r = bn;
        (n = (r & ~(1 << (32 - an(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = so++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = kw++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Dw = {
    readContext: Kt,
    useCallback: Sv,
    useContext: Kt,
    useEffect: $d,
    useImperativeHandle: xv,
    useInsertionEffect: yv,
    useLayoutEffect: gv,
    useMemo: kv,
    useReducer: vu,
    useRef: vv,
    useState: function () {
      return vu(uo);
    },
    useDebugValue: jd,
    useDeferredValue: function (e) {
      var t = Gt();
      return Cv(t, Ye.memoizedState, e);
    },
    useTransition: function () {
      var e = vu(uo)[0],
        t = Gt().memoizedState;
      return [e, t];
    },
    useMutableSource: uv,
    useSyncExternalStore: cv,
    useId: Ev,
    unstable_isNewReconciler: !1,
  },
  bw = {
    readContext: Kt,
    useCallback: Sv,
    useContext: Kt,
    useEffect: $d,
    useImperativeHandle: xv,
    useInsertionEffect: yv,
    useLayoutEffect: gv,
    useMemo: kv,
    useReducer: yu,
    useRef: vv,
    useState: function () {
      return yu(uo);
    },
    useDebugValue: jd,
    useDeferredValue: function (e) {
      var t = Gt();
      return Ye === null ? (t.memoizedState = e) : Cv(t, Ye.memoizedState, e);
    },
    useTransition: function () {
      var e = yu(uo)[0],
        t = Gt().memoizedState;
      return [e, t];
    },
    useMutableSource: uv,
    useSyncExternalStore: cv,
    useId: Ev,
    unstable_isNewReconciler: !1,
  };
function ea(e, t) {
  try {
    var n = "",
      r = t;
    do (n += n0(r)), (r = r.return);
    while (r);
    var i = n;
  } catch (a) {
    i =
      `
Error generating stack: ` +
      a.message +
      `
` +
      a.stack;
  }
  return { value: e, source: t, stack: i, digest: null };
}
function gu(e, t, n) {
  return {
    value: e,
    source: null,
    stack: n != null ? n : null,
    digest: t != null ? t : null,
  };
}
function pc(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Nw = typeof WeakMap == "function" ? WeakMap : Map;
function bv(e, t, n) {
  (n = On(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      Vl || ((Vl = !0), (Ec = r)), pc(e, t);
    }),
    n
  );
}
function Nv(e, t, n) {
  (n = On(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = t.value;
    (n.payload = function () {
      return r(i);
    }),
      (n.callback = function () {
        pc(e, t);
      });
  }
  var a = e.stateNode;
  return (
    a !== null &&
      typeof a.componentDidCatch == "function" &&
      (n.callback = function () {
        pc(e, t),
          typeof r != "function" &&
            (mr === null ? (mr = new Set([this])) : mr.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function Ch(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Nw();
    var i = new Set();
    r.set(t, i);
  } else (i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i));
  i.has(n) || (i.add(n), (e = Ww.bind(null, e, t, n)), t.then(e, e));
}
function Eh(e) {
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
function Th(e, t, n, r, i) {
  return (e.mode & 1) === 0
    ? (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = On(-1, 1)), (t.tag = 2), pr(n, t, 1))),
          (n.lanes |= 1)),
      e)
    : ((e.flags |= 65536), (e.lanes = i), e);
}
var Mw = An.ReactCurrentOwner,
  Ct = !1;
function mt(e, t, n, r) {
  t.child = e === null ? lv(t, null, n, r) : Ji(t, e.child, n, r);
}
function Ph(e, t, n, r, i) {
  n = n.render;
  var a = t.ref;
  return (
    bi(t, i),
    (r = Ad(e, t, n, r, a, i)),
    (n = Id()),
    e !== null && !Ct
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~i),
        Un(e, t, i))
      : (De && n && Td(t), (t.flags |= 1), mt(e, t, r, i), t.child)
  );
}
function Dh(e, t, n, r, i) {
  if (e === null) {
    var a = n.type;
    return typeof a == "function" &&
      !qd(a) &&
      a.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = a), Mv(e, t, a, r, i))
      : ((e = kl(n.type, null, r, t, t.mode, i)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((a = e.child), (e.lanes & i) === 0)) {
    var o = a.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : no), n(o, r) && e.ref === t.ref)
    )
      return Un(e, t, i);
  }
  return (
    (t.flags |= 1),
    (e = yr(a, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Mv(e, t, n, r, i) {
  if (e !== null) {
    var a = e.memoizedProps;
    if (no(a, r) && e.ref === t.ref)
      if (((Ct = !1), (t.pendingProps = r = a), (e.lanes & i) !== 0))
        (e.flags & 131072) !== 0 && (Ct = !0);
      else return (t.lanes = e.lanes), Un(e, t, i);
  }
  return mc(e, t, n, r, i);
}
function Ov(e, t, n) {
  var r = t.pendingProps,
    i = r.children,
    a = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if ((t.mode & 1) === 0)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        Ce(ki, Ot),
        (Ot |= n);
    else {
      if ((n & 1073741824) === 0)
        return (
          (e = a !== null ? a.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          Ce(ki, Ot),
          (Ot |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = a !== null ? a.baseLanes : n),
        Ce(ki, Ot),
        (Ot |= r);
    }
  else
    a !== null ? ((r = a.baseLanes | n), (t.memoizedState = null)) : (r = n),
      Ce(ki, Ot),
      (Ot |= r);
  return mt(e, t, i, n), t.child;
}
function Rv(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function mc(e, t, n, r, i) {
  var a = Tt(n) ? Yr : ht.current;
  return (
    (a = Gi(t, a)),
    bi(t, i),
    (n = Ad(e, t, n, r, a, i)),
    (r = Id()),
    e !== null && !Ct
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~i),
        Un(e, t, i))
      : (De && r && Td(t), (t.flags |= 1), mt(e, t, n, i), t.child)
  );
}
function bh(e, t, n, r, i) {
  if (Tt(n)) {
    var a = !0;
    Al(t);
  } else a = !1;
  if ((bi(t, i), t.stateNode === null))
    wl(e, t), av(t, n, r), hc(t, n, r, i), (r = !0);
  else if (e === null) {
    var o = t.stateNode,
      l = t.memoizedProps;
    o.props = l;
    var s = o.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = Kt(u))
      : ((u = Tt(n) ? Yr : ht.current), (u = Gi(t, u)));
    var c = n.getDerivedStateFromProps,
      d =
        typeof c == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    d ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== r || s !== u) && wh(t, o, r, u)),
      (Gn = !1);
    var p = t.memoizedState;
    (o.state = p),
      Hl(t, r, o, i),
      (s = t.memoizedState),
      l !== r || p !== s || Et.current || Gn
        ? (typeof c == "function" && (fc(t, n, c, r), (s = t.memoizedState)),
          (l = Gn || gh(t, n, l, r, p, s, u))
            ? (d ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = s)),
          (o.props = r),
          (o.state = s),
          (o.context = u),
          (r = l))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (o = t.stateNode),
      rv(e, t),
      (l = t.memoizedProps),
      (u = t.type === t.elementType ? l : Zt(t.type, l)),
      (o.props = u),
      (d = t.pendingProps),
      (p = o.context),
      (s = n.contextType),
      typeof s == "object" && s !== null
        ? (s = Kt(s))
        : ((s = Tt(n) ? Yr : ht.current), (s = Gi(t, s)));
    var v = n.getDerivedStateFromProps;
    (c =
      typeof v == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== d || p !== s) && wh(t, o, r, s)),
      (Gn = !1),
      (p = t.memoizedState),
      (o.state = p),
      Hl(t, r, o, i);
    var y = t.memoizedState;
    l !== d || p !== y || Et.current || Gn
      ? (typeof v == "function" && (fc(t, n, v, r), (y = t.memoizedState)),
        (u = Gn || gh(t, n, u, r, p, y, s) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, y, s),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, y, s)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (l === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (l === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = y)),
        (o.props = r),
        (o.state = y),
        (o.context = s),
        (r = u))
      : (typeof o.componentDidUpdate != "function" ||
          (l === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (l === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return vc(e, t, n, r, a, i);
}
function vc(e, t, n, r, i, a) {
  Rv(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return i && hh(t, n, !1), Un(e, t, a);
  (r = t.stateNode), (Mw.current = t);
  var l =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Ji(t, e.child, null, a)), (t.child = Ji(t, null, l, a)))
      : mt(e, t, l, a),
    (t.memoizedState = r.state),
    i && hh(t, n, !0),
    t.child
  );
}
function _v(e) {
  var t = e.stateNode;
  t.pendingContext
    ? fh(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && fh(e, t.context, !1),
    _d(e, t.containerInfo);
}
function Nh(e, t, n, r, i) {
  return Xi(), Dd(i), (t.flags |= 256), mt(e, t, n, r), t.child;
}
var yc = { dehydrated: null, treeContext: null, retryLane: 0 };
function gc(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Lv(e, t, n) {
  var r = t.pendingProps,
    i = Ne.current,
    a = !1,
    o = (t.flags & 128) !== 0,
    l;
  if (
    ((l = o) ||
      (l = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0),
    l
      ? ((a = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (i |= 1),
    Ce(Ne, i & 1),
    e === null)
  )
    return (
      cc(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? ((t.mode & 1) === 0
            ? (t.lanes = 1)
            : e.data === "$!"
            ? (t.lanes = 8)
            : (t.lanes = 1073741824),
          null)
        : ((o = r.children),
          (e = r.fallback),
          a
            ? ((r = t.mode),
              (a = t.child),
              (o = { mode: "hidden", children: o }),
              (r & 1) === 0 && a !== null
                ? ((a.childLanes = 0), (a.pendingProps = o))
                : (a = ks(o, r, 0, null)),
              (e = Qr(e, r, n, null)),
              (a.return = t),
              (e.return = t),
              (a.sibling = e),
              (t.child = a),
              (t.child.memoizedState = gc(n)),
              (t.memoizedState = yc),
              e)
            : zd(t, o))
    );
  if (((i = e.memoizedState), i !== null && ((l = i.dehydrated), l !== null)))
    return Ow(e, t, o, r, l, i, n);
  if (a) {
    (a = r.fallback), (o = t.mode), (i = e.child), (l = i.sibling);
    var s = { mode: "hidden", children: r.children };
    return (
      (o & 1) === 0 && t.child !== i
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = s),
          (t.deletions = null))
        : ((r = yr(i, s)), (r.subtreeFlags = i.subtreeFlags & 14680064)),
      l !== null ? (a = yr(l, a)) : ((a = Qr(a, o, n, null)), (a.flags |= 2)),
      (a.return = t),
      (r.return = t),
      (r.sibling = a),
      (t.child = r),
      (r = a),
      (a = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? gc(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (a.memoizedState = o),
      (a.childLanes = e.childLanes & ~n),
      (t.memoizedState = yc),
      r
    );
  }
  return (
    (a = e.child),
    (e = a.sibling),
    (r = yr(a, { mode: "visible", children: r.children })),
    (t.mode & 1) === 0 && (r.lanes = n),
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
function zd(e, t) {
  return (
    (t = ks({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function rl(e, t, n, r) {
  return (
    r !== null && Dd(r),
    Ji(t, e.child, null, n),
    (e = zd(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Ow(e, t, n, r, i, a, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = gu(Error(O(422)))), rl(e, t, o, r))
      : t.memoizedState !== null
      ? ((t.child = e.child), (t.flags |= 128), null)
      : ((a = r.fallback),
        (i = t.mode),
        (r = ks({ mode: "visible", children: r.children }, i, 0, null)),
        (a = Qr(a, i, o, null)),
        (a.flags |= 2),
        (r.return = t),
        (a.return = t),
        (r.sibling = a),
        (t.child = r),
        (t.mode & 1) !== 0 && Ji(t, e.child, null, o),
        (t.child.memoizedState = gc(o)),
        (t.memoizedState = yc),
        a);
  if ((t.mode & 1) === 0) return rl(e, t, o, null);
  if (i.data === "$!") {
    if (((r = i.nextSibling && i.nextSibling.dataset), r)) var l = r.dgst;
    return (r = l), (a = Error(O(419))), (r = gu(a, r, void 0)), rl(e, t, o, r);
  }
  if (((l = (o & e.childLanes) !== 0), Ct || l)) {
    if (((r = nt), r !== null)) {
      switch (o & -o) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
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
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      (i = (i & (r.suspendedLanes | o)) !== 0 ? 0 : i),
        i !== 0 &&
          i !== a.retryLane &&
          ((a.retryLane = i), Fn(e, i), on(r, e, i, -1));
    }
    return Vd(), (r = gu(Error(O(421)))), rl(e, t, o, r);
  }
  return i.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Bw.bind(null, e)),
      (i._reactRetry = t),
      null)
    : ((e = a.treeContext),
      (Rt = hr(i.nextSibling)),
      (_t = t),
      (De = !0),
      (rn = null),
      e !== null &&
        ((Qt[Yt++] = bn),
        (Qt[Yt++] = Nn),
        (Qt[Yt++] = Vr),
        (bn = e.id),
        (Nn = e.overflow),
        (Vr = t)),
      (t = zd(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Mh(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), dc(e.return, t, n);
}
function wu(e, t, n, r, i) {
  var a = e.memoizedState;
  a === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: i,
      })
    : ((a.isBackwards = t),
      (a.rendering = null),
      (a.renderingStartTime = 0),
      (a.last = r),
      (a.tail = n),
      (a.tailMode = i));
}
function Fv(e, t, n) {
  var r = t.pendingProps,
    i = r.revealOrder,
    a = r.tail;
  if ((mt(e, t, r.children, n), (r = Ne.current), (r & 2) !== 0))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Mh(e, n, t);
        else if (e.tag === 19) Mh(e, n, t);
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
  if ((Ce(Ne, r), (t.mode & 1) === 0)) t.memoizedState = null;
  else
    switch (i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          (e = n.alternate),
            e !== null && Wl(e) === null && (i = n),
            (n = n.sibling);
        (n = i),
          n === null
            ? ((i = t.child), (t.child = null))
            : ((i = n.sibling), (n.sibling = null)),
          wu(t, !1, i, n, a);
        break;
      case "backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (((e = i.alternate), e !== null && Wl(e) === null)) {
            t.child = i;
            break;
          }
          (e = i.sibling), (i.sibling = n), (n = i), (i = e);
        }
        wu(t, !0, n, null, a);
        break;
      case "together":
        wu(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function wl(e, t) {
  (t.mode & 1) === 0 &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Un(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Kr |= t.lanes),
    (n & t.childLanes) === 0)
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(O(153));
  if (t.child !== null) {
    for (
      e = t.child, n = yr(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = yr(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function Rw(e, t, n) {
  switch (t.tag) {
    case 3:
      _v(t), Xi();
      break;
    case 5:
      sv(t);
      break;
    case 1:
      Tt(t.type) && Al(t);
      break;
    case 4:
      _d(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        i = t.memoizedProps.value;
      Ce(jl, r._currentValue), (r._currentValue = i);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (Ce(Ne, Ne.current & 1), (t.flags |= 128), null)
          : (n & t.child.childLanes) !== 0
          ? Lv(e, t, n)
          : (Ce(Ne, Ne.current & 1),
            (e = Un(e, t, n)),
            e !== null ? e.sibling : null);
      Ce(Ne, Ne.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
        if (r) return Fv(e, t, n);
        t.flags |= 128;
      }
      if (
        ((i = t.memoizedState),
        i !== null &&
          ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        Ce(Ne, Ne.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Ov(e, t, n);
  }
  return Un(e, t, n);
}
var Uv, wc, Av, Iv;
Uv = function (e, t) {
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
wc = function () {};
Av = function (e, t, n, r) {
  var i = e.memoizedProps;
  if (i !== r) {
    (e = t.stateNode), Rr(Cn.current);
    var a = null;
    switch (n) {
      case "input":
        (i = zu(e, i)), (r = zu(e, r)), (a = []);
        break;
      case "select":
        (i = Re({}, i, { value: void 0 })),
          (r = Re({}, r, { value: void 0 })),
          (a = []);
        break;
      case "textarea":
        (i = Bu(e, i)), (r = Bu(e, r)), (a = []);
        break;
      default:
        typeof i.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Fl);
    }
    Yu(n, r);
    var o;
    n = null;
    for (u in i)
      if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null)
        if (u === "style") {
          var l = i[u];
          for (o in l) l.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (Ka.hasOwnProperty(u)
              ? a || (a = [])
              : (a = a || []).push(u, null));
    for (u in r) {
      var s = r[u];
      if (
        ((l = i != null ? i[u] : void 0),
        r.hasOwnProperty(u) && s !== l && (s != null || l != null))
      )
        if (u === "style")
          if (l) {
            for (o in l)
              !l.hasOwnProperty(o) ||
                (s && s.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in s)
              s.hasOwnProperty(o) &&
                l[o] !== s[o] &&
                (n || (n = {}), (n[o] = s[o]));
          } else n || (a || (a = []), a.push(u, n)), (n = s);
        else
          u === "dangerouslySetInnerHTML"
            ? ((s = s ? s.__html : void 0),
              (l = l ? l.__html : void 0),
              s != null && l !== s && (a = a || []).push(u, s))
            : u === "children"
            ? (typeof s != "string" && typeof s != "number") ||
              (a = a || []).push(u, "" + s)
            : u !== "suppressContentEditableWarning" &&
              u !== "suppressHydrationWarning" &&
              (Ka.hasOwnProperty(u)
                ? (s != null && u === "onScroll" && Ee("scroll", e),
                  a || l === s || (a = []))
                : (a = a || []).push(u, s));
    }
    n && (a = a || []).push("style", n);
    var u = a;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
Iv = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Ca(e, t) {
  if (!De)
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
function ut(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags & 14680064),
        (r |= i.flags & 14680064),
        (i.return = e),
        (i = i.sibling);
  else
    for (i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags),
        (r |= i.flags),
        (i.return = e),
        (i = i.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function _w(e, t, n) {
  var r = t.pendingProps;
  switch ((Pd(t), t.tag)) {
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
      return ut(t), null;
    case 1:
      return Tt(t.type) && Ul(), ut(t), null;
    case 3:
      return (
        (r = t.stateNode),
        Zi(),
        Te(Et),
        Te(ht),
        Fd(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (tl(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
              ((t.flags |= 1024), rn !== null && (Dc(rn), (rn = null)))),
        wc(e, t),
        ut(t),
        null
      );
    case 5:
      Ld(t);
      var i = Rr(lo.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        Av(e, t, n, r, i),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(O(166));
          return ut(t), null;
        }
        if (((e = Rr(Cn.current)), tl(t))) {
          (r = t.stateNode), (n = t.type);
          var a = t.memoizedProps;
          switch (((r[wn] = t), (r[ao] = a), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              Ee("cancel", r), Ee("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              Ee("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < Ua.length; i++) Ee(Ua[i], r);
              break;
            case "source":
              Ee("error", r);
              break;
            case "img":
            case "image":
            case "link":
              Ee("error", r), Ee("load", r);
              break;
            case "details":
              Ee("toggle", r);
              break;
            case "input":
              $f(r, a), Ee("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!a.multiple }),
                Ee("invalid", r);
              break;
            case "textarea":
              zf(r, a), Ee("invalid", r);
          }
          Yu(n, a), (i = null);
          for (var o in a)
            if (a.hasOwnProperty(o)) {
              var l = a[o];
              o === "children"
                ? typeof l == "string"
                  ? r.textContent !== l &&
                    (a.suppressHydrationWarning !== !0 &&
                      el(r.textContent, l, e),
                    (i = ["children", l]))
                  : typeof l == "number" &&
                    r.textContent !== "" + l &&
                    (a.suppressHydrationWarning !== !0 &&
                      el(r.textContent, l, e),
                    (i = ["children", "" + l]))
                : Ka.hasOwnProperty(o) &&
                  l != null &&
                  o === "onScroll" &&
                  Ee("scroll", r);
            }
          switch (n) {
            case "input":
              Yo(r), jf(r, a, !0);
              break;
            case "textarea":
              Yo(r), Hf(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof a.onClick == "function" && (r.onclick = Fl);
          }
          (r = i), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (o = i.nodeType === 9 ? i : i.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = dm(n)),
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
            (e[wn] = t),
            (e[ao] = r),
            Uv(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = Vu(n, r)), n)) {
              case "dialog":
                Ee("cancel", e), Ee("close", e), (i = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ee("load", e), (i = r);
                break;
              case "video":
              case "audio":
                for (i = 0; i < Ua.length; i++) Ee(Ua[i], e);
                i = r;
                break;
              case "source":
                Ee("error", e), (i = r);
                break;
              case "img":
              case "image":
              case "link":
                Ee("error", e), Ee("load", e), (i = r);
                break;
              case "details":
                Ee("toggle", e), (i = r);
                break;
              case "input":
                $f(e, r), (i = zu(e, r)), Ee("invalid", e);
                break;
              case "option":
                i = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (i = Re({}, r, { value: void 0 })),
                  Ee("invalid", e);
                break;
              case "textarea":
                zf(e, r), (i = Bu(e, r)), Ee("invalid", e);
                break;
              default:
                i = r;
            }
            Yu(n, i), (l = i);
            for (a in l)
              if (l.hasOwnProperty(a)) {
                var s = l[a];
                a === "style"
                  ? pm(e, s)
                  : a === "dangerouslySetInnerHTML"
                  ? ((s = s ? s.__html : void 0), s != null && fm(e, s))
                  : a === "children"
                  ? typeof s == "string"
                    ? (n !== "textarea" || s !== "") && Ga(e, s)
                    : typeof s == "number" && Ga(e, "" + s)
                  : a !== "suppressContentEditableWarning" &&
                    a !== "suppressHydrationWarning" &&
                    a !== "autoFocus" &&
                    (Ka.hasOwnProperty(a)
                      ? s != null && a === "onScroll" && Ee("scroll", e)
                      : s != null && dd(e, a, s, o));
              }
            switch (n) {
              case "input":
                Yo(e), jf(e, r, !1);
                break;
              case "textarea":
                Yo(e), Hf(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + wr(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (a = r.value),
                  a != null
                    ? Ei(e, !!r.multiple, a, !1)
                    : r.defaultValue != null &&
                      Ei(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof i.onClick == "function" && (e.onclick = Fl);
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
      return ut(t), null;
    case 6:
      if (e && t.stateNode != null) Iv(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(O(166));
        if (((n = Rr(lo.current)), Rr(Cn.current), tl(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[wn] = t),
            (a = r.nodeValue !== n) && ((e = _t), e !== null))
          )
            switch (e.tag) {
              case 3:
                el(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  el(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          a && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[wn] = t),
            (t.stateNode = r);
      }
      return ut(t), null;
    case 13:
      if (
        (Te(Ne),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (De && Rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
          tv(), Xi(), (t.flags |= 98560), (a = !1);
        else if (((a = tl(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!a) throw Error(O(318));
            if (
              ((a = t.memoizedState),
              (a = a !== null ? a.dehydrated : null),
              !a)
            )
              throw Error(O(317));
            a[wn] = t;
          } else
            Xi(),
              (t.flags & 128) === 0 && (t.memoizedState = null),
              (t.flags |= 4);
          ut(t), (a = !1);
        } else rn !== null && (Dc(rn), (rn = null)), (a = !0);
        if (!a) return t.flags & 65536 ? t : null;
      }
      return (t.flags & 128) !== 0
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            (t.mode & 1) !== 0 &&
              (e === null || (Ne.current & 1) !== 0
                ? qe === 0 && (qe = 3)
                : Vd())),
          t.updateQueue !== null && (t.flags |= 4),
          ut(t),
          null);
    case 4:
      return (
        Zi(), wc(e, t), e === null && ro(t.stateNode.containerInfo), ut(t), null
      );
    case 10:
      return Md(t.type._context), ut(t), null;
    case 17:
      return Tt(t.type) && Ul(), ut(t), null;
    case 19:
      if ((Te(Ne), (a = t.memoizedState), a === null)) return ut(t), null;
      if (((r = (t.flags & 128) !== 0), (o = a.rendering), o === null))
        if (r) Ca(a, !1);
        else {
          if (qe !== 0 || (e !== null && (e.flags & 128) !== 0))
            for (e = t.child; e !== null; ) {
              if (((o = Wl(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Ca(a, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (a = n),
                    (e = r),
                    (a.flags &= 14680066),
                    (o = a.alternate),
                    o === null
                      ? ((a.childLanes = 0),
                        (a.lanes = e),
                        (a.child = null),
                        (a.subtreeFlags = 0),
                        (a.memoizedProps = null),
                        (a.memoizedState = null),
                        (a.updateQueue = null),
                        (a.dependencies = null),
                        (a.stateNode = null))
                      : ((a.childLanes = o.childLanes),
                        (a.lanes = o.lanes),
                        (a.child = o.child),
                        (a.subtreeFlags = 0),
                        (a.deletions = null),
                        (a.memoizedProps = o.memoizedProps),
                        (a.memoizedState = o.memoizedState),
                        (a.updateQueue = o.updateQueue),
                        (a.type = o.type),
                        (e = o.dependencies),
                        (a.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return Ce(Ne, (Ne.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          a.tail !== null &&
            $e() > ta &&
            ((t.flags |= 128), (r = !0), Ca(a, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Wl(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Ca(a, !0),
              a.tail === null && a.tailMode === "hidden" && !o.alternate && !De)
            )
              return ut(t), null;
          } else
            2 * $e() - a.renderingStartTime > ta &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Ca(a, !1), (t.lanes = 4194304));
        a.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = a.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (a.last = o));
      }
      return a.tail !== null
        ? ((t = a.tail),
          (a.rendering = t),
          (a.tail = t.sibling),
          (a.renderingStartTime = $e()),
          (t.sibling = null),
          (n = Ne.current),
          Ce(Ne, r ? (n & 1) | 2 : n & 1),
          t)
        : (ut(t), null);
    case 22:
    case 23:
      return (
        Yd(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && (t.mode & 1) !== 0
          ? (Ot & 1073741824) !== 0 &&
            (ut(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : ut(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(O(156, t.tag));
}
function Lw(e, t) {
  switch ((Pd(t), t.tag)) {
    case 1:
      return (
        Tt(t.type) && Ul(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Zi(),
        Te(Et),
        Te(ht),
        Fd(),
        (e = t.flags),
        (e & 65536) !== 0 && (e & 128) === 0
          ? ((t.flags = (e & -65537) | 128), t)
          : null
      );
    case 5:
      return Ld(t), null;
    case 13:
      if (
        (Te(Ne), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(O(340));
        Xi();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return Te(Ne), null;
    case 4:
      return Zi(), null;
    case 10:
      return Md(t.type._context), null;
    case 22:
    case 23:
      return Yd(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var il = !1,
  dt = !1,
  Fw = typeof WeakSet == "function" ? WeakSet : Set,
  j = null;
function Si(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Fe(e, t, r);
      }
    else n.current = null;
}
function xc(e, t, n) {
  try {
    n();
  } catch (r) {
    Fe(e, t, r);
  }
}
var Oh = !1;
function Uw(e, t) {
  if (((rc = Rl), (e = Hm()), Ed(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var i = r.anchorOffset,
            a = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, a.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            l = -1,
            s = -1,
            u = 0,
            c = 0,
            d = e,
            p = null;
          t: for (;;) {
            for (
              var v;
              d !== n || (i !== 0 && d.nodeType !== 3) || (l = o + i),
                d !== a || (r !== 0 && d.nodeType !== 3) || (s = o + r),
                d.nodeType === 3 && (o += d.nodeValue.length),
                (v = d.firstChild) !== null;

            )
              (p = d), (d = v);
            for (;;) {
              if (d === e) break t;
              if (
                (p === n && ++u === i && (l = o),
                p === a && ++c === r && (s = o),
                (v = d.nextSibling) !== null)
              )
                break;
              (d = p), (p = d.parentNode);
            }
            d = v;
          }
          n = l === -1 || s === -1 ? null : { start: l, end: s };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ic = { focusedElem: e, selectionRange: n }, Rl = !1, j = t; j !== null; )
    if (((t = j), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (j = e);
    else
      for (; j !== null; ) {
        t = j;
        try {
          var y = t.alternate;
          if ((t.flags & 1024) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (y !== null) {
                  var C = y.memoizedProps,
                    k = y.memoizedState,
                    f = t.stateNode,
                    h = f.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? C : Zt(t.type, C),
                      k,
                    );
                  f.__reactInternalSnapshotBeforeUpdate = h;
                }
                break;
              case 3:
                var g = t.stateNode.containerInfo;
                g.nodeType === 1
                  ? (g.textContent = "")
                  : g.nodeType === 9 &&
                    g.documentElement &&
                    g.removeChild(g.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(O(163));
            }
        } catch (T) {
          Fe(t, t.return, T);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (j = e);
          break;
        }
        j = t.return;
      }
  return (y = Oh), (Oh = !1), y;
}
function Ba(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next);
    do {
      if ((i.tag & e) === e) {
        var a = i.destroy;
        (i.destroy = void 0), a !== void 0 && xc(t, n, a);
      }
      i = i.next;
    } while (i !== r);
  }
}
function xs(e, t) {
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
function Sc(e) {
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
function $v(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), $v(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[wn], delete t[ao], delete t[lc], delete t[gw], delete t[ww])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function jv(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Rh(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || jv(e.return)) return null;
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
function kc(e, t, n) {
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
          n != null || t.onclick !== null || (t.onclick = Fl));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (kc(e, t, n), e = e.sibling; e !== null; ) kc(e, t, n), (e = e.sibling);
}
function Cc(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Cc(e, t, n), e = e.sibling; e !== null; ) Cc(e, t, n), (e = e.sibling);
}
var at = null,
  tn = !1;
function Bn(e, t, n) {
  for (n = n.child; n !== null; ) zv(e, t, n), (n = n.sibling);
}
function zv(e, t, n) {
  if (kn && typeof kn.onCommitFiberUnmount == "function")
    try {
      kn.onCommitFiberUnmount(fs, n);
    } catch {}
  switch (n.tag) {
    case 5:
      dt || Si(n, t);
    case 6:
      var r = at,
        i = tn;
      (at = null),
        Bn(e, t, n),
        (at = r),
        (tn = i),
        at !== null &&
          (tn
            ? ((e = at),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : at.removeChild(n.stateNode));
      break;
    case 18:
      at !== null &&
        (tn
          ? ((e = at),
            (n = n.stateNode),
            e.nodeType === 8
              ? fu(e.parentNode, n)
              : e.nodeType === 1 && fu(e, n),
            eo(e))
          : fu(at, n.stateNode));
      break;
    case 4:
      (r = at),
        (i = tn),
        (at = n.stateNode.containerInfo),
        (tn = !0),
        Bn(e, t, n),
        (at = r),
        (tn = i);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !dt &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        i = r = r.next;
        do {
          var a = i,
            o = a.destroy;
          (a = a.tag),
            o !== void 0 && ((a & 2) !== 0 || (a & 4) !== 0) && xc(n, t, o),
            (i = i.next);
        } while (i !== r);
      }
      Bn(e, t, n);
      break;
    case 1:
      if (
        !dt &&
        (Si(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (l) {
          Fe(n, t, l);
        }
      Bn(e, t, n);
      break;
    case 21:
      Bn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((dt = (r = dt) || n.memoizedState !== null), Bn(e, t, n), (dt = r))
        : Bn(e, t, n);
      break;
    default:
      Bn(e, t, n);
  }
}
function _h(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Fw()),
      t.forEach(function (r) {
        var i = Qw.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(i, i));
      });
  }
}
function Jt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r];
      try {
        var a = e,
          o = t,
          l = o;
        e: for (; l !== null; ) {
          switch (l.tag) {
            case 5:
              (at = l.stateNode), (tn = !1);
              break e;
            case 3:
              (at = l.stateNode.containerInfo), (tn = !0);
              break e;
            case 4:
              (at = l.stateNode.containerInfo), (tn = !0);
              break e;
          }
          l = l.return;
        }
        if (at === null) throw Error(O(160));
        zv(a, o, i), (at = null), (tn = !1);
        var s = i.alternate;
        s !== null && (s.return = null), (i.return = null);
      } catch (u) {
        Fe(i, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) Hv(t, e), (t = t.sibling);
}
function Hv(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Jt(t, e), hn(e), r & 4)) {
        try {
          Ba(3, e, e.return), xs(3, e);
        } catch (C) {
          Fe(e, e.return, C);
        }
        try {
          Ba(5, e, e.return);
        } catch (C) {
          Fe(e, e.return, C);
        }
      }
      break;
    case 1:
      Jt(t, e), hn(e), r & 512 && n !== null && Si(n, n.return);
      break;
    case 5:
      if (
        (Jt(t, e),
        hn(e),
        r & 512 && n !== null && Si(n, n.return),
        e.flags & 32)
      ) {
        var i = e.stateNode;
        try {
          Ga(i, "");
        } catch (C) {
          Fe(e, e.return, C);
        }
      }
      if (r & 4 && ((i = e.stateNode), i != null)) {
        var a = e.memoizedProps,
          o = n !== null ? n.memoizedProps : a,
          l = e.type,
          s = e.updateQueue;
        if (((e.updateQueue = null), s !== null))
          try {
            l === "input" && a.type === "radio" && a.name != null && um(i, a),
              Vu(l, o);
            var u = Vu(l, a);
            for (o = 0; o < s.length; o += 2) {
              var c = s[o],
                d = s[o + 1];
              c === "style"
                ? pm(i, d)
                : c === "dangerouslySetInnerHTML"
                ? fm(i, d)
                : c === "children"
                ? Ga(i, d)
                : dd(i, c, d, u);
            }
            switch (l) {
              case "input":
                Hu(i, a);
                break;
              case "textarea":
                cm(i, a);
                break;
              case "select":
                var p = i._wrapperState.wasMultiple;
                i._wrapperState.wasMultiple = !!a.multiple;
                var v = a.value;
                v != null
                  ? Ei(i, !!a.multiple, v, !1)
                  : p !== !!a.multiple &&
                    (a.defaultValue != null
                      ? Ei(i, !!a.multiple, a.defaultValue, !0)
                      : Ei(i, !!a.multiple, a.multiple ? [] : "", !1));
            }
            i[ao] = a;
          } catch (C) {
            Fe(e, e.return, C);
          }
      }
      break;
    case 6:
      if ((Jt(t, e), hn(e), r & 4)) {
        if (e.stateNode === null) throw Error(O(162));
        (i = e.stateNode), (a = e.memoizedProps);
        try {
          i.nodeValue = a;
        } catch (C) {
          Fe(e, e.return, C);
        }
      }
      break;
    case 3:
      if (
        (Jt(t, e), hn(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          eo(t.containerInfo);
        } catch (C) {
          Fe(e, e.return, C);
        }
      break;
    case 4:
      Jt(t, e), hn(e);
      break;
    case 13:
      Jt(t, e),
        hn(e),
        (i = e.child),
        i.flags & 8192 &&
          ((a = i.memoizedState !== null),
          (i.stateNode.isHidden = a),
          !a ||
            (i.alternate !== null && i.alternate.memoizedState !== null) ||
            (Bd = $e())),
        r & 4 && _h(e);
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((dt = (u = dt) || c), Jt(t, e), (dt = u)) : Jt(t, e),
        hn(e),
        r & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !c && (e.mode & 1) !== 0)
        )
          for (j = e, c = e.child; c !== null; ) {
            for (d = j = c; j !== null; ) {
              switch (((p = j), (v = p.child), p.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ba(4, p, p.return);
                  break;
                case 1:
                  Si(p, p.return);
                  var y = p.stateNode;
                  if (typeof y.componentWillUnmount == "function") {
                    (r = p), (n = p.return);
                    try {
                      (t = r),
                        (y.props = t.memoizedProps),
                        (y.state = t.memoizedState),
                        y.componentWillUnmount();
                    } catch (C) {
                      Fe(r, n, C);
                    }
                  }
                  break;
                case 5:
                  Si(p, p.return);
                  break;
                case 22:
                  if (p.memoizedState !== null) {
                    Fh(d);
                    continue;
                  }
              }
              v !== null ? ((v.return = p), (j = v)) : Fh(d);
            }
            c = c.sibling;
          }
        e: for (c = null, d = e; ; ) {
          if (d.tag === 5) {
            if (c === null) {
              c = d;
              try {
                (i = d.stateNode),
                  u
                    ? ((a = i.style),
                      typeof a.setProperty == "function"
                        ? a.setProperty("display", "none", "important")
                        : (a.display = "none"))
                    : ((l = d.stateNode),
                      (s = d.memoizedProps.style),
                      (o =
                        s != null && s.hasOwnProperty("display")
                          ? s.display
                          : null),
                      (l.style.display = hm("display", o)));
              } catch (C) {
                Fe(e, e.return, C);
              }
            }
          } else if (d.tag === 6) {
            if (c === null)
              try {
                d.stateNode.nodeValue = u ? "" : d.memoizedProps;
              } catch (C) {
                Fe(e, e.return, C);
              }
          } else if (
            ((d.tag !== 22 && d.tag !== 23) ||
              d.memoizedState === null ||
              d === e) &&
            d.child !== null
          ) {
            (d.child.return = d), (d = d.child);
            continue;
          }
          if (d === e) break e;
          for (; d.sibling === null; ) {
            if (d.return === null || d.return === e) break e;
            c === d && (c = null), (d = d.return);
          }
          c === d && (c = null), (d.sibling.return = d.return), (d = d.sibling);
        }
      }
      break;
    case 19:
      Jt(t, e), hn(e), r & 4 && _h(e);
      break;
    case 21:
      break;
    default:
      Jt(t, e), hn(e);
  }
}
function hn(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (jv(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(O(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (Ga(i, ""), (r.flags &= -33));
          var a = Rh(e);
          Cc(e, a, i);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            l = Rh(e);
          kc(e, l, o);
          break;
        default:
          throw Error(O(161));
      }
    } catch (s) {
      Fe(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Aw(e, t, n) {
  (j = e), Wv(e);
}
function Wv(e, t, n) {
  for (var r = (e.mode & 1) !== 0; j !== null; ) {
    var i = j,
      a = i.child;
    if (i.tag === 22 && r) {
      var o = i.memoizedState !== null || il;
      if (!o) {
        var l = i.alternate,
          s = (l !== null && l.memoizedState !== null) || dt;
        l = il;
        var u = dt;
        if (((il = o), (dt = s) && !u))
          for (j = i; j !== null; )
            (o = j),
              (s = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Uh(i)
                : s !== null
                ? ((s.return = o), (j = s))
                : Uh(i);
        for (; a !== null; ) (j = a), Wv(a), (a = a.sibling);
        (j = i), (il = l), (dt = u);
      }
      Lh(e);
    } else
      (i.subtreeFlags & 8772) !== 0 && a !== null
        ? ((a.return = i), (j = a))
        : Lh(e);
  }
}
function Lh(e) {
  for (; j !== null; ) {
    var t = j;
    if ((t.flags & 8772) !== 0) {
      var n = t.alternate;
      try {
        if ((t.flags & 8772) !== 0)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              dt || xs(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !dt)
                if (n === null) r.componentDidMount();
                else {
                  var i =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Zt(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    i,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var a = t.updateQueue;
              a !== null && yh(t, a, r);
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
                yh(t, o, n);
              }
              break;
            case 5:
              var l = t.stateNode;
              if (n === null && t.flags & 4) {
                n = l;
                var s = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s.autoFocus && n.focus();
                    break;
                  case "img":
                    s.src && (n.src = s.src);
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
                  var c = u.memoizedState;
                  if (c !== null) {
                    var d = c.dehydrated;
                    d !== null && eo(d);
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
              throw Error(O(163));
          }
        dt || (t.flags & 512 && Sc(t));
      } catch (p) {
        Fe(t, t.return, p);
      }
    }
    if (t === e) {
      j = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (j = n);
      break;
    }
    j = t.return;
  }
}
function Fh(e) {
  for (; j !== null; ) {
    var t = j;
    if (t === e) {
      j = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (j = n);
      break;
    }
    j = t.return;
  }
}
function Uh(e) {
  for (; j !== null; ) {
    var t = j;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            xs(4, t);
          } catch (s) {
            Fe(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              Fe(t, i, s);
            }
          }
          var a = t.return;
          try {
            Sc(t);
          } catch (s) {
            Fe(t, a, s);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Sc(t);
          } catch (s) {
            Fe(t, o, s);
          }
      }
    } catch (s) {
      Fe(t, t.return, s);
    }
    if (t === e) {
      j = null;
      break;
    }
    var l = t.sibling;
    if (l !== null) {
      (l.return = t.return), (j = l);
      break;
    }
    j = t.return;
  }
}
var Iw = Math.ceil,
  Yl = An.ReactCurrentDispatcher,
  Hd = An.ReactCurrentOwner,
  qt = An.ReactCurrentBatchConfig,
  ue = 0,
  nt = null,
  Be = null,
  ot = 0,
  Ot = 0,
  ki = kr(0),
  qe = 0,
  fo = null,
  Kr = 0,
  Ss = 0,
  Wd = 0,
  Qa = null,
  kt = null,
  Bd = 0,
  ta = 1 / 0,
  Tn = null,
  Vl = !1,
  Ec = null,
  mr = null,
  al = !1,
  ur = null,
  ql = 0,
  Ya = 0,
  Tc = null,
  xl = -1,
  Sl = 0;
function vt() {
  return (ue & 6) !== 0 ? $e() : xl !== -1 ? xl : (xl = $e());
}
function vr(e) {
  return (e.mode & 1) === 0
    ? 1
    : (ue & 2) !== 0 && ot !== 0
    ? ot & -ot
    : Sw.transition !== null
    ? (Sl === 0 && (Sl = Pm()), Sl)
    : ((e = ye),
      e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : _m(e.type))),
      e);
}
function on(e, t, n, r) {
  if (50 < Ya) throw ((Ya = 0), (Tc = null), Error(O(185)));
  Ro(e, n, r),
    ((ue & 2) === 0 || e !== nt) &&
      (e === nt && ((ue & 2) === 0 && (Ss |= n), qe === 4 && Jn(e, ot)),
      Pt(e, r),
      n === 1 &&
        ue === 0 &&
        (t.mode & 1) === 0 &&
        ((ta = $e() + 500), ys && Cr()));
}
function Pt(e, t) {
  var n = e.callbackNode;
  S0(e, t);
  var r = Ol(e, e === nt ? ot : 0);
  if (r === 0)
    n !== null && Qf(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Qf(n), t === 1))
      e.tag === 0 ? xw(Ah.bind(null, e)) : Jm(Ah.bind(null, e)),
        vw(function () {
          (ue & 6) === 0 && Cr();
        }),
        (n = null);
    else {
      switch (Dm(r)) {
        case 1:
          n = vd;
          break;
        case 4:
          n = Em;
          break;
        case 16:
          n = Ml;
          break;
        case 536870912:
          n = Tm;
          break;
        default:
          n = Ml;
      }
      n = Xv(n, Bv.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function Bv(e, t) {
  if (((xl = -1), (Sl = 0), (ue & 6) !== 0)) throw Error(O(327));
  var n = e.callbackNode;
  if (Ni() && e.callbackNode !== n) return null;
  var r = Ol(e, e === nt ? ot : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Kl(e, r);
  else {
    t = r;
    var i = ue;
    ue |= 2;
    var a = Yv();
    (nt !== e || ot !== t) && ((Tn = null), (ta = $e() + 500), Br(e, t));
    do
      try {
        zw();
        break;
      } catch (l) {
        Qv(e, l);
      }
    while (1);
    Nd(),
      (Yl.current = a),
      (ue = i),
      Be !== null ? (t = 0) : ((nt = null), (ot = 0), (t = qe));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((i = Ju(e)), i !== 0 && ((r = i), (t = Pc(e, i)))), t === 1)
    )
      throw ((n = fo), Br(e, 0), Jn(e, r), Pt(e, $e()), n);
    if (t === 6) Jn(e, r);
    else {
      if (
        ((i = e.current.alternate),
        (r & 30) === 0 &&
          !$w(i) &&
          ((t = Kl(e, r)),
          t === 2 && ((a = Ju(e)), a !== 0 && ((r = a), (t = Pc(e, a)))),
          t === 1))
      )
        throw ((n = fo), Br(e, 0), Jn(e, r), Pt(e, $e()), n);
      switch (((e.finishedWork = i), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(O(345));
        case 2:
          br(e, kt, Tn);
          break;
        case 3:
          if (
            (Jn(e, r), (r & 130023424) === r && ((t = Bd + 500 - $e()), 10 < t))
          ) {
            if (Ol(e, 0) !== 0) break;
            if (((i = e.suspendedLanes), (i & r) !== r)) {
              vt(), (e.pingedLanes |= e.suspendedLanes & i);
              break;
            }
            e.timeoutHandle = oc(br.bind(null, e, kt, Tn), t);
            break;
          }
          br(e, kt, Tn);
          break;
        case 4:
          if ((Jn(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, i = -1; 0 < r; ) {
            var o = 31 - an(r);
            (a = 1 << o), (o = t[o]), o > i && (i = o), (r &= ~a);
          }
          if (
            ((r = i),
            (r = $e() - r),
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
                : 1960 * Iw(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = oc(br.bind(null, e, kt, Tn), r);
            break;
          }
          br(e, kt, Tn);
          break;
        case 5:
          br(e, kt, Tn);
          break;
        default:
          throw Error(O(329));
      }
    }
  }
  return Pt(e, $e()), e.callbackNode === n ? Bv.bind(null, e) : null;
}
function Pc(e, t) {
  var n = Qa;
  return (
    e.current.memoizedState.isDehydrated && (Br(e, t).flags |= 256),
    (e = Kl(e, t)),
    e !== 2 && ((t = kt), (kt = n), t !== null && Dc(t)),
    e
  );
}
function Dc(e) {
  kt === null ? (kt = e) : kt.push.apply(kt, e);
}
function $w(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            a = i.getSnapshot;
          i = i.value;
          try {
            if (!ln(a(), i)) return !1;
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
function Jn(e, t) {
  for (
    t &= ~Wd,
      t &= ~Ss,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - an(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function Ah(e) {
  if ((ue & 6) !== 0) throw Error(O(327));
  Ni();
  var t = Ol(e, 0);
  if ((t & 1) === 0) return Pt(e, $e()), null;
  var n = Kl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Ju(e);
    r !== 0 && ((t = r), (n = Pc(e, r)));
  }
  if (n === 1) throw ((n = fo), Br(e, 0), Jn(e, t), Pt(e, $e()), n);
  if (n === 6) throw Error(O(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    br(e, kt, Tn),
    Pt(e, $e()),
    null
  );
}
function Qd(e, t) {
  var n = ue;
  ue |= 1;
  try {
    return e(t);
  } finally {
    (ue = n), ue === 0 && ((ta = $e() + 500), ys && Cr());
  }
}
function Gr(e) {
  ur !== null && ur.tag === 0 && (ue & 6) === 0 && Ni();
  var t = ue;
  ue |= 1;
  var n = qt.transition,
    r = ye;
  try {
    if (((qt.transition = null), (ye = 1), e)) return e();
  } finally {
    (ye = r), (qt.transition = n), (ue = t), (ue & 6) === 0 && Cr();
  }
}
function Yd() {
  (Ot = ki.current), Te(ki);
}
function Br(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), mw(n)), Be !== null))
    for (n = Be.return; n !== null; ) {
      var r = n;
      switch ((Pd(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Ul();
          break;
        case 3:
          Zi(), Te(Et), Te(ht), Fd();
          break;
        case 5:
          Ld(r);
          break;
        case 4:
          Zi();
          break;
        case 13:
          Te(Ne);
          break;
        case 19:
          Te(Ne);
          break;
        case 10:
          Md(r.type._context);
          break;
        case 22:
        case 23:
          Yd();
      }
      n = n.return;
    }
  if (
    ((nt = e),
    (Be = e = yr(e.current, null)),
    (ot = Ot = t),
    (qe = 0),
    (fo = null),
    (Wd = Ss = Kr = 0),
    (kt = Qa = null),
    Or !== null)
  ) {
    for (t = 0; t < Or.length; t++)
      if (((n = Or[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var i = r.next,
          a = n.pending;
        if (a !== null) {
          var o = a.next;
          (a.next = i), (r.next = o);
        }
        n.pending = r;
      }
    Or = null;
  }
  return e;
}
function Qv(e, t) {
  do {
    var n = Be;
    try {
      if ((Nd(), (yl.current = Ql), Bl)) {
        for (var r = Oe.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), (r = r.next);
        }
        Bl = !1;
      }
      if (
        ((qr = 0),
        (et = Ye = Oe = null),
        (Wa = !1),
        (so = 0),
        (Hd.current = null),
        n === null || n.return === null)
      ) {
        (qe = 1), (fo = t), (Be = null);
        break;
      }
      e: {
        var a = e,
          o = n.return,
          l = n,
          s = t;
        if (
          ((t = ot),
          (l.flags |= 32768),
          s !== null && typeof s == "object" && typeof s.then == "function")
        ) {
          var u = s,
            c = l,
            d = c.tag;
          if ((c.mode & 1) === 0 && (d === 0 || d === 11 || d === 15)) {
            var p = c.alternate;
            p
              ? ((c.updateQueue = p.updateQueue),
                (c.memoizedState = p.memoizedState),
                (c.lanes = p.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var v = Eh(o);
          if (v !== null) {
            (v.flags &= -257),
              Th(v, o, l, a, t),
              v.mode & 1 && Ch(a, u, t),
              (t = v),
              (s = u);
            var y = t.updateQueue;
            if (y === null) {
              var C = new Set();
              C.add(s), (t.updateQueue = C);
            } else y.add(s);
            break e;
          } else {
            if ((t & 1) === 0) {
              Ch(a, u, t), Vd();
              break e;
            }
            s = Error(O(426));
          }
        } else if (De && l.mode & 1) {
          var k = Eh(o);
          if (k !== null) {
            (k.flags & 65536) === 0 && (k.flags |= 256),
              Th(k, o, l, a, t),
              Dd(ea(s, l));
            break e;
          }
        }
        (a = s = ea(s, l)),
          qe !== 4 && (qe = 2),
          Qa === null ? (Qa = [a]) : Qa.push(a),
          (a = o);
        do {
          switch (a.tag) {
            case 3:
              (a.flags |= 65536), (t &= -t), (a.lanes |= t);
              var f = bv(a, s, t);
              vh(a, f);
              break e;
            case 1:
              l = s;
              var h = a.type,
                g = a.stateNode;
              if (
                (a.flags & 128) === 0 &&
                (typeof h.getDerivedStateFromError == "function" ||
                  (g !== null &&
                    typeof g.componentDidCatch == "function" &&
                    (mr === null || !mr.has(g))))
              ) {
                (a.flags |= 65536), (t &= -t), (a.lanes |= t);
                var T = Nv(a, l, t);
                vh(a, T);
                break e;
              }
          }
          a = a.return;
        } while (a !== null);
      }
      qv(n);
    } catch (M) {
      (t = M), Be === n && n !== null && (Be = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Yv() {
  var e = Yl.current;
  return (Yl.current = Ql), e === null ? Ql : e;
}
function Vd() {
  (qe === 0 || qe === 3 || qe === 2) && (qe = 4),
    nt === null ||
      ((Kr & 268435455) === 0 && (Ss & 268435455) === 0) ||
      Jn(nt, ot);
}
function Kl(e, t) {
  var n = ue;
  ue |= 2;
  var r = Yv();
  (nt !== e || ot !== t) && ((Tn = null), Br(e, t));
  do
    try {
      jw();
      break;
    } catch (i) {
      Qv(e, i);
    }
  while (1);
  if ((Nd(), (ue = n), (Yl.current = r), Be !== null)) throw Error(O(261));
  return (nt = null), (ot = 0), qe;
}
function jw() {
  for (; Be !== null; ) Vv(Be);
}
function zw() {
  for (; Be !== null && !f0(); ) Vv(Be);
}
function Vv(e) {
  var t = Gv(e.alternate, e, Ot);
  (e.memoizedProps = e.pendingProps),
    t === null ? qv(e) : (Be = t),
    (Hd.current = null);
}
function qv(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), (t.flags & 32768) === 0)) {
      if (((n = _w(n, t, Ot)), n !== null)) {
        Be = n;
        return;
      }
    } else {
      if (((n = Lw(n, t)), n !== null)) {
        (n.flags &= 32767), (Be = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (qe = 6), (Be = null);
        return;
      }
    }
    if (((t = t.sibling), t !== null)) {
      Be = t;
      return;
    }
    Be = t = e;
  } while (t !== null);
  qe === 0 && (qe = 5);
}
function br(e, t, n) {
  var r = ye,
    i = qt.transition;
  try {
    (qt.transition = null), (ye = 1), Hw(e, t, n, r);
  } finally {
    (qt.transition = i), (ye = r);
  }
  return null;
}
function Hw(e, t, n, r) {
  do Ni();
  while (ur !== null);
  if ((ue & 6) !== 0) throw Error(O(327));
  n = e.finishedWork;
  var i = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(O(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var a = n.lanes | n.childLanes;
  if (
    (k0(e, a),
    e === nt && ((Be = nt = null), (ot = 0)),
    ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
      al ||
      ((al = !0),
      Xv(Ml, function () {
        return Ni(), null;
      })),
    (a = (n.flags & 15990) !== 0),
    (n.subtreeFlags & 15990) !== 0 || a)
  ) {
    (a = qt.transition), (qt.transition = null);
    var o = ye;
    ye = 1;
    var l = ue;
    (ue |= 4),
      (Hd.current = null),
      Uw(e, n),
      Hv(n, e),
      sw(ic),
      (Rl = !!rc),
      (ic = rc = null),
      (e.current = n),
      Aw(n),
      h0(),
      (ue = l),
      (ye = o),
      (qt.transition = a);
  } else e.current = n;
  if (
    (al && ((al = !1), (ur = e), (ql = i)),
    (a = e.pendingLanes),
    a === 0 && (mr = null),
    v0(n.stateNode),
    Pt(e, $e()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (i = t[n]), r(i.value, { componentStack: i.stack, digest: i.digest });
  if (Vl) throw ((Vl = !1), (e = Ec), (Ec = null), e);
  return (
    (ql & 1) !== 0 && e.tag !== 0 && Ni(),
    (a = e.pendingLanes),
    (a & 1) !== 0 ? (e === Tc ? Ya++ : ((Ya = 0), (Tc = e))) : (Ya = 0),
    Cr(),
    null
  );
}
function Ni() {
  if (ur !== null) {
    var e = Dm(ql),
      t = qt.transition,
      n = ye;
    try {
      if (((qt.transition = null), (ye = 16 > e ? 16 : e), ur === null))
        var r = !1;
      else {
        if (((e = ur), (ur = null), (ql = 0), (ue & 6) !== 0))
          throw Error(O(331));
        var i = ue;
        for (ue |= 4, j = e.current; j !== null; ) {
          var a = j,
            o = a.child;
          if ((j.flags & 16) !== 0) {
            var l = a.deletions;
            if (l !== null) {
              for (var s = 0; s < l.length; s++) {
                var u = l[s];
                for (j = u; j !== null; ) {
                  var c = j;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ba(8, c, a);
                  }
                  var d = c.child;
                  if (d !== null) (d.return = c), (j = d);
                  else
                    for (; j !== null; ) {
                      c = j;
                      var p = c.sibling,
                        v = c.return;
                      if (($v(c), c === u)) {
                        j = null;
                        break;
                      }
                      if (p !== null) {
                        (p.return = v), (j = p);
                        break;
                      }
                      j = v;
                    }
                }
              }
              var y = a.alternate;
              if (y !== null) {
                var C = y.child;
                if (C !== null) {
                  y.child = null;
                  do {
                    var k = C.sibling;
                    (C.sibling = null), (C = k);
                  } while (C !== null);
                }
              }
              j = a;
            }
          }
          if ((a.subtreeFlags & 2064) !== 0 && o !== null)
            (o.return = a), (j = o);
          else
            e: for (; j !== null; ) {
              if (((a = j), (a.flags & 2048) !== 0))
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ba(9, a, a.return);
                }
              var f = a.sibling;
              if (f !== null) {
                (f.return = a.return), (j = f);
                break e;
              }
              j = a.return;
            }
        }
        var h = e.current;
        for (j = h; j !== null; ) {
          o = j;
          var g = o.child;
          if ((o.subtreeFlags & 2064) !== 0 && g !== null)
            (g.return = o), (j = g);
          else
            e: for (o = h; j !== null; ) {
              if (((l = j), (l.flags & 2048) !== 0))
                try {
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      xs(9, l);
                  }
                } catch (M) {
                  Fe(l, l.return, M);
                }
              if (l === o) {
                j = null;
                break e;
              }
              var T = l.sibling;
              if (T !== null) {
                (T.return = l.return), (j = T);
                break e;
              }
              j = l.return;
            }
        }
        if (
          ((ue = i), Cr(), kn && typeof kn.onPostCommitFiberRoot == "function")
        )
          try {
            kn.onPostCommitFiberRoot(fs, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (ye = n), (qt.transition = t);
    }
  }
  return !1;
}
function Ih(e, t, n) {
  (t = ea(n, t)),
    (t = bv(e, t, 1)),
    (e = pr(e, t, 1)),
    (t = vt()),
    e !== null && (Ro(e, 1, t), Pt(e, t));
}
function Fe(e, t, n) {
  if (e.tag === 3) Ih(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Ih(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (mr === null || !mr.has(r)))
        ) {
          (e = ea(n, e)),
            (e = Nv(t, e, 1)),
            (t = pr(t, e, 1)),
            (e = vt()),
            t !== null && (Ro(t, 1, e), Pt(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function Ww(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = vt()),
    (e.pingedLanes |= e.suspendedLanes & n),
    nt === e &&
      (ot & n) === n &&
      (qe === 4 || (qe === 3 && (ot & 130023424) === ot && 500 > $e() - Bd)
        ? Br(e, 0)
        : (Wd |= n)),
    Pt(e, t);
}
function Kv(e, t) {
  t === 0 &&
    ((e.mode & 1) === 0
      ? (t = 1)
      : ((t = Ko), (Ko <<= 1), (Ko & 130023424) === 0 && (Ko = 4194304)));
  var n = vt();
  (e = Fn(e, t)), e !== null && (Ro(e, t, n), Pt(e, n));
}
function Bw(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), Kv(e, n);
}
function Qw(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        i = e.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(O(314));
  }
  r !== null && r.delete(t), Kv(e, n);
}
var Gv;
Gv = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Et.current) Ct = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
        return (Ct = !1), Rw(e, t, n);
      Ct = (e.flags & 131072) !== 0;
    }
  else (Ct = !1), De && (t.flags & 1048576) !== 0 && Zm(t, $l, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      wl(e, t), (e = t.pendingProps);
      var i = Gi(t, ht.current);
      bi(t, n), (i = Ad(null, t, r, e, i, n));
      var a = Id();
      return (
        (t.flags |= 1),
        typeof i == "object" &&
        i !== null &&
        typeof i.render == "function" &&
        i.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Tt(r) ? ((a = !0), Al(t)) : (a = !1),
            (t.memoizedState =
              i.state !== null && i.state !== void 0 ? i.state : null),
            Rd(t),
            (i.updater = gs),
            (t.stateNode = i),
            (i._reactInternals = t),
            hc(t, r, e, n),
            (t = vc(null, t, r, !0, a, n)))
          : ((t.tag = 0), De && a && Td(t), mt(null, t, i, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (wl(e, t),
          (e = t.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (t.type = r),
          (i = t.tag = Vw(r)),
          (e = Zt(r, e)),
          i)
        ) {
          case 0:
            t = mc(null, t, r, e, n);
            break e;
          case 1:
            t = bh(null, t, r, e, n);
            break e;
          case 11:
            t = Ph(null, t, r, e, n);
            break e;
          case 14:
            t = Dh(null, t, r, Zt(r.type, e), n);
            break e;
        }
        throw Error(O(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : Zt(r, i)),
        mc(e, t, r, i, n)
      );
    case 1:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : Zt(r, i)),
        bh(e, t, r, i, n)
      );
    case 3:
      e: {
        if ((_v(t), e === null)) throw Error(O(387));
        (r = t.pendingProps),
          (a = t.memoizedState),
          (i = a.element),
          rv(e, t),
          Hl(t, r, null, n);
        var o = t.memoizedState;
        if (((r = o.element), a.isDehydrated))
          if (
            ((a = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = a),
            (t.memoizedState = a),
            t.flags & 256)
          ) {
            (i = ea(Error(O(423)), t)), (t = Nh(e, t, r, n, i));
            break e;
          } else if (r !== i) {
            (i = ea(Error(O(424)), t)), (t = Nh(e, t, r, n, i));
            break e;
          } else
            for (
              Rt = hr(t.stateNode.containerInfo.firstChild),
                _t = t,
                De = !0,
                rn = null,
                n = lv(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Xi(), r === i)) {
            t = Un(e, t, n);
            break e;
          }
          mt(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        sv(t),
        e === null && cc(t),
        (r = t.type),
        (i = t.pendingProps),
        (a = e !== null ? e.memoizedProps : null),
        (o = i.children),
        ac(r, i) ? (o = null) : a !== null && ac(r, a) && (t.flags |= 32),
        Rv(e, t),
        mt(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && cc(t), null;
    case 13:
      return Lv(e, t, n);
    case 4:
      return (
        _d(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Ji(t, null, r, n)) : mt(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : Zt(r, i)),
        Ph(e, t, r, i, n)
      );
    case 7:
      return mt(e, t, t.pendingProps, n), t.child;
    case 8:
      return mt(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return mt(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (i = t.pendingProps),
          (a = t.memoizedProps),
          (o = i.value),
          Ce(jl, r._currentValue),
          (r._currentValue = o),
          a !== null)
        )
          if (ln(a.value, o)) {
            if (a.children === i.children && !Et.current) {
              t = Un(e, t, n);
              break e;
            }
          } else
            for (a = t.child, a !== null && (a.return = t); a !== null; ) {
              var l = a.dependencies;
              if (l !== null) {
                o = a.child;
                for (var s = l.firstContext; s !== null; ) {
                  if (s.context === r) {
                    if (a.tag === 1) {
                      (s = On(-1, n & -n)), (s.tag = 2);
                      var u = a.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var c = u.pending;
                        c === null
                          ? (s.next = s)
                          : ((s.next = c.next), (c.next = s)),
                          (u.pending = s);
                      }
                    }
                    (a.lanes |= n),
                      (s = a.alternate),
                      s !== null && (s.lanes |= n),
                      dc(a.return, n, t),
                      (l.lanes |= n);
                    break;
                  }
                  s = s.next;
                }
              } else if (a.tag === 10) o = a.type === t.type ? null : a.child;
              else if (a.tag === 18) {
                if (((o = a.return), o === null)) throw Error(O(341));
                (o.lanes |= n),
                  (l = o.alternate),
                  l !== null && (l.lanes |= n),
                  dc(o, n, t),
                  (o = a.sibling);
              } else o = a.child;
              if (o !== null) o.return = a;
              else
                for (o = a; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((a = o.sibling), a !== null)) {
                    (a.return = o.return), (o = a);
                    break;
                  }
                  o = o.return;
                }
              a = o;
            }
        mt(e, t, i.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (i = t.type),
        (r = t.pendingProps.children),
        bi(t, n),
        (i = Kt(i)),
        (r = r(i)),
        (t.flags |= 1),
        mt(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (i = Zt(r, t.pendingProps)),
        (i = Zt(r.type, i)),
        Dh(e, t, r, i, n)
      );
    case 15:
      return Mv(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : Zt(r, i)),
        wl(e, t),
        (t.tag = 1),
        Tt(r) ? ((e = !0), Al(t)) : (e = !1),
        bi(t, n),
        av(t, r, i),
        hc(t, r, i, n),
        vc(null, t, r, !0, e, n)
      );
    case 19:
      return Fv(e, t, n);
    case 22:
      return Ov(e, t, n);
  }
  throw Error(O(156, t.tag));
};
function Xv(e, t) {
  return Cm(e, t);
}
function Yw(e, t, n, r) {
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
function Vt(e, t, n, r) {
  return new Yw(e, t, n, r);
}
function qd(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function Vw(e) {
  if (typeof e == "function") return qd(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === hd)) return 11;
    if (e === pd) return 14;
  }
  return 2;
}
function yr(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Vt(e.tag, t, e.key, e.mode)),
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
function kl(e, t, n, r, i, a) {
  var o = 2;
  if (((r = e), typeof e == "function")) qd(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case fi:
        return Qr(n.children, i, a, t);
      case fd:
        (o = 8), (i |= 8);
        break;
      case Au:
        return (
          (e = Vt(12, n, t, i | 2)), (e.elementType = Au), (e.lanes = a), e
        );
      case Iu:
        return (e = Vt(13, n, t, i)), (e.elementType = Iu), (e.lanes = a), e;
      case $u:
        return (e = Vt(19, n, t, i)), (e.elementType = $u), (e.lanes = a), e;
      case om:
        return ks(n, i, a, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case im:
              o = 10;
              break e;
            case am:
              o = 9;
              break e;
            case hd:
              o = 11;
              break e;
            case pd:
              o = 14;
              break e;
            case Kn:
              (o = 16), (r = null);
              break e;
          }
        throw Error(O(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Vt(o, n, t, i)), (t.elementType = e), (t.type = r), (t.lanes = a), t
  );
}
function Qr(e, t, n, r) {
  return (e = Vt(7, e, r, t)), (e.lanes = n), e;
}
function ks(e, t, n, r) {
  return (
    (e = Vt(22, e, r, t)),
    (e.elementType = om),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function xu(e, t, n) {
  return (e = Vt(6, e, null, t)), (e.lanes = n), e;
}
function Su(e, t, n) {
  return (
    (t = Vt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function qw(e, t, n, r, i) {
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
    (this.eventTimes = tu(0)),
    (this.expirationTimes = tu(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = tu(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null);
}
function Kd(e, t, n, r, i, a, o, l, s) {
  return (
    (e = new qw(e, t, n, l, s)),
    t === 1 ? ((t = 1), a === !0 && (t |= 8)) : (t = 0),
    (a = Vt(3, null, null, t)),
    (e.current = a),
    (a.stateNode = e),
    (a.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Rd(a),
    e
  );
}
function Kw(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: di,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Jv(e) {
  if (!e) return xr;
  e = e._reactInternals;
  e: {
    if (ni(e) !== e || e.tag !== 1) throw Error(O(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Tt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(O(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Tt(n)) return Xm(e, n, t);
  }
  return t;
}
function Zv(e, t, n, r, i, a, o, l, s) {
  return (
    (e = Kd(n, r, !0, e, i, a, o, l, s)),
    (e.context = Jv(null)),
    (n = e.current),
    (r = vt()),
    (i = vr(n)),
    (a = On(r, i)),
    (a.callback = t != null ? t : null),
    pr(n, a, i),
    (e.current.lanes = i),
    Ro(e, i, r),
    Pt(e, r),
    e
  );
}
function Cs(e, t, n, r) {
  var i = t.current,
    a = vt(),
    o = vr(i);
  return (
    (n = Jv(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = On(a, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = pr(i, t, o)),
    e !== null && (on(e, i, o, a), vl(e, i, o)),
    o
  );
}
function Gl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function $h(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Gd(e, t) {
  $h(e, t), (e = e.alternate) && $h(e, t);
}
function Gw() {
  return null;
}
var ey =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Xd(e) {
  this._internalRoot = e;
}
Es.prototype.render = Xd.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(O(409));
  Cs(e, t, null, null);
};
Es.prototype.unmount = Xd.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Gr(function () {
      Cs(null, e, null, null);
    }),
      (t[Ln] = null);
  }
};
function Es(e) {
  this._internalRoot = e;
}
Es.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Mm();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Xn.length && t !== 0 && t < Xn[n].priority; n++);
    Xn.splice(n, 0, e), n === 0 && Rm(e);
  }
};
function Jd(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ts(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function jh() {}
function Xw(e, t, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var a = r;
      r = function () {
        var u = Gl(o);
        a.call(u);
      };
    }
    var o = Zv(t, r, e, 0, null, !1, !1, "", jh);
    return (
      (e._reactRootContainer = o),
      (e[Ln] = o.current),
      ro(e.nodeType === 8 ? e.parentNode : e),
      Gr(),
      o
    );
  }
  for (; (i = e.lastChild); ) e.removeChild(i);
  if (typeof r == "function") {
    var l = r;
    r = function () {
      var u = Gl(s);
      l.call(u);
    };
  }
  var s = Kd(e, 0, !1, null, null, !1, !1, "", jh);
  return (
    (e._reactRootContainer = s),
    (e[Ln] = s.current),
    ro(e.nodeType === 8 ? e.parentNode : e),
    Gr(function () {
      Cs(t, s, n, r);
    }),
    s
  );
}
function Ps(e, t, n, r, i) {
  var a = n._reactRootContainer;
  if (a) {
    var o = a;
    if (typeof i == "function") {
      var l = i;
      i = function () {
        var s = Gl(o);
        l.call(s);
      };
    }
    Cs(t, o, e, i);
  } else o = Xw(n, t, e, i, r);
  return Gl(o);
}
bm = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Fa(t.pendingLanes);
        n !== 0 &&
          (yd(t, n | 1),
          Pt(t, $e()),
          (ue & 6) === 0 && ((ta = $e() + 500), Cr()));
      }
      break;
    case 13:
      Gr(function () {
        var r = Fn(e, 1);
        if (r !== null) {
          var i = vt();
          on(r, e, 1, i);
        }
      }),
        Gd(e, 1);
  }
};
gd = function (e) {
  if (e.tag === 13) {
    var t = Fn(e, 134217728);
    if (t !== null) {
      var n = vt();
      on(t, e, 134217728, n);
    }
    Gd(e, 134217728);
  }
};
Nm = function (e) {
  if (e.tag === 13) {
    var t = vr(e),
      n = Fn(e, t);
    if (n !== null) {
      var r = vt();
      on(n, e, t, r);
    }
    Gd(e, t);
  }
};
Mm = function () {
  return ye;
};
Om = function (e, t) {
  var n = ye;
  try {
    return (ye = e), t();
  } finally {
    ye = n;
  }
};
Ku = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Hu(e, n), (t = n.name), n.type === "radio" && t != null)) {
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
            var i = vs(r);
            if (!i) throw Error(O(90));
            sm(r), Hu(r, i);
          }
        }
      }
      break;
    case "textarea":
      cm(e, n);
      break;
    case "select":
      (t = n.value), t != null && Ei(e, !!n.multiple, t, !1);
  }
};
ym = Qd;
gm = Gr;
var Jw = { usingClientEntryPoint: !1, Events: [Lo, vi, vs, mm, vm, Qd] },
  Ea = {
    findFiberByHostInstance: Mr,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  Zw = {
    bundleType: Ea.bundleType,
    version: Ea.version,
    rendererPackageName: Ea.rendererPackageName,
    rendererConfig: Ea.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: An.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Sm(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Ea.findFiberByHostInstance || Gw,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ol = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ol.isDisabled && ol.supportsFiber)
    try {
      (fs = ol.inject(Zw)), (kn = ol);
    } catch {}
}
Ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Jw;
Ft.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Jd(t)) throw Error(O(200));
  return Kw(e, t, null, n);
};
Ft.createRoot = function (e, t) {
  if (!Jd(e)) throw Error(O(299));
  var n = !1,
    r = "",
    i = ey;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
    (t = Kd(e, 1, !1, null, null, n, !1, r, i)),
    (e[Ln] = t.current),
    ro(e.nodeType === 8 ? e.parentNode : e),
    new Xd(t)
  );
};
Ft.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(O(188))
      : ((e = Object.keys(e).join(",")), Error(O(268, e)));
  return (e = Sm(t)), (e = e === null ? null : e.stateNode), e;
};
Ft.flushSync = function (e) {
  return Gr(e);
};
Ft.hydrate = function (e, t, n) {
  if (!Ts(t)) throw Error(O(200));
  return Ps(null, e, t, !0, n);
};
Ft.hydrateRoot = function (e, t, n) {
  if (!Jd(e)) throw Error(O(405));
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    a = "",
    o = ey;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (a = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = Zv(t, null, e, 1, n != null ? n : null, i, !1, a, o)),
    (e[Ln] = t.current),
    ro(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (i = n._getVersion),
        (i = i(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, i])
          : t.mutableSourceEagerHydrationData.push(n, i);
  return new Es(t);
};
Ft.render = function (e, t, n) {
  if (!Ts(t)) throw Error(O(200));
  return Ps(null, e, t, !1, n);
};
Ft.unmountComponentAtNode = function (e) {
  if (!Ts(e)) throw Error(O(40));
  return e._reactRootContainer
    ? (Gr(function () {
        Ps(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Ln] = null);
        });
      }),
      !0)
    : !1;
};
Ft.unstable_batchedUpdates = Qd;
Ft.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ts(n)) throw Error(O(200));
  if (e == null || e._reactInternals === void 0) throw Error(O(38));
  return Ps(e, t, n, !1, r);
};
Ft.version = "18.2.0-next-9e3b772b8-20220608";
(function (e) {
  function t() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
      } catch (n) {
        console.error(n);
      }
  }
  t(), (e.exports = Ft);
})(Mo);
const e1 = Qp(Mo.exports),
  t1 = Bp({ __proto__: null, default: e1 }, [Mo.exports]);
var zh = Mo.exports;
(Fu.createRoot = zh.createRoot), (Fu.hydrateRoot = zh.hydrateRoot);
/**
 * @remix-run/router v1.14.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function be() {
  return (
    (be = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    be.apply(this, arguments)
  );
}
var Ie;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(Ie || (Ie = {}));
const Hh = "popstate";
function n1(e) {
  e === void 0 && (e = {});
  function t(r, i) {
    let { pathname: a, search: o, hash: l } = r.location;
    return ho(
      "",
      { pathname: a, search: o, hash: l },
      (i.state && i.state.usr) || null,
      (i.state && i.state.key) || "default",
    );
  }
  function n(r, i) {
    return typeof i == "string" ? i : ua(i);
  }
  return i1(t, n, null, e);
}
function ne(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Xr(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function r1() {
  return Math.random().toString(36).substr(2, 8);
}
function Wh(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function ho(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    be(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? In(t) : t,
      { state: n, key: (t && t.key) || r || r1() },
    )
  );
}
function ua(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function In(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
function i1(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: i = document.defaultView, v5Compat: a = !1 } = r,
    o = i.history,
    l = Ie.Pop,
    s = null,
    u = c();
  u == null && ((u = 0), o.replaceState(be({}, o.state, { idx: u }), ""));
  function c() {
    return (o.state || { idx: null }).idx;
  }
  function d() {
    l = Ie.Pop;
    let k = c(),
      f = k == null ? null : k - u;
    (u = k), s && s({ action: l, location: C.location, delta: f });
  }
  function p(k, f) {
    l = Ie.Push;
    let h = ho(C.location, k, f);
    n && n(h, k), (u = c() + 1);
    let g = Wh(h, u),
      T = C.createHref(h);
    try {
      o.pushState(g, "", T);
    } catch (M) {
      if (M instanceof DOMException && M.name === "DataCloneError") throw M;
      i.location.assign(T);
    }
    a && s && s({ action: l, location: C.location, delta: 1 });
  }
  function v(k, f) {
    l = Ie.Replace;
    let h = ho(C.location, k, f);
    n && n(h, k), (u = c());
    let g = Wh(h, u),
      T = C.createHref(h);
    o.replaceState(g, "", T),
      a && s && s({ action: l, location: C.location, delta: 0 });
  }
  function y(k) {
    let f = i.location.origin !== "null" ? i.location.origin : i.location.href,
      h = typeof k == "string" ? k : ua(k);
    return (
      ne(
        f,
        "No window.location.(origin|href) available to create URL for href: " +
          h,
      ),
      new URL(h, f)
    );
  }
  let C = {
    get action() {
      return l;
    },
    get location() {
      return e(i, o);
    },
    listen(k) {
      if (s) throw new Error("A history only accepts one active listener");
      return (
        i.addEventListener(Hh, d),
        (s = k),
        () => {
          i.removeEventListener(Hh, d), (s = null);
        }
      );
    },
    createHref(k) {
      return t(i, k);
    },
    createURL: y,
    encodeLocation(k) {
      let f = y(k);
      return { pathname: f.pathname, search: f.search, hash: f.hash };
    },
    push: p,
    replace: v,
    go(k) {
      return o.go(k);
    },
  };
  return C;
}
var Le;
(function (e) {
  (e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error");
})(Le || (Le = {}));
const a1 = new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "children",
]);
function o1(e) {
  return e.index === !0;
}
function bc(e, t, n, r) {
  return (
    n === void 0 && (n = []),
    r === void 0 && (r = {}),
    e.map((i, a) => {
      let o = [...n, a],
        l = typeof i.id == "string" ? i.id : o.join("-");
      if (
        (ne(
          i.index !== !0 || !i.children,
          "Cannot specify children on an index route",
        ),
        ne(
          !r[l],
          'Found a route id collision on id "' +
            l +
            `".  Route id's must be globally unique within Data Router usages`,
        ),
        o1(i))
      ) {
        let s = be({}, i, t(i), { id: l });
        return (r[l] = s), s;
      } else {
        let s = be({}, i, t(i), { id: l, children: void 0 });
        return (
          (r[l] = s), i.children && (s.children = bc(i.children, t, o, r)), s
        );
      }
    })
  );
}
function Ci(e, t, n) {
  n === void 0 && (n = "/");
  let r = typeof t == "string" ? In(t) : t,
    i = Jr(r.pathname || "/", n);
  if (i == null) return null;
  let a = ty(e);
  s1(a);
  let o = null;
  for (let l = 0; o == null && l < a.length; ++l) o = y1(a[l], x1(i));
  return o;
}
function l1(e, t) {
  let { route: n, pathname: r, params: i } = e;
  return { id: n.id, pathname: r, params: i, data: t[n.id], handle: n.handle };
}
function ty(e, t, n, r) {
  t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = "");
  let i = (a, o, l) => {
    let s = {
      relativePath: l === void 0 ? a.path || "" : l,
      caseSensitive: a.caseSensitive === !0,
      childrenIndex: o,
      route: a,
    };
    s.relativePath.startsWith("/") &&
      (ne(
        s.relativePath.startsWith(r),
        'Absolute route path "' +
          s.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (s.relativePath = s.relativePath.slice(r.length)));
    let u = gr([r, s.relativePath]),
      c = n.concat(s);
    a.children &&
      a.children.length > 0 &&
      (ne(
        a.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + u + '".'),
      ),
      ty(a.children, t, c, u)),
      !(a.path == null && !a.index) &&
        t.push({ path: u, score: m1(u, a.index), routesMeta: c });
  };
  return (
    e.forEach((a, o) => {
      var l;
      if (a.path === "" || !((l = a.path) != null && l.includes("?"))) i(a, o);
      else for (let s of ny(a.path)) i(a, o, s);
    }),
    t
  );
}
function ny(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    i = n.endsWith("?"),
    a = n.replace(/\?$/, "");
  if (r.length === 0) return i ? [a, ""] : [a];
  let o = ny(r.join("/")),
    l = [];
  return (
    l.push(...o.map((s) => (s === "" ? a : [a, s].join("/")))),
    i && l.push(...o),
    l.map((s) => (e.startsWith("/") && s === "" ? "/" : s))
  );
}
function s1(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : v1(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
const u1 = /^:\w+$/,
  c1 = 3,
  d1 = 2,
  f1 = 1,
  h1 = 10,
  p1 = -2,
  Bh = (e) => e === "*";
function m1(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(Bh) && (r += p1),
    t && (r += d1),
    n
      .filter((i) => !Bh(i))
      .reduce((i, a) => i + (u1.test(a) ? c1 : a === "" ? f1 : h1), r)
  );
}
function v1(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, i) => r === t[i])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function y1(e, t) {
  let { routesMeta: n } = e,
    r = {},
    i = "/",
    a = [];
  for (let o = 0; o < n.length; ++o) {
    let l = n[o],
      s = o === n.length - 1,
      u = i === "/" ? t : t.slice(i.length) || "/",
      c = g1(
        { path: l.relativePath, caseSensitive: l.caseSensitive, end: s },
        u,
      );
    if (!c) return null;
    Object.assign(r, c.params);
    let d = l.route;
    a.push({
      params: r,
      pathname: gr([i, c.pathname]),
      pathnameBase: E1(gr([i, c.pathnameBase])),
      route: d,
    }),
      c.pathnameBase !== "/" && (i = gr([i, c.pathnameBase]));
  }
  return a;
}
function g1(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = w1(e.path, e.caseSensitive, e.end),
    i = t.match(n);
  if (!i) return null;
  let a = i[0],
    o = a.replace(/(.)\/+$/, "$1"),
    l = i.slice(1);
  return {
    params: r.reduce((u, c, d) => {
      let { paramName: p, isOptional: v } = c;
      if (p === "*") {
        let C = l[d] || "";
        o = a.slice(0, a.length - C.length).replace(/(.)\/+$/, "$1");
      }
      const y = l[d];
      return v && !y ? (u[p] = void 0) : (u[p] = S1(y || "", p)), u;
    }, {}),
    pathname: a,
    pathnameBase: o,
    pattern: e,
  };
}
function w1(e, t, n) {
  t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    Xr(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'),
    );
  let r = [],
    i =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:(\w+)(\?)?/g,
          (o, l, s) => (
            r.push({ paramName: l, isOptional: s != null }),
            s ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (i += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (i += "\\/*$")
      : e !== "" && e !== "/" && (i += "(?:(?=\\/|$))"),
    [new RegExp(i, t ? void 0 : "i"), r]
  );
}
function x1(e) {
  try {
    return decodeURI(e);
  } catch (t) {
    return (
      Xr(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ")."),
      ),
      e
    );
  }
}
function S1(e, t) {
  try {
    return decodeURIComponent(e);
  } catch (n) {
    return (
      Xr(
        !1,
        'The value for the URL param "' +
          t +
          '" will not be decoded because' +
          (' the string "' +
            e +
            '" is a malformed URL segment. This is probably') +
          (" due to a bad percent encoding (" + n + ")."),
      ),
      e
    );
  }
}
function Jr(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function k1(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: i = "",
  } = typeof e == "string" ? In(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : C1(n, t)) : t,
    search: T1(r),
    hash: P1(i),
  };
}
function C1(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((i) => {
      i === ".." ? n.length > 1 && n.pop() : i !== "." && n.push(i);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function ku(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function ry(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function iy(e, t) {
  let n = ry(e);
  return t
    ? n.map((r, i) => (i === e.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function ay(e, t, n, r) {
  r === void 0 && (r = !1);
  let i;
  typeof e == "string"
    ? (i = In(e))
    : ((i = be({}, e)),
      ne(
        !i.pathname || !i.pathname.includes("?"),
        ku("?", "pathname", "search", i),
      ),
      ne(
        !i.pathname || !i.pathname.includes("#"),
        ku("#", "pathname", "hash", i),
      ),
      ne(!i.search || !i.search.includes("#"), ku("#", "search", "hash", i)));
  let a = e === "" || i.pathname === "",
    o = a ? "/" : i.pathname,
    l;
  if (o == null) l = n;
  else if (r) {
    let d = t.length === 0 ? [] : t[t.length - 1].replace(/^\//, "").split("/");
    if (o.startsWith("..")) {
      let p = o.split("/");
      for (; p[0] === ".."; ) p.shift(), d.pop();
      i.pathname = p.join("/");
    }
    l = "/" + d.join("/");
  } else {
    let d = t.length - 1;
    if (o.startsWith("..")) {
      let p = o.split("/");
      for (; p[0] === ".."; ) p.shift(), (d -= 1);
      i.pathname = p.join("/");
    }
    l = d >= 0 ? t[d] : "/";
  }
  let s = k1(i, l),
    u = o && o !== "/" && o.endsWith("/"),
    c = (a || o === ".") && n.endsWith("/");
  return !s.pathname.endsWith("/") && (u || c) && (s.pathname += "/"), s;
}
const gr = (e) => e.join("/").replace(/\/\/+/g, "/"),
  E1 = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  T1 = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  P1 = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e),
  oy = function (t, n) {
    n === void 0 && (n = 302);
    let r = n;
    typeof r == "number"
      ? (r = { status: r })
      : typeof r.status > "u" && (r.status = 302);
    let i = new Headers(r.headers);
    return i.set("Location", t), new Response(null, be({}, r, { headers: i }));
  };
class Zd {
  constructor(t, n, r, i) {
    i === void 0 && (i = !1),
      (this.status = t),
      (this.statusText = n || ""),
      (this.internal = i),
      r instanceof Error
        ? ((this.data = r.toString()), (this.error = r))
        : (this.data = r);
  }
}
function ly(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const sy = ["post", "put", "patch", "delete"],
  D1 = new Set(sy),
  b1 = ["get", ...sy],
  N1 = new Set(b1),
  M1 = new Set([301, 302, 303, 307, 308]),
  O1 = new Set([307, 308]),
  Cu = {
    state: "idle",
    location: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  R1 = {
    state: "idle",
    data: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  Ta = { state: "unblocked", proceed: void 0, reset: void 0, location: void 0 },
  uy = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  _1 = (e) => ({ hasErrorBoundary: Boolean(e.hasErrorBoundary) }),
  cy = "remix-router-transitions";
function L1(e) {
  const t = e.window ? e.window : typeof window < "u" ? window : void 0,
    n =
      typeof t < "u" &&
      typeof t.document < "u" &&
      typeof t.document.createElement < "u",
    r = !n;
  ne(
    e.routes.length > 0,
    "You must provide a non-empty routes array to createRouter",
  );
  let i;
  if (e.mapRouteProperties) i = e.mapRouteProperties;
  else if (e.detectErrorBoundary) {
    let E = e.detectErrorBoundary;
    i = (D) => ({ hasErrorBoundary: E(D) });
  } else i = _1;
  let a = {},
    o = bc(e.routes, i, void 0, a),
    l,
    s = e.basename || "/",
    u = be(
      {
        v7_fetcherPersist: !1,
        v7_normalizeFormMethod: !1,
        v7_partialHydration: !1,
        v7_prependBasename: !1,
        v7_relativeSplatPath: !1,
      },
      e.future,
    ),
    c = null,
    d = new Set(),
    p = null,
    v = null,
    y = null,
    C = e.hydrationData != null,
    k = Ci(o, e.history.location, s),
    f = null;
  if (k == null) {
    let E = Wt(404, { pathname: e.history.location.pathname }),
      { matches: D, route: N } = Jh(o);
    (k = D), (f = { [N.id]: E });
  }
  let h,
    g = k.some((E) => E.route.lazy),
    T = k.some((E) => E.route.loader);
  if (g) h = !1;
  else if (!T) h = !0;
  else if (u.v7_partialHydration) {
    let E = e.hydrationData ? e.hydrationData.loaderData : null,
      D = e.hydrationData ? e.hydrationData.errors : null;
    h = k.every(
      (N) =>
        N.route.loader &&
        N.route.loader.hydrate !== !0 &&
        ((E && E[N.route.id] !== void 0) || (D && D[N.route.id] !== void 0)),
    );
  } else h = e.hydrationData != null;
  let M,
    w = {
      historyAction: e.history.action,
      location: e.history.location,
      matches: k,
      initialized: h,
      navigation: Cu,
      restoreScrollPosition: e.hydrationData != null ? !1 : null,
      preventScrollReset: !1,
      revalidation: "idle",
      loaderData: (e.hydrationData && e.hydrationData.loaderData) || {},
      actionData: (e.hydrationData && e.hydrationData.actionData) || null,
      errors: (e.hydrationData && e.hydrationData.errors) || f,
      fetchers: new Map(),
      blockers: new Map(),
    },
    P = Ie.Pop,
    b = !1,
    _,
    I = !1,
    G = new Map(),
    me = null,
    fe = !1,
    Ae = !1,
    ge = [],
    Z = [],
    X = new Map(),
    R = 0,
    W = -1,
    B = new Map(),
    ae = new Set(),
    he = new Map(),
    Dt = new Map(),
    _e = new Set(),
    wt = new Map(),
    Ke = new Map(),
    bt = !1;
  function He() {
    if (
      ((c = e.history.listen((E) => {
        let { action: D, location: N, delta: U } = E;
        if (bt) {
          bt = !1;
          return;
        }
        Xr(
          Ke.size === 0 || U != null,
          "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.",
        );
        let H = Mf({
          currentLocation: w.location,
          nextLocation: N,
          historyAction: D,
        });
        if (H && U != null) {
          (bt = !0),
            e.history.go(U * -1),
            jo(H, {
              state: "blocked",
              location: N,
              proceed() {
                jo(H, {
                  state: "proceeding",
                  proceed: void 0,
                  reset: void 0,
                  location: N,
                }),
                  e.history.go(U);
              },
              reset() {
                let ee = new Map(w.blockers);
                ee.set(H, Ta), Ge({ blockers: ee });
              },
            });
          return;
        }
        return dn(D, N);
      })),
      n)
    ) {
      Y1(t, G);
      let E = () => V1(t, G);
      t.addEventListener("pagehide", E),
        (me = () => t.removeEventListener("pagehide", E));
    }
    return w.initialized || dn(Ie.Pop, w.location, { initialHydration: !0 }), M;
  }
  function we() {
    c && c(),
      me && me(),
      d.clear(),
      _ && _.abort(),
      w.fetchers.forEach((E, D) => $o(D)),
      w.blockers.forEach((E, D) => Nf(D));
  }
  function xt(E) {
    return d.add(E), () => d.delete(E);
  }
  function Ge(E, D) {
    D === void 0 && (D = {}), (w = be({}, w, E));
    let N = [],
      U = [];
    u.v7_fetcherPersist &&
      w.fetchers.forEach((H, ee) => {
        H.state === "idle" && (_e.has(ee) ? U.push(ee) : N.push(ee));
      }),
      [...d].forEach((H) =>
        H(w, {
          deletedFetchers: U,
          unstable_viewTransitionOpts: D.viewTransitionOpts,
          unstable_flushSync: D.flushSync === !0,
        }),
      ),
      u.v7_fetcherPersist &&
        (N.forEach((H) => w.fetchers.delete(H)), U.forEach((H) => $o(H)));
  }
  function jn(E, D, N) {
    var U, H;
    let { flushSync: ee } = N === void 0 ? {} : N,
      K =
        w.actionData != null &&
        w.navigation.formMethod != null &&
        nn(w.navigation.formMethod) &&
        w.navigation.state === "loading" &&
        ((U = E.state) == null ? void 0 : U._isRedirect) !== !0,
      q;
    D.actionData
      ? Object.keys(D.actionData).length > 0
        ? (q = D.actionData)
        : (q = null)
      : K
      ? (q = w.actionData)
      : (q = null);
    let Q = D.loaderData
        ? Xh(w.loaderData, D.loaderData, D.matches || [], D.errors)
        : w.loaderData,
      oe = w.blockers;
    oe.size > 0 && ((oe = new Map(oe)), oe.forEach((Se, it) => oe.set(it, Ta)));
    let Xe =
      b === !0 ||
      (w.navigation.formMethod != null &&
        nn(w.navigation.formMethod) &&
        ((H = E.state) == null ? void 0 : H._isRedirect) !== !0);
    l && ((o = l), (l = void 0)),
      fe ||
        P === Ie.Pop ||
        (P === Ie.Push
          ? e.history.push(E, E.state)
          : P === Ie.Replace && e.history.replace(E, E.state));
    let te;
    if (P === Ie.Pop) {
      let Se = G.get(w.location.pathname);
      Se && Se.has(E.pathname)
        ? (te = { currentLocation: w.location, nextLocation: E })
        : G.has(E.pathname) &&
          (te = { currentLocation: E, nextLocation: w.location });
    } else if (I) {
      let Se = G.get(w.location.pathname);
      Se
        ? Se.add(E.pathname)
        : ((Se = new Set([E.pathname])), G.set(w.location.pathname, Se)),
        (te = { currentLocation: w.location, nextLocation: E });
    }
    Ge(
      be({}, D, {
        actionData: q,
        loaderData: Q,
        historyAction: P,
        location: E,
        initialized: !0,
        navigation: Cu,
        revalidation: "idle",
        restoreScrollPosition: Rf(E, D.matches || w.matches),
        preventScrollReset: Xe,
        blockers: oe,
      }),
      { viewTransitionOpts: te, flushSync: ee === !0 },
    ),
      (P = Ie.Pop),
      (b = !1),
      (I = !1),
      (fe = !1),
      (Ae = !1),
      (ge = []),
      (Z = []);
  }
  async function ha(E, D) {
    if (typeof E == "number") {
      e.history.go(E);
      return;
    }
    let N = Nc(
        w.location,
        w.matches,
        s,
        u.v7_prependBasename,
        E,
        u.v7_relativeSplatPath,
        D == null ? void 0 : D.fromRouteId,
        D == null ? void 0 : D.relative,
      ),
      {
        path: U,
        submission: H,
        error: ee,
      } = Qh(u.v7_normalizeFormMethod, !1, N, D),
      K = w.location,
      q = ho(w.location, U, D && D.state);
    q = be({}, q, e.history.encodeLocation(q));
    let Q = D && D.replace != null ? D.replace : void 0,
      oe = Ie.Push;
    Q === !0
      ? (oe = Ie.Replace)
      : Q === !1 ||
        (H != null &&
          nn(H.formMethod) &&
          H.formAction === w.location.pathname + w.location.search &&
          (oe = Ie.Replace));
    let Xe =
        D && "preventScrollReset" in D ? D.preventScrollReset === !0 : void 0,
      te = (D && D.unstable_flushSync) === !0,
      Se = Mf({ currentLocation: K, nextLocation: q, historyAction: oe });
    if (Se) {
      jo(Se, {
        state: "blocked",
        location: q,
        proceed() {
          jo(Se, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: q,
          }),
            ha(E, D);
        },
        reset() {
          let it = new Map(w.blockers);
          it.set(Se, Ta), Ge({ blockers: it });
        },
      });
      return;
    }
    return await dn(oe, q, {
      submission: H,
      pendingError: ee,
      preventScrollReset: Xe,
      replace: D && D.replace,
      enableViewTransition: D && D.unstable_viewTransition,
      flushSync: te,
    });
  }
  function pa() {
    if (
      (Ws(),
      Ge({ revalidation: "loading" }),
      w.navigation.state !== "submitting")
    ) {
      if (w.navigation.state === "idle") {
        dn(w.historyAction, w.location, { startUninterruptedRevalidation: !0 });
        return;
      }
      dn(P || w.historyAction, w.navigation.location, {
        overrideNavigation: w.navigation,
      });
    }
  }
  async function dn(E, D, N) {
    _ && _.abort(),
      (_ = null),
      (P = E),
      (fe = (N && N.startUninterruptedRevalidation) === !0),
      Rg(w.location, w.matches),
      (b = (N && N.preventScrollReset) === !0),
      (I = (N && N.enableViewTransition) === !0);
    let U = l || o,
      H = N && N.overrideNavigation,
      ee = Ci(U, D, s),
      K = (N && N.flushSync) === !0;
    if (!ee) {
      let it = Wt(404, { pathname: D.pathname }),
        { matches: It, route: Je } = Jh(U);
      Bs(),
        jn(
          D,
          { matches: It, loaderData: {}, errors: { [Je.id]: it } },
          { flushSync: K },
        );
      return;
    }
    if (
      w.initialized &&
      !Ae &&
      j1(w.location, D) &&
      !(N && N.submission && nn(N.submission.formMethod))
    ) {
      jn(D, { matches: ee }, { flushSync: K });
      return;
    }
    _ = new AbortController();
    let q = Da(e.history, D, _.signal, N && N.submission),
      Q,
      oe;
    if (N && N.pendingError) oe = { [Va(ee).route.id]: N.pendingError };
    else if (N && N.submission && nn(N.submission.formMethod)) {
      let it = await Eg(q, D, N.submission, ee, {
        replace: N.replace,
        flushSync: K,
      });
      if (it.shortCircuited) return;
      (Q = it.pendingActionData),
        (oe = it.pendingActionError),
        (H = Eu(D, N.submission)),
        (K = !1),
        (q = new Request(q.url, { signal: q.signal }));
    }
    let {
      shortCircuited: Xe,
      loaderData: te,
      errors: Se,
    } = await Tg(
      q,
      D,
      ee,
      H,
      N && N.submission,
      N && N.fetcherSubmission,
      N && N.replace,
      N && N.initialHydration === !0,
      K,
      Q,
      oe,
    );
    Xe ||
      ((_ = null),
      jn(
        D,
        be({ matches: ee }, Q ? { actionData: Q } : {}, {
          loaderData: te,
          errors: Se,
        }),
      ));
  }
  async function Eg(E, D, N, U, H) {
    H === void 0 && (H = {}), Ws();
    let ee = B1(D, N);
    Ge({ navigation: ee }, { flushSync: H.flushSync === !0 });
    let K,
      q = Oc(U, D);
    if (!q.route.action && !q.route.lazy)
      K = {
        type: Le.error,
        error: Wt(405, {
          method: E.method,
          pathname: D.pathname,
          routeId: q.route.id,
        }),
      };
    else if (
      ((K = await Pa("action", E, q, U, a, i, s, u.v7_relativeSplatPath)),
      E.signal.aborted)
    )
      return { shortCircuited: !0 };
    if (Mi(K)) {
      let Q;
      return (
        H && H.replace != null
          ? (Q = H.replace)
          : (Q = K.location === w.location.pathname + w.location.search),
        await ma(w, K, { submission: N, replace: Q }),
        { shortCircuited: !0 }
      );
    }
    if (qa(K)) {
      let Q = Va(U, q.route.id);
      return (
        (H && H.replace) !== !0 && (P = Ie.Push),
        { pendingActionData: {}, pendingActionError: { [Q.route.id]: K.error } }
      );
    }
    if (_r(K)) throw Wt(400, { type: "defer-action" });
    return { pendingActionData: { [q.route.id]: K.data } };
  }
  async function Tg(E, D, N, U, H, ee, K, q, Q, oe, Xe) {
    let te = U || Eu(D, H),
      Se = H || ee || tp(te),
      it = l || o,
      [It, Je] = Yh(
        e.history,
        w,
        N,
        Se,
        D,
        u.v7_partialHydration && q === !0,
        Ae,
        ge,
        Z,
        _e,
        he,
        ae,
        it,
        s,
        oe,
        Xe,
      );
    if (
      (Bs(
        (xe) =>
          !(N && N.some((Pe) => Pe.route.id === xe)) ||
          (It && It.some((Pe) => Pe.route.id === xe)),
      ),
      (W = ++R),
      It.length === 0 && Je.length === 0)
    ) {
      let xe = Df();
      return (
        jn(
          D,
          be(
            { matches: N, loaderData: {}, errors: Xe || null },
            oe ? { actionData: oe } : {},
            xe ? { fetchers: new Map(w.fetchers) } : {},
          ),
          { flushSync: Q },
        ),
        { shortCircuited: !0 }
      );
    }
    if (!fe && (!u.v7_partialHydration || !q)) {
      Je.forEach((Pe) => {
        let fn = w.fetchers.get(Pe.key),
          Ho = ba(void 0, fn ? fn.data : void 0);
        w.fetchers.set(Pe.key, Ho);
      });
      let xe = oe || w.actionData;
      Ge(
        be(
          { navigation: te },
          xe
            ? Object.keys(xe).length === 0
              ? { actionData: null }
              : { actionData: xe }
            : {},
          Je.length > 0 ? { fetchers: new Map(w.fetchers) } : {},
        ),
        { flushSync: Q },
      );
    }
    Je.forEach((xe) => {
      X.has(xe.key) && Hn(xe.key),
        xe.controller && X.set(xe.key, xe.controller);
    });
    let ai = () => Je.forEach((xe) => Hn(xe.key));
    _ && _.signal.addEventListener("abort", ai);
    let {
      results: Qs,
      loaderResults: oi,
      fetcherResults: Wn,
    } = await Ef(w.matches, N, It, Je, E);
    if (E.signal.aborted) return { shortCircuited: !0 };
    _ && _.signal.removeEventListener("abort", ai),
      Je.forEach((xe) => X.delete(xe.key));
    let Tr = Zh(Qs);
    if (Tr) {
      if (Tr.idx >= It.length) {
        let xe = Je[Tr.idx - It.length].key;
        ae.add(xe);
      }
      return await ma(w, Tr.result, { replace: K }), { shortCircuited: !0 };
    }
    let { loaderData: Ys, errors: Vs } = Gh(w, N, It, oi, Xe, Je, Wn, wt);
    wt.forEach((xe, Pe) => {
      xe.subscribe((fn) => {
        (fn || xe.done) && wt.delete(Pe);
      });
    });
    let qs = Df(),
      li = bf(W),
      zo = qs || li || Je.length > 0;
    return be(
      { loaderData: Ys, errors: Vs },
      zo ? { fetchers: new Map(w.fetchers) } : {},
    );
  }
  function Pg(E, D, N, U) {
    if (r)
      throw new Error(
        "router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.",
      );
    X.has(E) && Hn(E);
    let H = (U && U.unstable_flushSync) === !0,
      ee = l || o,
      K = Nc(
        w.location,
        w.matches,
        s,
        u.v7_prependBasename,
        N,
        u.v7_relativeSplatPath,
        D,
        U == null ? void 0 : U.relative,
      ),
      q = Ci(ee, K, s);
    if (!q) {
      va(E, D, Wt(404, { pathname: K }), { flushSync: H });
      return;
    }
    let {
      path: Q,
      submission: oe,
      error: Xe,
    } = Qh(u.v7_normalizeFormMethod, !0, K, U);
    if (Xe) {
      va(E, D, Xe, { flushSync: H });
      return;
    }
    let te = Oc(q, Q);
    if (((b = (U && U.preventScrollReset) === !0), oe && nn(oe.formMethod))) {
      Dg(E, D, Q, te, q, H, oe);
      return;
    }
    he.set(E, { routeId: D, path: Q }), bg(E, D, Q, te, q, H, oe);
  }
  async function Dg(E, D, N, U, H, ee, K) {
    if ((Ws(), he.delete(E), !U.route.action && !U.route.lazy)) {
      let Pe = Wt(405, { method: K.formMethod, pathname: N, routeId: D });
      va(E, D, Pe, { flushSync: ee });
      return;
    }
    let q = w.fetchers.get(E);
    zn(E, Q1(K, q), { flushSync: ee });
    let Q = new AbortController(),
      oe = Da(e.history, N, Q.signal, K);
    X.set(E, Q);
    let Xe = R,
      te = await Pa("action", oe, U, H, a, i, s, u.v7_relativeSplatPath);
    if (oe.signal.aborted) {
      X.get(E) === Q && X.delete(E);
      return;
    }
    if (_e.has(E)) {
      zn(E, Yn(void 0));
      return;
    }
    if (Mi(te))
      if ((X.delete(E), W > Xe)) {
        zn(E, Yn(void 0));
        return;
      } else
        return ae.add(E), zn(E, ba(K)), ma(w, te, { fetcherSubmission: K });
    if (qa(te)) {
      va(E, D, te.error);
      return;
    }
    if (_r(te)) throw Wt(400, { type: "defer-action" });
    let Se = w.navigation.location || w.location,
      it = Da(e.history, Se, Q.signal),
      It = l || o,
      Je =
        w.navigation.state !== "idle"
          ? Ci(It, w.navigation.location, s)
          : w.matches;
    ne(Je, "Didn't find any matches after fetcher action");
    let ai = ++R;
    B.set(E, ai);
    let Qs = ba(K, te.data);
    w.fetchers.set(E, Qs);
    let [oi, Wn] = Yh(
      e.history,
      w,
      Je,
      K,
      Se,
      !1,
      Ae,
      ge,
      Z,
      _e,
      he,
      ae,
      It,
      s,
      { [U.route.id]: te.data },
      void 0,
    );
    Wn.filter((Pe) => Pe.key !== E).forEach((Pe) => {
      let fn = Pe.key,
        Ho = w.fetchers.get(fn),
        Lg = ba(void 0, Ho ? Ho.data : void 0);
      w.fetchers.set(fn, Lg),
        X.has(fn) && Hn(fn),
        Pe.controller && X.set(fn, Pe.controller);
    }),
      Ge({ fetchers: new Map(w.fetchers) });
    let Tr = () => Wn.forEach((Pe) => Hn(Pe.key));
    Q.signal.addEventListener("abort", Tr);
    let {
      results: Ys,
      loaderResults: Vs,
      fetcherResults: qs,
    } = await Ef(w.matches, Je, oi, Wn, it);
    if (Q.signal.aborted) return;
    Q.signal.removeEventListener("abort", Tr),
      B.delete(E),
      X.delete(E),
      Wn.forEach((Pe) => X.delete(Pe.key));
    let li = Zh(Ys);
    if (li) {
      if (li.idx >= oi.length) {
        let Pe = Wn[li.idx - oi.length].key;
        ae.add(Pe);
      }
      return ma(w, li.result);
    }
    let { loaderData: zo, errors: xe } = Gh(
      w,
      w.matches,
      oi,
      Vs,
      void 0,
      Wn,
      qs,
      wt,
    );
    if (w.fetchers.has(E)) {
      let Pe = Yn(te.data);
      w.fetchers.set(E, Pe);
    }
    bf(ai),
      w.navigation.state === "loading" && ai > W
        ? (ne(P, "Expected pending action"),
          _ && _.abort(),
          jn(w.navigation.location, {
            matches: Je,
            loaderData: zo,
            errors: xe,
            fetchers: new Map(w.fetchers),
          }))
        : (Ge({
            errors: xe,
            loaderData: Xh(w.loaderData, zo, Je, xe),
            fetchers: new Map(w.fetchers),
          }),
          (Ae = !1));
  }
  async function bg(E, D, N, U, H, ee, K) {
    let q = w.fetchers.get(E);
    zn(E, ba(K, q ? q.data : void 0), { flushSync: ee });
    let Q = new AbortController(),
      oe = Da(e.history, N, Q.signal);
    X.set(E, Q);
    let Xe = R,
      te = await Pa("loader", oe, U, H, a, i, s, u.v7_relativeSplatPath);
    if (
      (_r(te) && (te = (await hy(te, oe.signal, !0)) || te),
      X.get(E) === Q && X.delete(E),
      !oe.signal.aborted)
    ) {
      if (_e.has(E)) {
        zn(E, Yn(void 0));
        return;
      }
      if (Mi(te))
        if (W > Xe) {
          zn(E, Yn(void 0));
          return;
        } else {
          ae.add(E), await ma(w, te);
          return;
        }
      if (qa(te)) {
        va(E, D, te.error);
        return;
      }
      ne(!_r(te), "Unhandled fetcher deferred data"), zn(E, Yn(te.data));
    }
  }
  async function ma(E, D, N) {
    let {
      submission: U,
      fetcherSubmission: H,
      replace: ee,
    } = N === void 0 ? {} : N;
    D.revalidate && (Ae = !0);
    let K = ho(E.location, D.location, { _isRedirect: !0 });
    if ((ne(K, "Expected a location on the redirect navigation"), n)) {
      let Se = !1;
      if (D.reloadDocument) Se = !0;
      else if (uy.test(D.location)) {
        const it = e.history.createURL(D.location);
        Se = it.origin !== t.location.origin || Jr(it.pathname, s) == null;
      }
      if (Se) {
        ee ? t.location.replace(D.location) : t.location.assign(D.location);
        return;
      }
    }
    _ = null;
    let q = ee === !0 ? Ie.Replace : Ie.Push,
      { formMethod: Q, formAction: oe, formEncType: Xe } = E.navigation;
    !U && !H && Q && oe && Xe && (U = tp(E.navigation));
    let te = U || H;
    if (O1.has(D.status) && te && nn(te.formMethod))
      await dn(q, K, {
        submission: be({}, te, { formAction: D.location }),
        preventScrollReset: b,
      });
    else {
      let Se = Eu(K, U);
      await dn(q, K, {
        overrideNavigation: Se,
        fetcherSubmission: H,
        preventScrollReset: b,
      });
    }
  }
  async function Ef(E, D, N, U, H) {
    let ee = await Promise.all([
        ...N.map((Q) => Pa("loader", H, Q, D, a, i, s, u.v7_relativeSplatPath)),
        ...U.map((Q) =>
          Q.matches && Q.match && Q.controller
            ? Pa(
                "loader",
                Da(e.history, Q.path, Q.controller.signal),
                Q.match,
                Q.matches,
                a,
                i,
                s,
                u.v7_relativeSplatPath,
              )
            : { type: Le.error, error: Wt(404, { pathname: Q.path }) },
        ),
      ]),
      K = ee.slice(0, N.length),
      q = ee.slice(N.length);
    return (
      await Promise.all([
        ep(
          E,
          N,
          K,
          K.map(() => H.signal),
          !1,
          w.loaderData,
        ),
        ep(
          E,
          U.map((Q) => Q.match),
          q,
          U.map((Q) => (Q.controller ? Q.controller.signal : null)),
          !0,
        ),
      ]),
      { results: ee, loaderResults: K, fetcherResults: q }
    );
  }
  function Ws() {
    (Ae = !0),
      ge.push(...Bs()),
      he.forEach((E, D) => {
        X.has(D) && (Z.push(D), Hn(D));
      });
  }
  function zn(E, D, N) {
    N === void 0 && (N = {}),
      w.fetchers.set(E, D),
      Ge(
        { fetchers: new Map(w.fetchers) },
        { flushSync: (N && N.flushSync) === !0 },
      );
  }
  function va(E, D, N, U) {
    U === void 0 && (U = {});
    let H = Va(w.matches, D);
    $o(E),
      Ge(
        { errors: { [H.route.id]: N }, fetchers: new Map(w.fetchers) },
        { flushSync: (U && U.flushSync) === !0 },
      );
  }
  function Tf(E) {
    return (
      u.v7_fetcherPersist &&
        (Dt.set(E, (Dt.get(E) || 0) + 1), _e.has(E) && _e.delete(E)),
      w.fetchers.get(E) || R1
    );
  }
  function $o(E) {
    let D = w.fetchers.get(E);
    X.has(E) && !(D && D.state === "loading" && B.has(E)) && Hn(E),
      he.delete(E),
      B.delete(E),
      ae.delete(E),
      _e.delete(E),
      w.fetchers.delete(E);
  }
  function Ng(E) {
    if (u.v7_fetcherPersist) {
      let D = (Dt.get(E) || 0) - 1;
      D <= 0 ? (Dt.delete(E), _e.add(E)) : Dt.set(E, D);
    } else $o(E);
    Ge({ fetchers: new Map(w.fetchers) });
  }
  function Hn(E) {
    let D = X.get(E);
    ne(D, "Expected fetch controller: " + E), D.abort(), X.delete(E);
  }
  function Pf(E) {
    for (let D of E) {
      let N = Tf(D),
        U = Yn(N.data);
      w.fetchers.set(D, U);
    }
  }
  function Df() {
    let E = [],
      D = !1;
    for (let N of ae) {
      let U = w.fetchers.get(N);
      ne(U, "Expected fetcher: " + N),
        U.state === "loading" && (ae.delete(N), E.push(N), (D = !0));
    }
    return Pf(E), D;
  }
  function bf(E) {
    let D = [];
    for (let [N, U] of B)
      if (U < E) {
        let H = w.fetchers.get(N);
        ne(H, "Expected fetcher: " + N),
          H.state === "loading" && (Hn(N), B.delete(N), D.push(N));
      }
    return Pf(D), D.length > 0;
  }
  function Mg(E, D) {
    let N = w.blockers.get(E) || Ta;
    return Ke.get(E) !== D && Ke.set(E, D), N;
  }
  function Nf(E) {
    w.blockers.delete(E), Ke.delete(E);
  }
  function jo(E, D) {
    let N = w.blockers.get(E) || Ta;
    ne(
      (N.state === "unblocked" && D.state === "blocked") ||
        (N.state === "blocked" && D.state === "blocked") ||
        (N.state === "blocked" && D.state === "proceeding") ||
        (N.state === "blocked" && D.state === "unblocked") ||
        (N.state === "proceeding" && D.state === "unblocked"),
      "Invalid blocker state transition: " + N.state + " -> " + D.state,
    );
    let U = new Map(w.blockers);
    U.set(E, D), Ge({ blockers: U });
  }
  function Mf(E) {
    let { currentLocation: D, nextLocation: N, historyAction: U } = E;
    if (Ke.size === 0) return;
    Ke.size > 1 && Xr(!1, "A router only supports one blocker at a time");
    let H = Array.from(Ke.entries()),
      [ee, K] = H[H.length - 1],
      q = w.blockers.get(ee);
    if (
      !(q && q.state === "proceeding") &&
      K({ currentLocation: D, nextLocation: N, historyAction: U })
    )
      return ee;
  }
  function Bs(E) {
    let D = [];
    return (
      wt.forEach((N, U) => {
        (!E || E(U)) && (N.cancel(), D.push(U), wt.delete(U));
      }),
      D
    );
  }
  function Og(E, D, N) {
    if (((p = E), (y = D), (v = N || null), !C && w.navigation === Cu)) {
      C = !0;
      let U = Rf(w.location, w.matches);
      U != null && Ge({ restoreScrollPosition: U });
    }
    return () => {
      (p = null), (y = null), (v = null);
    };
  }
  function Of(E, D) {
    return (
      (v &&
        v(
          E,
          D.map((U) => l1(U, w.loaderData)),
        )) ||
      E.key
    );
  }
  function Rg(E, D) {
    if (p && y) {
      let N = Of(E, D);
      p[N] = y();
    }
  }
  function Rf(E, D) {
    if (p) {
      let N = Of(E, D),
        U = p[N];
      if (typeof U == "number") return U;
    }
    return null;
  }
  function _g(E) {
    (a = {}), (l = bc(E, i, void 0, a));
  }
  return (
    (M = {
      get basename() {
        return s;
      },
      get future() {
        return u;
      },
      get state() {
        return w;
      },
      get routes() {
        return o;
      },
      get window() {
        return t;
      },
      initialize: He,
      subscribe: xt,
      enableScrollRestoration: Og,
      navigate: ha,
      fetch: Pg,
      revalidate: pa,
      createHref: (E) => e.history.createHref(E),
      encodeLocation: (E) => e.history.encodeLocation(E),
      getFetcher: Tf,
      deleteFetcher: Ng,
      dispose: we,
      getBlocker: Mg,
      deleteBlocker: Nf,
      _internalFetchControllers: X,
      _internalActiveDeferreds: wt,
      _internalSetRoutes: _g,
    }),
    M
  );
}
function F1(e) {
  return (
    e != null &&
    (("formData" in e && e.formData != null) ||
      ("body" in e && e.body !== void 0))
  );
}
function Nc(e, t, n, r, i, a, o, l) {
  let s, u;
  if (o) {
    s = [];
    for (let d of t)
      if ((s.push(d), d.route.id === o)) {
        u = d;
        break;
      }
  } else (s = t), (u = t[t.length - 1]);
  let c = ay(i || ".", iy(s, a), Jr(e.pathname, n) || e.pathname, l === "path");
  return (
    i == null && ((c.search = e.search), (c.hash = e.hash)),
    (i == null || i === "" || i === ".") &&
      u &&
      u.route.index &&
      !ef(c.search) &&
      (c.search = c.search ? c.search.replace(/^\?/, "?index&") : "?index"),
    r &&
      n !== "/" &&
      (c.pathname = c.pathname === "/" ? n : gr([n, c.pathname])),
    ua(c)
  );
}
function Qh(e, t, n, r) {
  if (!r || !F1(r)) return { path: n };
  if (r.formMethod && !W1(r.formMethod))
    return { path: n, error: Wt(405, { method: r.formMethod }) };
  let i = () => ({ path: n, error: Wt(400, { type: "invalid-body" }) }),
    a = r.formMethod || "get",
    o = e ? a.toUpperCase() : a.toLowerCase(),
    l = fy(n);
  if (r.body !== void 0) {
    if (r.formEncType === "text/plain") {
      if (!nn(o)) return i();
      let p =
        typeof r.body == "string"
          ? r.body
          : r.body instanceof FormData || r.body instanceof URLSearchParams
          ? Array.from(r.body.entries()).reduce((v, y) => {
              let [C, k] = y;
              return (
                "" +
                v +
                C +
                "=" +
                k +
                `
`
              );
            }, "")
          : String(r.body);
      return {
        path: n,
        submission: {
          formMethod: o,
          formAction: l,
          formEncType: r.formEncType,
          formData: void 0,
          json: void 0,
          text: p,
        },
      };
    } else if (r.formEncType === "application/json") {
      if (!nn(o)) return i();
      try {
        let p = typeof r.body == "string" ? JSON.parse(r.body) : r.body;
        return {
          path: n,
          submission: {
            formMethod: o,
            formAction: l,
            formEncType: r.formEncType,
            formData: void 0,
            json: p,
            text: void 0,
          },
        };
      } catch {
        return i();
      }
    }
  }
  ne(
    typeof FormData == "function",
    "FormData is not available in this environment",
  );
  let s, u;
  if (r.formData) (s = Mc(r.formData)), (u = r.formData);
  else if (r.body instanceof FormData) (s = Mc(r.body)), (u = r.body);
  else if (r.body instanceof URLSearchParams) (s = r.body), (u = Kh(s));
  else if (r.body == null) (s = new URLSearchParams()), (u = new FormData());
  else
    try {
      (s = new URLSearchParams(r.body)), (u = Kh(s));
    } catch {
      return i();
    }
  let c = {
    formMethod: o,
    formAction: l,
    formEncType: (r && r.formEncType) || "application/x-www-form-urlencoded",
    formData: u,
    json: void 0,
    text: void 0,
  };
  if (nn(c.formMethod)) return { path: n, submission: c };
  let d = In(n);
  return (
    t && d.search && ef(d.search) && s.append("index", ""),
    (d.search = "?" + s),
    { path: ua(d), submission: c }
  );
}
function U1(e, t) {
  let n = e;
  if (t) {
    let r = e.findIndex((i) => i.route.id === t);
    r >= 0 && (n = e.slice(0, r));
  }
  return n;
}
function Yh(e, t, n, r, i, a, o, l, s, u, c, d, p, v, y, C) {
  let k = C ? Object.values(C)[0] : y ? Object.values(y)[0] : void 0,
    f = e.createURL(t.location),
    h = e.createURL(i),
    g = C ? Object.keys(C)[0] : void 0,
    M = U1(n, g).filter((P, b) => {
      if (a) return A1(t, P.route);
      if (P.route.lazy) return !0;
      if (P.route.loader == null) return !1;
      if (I1(t.loaderData, t.matches[b], P) || l.some((G) => G === P.route.id))
        return !0;
      let _ = t.matches[b],
        I = P;
      return Vh(
        P,
        be(
          {
            currentUrl: f,
            currentParams: _.params,
            nextUrl: h,
            nextParams: I.params,
          },
          r,
          {
            actionResult: k,
            defaultShouldRevalidate:
              o ||
              f.pathname + f.search === h.pathname + h.search ||
              f.search !== h.search ||
              dy(_, I),
          },
        ),
      );
    }),
    w = [];
  return (
    c.forEach((P, b) => {
      if (a || !n.some((fe) => fe.route.id === P.routeId) || u.has(b)) return;
      let _ = Ci(p, P.path, v);
      if (!_) {
        w.push({
          key: b,
          routeId: P.routeId,
          path: P.path,
          matches: null,
          match: null,
          controller: null,
        });
        return;
      }
      let I = t.fetchers.get(b),
        G = Oc(_, P.path),
        me = !1;
      d.has(b)
        ? (me = !1)
        : s.includes(b)
        ? (me = !0)
        : I && I.state !== "idle" && I.data === void 0
        ? (me = o)
        : (me = Vh(
            G,
            be(
              {
                currentUrl: f,
                currentParams: t.matches[t.matches.length - 1].params,
                nextUrl: h,
                nextParams: n[n.length - 1].params,
              },
              r,
              { actionResult: k, defaultShouldRevalidate: o },
            ),
          )),
        me &&
          w.push({
            key: b,
            routeId: P.routeId,
            path: P.path,
            matches: _,
            match: G,
            controller: new AbortController(),
          });
    }),
    [M, w]
  );
}
function A1(e, t) {
  return t.loader
    ? t.loader.hydrate
      ? !0
      : e.loaderData[t.id] === void 0 &&
        (!e.errors || e.errors[t.id] === void 0)
    : !1;
}
function I1(e, t, n) {
  let r = !t || n.route.id !== t.route.id,
    i = e[n.route.id] === void 0;
  return r || i;
}
function dy(e, t) {
  let n = e.route.path;
  return (
    e.pathname !== t.pathname ||
    (n != null && n.endsWith("*") && e.params["*"] !== t.params["*"])
  );
}
function Vh(e, t) {
  if (e.route.shouldRevalidate) {
    let n = e.route.shouldRevalidate(t);
    if (typeof n == "boolean") return n;
  }
  return t.defaultShouldRevalidate;
}
async function qh(e, t, n) {
  if (!e.lazy) return;
  let r = await e.lazy();
  if (!e.lazy) return;
  let i = n[e.id];
  ne(i, "No route found in manifest");
  let a = {};
  for (let o in r) {
    let s = i[o] !== void 0 && o !== "hasErrorBoundary";
    Xr(
      !s,
      'Route "' +
        i.id +
        '" has a static property "' +
        o +
        '" defined but its lazy function is also returning a value for this property. ' +
        ('The lazy route property "' + o + '" will be ignored.'),
    ),
      !s && !a1.has(o) && (a[o] = r[o]);
  }
  Object.assign(i, a), Object.assign(i, be({}, t(i), { lazy: void 0 }));
}
async function Pa(e, t, n, r, i, a, o, l, s) {
  s === void 0 && (s = {});
  let u,
    c,
    d,
    p = (C) => {
      let k,
        f = new Promise((h, g) => (k = g));
      return (
        (d = () => k()),
        t.signal.addEventListener("abort", d),
        Promise.race([
          C({ request: t, params: n.params, context: s.requestContext }),
          f,
        ])
      );
    };
  try {
    let C = n.route[e];
    if (n.route.lazy)
      if (C) {
        let k,
          f = await Promise.all([
            p(C).catch((h) => {
              k = h;
            }),
            qh(n.route, a, i),
          ]);
        if (k) throw k;
        c = f[0];
      } else if ((await qh(n.route, a, i), (C = n.route[e]), C)) c = await p(C);
      else if (e === "action") {
        let k = new URL(t.url),
          f = k.pathname + k.search;
        throw Wt(405, { method: t.method, pathname: f, routeId: n.route.id });
      } else return { type: Le.data, data: void 0 };
    else if (C) c = await p(C);
    else {
      let k = new URL(t.url),
        f = k.pathname + k.search;
      throw Wt(404, { pathname: f });
    }
    ne(
      c !== void 0,
      "You defined " +
        (e === "action" ? "an action" : "a loader") +
        " for route " +
        ('"' +
          n.route.id +
          "\" but didn't return anything from your `" +
          e +
          "` ") +
        "function. Please return a value or `null`.",
    );
  } catch (C) {
    (u = Le.error), (c = C);
  } finally {
    d && t.signal.removeEventListener("abort", d);
  }
  if (H1(c)) {
    let C = c.status;
    if (M1.has(C)) {
      let f = c.headers.get("Location");
      if (
        (ne(
          f,
          "Redirects returned/thrown from loaders/actions must have a Location header",
        ),
        !uy.test(f))
      )
        f = Nc(new URL(t.url), r.slice(0, r.indexOf(n) + 1), o, !0, f, l);
      else if (!s.isStaticRequest) {
        let h = new URL(t.url),
          g = f.startsWith("//") ? new URL(h.protocol + f) : new URL(f),
          T = Jr(g.pathname, o) != null;
        g.origin === h.origin && T && (f = g.pathname + g.search + g.hash);
      }
      if (s.isStaticRequest) throw (c.headers.set("Location", f), c);
      return {
        type: Le.redirect,
        status: C,
        location: f,
        revalidate: c.headers.get("X-Remix-Revalidate") !== null,
        reloadDocument: c.headers.get("X-Remix-Reload-Document") !== null,
      };
    }
    if (s.isRouteRequest)
      throw { type: u === Le.error ? Le.error : Le.data, response: c };
    let k;
    try {
      let f = c.headers.get("Content-Type");
      f && /\bapplication\/json\b/.test(f)
        ? (k = await c.json())
        : (k = await c.text());
    } catch (f) {
      return { type: Le.error, error: f };
    }
    return u === Le.error
      ? { type: u, error: new Zd(C, c.statusText, k), headers: c.headers }
      : { type: Le.data, data: k, statusCode: c.status, headers: c.headers };
  }
  if (u === Le.error) return { type: u, error: c };
  if (z1(c)) {
    var v, y;
    return {
      type: Le.deferred,
      deferredData: c,
      statusCode: (v = c.init) == null ? void 0 : v.status,
      headers:
        ((y = c.init) == null ? void 0 : y.headers) &&
        new Headers(c.init.headers),
    };
  }
  return { type: Le.data, data: c };
}
function Da(e, t, n, r) {
  let i = e.createURL(fy(t)).toString(),
    a = { signal: n };
  if (r && nn(r.formMethod)) {
    let { formMethod: o, formEncType: l } = r;
    (a.method = o.toUpperCase()),
      l === "application/json"
        ? ((a.headers = new Headers({ "Content-Type": l })),
          (a.body = JSON.stringify(r.json)))
        : l === "text/plain"
        ? (a.body = r.text)
        : l === "application/x-www-form-urlencoded" && r.formData
        ? (a.body = Mc(r.formData))
        : (a.body = r.formData);
  }
  return new Request(i, a);
}
function Mc(e) {
  let t = new URLSearchParams();
  for (let [n, r] of e.entries())
    t.append(n, typeof r == "string" ? r : r.name);
  return t;
}
function Kh(e) {
  let t = new FormData();
  for (let [n, r] of e.entries()) t.append(n, r);
  return t;
}
function $1(e, t, n, r, i) {
  let a = {},
    o = null,
    l,
    s = !1,
    u = {};
  return (
    n.forEach((c, d) => {
      let p = t[d].route.id;
      if (
        (ne(!Mi(c), "Cannot handle redirect results in processLoaderData"),
        qa(c))
      ) {
        let v = Va(e, p),
          y = c.error;
        r && ((y = Object.values(r)[0]), (r = void 0)),
          (o = o || {}),
          o[v.route.id] == null && (o[v.route.id] = y),
          (a[p] = void 0),
          s || ((s = !0), (l = ly(c.error) ? c.error.status : 500)),
          c.headers && (u[p] = c.headers);
      } else
        _r(c)
          ? (i.set(p, c.deferredData), (a[p] = c.deferredData.data))
          : (a[p] = c.data),
          c.statusCode != null &&
            c.statusCode !== 200 &&
            !s &&
            (l = c.statusCode),
          c.headers && (u[p] = c.headers);
    }),
    r && ((o = r), (a[Object.keys(r)[0]] = void 0)),
    { loaderData: a, errors: o, statusCode: l || 200, loaderHeaders: u }
  );
}
function Gh(e, t, n, r, i, a, o, l) {
  let { loaderData: s, errors: u } = $1(t, n, r, i, l);
  for (let c = 0; c < a.length; c++) {
    let { key: d, match: p, controller: v } = a[c];
    ne(
      o !== void 0 && o[c] !== void 0,
      "Did not find corresponding fetcher result",
    );
    let y = o[c];
    if (!(v && v.signal.aborted))
      if (qa(y)) {
        let C = Va(e.matches, p == null ? void 0 : p.route.id);
        (u && u[C.route.id]) || (u = be({}, u, { [C.route.id]: y.error })),
          e.fetchers.delete(d);
      } else if (Mi(y)) ne(!1, "Unhandled fetcher revalidation redirect");
      else if (_r(y)) ne(!1, "Unhandled fetcher deferred data");
      else {
        let C = Yn(y.data);
        e.fetchers.set(d, C);
      }
  }
  return { loaderData: s, errors: u };
}
function Xh(e, t, n, r) {
  let i = be({}, t);
  for (let a of n) {
    let o = a.route.id;
    if (
      (t.hasOwnProperty(o)
        ? t[o] !== void 0 && (i[o] = t[o])
        : e[o] !== void 0 && a.route.loader && (i[o] = e[o]),
      r && r.hasOwnProperty(o))
    )
      break;
  }
  return i;
}
function Va(e, t) {
  return (
    (t ? e.slice(0, e.findIndex((r) => r.route.id === t) + 1) : [...e])
      .reverse()
      .find((r) => r.route.hasErrorBoundary === !0) || e[0]
  );
}
function Jh(e) {
  let t =
    e.length === 1
      ? e[0]
      : e.find((n) => n.index || !n.path || n.path === "/") || {
          id: "__shim-error-route__",
        };
  return {
    matches: [{ params: {}, pathname: "", pathnameBase: "", route: t }],
    route: t,
  };
}
function Wt(e, t) {
  let { pathname: n, routeId: r, method: i, type: a } = t === void 0 ? {} : t,
    o = "Unknown Server Error",
    l = "Unknown @remix-run/router error";
  return (
    e === 400
      ? ((o = "Bad Request"),
        i && n && r
          ? (l =
              "You made a " +
              i +
              ' request to "' +
              n +
              '" but ' +
              ('did not provide a `loader` for route "' + r + '", ') +
              "so there is no way to handle the request.")
          : a === "defer-action"
          ? (l = "defer() is not supported in actions")
          : a === "invalid-body" && (l = "Unable to encode submission body"))
      : e === 403
      ? ((o = "Forbidden"),
        (l = 'Route "' + r + '" does not match URL "' + n + '"'))
      : e === 404
      ? ((o = "Not Found"), (l = 'No route matches URL "' + n + '"'))
      : e === 405 &&
        ((o = "Method Not Allowed"),
        i && n && r
          ? (l =
              "You made a " +
              i.toUpperCase() +
              ' request to "' +
              n +
              '" but ' +
              ('did not provide an `action` for route "' + r + '", ') +
              "so there is no way to handle the request.")
          : i && (l = 'Invalid request method "' + i.toUpperCase() + '"')),
    new Zd(e || 500, o, new Error(l), !0)
  );
}
function Zh(e) {
  for (let t = e.length - 1; t >= 0; t--) {
    let n = e[t];
    if (Mi(n)) return { result: n, idx: t };
  }
}
function fy(e) {
  let t = typeof e == "string" ? In(e) : e;
  return ua(be({}, t, { hash: "" }));
}
function j1(e, t) {
  return e.pathname !== t.pathname || e.search !== t.search
    ? !1
    : e.hash === ""
    ? t.hash !== ""
    : e.hash === t.hash
    ? !0
    : t.hash !== "";
}
function _r(e) {
  return e.type === Le.deferred;
}
function qa(e) {
  return e.type === Le.error;
}
function Mi(e) {
  return (e && e.type) === Le.redirect;
}
function z1(e) {
  let t = e;
  return (
    t &&
    typeof t == "object" &&
    typeof t.data == "object" &&
    typeof t.subscribe == "function" &&
    typeof t.cancel == "function" &&
    typeof t.resolveData == "function"
  );
}
function H1(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.headers == "object" &&
    typeof e.body < "u"
  );
}
function W1(e) {
  return N1.has(e.toLowerCase());
}
function nn(e) {
  return D1.has(e.toLowerCase());
}
async function ep(e, t, n, r, i, a) {
  for (let o = 0; o < n.length; o++) {
    let l = n[o],
      s = t[o];
    if (!s) continue;
    let u = e.find((d) => d.route.id === s.route.id),
      c = u != null && !dy(u, s) && (a && a[s.route.id]) !== void 0;
    if (_r(l) && (i || c)) {
      let d = r[o];
      ne(d, "Expected an AbortSignal for revalidating fetcher deferred result"),
        await hy(l, d, i).then((p) => {
          p && (n[o] = p || n[o]);
        });
    }
  }
}
async function hy(e, t, n) {
  if ((n === void 0 && (n = !1), !(await e.deferredData.resolveData(t)))) {
    if (n)
      try {
        return { type: Le.data, data: e.deferredData.unwrappedData };
      } catch (i) {
        return { type: Le.error, error: i };
      }
    return { type: Le.data, data: e.deferredData.data };
  }
}
function ef(e) {
  return new URLSearchParams(e).getAll("index").some((t) => t === "");
}
function Oc(e, t) {
  let n = typeof t == "string" ? In(t).search : t.search;
  if (e[e.length - 1].route.index && ef(n || "")) return e[e.length - 1];
  let r = ry(e);
  return r[r.length - 1];
}
function tp(e) {
  let {
    formMethod: t,
    formAction: n,
    formEncType: r,
    text: i,
    formData: a,
    json: o,
  } = e;
  if (!(!t || !n || !r)) {
    if (i != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: void 0,
        text: i,
      };
    if (a != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: a,
        json: void 0,
        text: void 0,
      };
    if (o !== void 0)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: o,
        text: void 0,
      };
  }
}
function Eu(e, t) {
  return t
    ? {
        state: "loading",
        location: e,
        formMethod: t.formMethod,
        formAction: t.formAction,
        formEncType: t.formEncType,
        formData: t.formData,
        json: t.json,
        text: t.text,
      }
    : {
        state: "loading",
        location: e,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      };
}
function B1(e, t) {
  return {
    state: "submitting",
    location: e,
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
  };
}
function ba(e, t) {
  return e
    ? {
        state: "loading",
        formMethod: e.formMethod,
        formAction: e.formAction,
        formEncType: e.formEncType,
        formData: e.formData,
        json: e.json,
        text: e.text,
        data: t,
      }
    : {
        state: "loading",
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
        data: t,
      };
}
function Q1(e, t) {
  return {
    state: "submitting",
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text,
    data: t ? t.data : void 0,
  };
}
function Yn(e) {
  return {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: e,
  };
}
function Y1(e, t) {
  try {
    let n = e.sessionStorage.getItem(cy);
    if (n) {
      let r = JSON.parse(n);
      for (let [i, a] of Object.entries(r || {}))
        a && Array.isArray(a) && t.set(i, new Set(a || []));
    }
  } catch {}
}
function V1(e, t) {
  if (t.size > 0) {
    let n = {};
    for (let [r, i] of t) n[r] = [...i];
    try {
      e.sessionStorage.setItem(cy, JSON.stringify(n));
    } catch (r) {
      Xr(
        !1,
        "Failed to save applied view transitions in sessionStorage (" +
          r +
          ").",
      );
    }
  }
}
var Ds = { exports: {} },
  bs = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var q1 = S.exports,
  K1 = Symbol.for("react.element"),
  G1 = Symbol.for("react.fragment"),
  X1 = Object.prototype.hasOwnProperty,
  J1 = q1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Z1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function py(e, t, n) {
  var r,
    i = {},
    a = null,
    o = null;
  n !== void 0 && (a = "" + n),
    t.key !== void 0 && (a = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (r in t) X1.call(t, r) && !Z1.hasOwnProperty(r) && (i[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) i[r] === void 0 && (i[r] = t[r]);
  return {
    $$typeof: K1,
    type: e,
    key: a,
    ref: o,
    props: i,
    _owner: J1.current,
  };
}
bs.Fragment = G1;
bs.jsx = py;
bs.jsxs = py;
(function (e) {
  e.exports = bs;
})(Ds);
const un = Ds.exports.Fragment,
  m = Ds.exports.jsx,
  F = Ds.exports.jsxs;
/**
 * React Router v6.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Xl() {
  return (
    (Xl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Xl.apply(this, arguments)
  );
}
const tf = S.exports.createContext(null),
  my = S.exports.createContext(null),
  Uo = S.exports.createContext(null),
  Ns = S.exports.createContext(null),
  ri = S.exports.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  vy = S.exports.createContext(null);
function nf() {
  return S.exports.useContext(Ns) != null;
}
function rf() {
  return nf() || ne(!1), S.exports.useContext(Ns).location;
}
const ex = S.exports.createContext(null);
function tx(e) {
  let t = S.exports.useContext(ri).outlet;
  return t && m(ex.Provider, { value: e, children: t });
}
function nx(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = S.exports.useContext(Uo),
    { matches: i } = S.exports.useContext(ri),
    { pathname: a } = rf(),
    o = JSON.stringify(iy(i, r.v7_relativeSplatPath));
  return S.exports.useMemo(
    () => ay(e, JSON.parse(o), a, n === "path"),
    [e, o, a, n],
  );
}
function rx(e, t, n, r) {
  nf() || ne(!1);
  let { navigator: i } = S.exports.useContext(Uo),
    { matches: a } = S.exports.useContext(ri),
    o = a[a.length - 1],
    l = o ? o.params : {};
  o && o.pathname;
  let s = o ? o.pathnameBase : "/";
  o && o.route;
  let u = rf(),
    c;
  if (t) {
    var d;
    let k = typeof t == "string" ? In(t) : t;
    s === "/" ||
      ((d = k.pathname) == null ? void 0 : d.startsWith(s)) ||
      ne(!1),
      (c = k);
  } else c = u;
  let p = c.pathname || "/",
    v = s === "/" ? p : p.slice(s.length) || "/",
    y = Ci(e, { pathname: v }),
    C = sx(
      y &&
        y.map((k) =>
          Object.assign({}, k, {
            params: Object.assign({}, l, k.params),
            pathname: gr([
              s,
              i.encodeLocation
                ? i.encodeLocation(k.pathname).pathname
                : k.pathname,
            ]),
            pathnameBase:
              k.pathnameBase === "/"
                ? s
                : gr([
                    s,
                    i.encodeLocation
                      ? i.encodeLocation(k.pathnameBase).pathname
                      : k.pathnameBase,
                  ]),
          }),
        ),
      a,
      n,
      r,
    );
  return t && C
    ? m(Ns.Provider, {
        value: {
          location: Xl(
            {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
            },
            c,
          ),
          navigationType: Ie.Pop,
        },
        children: C,
      })
    : C;
}
function ix() {
  let e = gy(),
    t = ly(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
      ? e.message
      : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null;
  return F(un, {
    children: [
      m("h2", { children: "Unexpected Application Error!" }),
      m("h3", { style: { fontStyle: "italic" }, children: t }),
      n
        ? m("pre", {
            style: {
              padding: "0.5rem",
              backgroundColor: "rgba(200,200,200, 0.5)",
            },
            children: n,
          })
        : null,
      null,
    ],
  });
}
const ax = m(ix, {});
class ox extends S.exports.Component {
  constructor(t) {
    super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n,
    );
  }
  render() {
    return this.state.error !== void 0
      ? m(ri.Provider, {
          value: this.props.routeContext,
          children: m(vy.Provider, {
            value: this.state.error,
            children: this.props.component,
          }),
        })
      : this.props.children;
  }
}
function lx(e) {
  let { routeContext: t, match: n, children: r } = e,
    i = S.exports.useContext(tf);
  return (
    i &&
      i.static &&
      i.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (i.staticContext._deepestRenderedBoundaryId = n.route.id),
    m(ri.Provider, { value: t, children: r })
  );
}
function sx(e, t, n, r) {
  var i;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var a;
    if ((a = n) != null && a.errors) e = n.matches;
    else return null;
  }
  let o = e,
    l = (i = n) == null ? void 0 : i.errors;
  if (l != null) {
    let c = o.findIndex(
      (d) => d.route.id && (l == null ? void 0 : l[d.route.id]),
    );
    c >= 0 || ne(!1), (o = o.slice(0, Math.min(o.length, c + 1)));
  }
  let s = !1,
    u = -1;
  if (n && r && r.v7_partialHydration)
    for (let c = 0; c < o.length; c++) {
      let d = o[c];
      if (
        ((d.route.HydrateFallback || d.route.hydrateFallbackElement) && (u = c),
        d.route.loader &&
          d.route.id &&
          n.loaderData[d.route.id] === void 0 &&
          (!n.errors || n.errors[d.route.id] === void 0))
      ) {
        (s = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]);
        break;
      }
    }
  return o.reduceRight((c, d, p) => {
    let v,
      y = !1,
      C = null,
      k = null;
    n &&
      ((v = l && d.route.id ? l[d.route.id] : void 0),
      (C = d.route.errorElement || ax),
      s &&
        (u < 0 && p === 0
          ? (fx("route-fallback", !1), (y = !0), (k = null))
          : u === p &&
            ((y = !0), (k = d.route.hydrateFallbackElement || null))));
    let f = t.concat(o.slice(0, p + 1)),
      h = () => {
        let g;
        return (
          v
            ? (g = C)
            : y
            ? (g = k)
            : d.route.Component
            ? (g = S.exports.createElement(d.route.Component, null))
            : d.route.element
            ? (g = d.route.element)
            : (g = c),
          m(lx, {
            match: d,
            routeContext: { outlet: c, matches: f, isDataRoute: n != null },
            children: g,
          })
        );
      };
    return n && (d.route.ErrorBoundary || d.route.errorElement || p === 0)
      ? m(ox, {
          location: n.location,
          revalidation: n.revalidation,
          component: C,
          error: v,
          children: h(),
          routeContext: { outlet: null, matches: f, isDataRoute: !0 },
        })
      : h();
  }, null);
}
var Jl = (function (e) {
  return (
    (e.UseBlocker = "useBlocker"),
    (e.UseLoaderData = "useLoaderData"),
    (e.UseActionData = "useActionData"),
    (e.UseRouteError = "useRouteError"),
    (e.UseNavigation = "useNavigation"),
    (e.UseRouteLoaderData = "useRouteLoaderData"),
    (e.UseMatches = "useMatches"),
    (e.UseRevalidator = "useRevalidator"),
    (e.UseNavigateStable = "useNavigate"),
    (e.UseRouteId = "useRouteId"),
    e
  );
})(Jl || {});
function ux(e) {
  let t = S.exports.useContext(my);
  return t || ne(!1), t;
}
function cx(e) {
  let t = S.exports.useContext(ri);
  return t || ne(!1), t;
}
function yy(e) {
  let t = cx(),
    n = t.matches[t.matches.length - 1];
  return n.route.id || ne(!1), n.route.id;
}
function dx() {
  return yy(Jl.UseRouteId);
}
function gy() {
  var e;
  let t = S.exports.useContext(vy),
    n = ux(Jl.UseRouteError),
    r = yy(Jl.UseRouteError);
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
const np = {};
function fx(e, t, n) {
  !t && !np[e] && (np[e] = !0);
}
const hx = "startTransition";
Zp[hx];
function wy(e) {
  return tx(e.context);
}
function px(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: i = Ie.Pop,
    navigator: a,
    static: o = !1,
    future: l,
  } = e;
  nf() && ne(!1);
  let s = t.replace(/^\/*/, "/"),
    u = S.exports.useMemo(
      () => ({
        basename: s,
        navigator: a,
        static: o,
        future: Xl({ v7_relativeSplatPath: !1 }, l),
      }),
      [s, l, a, o],
    );
  typeof r == "string" && (r = In(r));
  let {
      pathname: c = "/",
      search: d = "",
      hash: p = "",
      state: v = null,
      key: y = "default",
    } = r,
    C = S.exports.useMemo(() => {
      let k = Jr(c, s);
      return k == null
        ? null
        : {
            location: { pathname: k, search: d, hash: p, state: v, key: y },
            navigationType: i,
          };
    }, [s, c, d, p, v, y, i]);
  return C == null
    ? null
    : m(Uo.Provider, {
        value: u,
        children: m(Ns.Provider, { children: n, value: C }),
      });
}
new Promise(() => {});
function mx(e) {
  let t = {
    hasErrorBoundary: e.ErrorBoundary != null || e.errorElement != null,
  };
  return (
    e.Component &&
      Object.assign(t, {
        element: S.exports.createElement(e.Component),
        Component: void 0,
      }),
    e.HydrateFallback &&
      Object.assign(t, {
        hydrateFallbackElement: S.exports.createElement(e.HydrateFallback),
        HydrateFallback: void 0,
      }),
    e.ErrorBoundary &&
      Object.assign(t, {
        errorElement: S.exports.createElement(e.ErrorBoundary),
        ErrorBoundary: void 0,
      }),
    t
  );
}
/**
 * React Router DOM v6.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function po() {
  return (
    (po = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    po.apply(this, arguments)
  );
}
function vx(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    i,
    a;
  for (a = 0; a < r.length; a++)
    (i = r[a]), !(t.indexOf(i) >= 0) && (n[i] = e[i]);
  return n;
}
const Cl = "get",
  Tu = "application/x-www-form-urlencoded";
function Ms(e) {
  return e != null && typeof e.tagName == "string";
}
function yx(e) {
  return Ms(e) && e.tagName.toLowerCase() === "button";
}
function gx(e) {
  return Ms(e) && e.tagName.toLowerCase() === "form";
}
function wx(e) {
  return Ms(e) && e.tagName.toLowerCase() === "input";
}
let ll = null;
function xx() {
  if (ll === null)
    try {
      new FormData(document.createElement("form"), 0), (ll = !1);
    } catch {
      ll = !0;
    }
  return ll;
}
const Sx = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function Pu(e) {
  return e != null && !Sx.has(e) ? null : e;
}
function kx(e, t) {
  let n, r, i, a, o;
  if (gx(e)) {
    let l = e.getAttribute("action");
    (r = l ? Jr(l, t) : null),
      (n = e.getAttribute("method") || Cl),
      (i = Pu(e.getAttribute("enctype")) || Tu),
      (a = new FormData(e));
  } else if (yx(e) || (wx(e) && (e.type === "submit" || e.type === "image"))) {
    let l = e.form;
    if (l == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>',
      );
    let s = e.getAttribute("formaction") || l.getAttribute("action");
    if (
      ((r = s ? Jr(s, t) : null),
      (n = e.getAttribute("formmethod") || l.getAttribute("method") || Cl),
      (i =
        Pu(e.getAttribute("formenctype")) ||
        Pu(l.getAttribute("enctype")) ||
        Tu),
      (a = new FormData(l, e)),
      !xx())
    ) {
      let { name: u, type: c, value: d } = e;
      if (c === "image") {
        let p = u ? u + "." : "";
        a.append(p + "x", "0"), a.append(p + "y", "0");
      } else u && a.append(u, d);
    }
  } else {
    if (Ms(e))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    (n = Cl), (r = null), (i = Tu), (o = e);
  }
  return (
    a && i === "text/plain" && ((o = a), (a = void 0)),
    { action: r, method: n.toLowerCase(), encType: i, formData: a, body: o }
  );
}
const Cx = [
  "fetcherKey",
  "navigate",
  "reloadDocument",
  "replace",
  "state",
  "method",
  "action",
  "onSubmit",
  "relative",
  "preventScrollReset",
  "unstable_viewTransition",
];
function Ex(e, t) {
  return L1({
    basename: t == null ? void 0 : t.basename,
    future: po({}, t == null ? void 0 : t.future, { v7_prependBasename: !0 }),
    history: n1({ window: t == null ? void 0 : t.window }),
    hydrationData: (t == null ? void 0 : t.hydrationData) || Tx(),
    routes: e,
    mapRouteProperties: mx,
    window: t == null ? void 0 : t.window,
  }).initialize();
}
function Tx() {
  var e;
  let t = (e = window) == null ? void 0 : e.__staticRouterHydrationData;
  return t && t.errors && (t = po({}, t, { errors: Px(t.errors) })), t;
}
function Px(e) {
  if (!e) return null;
  let t = Object.entries(e),
    n = {};
  for (let [r, i] of t)
    if (i && i.__type === "RouteErrorResponse")
      n[r] = new Zd(i.status, i.statusText, i.data, i.internal === !0);
    else if (i && i.__type === "Error") {
      if (i.__subType) {
        let a = window[i.__subType];
        if (typeof a == "function")
          try {
            let o = new a(i.message);
            (o.stack = ""), (n[r] = o);
          } catch {}
      }
      if (n[r] == null) {
        let a = new Error(i.message);
        (a.stack = ""), (n[r] = a);
      }
    } else n[r] = i;
  return n;
}
const Dx = S.exports.createContext({ isTransitioning: !1 }),
  bx = S.exports.createContext(new Map()),
  Nx = "startTransition",
  rp = Zp[Nx],
  Mx = "flushSync",
  ip = t1[Mx];
function Ox(e) {
  rp ? rp(e) : e();
}
function Na(e) {
  ip ? ip(e) : e();
}
class Rx {
  constructor() {
    (this.status = "pending"),
      (this.promise = new Promise((t, n) => {
        (this.resolve = (r) => {
          this.status === "pending" && ((this.status = "resolved"), t(r));
        }),
          (this.reject = (r) => {
            this.status === "pending" && ((this.status = "rejected"), n(r));
          });
      }));
  }
}
function _x(e) {
  let { fallbackElement: t, router: n, future: r } = e,
    [i, a] = S.exports.useState(n.state),
    [o, l] = S.exports.useState(),
    [s, u] = S.exports.useState({ isTransitioning: !1 }),
    [c, d] = S.exports.useState(),
    [p, v] = S.exports.useState(),
    [y, C] = S.exports.useState(),
    k = S.exports.useRef(new Map()),
    { v7_startTransition: f } = r || {},
    h = S.exports.useCallback(
      (P) => {
        f ? Ox(P) : P();
      },
      [f],
    ),
    g = S.exports.useCallback(
      (P, b) => {
        let {
          deletedFetchers: _,
          unstable_flushSync: I,
          unstable_viewTransitionOpts: G,
        } = b;
        _.forEach((fe) => k.current.delete(fe)),
          P.fetchers.forEach((fe, Ae) => {
            fe.data !== void 0 && k.current.set(Ae, fe.data);
          });
        let me =
          n.window == null ||
          typeof n.window.document.startViewTransition != "function";
        if (!G || me) {
          I ? Na(() => a(P)) : h(() => a(P));
          return;
        }
        if (I) {
          Na(() => {
            p && (c && c.resolve(), p.skipTransition()),
              u({
                isTransitioning: !0,
                flushSync: !0,
                currentLocation: G.currentLocation,
                nextLocation: G.nextLocation,
              });
          });
          let fe = n.window.document.startViewTransition(() => {
            Na(() => a(P));
          });
          fe.finished.finally(() => {
            Na(() => {
              d(void 0), v(void 0), l(void 0), u({ isTransitioning: !1 });
            });
          }),
            Na(() => v(fe));
          return;
        }
        p
          ? (c && c.resolve(),
            p.skipTransition(),
            C({
              state: P,
              currentLocation: G.currentLocation,
              nextLocation: G.nextLocation,
            }))
          : (l(P),
            u({
              isTransitioning: !0,
              flushSync: !1,
              currentLocation: G.currentLocation,
              nextLocation: G.nextLocation,
            }));
      },
      [n.window, p, c, k, h],
    );
  S.exports.useLayoutEffect(() => n.subscribe(g), [n, g]),
    S.exports.useEffect(() => {
      s.isTransitioning && !s.flushSync && d(new Rx());
    }, [s]),
    S.exports.useEffect(() => {
      if (c && o && n.window) {
        let P = o,
          b = c.promise,
          _ = n.window.document.startViewTransition(async () => {
            h(() => a(P)), await b;
          });
        _.finished.finally(() => {
          d(void 0), v(void 0), l(void 0), u({ isTransitioning: !1 });
        }),
          v(_);
      }
    }, [h, o, c, n.window]),
    S.exports.useEffect(() => {
      c && o && i.location.key === o.location.key && c.resolve();
    }, [c, p, i.location, o]),
    S.exports.useEffect(() => {
      !s.isTransitioning &&
        y &&
        (l(y.state),
        u({
          isTransitioning: !0,
          flushSync: !1,
          currentLocation: y.currentLocation,
          nextLocation: y.nextLocation,
        }),
        C(void 0));
    }, [s.isTransitioning, y]),
    S.exports.useEffect(() => {}, []);
  let T = S.exports.useMemo(
      () => ({
        createHref: n.createHref,
        encodeLocation: n.encodeLocation,
        go: (P) => n.navigate(P),
        push: (P, b, _) =>
          n.navigate(P, {
            state: b,
            preventScrollReset: _ == null ? void 0 : _.preventScrollReset,
          }),
        replace: (P, b, _) =>
          n.navigate(P, {
            replace: !0,
            state: b,
            preventScrollReset: _ == null ? void 0 : _.preventScrollReset,
          }),
      }),
      [n],
    ),
    M = n.basename || "/",
    w = S.exports.useMemo(
      () => ({ router: n, navigator: T, static: !1, basename: M }),
      [n, T, M],
    );
  return m(un, {
    children: m(tf.Provider, {
      value: w,
      children: m(my.Provider, {
        value: i,
        children: m(bx.Provider, {
          value: k.current,
          children: m(Dx.Provider, {
            value: s,
            children: m(px, {
              basename: M,
              location: i.location,
              navigationType: i.historyAction,
              navigator: T,
              future: { v7_relativeSplatPath: n.future.v7_relativeSplatPath },
              children:
                i.initialized || n.future.v7_partialHydration
                  ? m(Lx, { routes: n.routes, future: n.future, state: i })
                  : t,
            }),
          }),
        }),
      }),
    }),
  });
}
function Lx(e) {
  let { routes: t, future: n, state: r } = e;
  return rx(t, void 0, r, n);
}
const xy = S.exports.forwardRef((e, t) => {
  let {
      fetcherKey: n,
      navigate: r,
      reloadDocument: i,
      replace: a,
      state: o,
      method: l = Cl,
      action: s,
      onSubmit: u,
      relative: c,
      preventScrollReset: d,
      unstable_viewTransition: p,
    } = e,
    v = vx(e, Cx),
    y = Sy(),
    C = $x(s, { relative: c }),
    k = l.toLowerCase() === "get" ? "get" : "post";
  return m("form", {
    ref: t,
    method: k,
    action: C,
    onSubmit: i
      ? u
      : (h) => {
          if ((u && u(h), h.defaultPrevented)) return;
          h.preventDefault();
          let g = h.nativeEvent.submitter,
            T = (g == null ? void 0 : g.getAttribute("formmethod")) || l;
          y(g || h.currentTarget, {
            fetcherKey: n,
            method: T,
            navigate: r,
            replace: a,
            state: o,
            relative: c,
            preventScrollReset: d,
            unstable_viewTransition: p,
          });
        },
    ...v,
  });
});
var Rc;
(function (e) {
  (e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState");
})(Rc || (Rc = {}));
var ap;
(function (e) {
  (e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration");
})(ap || (ap = {}));
function Fx(e) {
  let t = S.exports.useContext(tf);
  return t || ne(!1), t;
}
function Ux() {
  if (typeof document > "u")
    throw new Error(
      "You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.",
    );
}
let Ax = 0,
  Ix = () => "__" + String(++Ax) + "__";
function Sy() {
  let { router: e } = Fx(Rc.UseSubmit),
    { basename: t } = S.exports.useContext(Uo),
    n = dx();
  return S.exports.useCallback(
    function (r, i) {
      i === void 0 && (i = {}), Ux();
      let { action: a, method: o, encType: l, formData: s, body: u } = kx(r, t);
      if (i.navigate === !1) {
        let c = i.fetcherKey || Ix();
        e.fetch(c, n, i.action || a, {
          preventScrollReset: i.preventScrollReset,
          formData: s,
          body: u,
          formMethod: i.method || o,
          formEncType: i.encType || l,
          unstable_flushSync: i.unstable_flushSync,
        });
      } else
        e.navigate(i.action || a, {
          preventScrollReset: i.preventScrollReset,
          formData: s,
          body: u,
          formMethod: i.method || o,
          formEncType: i.encType || l,
          replace: i.replace,
          state: i.state,
          fromRouteId: n,
          unstable_flushSync: i.unstable_flushSync,
          unstable_viewTransition: i.unstable_viewTransition,
        });
    },
    [e, t, n],
  );
}
function $x(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { basename: r } = S.exports.useContext(Uo),
    i = S.exports.useContext(ri);
  i || ne(!1);
  let [a] = i.matches.slice(-1),
    o = po({}, nx(e || ".", { relative: n })),
    l = rf();
  if (e == null) {
    o.search = l.search;
    let s = new URLSearchParams(o.search);
    s.has("index") &&
      s.get("index") === "" &&
      (s.delete("index"), (o.search = s.toString() ? "?" + s.toString() : ""));
  }
  return (
    (!e || e === ".") &&
      a.route.index &&
      (o.search = o.search ? o.search.replace(/^\?/, "?index&") : "?index"),
    r !== "/" && (o.pathname = o.pathname === "/" ? r : gr([r, o.pathname])),
    ua(o)
  );
}
function sn(e) {
  return (
    (sn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    sn(e)
  );
}
function re(e) {
  if (e === null || e === !0 || e === !1) return NaN;
  var t = Number(e);
  return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
}
function Y(e, t) {
  if (t.length < e)
    throw new TypeError(
      e +
        " argument" +
        (e > 1 ? "s" : "") +
        " required, but only " +
        t.length +
        " present",
    );
}
function V(e) {
  Y(1, arguments);
  var t = Object.prototype.toString.call(e);
  return e instanceof Date || (sn(e) === "object" && t === "[object Date]")
    ? new Date(e.getTime())
    : typeof e == "number" || t === "[object Number]"
    ? new Date(e)
    : ((typeof e == "string" || t === "[object String]") &&
        typeof console < "u" &&
        (console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments",
        ),
        console.warn(new Error().stack)),
      new Date(NaN));
}
function af(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = re(t);
  return isNaN(r) ? new Date(NaN) : (r && n.setDate(n.getDate() + r), n);
}
function ky(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = re(t);
  if (isNaN(r)) return new Date(NaN);
  if (!r) return n;
  var i = n.getDate(),
    a = new Date(n.getTime());
  a.setMonth(n.getMonth() + r + 1, 0);
  var o = a.getDate();
  return i >= o ? a : (n.setFullYear(a.getFullYear(), a.getMonth(), i), n);
}
function Zn(e, t) {
  if ((Y(2, arguments), !t || sn(t) !== "object")) return new Date(NaN);
  var n = t.years ? re(t.years) : 0,
    r = t.months ? re(t.months) : 0,
    i = t.weeks ? re(t.weeks) : 0,
    a = t.days ? re(t.days) : 0,
    o = t.hours ? re(t.hours) : 0,
    l = t.minutes ? re(t.minutes) : 0,
    s = t.seconds ? re(t.seconds) : 0,
    u = V(e),
    c = r || n ? ky(u, r + n * 12) : u,
    d = a || i ? af(c, a + i * 7) : c,
    p = l + o * 60,
    v = s + p * 60,
    y = v * 1e3,
    C = new Date(d.getTime() + y);
  return C;
}
function jx(e, t) {
  Y(2, arguments);
  var n = V(e).getTime(),
    r = re(t);
  return new Date(n + r);
}
var zx = {};
function Er() {
  return zx;
}
function Cy(e, t) {
  var n, r, i, a, o, l, s, u;
  Y(1, arguments);
  var c = Er(),
    d = re(
      (n =
        (r =
          (i =
            (a = t == null ? void 0 : t.weekStartsOn) !== null && a !== void 0
              ? a
              : t == null ||
                (o = t.locale) === null ||
                o === void 0 ||
                (l = o.options) === null ||
                l === void 0
              ? void 0
              : l.weekStartsOn) !== null && i !== void 0
            ? i
            : c.weekStartsOn) !== null && r !== void 0
          ? r
          : (s = c.locale) === null ||
            s === void 0 ||
            (u = s.options) === null ||
            u === void 0
          ? void 0
          : u.weekStartsOn) !== null && n !== void 0
        ? n
        : 0,
    );
  if (!(d >= 0 && d <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var p = V(e),
    v = p.getDay(),
    y = (v < d ? 7 : 0) + v - d;
  return p.setDate(p.getDate() - y), p.setHours(0, 0, 0, 0), p;
}
function Zl(e) {
  var t = new Date(
    Date.UTC(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes(),
      e.getSeconds(),
      e.getMilliseconds(),
    ),
  );
  return t.setUTCFullYear(e.getFullYear()), e.getTime() - t.getTime();
}
function mo(e) {
  Y(1, arguments);
  var t = V(e);
  return t.setHours(0, 0, 0, 0), t;
}
var Hx = 864e5;
function Wx(e, t) {
  Y(2, arguments);
  var n = mo(e),
    r = mo(t),
    i = n.getTime() - Zl(n),
    a = r.getTime() - Zl(r);
  return Math.round((i - a) / Hx);
}
function Ey(e, t) {
  Y(2, arguments);
  var n = re(t),
    r = n * 7;
  return af(e, r);
}
function Oi(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t),
    i = n.getTime() - r.getTime();
  return i < 0 ? -1 : i > 0 ? 1 : i;
}
var Ty = 6e4,
  Py = 36e5,
  Bx = 1e3;
function ii(e, t) {
  Y(2, arguments);
  var n = mo(e),
    r = mo(t);
  return n.getTime() === r.getTime();
}
function Qx(e) {
  return (
    Y(1, arguments),
    e instanceof Date ||
      (sn(e) === "object" &&
        Object.prototype.toString.call(e) === "[object Date]")
  );
}
function Yx(e) {
  if ((Y(1, arguments), !Qx(e) && typeof e != "number")) return !1;
  var t = V(e);
  return !isNaN(Number(t));
}
function Vx(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t),
    i = n.getFullYear() - r.getFullYear(),
    a = n.getMonth() - r.getMonth();
  return i * 12 + a;
}
function qx(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t);
  return n.getFullYear() - r.getFullYear();
}
function op(e, t) {
  var n =
    e.getFullYear() - t.getFullYear() ||
    e.getMonth() - t.getMonth() ||
    e.getDate() - t.getDate() ||
    e.getHours() - t.getHours() ||
    e.getMinutes() - t.getMinutes() ||
    e.getSeconds() - t.getSeconds() ||
    e.getMilliseconds() - t.getMilliseconds();
  return n < 0 ? -1 : n > 0 ? 1 : n;
}
function Kx(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t),
    i = op(n, r),
    a = Math.abs(Wx(n, r));
  n.setDate(n.getDate() - i * a);
  var o = Number(op(n, r) === -i),
    l = i * (a - o);
  return l === 0 ? 0 : l;
}
function of(e, t) {
  return Y(2, arguments), V(e).getTime() - V(t).getTime();
}
var lp = {
    ceil: Math.ceil,
    round: Math.round,
    floor: Math.floor,
    trunc: function (t) {
      return t < 0 ? Math.ceil(t) : Math.floor(t);
    },
  },
  Gx = "trunc";
function lf(e) {
  return e ? lp[e] : lp[Gx];
}
function Xx(e, t, n) {
  Y(2, arguments);
  var r = of(e, t) / Py;
  return lf(n == null ? void 0 : n.roundingMethod)(r);
}
function Jx(e, t, n) {
  Y(2, arguments);
  var r = of(e, t) / Ty;
  return lf(n == null ? void 0 : n.roundingMethod)(r);
}
function Zx(e) {
  Y(1, arguments);
  var t = V(e);
  return t.setHours(23, 59, 59, 999), t;
}
function Dy(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getMonth();
  return (
    t.setFullYear(t.getFullYear(), n + 1, 0), t.setHours(23, 59, 59, 999), t
  );
}
function eS(e) {
  Y(1, arguments);
  var t = V(e);
  return Zx(t).getTime() === Dy(t).getTime();
}
function tS(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t),
    i = Oi(n, r),
    a = Math.abs(Vx(n, r)),
    o;
  if (a < 1) o = 0;
  else {
    n.getMonth() === 1 && n.getDate() > 27 && n.setDate(30),
      n.setMonth(n.getMonth() - i * a);
    var l = Oi(n, r) === -i;
    eS(V(e)) && a === 1 && Oi(e, r) === 1 && (l = !1),
      (o = i * (a - Number(l)));
  }
  return o === 0 ? 0 : o;
}
function nS(e, t, n) {
  Y(2, arguments);
  var r = of(e, t) / 1e3;
  return lf(n == null ? void 0 : n.roundingMethod)(r);
}
function rS(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t),
    i = Oi(n, r),
    a = Math.abs(qx(n, r));
  n.setFullYear(1584), r.setFullYear(1584);
  var o = Oi(n, r) === -i,
    l = i * (a - Number(o));
  return l === 0 ? 0 : l;
}
function by(e, t) {
  var n;
  Y(1, arguments);
  var r = e || {},
    i = V(r.start),
    a = V(r.end),
    o = a.getTime();
  if (!(i.getTime() <= o)) throw new RangeError("Invalid interval");
  var l = [],
    s = i;
  s.setHours(0, 0, 0, 0);
  var u = Number(
    (n = t == null ? void 0 : t.step) !== null && n !== void 0 ? n : 1,
  );
  if (u < 1 || isNaN(u))
    throw new RangeError("`options.step` must be a number greater than 1");
  for (; s.getTime() <= o; )
    l.push(V(s)), s.setDate(s.getDate() + u), s.setHours(0, 0, 0, 0);
  return l;
}
function Ny(e, t) {
  var n, r, i, a, o, l, s, u;
  Y(1, arguments);
  var c = Er(),
    d = re(
      (n =
        (r =
          (i =
            (a = t == null ? void 0 : t.weekStartsOn) !== null && a !== void 0
              ? a
              : t == null ||
                (o = t.locale) === null ||
                o === void 0 ||
                (l = o.options) === null ||
                l === void 0
              ? void 0
              : l.weekStartsOn) !== null && i !== void 0
            ? i
            : c.weekStartsOn) !== null && r !== void 0
          ? r
          : (s = c.locale) === null ||
            s === void 0 ||
            (u = s.options) === null ||
            u === void 0
          ? void 0
          : u.weekStartsOn) !== null && n !== void 0
        ? n
        : 0,
    );
  if (!(d >= 0 && d <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var p = V(e),
    v = p.getDay(),
    y = (v < d ? -7 : 0) + 6 - (v - d);
  return p.setDate(p.getDate() + y), p.setHours(23, 59, 59, 999), p;
}
function My(e, t) {
  Y(2, arguments);
  var n = re(t);
  return jx(e, -n);
}
var iS = 864e5;
function aS(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getTime();
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  var r = t.getTime(),
    i = n - r;
  return Math.floor(i / iS) + 1;
}
function na(e) {
  Y(1, arguments);
  var t = 1,
    n = V(e),
    r = n.getUTCDay(),
    i = (r < t ? 7 : 0) + r - t;
  return n.setUTCDate(n.getUTCDate() - i), n.setUTCHours(0, 0, 0, 0), n;
}
function Oy(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getUTCFullYear(),
    r = new Date(0);
  r.setUTCFullYear(n + 1, 0, 4), r.setUTCHours(0, 0, 0, 0);
  var i = na(r),
    a = new Date(0);
  a.setUTCFullYear(n, 0, 4), a.setUTCHours(0, 0, 0, 0);
  var o = na(a);
  return t.getTime() >= i.getTime()
    ? n + 1
    : t.getTime() >= o.getTime()
    ? n
    : n - 1;
}
function oS(e) {
  Y(1, arguments);
  var t = Oy(e),
    n = new Date(0);
  n.setUTCFullYear(t, 0, 4), n.setUTCHours(0, 0, 0, 0);
  var r = na(n);
  return r;
}
var lS = 6048e5;
function Ry(e) {
  Y(1, arguments);
  var t = V(e),
    n = na(t).getTime() - oS(t).getTime();
  return Math.round(n / lS) + 1;
}
function Zr(e, t) {
  var n, r, i, a, o, l, s, u;
  Y(1, arguments);
  var c = Er(),
    d = re(
      (n =
        (r =
          (i =
            (a = t == null ? void 0 : t.weekStartsOn) !== null && a !== void 0
              ? a
              : t == null ||
                (o = t.locale) === null ||
                o === void 0 ||
                (l = o.options) === null ||
                l === void 0
              ? void 0
              : l.weekStartsOn) !== null && i !== void 0
            ? i
            : c.weekStartsOn) !== null && r !== void 0
          ? r
          : (s = c.locale) === null ||
            s === void 0 ||
            (u = s.options) === null ||
            u === void 0
          ? void 0
          : u.weekStartsOn) !== null && n !== void 0
        ? n
        : 0,
    );
  if (!(d >= 0 && d <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var p = V(e),
    v = p.getUTCDay(),
    y = (v < d ? 7 : 0) + v - d;
  return p.setUTCDate(p.getUTCDate() - y), p.setUTCHours(0, 0, 0, 0), p;
}
function sf(e, t) {
  var n, r, i, a, o, l, s, u;
  Y(1, arguments);
  var c = V(e),
    d = c.getUTCFullYear(),
    p = Er(),
    v = re(
      (n =
        (r =
          (i =
            (a = t == null ? void 0 : t.firstWeekContainsDate) !== null &&
            a !== void 0
              ? a
              : t == null ||
                (o = t.locale) === null ||
                o === void 0 ||
                (l = o.options) === null ||
                l === void 0
              ? void 0
              : l.firstWeekContainsDate) !== null && i !== void 0
            ? i
            : p.firstWeekContainsDate) !== null && r !== void 0
          ? r
          : (s = p.locale) === null ||
            s === void 0 ||
            (u = s.options) === null ||
            u === void 0
          ? void 0
          : u.firstWeekContainsDate) !== null && n !== void 0
        ? n
        : 1,
    );
  if (!(v >= 1 && v <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively",
    );
  var y = new Date(0);
  y.setUTCFullYear(d + 1, 0, v), y.setUTCHours(0, 0, 0, 0);
  var C = Zr(y, t),
    k = new Date(0);
  k.setUTCFullYear(d, 0, v), k.setUTCHours(0, 0, 0, 0);
  var f = Zr(k, t);
  return c.getTime() >= C.getTime()
    ? d + 1
    : c.getTime() >= f.getTime()
    ? d
    : d - 1;
}
function sS(e, t) {
  var n, r, i, a, o, l, s, u;
  Y(1, arguments);
  var c = Er(),
    d = re(
      (n =
        (r =
          (i =
            (a = t == null ? void 0 : t.firstWeekContainsDate) !== null &&
            a !== void 0
              ? a
              : t == null ||
                (o = t.locale) === null ||
                o === void 0 ||
                (l = o.options) === null ||
                l === void 0
              ? void 0
              : l.firstWeekContainsDate) !== null && i !== void 0
            ? i
            : c.firstWeekContainsDate) !== null && r !== void 0
          ? r
          : (s = c.locale) === null ||
            s === void 0 ||
            (u = s.options) === null ||
            u === void 0
          ? void 0
          : u.firstWeekContainsDate) !== null && n !== void 0
        ? n
        : 1,
    ),
    p = sf(e, t),
    v = new Date(0);
  v.setUTCFullYear(p, 0, d), v.setUTCHours(0, 0, 0, 0);
  var y = Zr(v, t);
  return y;
}
var uS = 6048e5;
function _y(e, t) {
  Y(1, arguments);
  var n = V(e),
    r = Zr(n, t).getTime() - sS(n, t).getTime();
  return Math.round(r / uS) + 1;
}
function ve(e, t) {
  for (var n = e < 0 ? "-" : "", r = Math.abs(e).toString(); r.length < t; )
    r = "0" + r;
  return n + r;
}
var cS = {
  y: function (t, n) {
    var r = t.getUTCFullYear(),
      i = r > 0 ? r : 1 - r;
    return ve(n === "yy" ? i % 100 : i, n.length);
  },
  M: function (t, n) {
    var r = t.getUTCMonth();
    return n === "M" ? String(r + 1) : ve(r + 1, 2);
  },
  d: function (t, n) {
    return ve(t.getUTCDate(), n.length);
  },
  a: function (t, n) {
    var r = t.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (n) {
      case "a":
      case "aa":
        return r.toUpperCase();
      case "aaa":
        return r;
      case "aaaaa":
        return r[0];
      case "aaaa":
      default:
        return r === "am" ? "a.m." : "p.m.";
    }
  },
  h: function (t, n) {
    return ve(t.getUTCHours() % 12 || 12, n.length);
  },
  H: function (t, n) {
    return ve(t.getUTCHours(), n.length);
  },
  m: function (t, n) {
    return ve(t.getUTCMinutes(), n.length);
  },
  s: function (t, n) {
    return ve(t.getUTCSeconds(), n.length);
  },
  S: function (t, n) {
    var r = n.length,
      i = t.getUTCMilliseconds(),
      a = Math.floor(i * Math.pow(10, r - 3));
    return ve(a, n.length);
  },
};
const Qn = cS;
var ui = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  dS = {
    G: function (t, n, r) {
      var i = t.getUTCFullYear() > 0 ? 1 : 0;
      switch (n) {
        case "G":
        case "GG":
        case "GGG":
          return r.era(i, { width: "abbreviated" });
        case "GGGGG":
          return r.era(i, { width: "narrow" });
        case "GGGG":
        default:
          return r.era(i, { width: "wide" });
      }
    },
    y: function (t, n, r) {
      if (n === "yo") {
        var i = t.getUTCFullYear(),
          a = i > 0 ? i : 1 - i;
        return r.ordinalNumber(a, { unit: "year" });
      }
      return Qn.y(t, n);
    },
    Y: function (t, n, r, i) {
      var a = sf(t, i),
        o = a > 0 ? a : 1 - a;
      if (n === "YY") {
        var l = o % 100;
        return ve(l, 2);
      }
      return n === "Yo"
        ? r.ordinalNumber(o, { unit: "year" })
        : ve(o, n.length);
    },
    R: function (t, n) {
      var r = Oy(t);
      return ve(r, n.length);
    },
    u: function (t, n) {
      var r = t.getUTCFullYear();
      return ve(r, n.length);
    },
    Q: function (t, n, r) {
      var i = Math.ceil((t.getUTCMonth() + 1) / 3);
      switch (n) {
        case "Q":
          return String(i);
        case "QQ":
          return ve(i, 2);
        case "Qo":
          return r.ordinalNumber(i, { unit: "quarter" });
        case "QQQ":
          return r.quarter(i, { width: "abbreviated", context: "formatting" });
        case "QQQQQ":
          return r.quarter(i, { width: "narrow", context: "formatting" });
        case "QQQQ":
        default:
          return r.quarter(i, { width: "wide", context: "formatting" });
      }
    },
    q: function (t, n, r) {
      var i = Math.ceil((t.getUTCMonth() + 1) / 3);
      switch (n) {
        case "q":
          return String(i);
        case "qq":
          return ve(i, 2);
        case "qo":
          return r.ordinalNumber(i, { unit: "quarter" });
        case "qqq":
          return r.quarter(i, { width: "abbreviated", context: "standalone" });
        case "qqqqq":
          return r.quarter(i, { width: "narrow", context: "standalone" });
        case "qqqq":
        default:
          return r.quarter(i, { width: "wide", context: "standalone" });
      }
    },
    M: function (t, n, r) {
      var i = t.getUTCMonth();
      switch (n) {
        case "M":
        case "MM":
          return Qn.M(t, n);
        case "Mo":
          return r.ordinalNumber(i + 1, { unit: "month" });
        case "MMM":
          return r.month(i, { width: "abbreviated", context: "formatting" });
        case "MMMMM":
          return r.month(i, { width: "narrow", context: "formatting" });
        case "MMMM":
        default:
          return r.month(i, { width: "wide", context: "formatting" });
      }
    },
    L: function (t, n, r) {
      var i = t.getUTCMonth();
      switch (n) {
        case "L":
          return String(i + 1);
        case "LL":
          return ve(i + 1, 2);
        case "Lo":
          return r.ordinalNumber(i + 1, { unit: "month" });
        case "LLL":
          return r.month(i, { width: "abbreviated", context: "standalone" });
        case "LLLLL":
          return r.month(i, { width: "narrow", context: "standalone" });
        case "LLLL":
        default:
          return r.month(i, { width: "wide", context: "standalone" });
      }
    },
    w: function (t, n, r, i) {
      var a = _y(t, i);
      return n === "wo"
        ? r.ordinalNumber(a, { unit: "week" })
        : ve(a, n.length);
    },
    I: function (t, n, r) {
      var i = Ry(t);
      return n === "Io"
        ? r.ordinalNumber(i, { unit: "week" })
        : ve(i, n.length);
    },
    d: function (t, n, r) {
      return n === "do"
        ? r.ordinalNumber(t.getUTCDate(), { unit: "date" })
        : Qn.d(t, n);
    },
    D: function (t, n, r) {
      var i = aS(t);
      return n === "Do"
        ? r.ordinalNumber(i, { unit: "dayOfYear" })
        : ve(i, n.length);
    },
    E: function (t, n, r) {
      var i = t.getUTCDay();
      switch (n) {
        case "E":
        case "EE":
        case "EEE":
          return r.day(i, { width: "abbreviated", context: "formatting" });
        case "EEEEE":
          return r.day(i, { width: "narrow", context: "formatting" });
        case "EEEEEE":
          return r.day(i, { width: "short", context: "formatting" });
        case "EEEE":
        default:
          return r.day(i, { width: "wide", context: "formatting" });
      }
    },
    e: function (t, n, r, i) {
      var a = t.getUTCDay(),
        o = (a - i.weekStartsOn + 8) % 7 || 7;
      switch (n) {
        case "e":
          return String(o);
        case "ee":
          return ve(o, 2);
        case "eo":
          return r.ordinalNumber(o, { unit: "day" });
        case "eee":
          return r.day(a, { width: "abbreviated", context: "formatting" });
        case "eeeee":
          return r.day(a, { width: "narrow", context: "formatting" });
        case "eeeeee":
          return r.day(a, { width: "short", context: "formatting" });
        case "eeee":
        default:
          return r.day(a, { width: "wide", context: "formatting" });
      }
    },
    c: function (t, n, r, i) {
      var a = t.getUTCDay(),
        o = (a - i.weekStartsOn + 8) % 7 || 7;
      switch (n) {
        case "c":
          return String(o);
        case "cc":
          return ve(o, n.length);
        case "co":
          return r.ordinalNumber(o, { unit: "day" });
        case "ccc":
          return r.day(a, { width: "abbreviated", context: "standalone" });
        case "ccccc":
          return r.day(a, { width: "narrow", context: "standalone" });
        case "cccccc":
          return r.day(a, { width: "short", context: "standalone" });
        case "cccc":
        default:
          return r.day(a, { width: "wide", context: "standalone" });
      }
    },
    i: function (t, n, r) {
      var i = t.getUTCDay(),
        a = i === 0 ? 7 : i;
      switch (n) {
        case "i":
          return String(a);
        case "ii":
          return ve(a, n.length);
        case "io":
          return r.ordinalNumber(a, { unit: "day" });
        case "iii":
          return r.day(i, { width: "abbreviated", context: "formatting" });
        case "iiiii":
          return r.day(i, { width: "narrow", context: "formatting" });
        case "iiiiii":
          return r.day(i, { width: "short", context: "formatting" });
        case "iiii":
        default:
          return r.day(i, { width: "wide", context: "formatting" });
      }
    },
    a: function (t, n, r) {
      var i = t.getUTCHours(),
        a = i / 12 >= 1 ? "pm" : "am";
      switch (n) {
        case "a":
        case "aa":
          return r.dayPeriod(a, {
            width: "abbreviated",
            context: "formatting",
          });
        case "aaa":
          return r
            .dayPeriod(a, { width: "abbreviated", context: "formatting" })
            .toLowerCase();
        case "aaaaa":
          return r.dayPeriod(a, { width: "narrow", context: "formatting" });
        case "aaaa":
        default:
          return r.dayPeriod(a, { width: "wide", context: "formatting" });
      }
    },
    b: function (t, n, r) {
      var i = t.getUTCHours(),
        a;
      switch (
        (i === 12
          ? (a = ui.noon)
          : i === 0
          ? (a = ui.midnight)
          : (a = i / 12 >= 1 ? "pm" : "am"),
        n)
      ) {
        case "b":
        case "bb":
          return r.dayPeriod(a, {
            width: "abbreviated",
            context: "formatting",
          });
        case "bbb":
          return r
            .dayPeriod(a, { width: "abbreviated", context: "formatting" })
            .toLowerCase();
        case "bbbbb":
          return r.dayPeriod(a, { width: "narrow", context: "formatting" });
        case "bbbb":
        default:
          return r.dayPeriod(a, { width: "wide", context: "formatting" });
      }
    },
    B: function (t, n, r) {
      var i = t.getUTCHours(),
        a;
      switch (
        (i >= 17
          ? (a = ui.evening)
          : i >= 12
          ? (a = ui.afternoon)
          : i >= 4
          ? (a = ui.morning)
          : (a = ui.night),
        n)
      ) {
        case "B":
        case "BB":
        case "BBB":
          return r.dayPeriod(a, {
            width: "abbreviated",
            context: "formatting",
          });
        case "BBBBB":
          return r.dayPeriod(a, { width: "narrow", context: "formatting" });
        case "BBBB":
        default:
          return r.dayPeriod(a, { width: "wide", context: "formatting" });
      }
    },
    h: function (t, n, r) {
      if (n === "ho") {
        var i = t.getUTCHours() % 12;
        return i === 0 && (i = 12), r.ordinalNumber(i, { unit: "hour" });
      }
      return Qn.h(t, n);
    },
    H: function (t, n, r) {
      return n === "Ho"
        ? r.ordinalNumber(t.getUTCHours(), { unit: "hour" })
        : Qn.H(t, n);
    },
    K: function (t, n, r) {
      var i = t.getUTCHours() % 12;
      return n === "Ko"
        ? r.ordinalNumber(i, { unit: "hour" })
        : ve(i, n.length);
    },
    k: function (t, n, r) {
      var i = t.getUTCHours();
      return (
        i === 0 && (i = 24),
        n === "ko" ? r.ordinalNumber(i, { unit: "hour" }) : ve(i, n.length)
      );
    },
    m: function (t, n, r) {
      return n === "mo"
        ? r.ordinalNumber(t.getUTCMinutes(), { unit: "minute" })
        : Qn.m(t, n);
    },
    s: function (t, n, r) {
      return n === "so"
        ? r.ordinalNumber(t.getUTCSeconds(), { unit: "second" })
        : Qn.s(t, n);
    },
    S: function (t, n) {
      return Qn.S(t, n);
    },
    X: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = a.getTimezoneOffset();
      if (o === 0) return "Z";
      switch (n) {
        case "X":
          return up(o);
        case "XXXX":
        case "XX":
          return Nr(o);
        case "XXXXX":
        case "XXX":
        default:
          return Nr(o, ":");
      }
    },
    x: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = a.getTimezoneOffset();
      switch (n) {
        case "x":
          return up(o);
        case "xxxx":
        case "xx":
          return Nr(o);
        case "xxxxx":
        case "xxx":
        default:
          return Nr(o, ":");
      }
    },
    O: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = a.getTimezoneOffset();
      switch (n) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + sp(o, ":");
        case "OOOO":
        default:
          return "GMT" + Nr(o, ":");
      }
    },
    z: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = a.getTimezoneOffset();
      switch (n) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + sp(o, ":");
        case "zzzz":
        default:
          return "GMT" + Nr(o, ":");
      }
    },
    t: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = Math.floor(a.getTime() / 1e3);
      return ve(o, n.length);
    },
    T: function (t, n, r, i) {
      var a = i._originalDate || t,
        o = a.getTime();
      return ve(o, n.length);
    },
  };
function sp(e, t) {
  var n = e > 0 ? "-" : "+",
    r = Math.abs(e),
    i = Math.floor(r / 60),
    a = r % 60;
  if (a === 0) return n + String(i);
  var o = t || "";
  return n + String(i) + o + ve(a, 2);
}
function up(e, t) {
  if (e % 60 === 0) {
    var n = e > 0 ? "-" : "+";
    return n + ve(Math.abs(e) / 60, 2);
  }
  return Nr(e, t);
}
function Nr(e, t) {
  var n = t || "",
    r = e > 0 ? "-" : "+",
    i = Math.abs(e),
    a = ve(Math.floor(i / 60), 2),
    o = ve(i % 60, 2);
  return r + a + n + o;
}
const fS = dS;
var cp = function (t, n) {
    switch (t) {
      case "P":
        return n.date({ width: "short" });
      case "PP":
        return n.date({ width: "medium" });
      case "PPP":
        return n.date({ width: "long" });
      case "PPPP":
      default:
        return n.date({ width: "full" });
    }
  },
  Ly = function (t, n) {
    switch (t) {
      case "p":
        return n.time({ width: "short" });
      case "pp":
        return n.time({ width: "medium" });
      case "ppp":
        return n.time({ width: "long" });
      case "pppp":
      default:
        return n.time({ width: "full" });
    }
  },
  hS = function (t, n) {
    var r = t.match(/(P+)(p+)?/) || [],
      i = r[1],
      a = r[2];
    if (!a) return cp(t, n);
    var o;
    switch (i) {
      case "P":
        o = n.dateTime({ width: "short" });
        break;
      case "PP":
        o = n.dateTime({ width: "medium" });
        break;
      case "PPP":
        o = n.dateTime({ width: "long" });
        break;
      case "PPPP":
      default:
        o = n.dateTime({ width: "full" });
        break;
    }
    return o.replace("{{date}}", cp(i, n)).replace("{{time}}", Ly(a, n));
  },
  pS = { p: Ly, P: hS };
const _c = pS;
var mS = ["D", "DD"],
  vS = ["YY", "YYYY"];
function Fy(e) {
  return mS.indexOf(e) !== -1;
}
function Uy(e) {
  return vS.indexOf(e) !== -1;
}
function es(e, t, n) {
  if (e === "YYYY")
    throw new RangeError(
      "Use `yyyy` instead of `YYYY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(
          n,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md",
        ),
    );
  if (e === "YY")
    throw new RangeError(
      "Use `yy` instead of `YY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(
          n,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md",
        ),
    );
  if (e === "D")
    throw new RangeError(
      "Use `d` instead of `D` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(
          n,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md",
        ),
    );
  if (e === "DD")
    throw new RangeError(
      "Use `dd` instead of `DD` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(
          n,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md",
        ),
    );
}
var yS = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds",
    },
    xSeconds: { one: "1 second", other: "{{count}} seconds" },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes",
    },
    xMinutes: { one: "1 minute", other: "{{count}} minutes" },
    aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
    xHours: { one: "1 hour", other: "{{count}} hours" },
    xDays: { one: "1 day", other: "{{count}} days" },
    aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
    xWeeks: { one: "1 week", other: "{{count}} weeks" },
    aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
    xMonths: { one: "1 month", other: "{{count}} months" },
    aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
    xYears: { one: "1 year", other: "{{count}} years" },
    overXYears: { one: "over 1 year", other: "over {{count}} years" },
    almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
  },
  gS = function (t, n, r) {
    var i,
      a = yS[t];
    return (
      typeof a == "string"
        ? (i = a)
        : n === 1
        ? (i = a.one)
        : (i = a.other.replace("{{count}}", n.toString())),
      r != null && r.addSuffix
        ? r.comparison && r.comparison > 0
          ? "in " + i
          : i + " ago"
        : i
    );
  };
const wS = gS;
function Du(e) {
  return function () {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      n = t.width ? String(t.width) : e.defaultWidth,
      r = e.formats[n] || e.formats[e.defaultWidth];
    return r;
  };
}
var xS = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy",
  },
  SS = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a",
  },
  kS = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}",
  },
  CS = {
    date: Du({ formats: xS, defaultWidth: "full" }),
    time: Du({ formats: SS, defaultWidth: "full" }),
    dateTime: Du({ formats: kS, defaultWidth: "full" }),
  };
const ES = CS;
var TS = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P",
  },
  PS = function (t, n, r, i) {
    return TS[t];
  };
const DS = PS;
function Ma(e) {
  return function (t, n) {
    var r = n != null && n.context ? String(n.context) : "standalone",
      i;
    if (r === "formatting" && e.formattingValues) {
      var a = e.defaultFormattingWidth || e.defaultWidth,
        o = n != null && n.width ? String(n.width) : a;
      i = e.formattingValues[o] || e.formattingValues[a];
    } else {
      var l = e.defaultWidth,
        s = n != null && n.width ? String(n.width) : e.defaultWidth;
      i = e.values[s] || e.values[l];
    }
    var u = e.argumentCallback ? e.argumentCallback(t) : t;
    return i[u];
  };
}
var bS = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"],
  },
  NS = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
  },
  MS = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  OS = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  RS = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
  },
  _S = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
  },
  LS = function (t, n) {
    var r = Number(t),
      i = r % 100;
    if (i > 20 || i < 10)
      switch (i % 10) {
        case 1:
          return r + "st";
        case 2:
          return r + "nd";
        case 3:
          return r + "rd";
      }
    return r + "th";
  },
  FS = {
    ordinalNumber: LS,
    era: Ma({ values: bS, defaultWidth: "wide" }),
    quarter: Ma({
      values: NS,
      defaultWidth: "wide",
      argumentCallback: function (t) {
        return t - 1;
      },
    }),
    month: Ma({ values: MS, defaultWidth: "wide" }),
    day: Ma({ values: OS, defaultWidth: "wide" }),
    dayPeriod: Ma({
      values: RS,
      defaultWidth: "wide",
      formattingValues: _S,
      defaultFormattingWidth: "wide",
    }),
  };
const US = FS;
function Oa(e) {
  return function (t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      r = n.width,
      i = (r && e.matchPatterns[r]) || e.matchPatterns[e.defaultMatchWidth],
      a = t.match(i);
    if (!a) return null;
    var o = a[0],
      l = (r && e.parsePatterns[r]) || e.parsePatterns[e.defaultParseWidth],
      s = Array.isArray(l)
        ? IS(l, function (d) {
            return d.test(o);
          })
        : AS(l, function (d) {
            return d.test(o);
          }),
      u;
    (u = e.valueCallback ? e.valueCallback(s) : s),
      (u = n.valueCallback ? n.valueCallback(u) : u);
    var c = t.slice(o.length);
    return { value: u, rest: c };
  };
}
function AS(e, t) {
  for (var n in e) if (e.hasOwnProperty(n) && t(e[n])) return n;
}
function IS(e, t) {
  for (var n = 0; n < e.length; n++) if (t(e[n])) return n;
}
function $S(e) {
  return function (t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      r = t.match(e.matchPattern);
    if (!r) return null;
    var i = r[0],
      a = t.match(e.parsePattern);
    if (!a) return null;
    var o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
    o = n.valueCallback ? n.valueCallback(o) : o;
    var l = t.slice(i.length);
    return { value: o, rest: l };
  };
}
var jS = /^(\d+)(th|st|nd|rd)?/i,
  zS = /\d+/i,
  HS = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  WS = { any: [/^b/i, /^(a|c)/i] },
  BS = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  },
  QS = { any: [/1/i, /2/i, /3/i, /4/i] },
  YS = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  VS = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  },
  qS = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  KS = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  GS = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  XS = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  JS = {
    ordinalNumber: $S({
      matchPattern: jS,
      parsePattern: zS,
      valueCallback: function (t) {
        return parseInt(t, 10);
      },
    }),
    era: Oa({
      matchPatterns: HS,
      defaultMatchWidth: "wide",
      parsePatterns: WS,
      defaultParseWidth: "any",
    }),
    quarter: Oa({
      matchPatterns: BS,
      defaultMatchWidth: "wide",
      parsePatterns: QS,
      defaultParseWidth: "any",
      valueCallback: function (t) {
        return t + 1;
      },
    }),
    month: Oa({
      matchPatterns: YS,
      defaultMatchWidth: "wide",
      parsePatterns: VS,
      defaultParseWidth: "any",
    }),
    day: Oa({
      matchPatterns: qS,
      defaultMatchWidth: "wide",
      parsePatterns: KS,
      defaultParseWidth: "any",
    }),
    dayPeriod: Oa({
      matchPatterns: GS,
      defaultMatchWidth: "any",
      parsePatterns: XS,
      defaultParseWidth: "any",
    }),
  };
const ZS = JS;
var ek = {
  code: "en-US",
  formatDistance: wS,
  formatLong: ES,
  formatRelative: DS,
  localize: US,
  match: ZS,
  options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
};
const Ay = ek;
var tk = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  nk = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  rk = /^'([^]*?)'?$/,
  ik = /''/g,
  ak = /[a-zA-Z]/;
function We(e, t, n) {
  var r, i, a, o, l, s, u, c, d, p, v, y, C, k, f, h, g, T;
  Y(2, arguments);
  var M = String(t),
    w = Er(),
    P =
      (r =
        (i = n == null ? void 0 : n.locale) !== null && i !== void 0
          ? i
          : w.locale) !== null && r !== void 0
        ? r
        : Ay,
    b = re(
      (a =
        (o =
          (l =
            (s = n == null ? void 0 : n.firstWeekContainsDate) !== null &&
            s !== void 0
              ? s
              : n == null ||
                (u = n.locale) === null ||
                u === void 0 ||
                (c = u.options) === null ||
                c === void 0
              ? void 0
              : c.firstWeekContainsDate) !== null && l !== void 0
            ? l
            : w.firstWeekContainsDate) !== null && o !== void 0
          ? o
          : (d = w.locale) === null ||
            d === void 0 ||
            (p = d.options) === null ||
            p === void 0
          ? void 0
          : p.firstWeekContainsDate) !== null && a !== void 0
        ? a
        : 1,
    );
  if (!(b >= 1 && b <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively",
    );
  var _ = re(
    (v =
      (y =
        (C =
          (k = n == null ? void 0 : n.weekStartsOn) !== null && k !== void 0
            ? k
            : n == null ||
              (f = n.locale) === null ||
              f === void 0 ||
              (h = f.options) === null ||
              h === void 0
            ? void 0
            : h.weekStartsOn) !== null && C !== void 0
          ? C
          : w.weekStartsOn) !== null && y !== void 0
        ? y
        : (g = w.locale) === null ||
          g === void 0 ||
          (T = g.options) === null ||
          T === void 0
        ? void 0
        : T.weekStartsOn) !== null && v !== void 0
      ? v
      : 0,
  );
  if (!(_ >= 0 && _ <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if (!P.localize)
    throw new RangeError("locale must contain localize property");
  if (!P.formatLong)
    throw new RangeError("locale must contain formatLong property");
  var I = V(e);
  if (!Yx(I)) throw new RangeError("Invalid time value");
  var G = Zl(I),
    me = My(I, G),
    fe = {
      firstWeekContainsDate: b,
      weekStartsOn: _,
      locale: P,
      _originalDate: I,
    },
    Ae = M.match(nk)
      .map(function (ge) {
        var Z = ge[0];
        if (Z === "p" || Z === "P") {
          var X = _c[Z];
          return X(ge, P.formatLong);
        }
        return ge;
      })
      .join("")
      .match(tk)
      .map(function (ge) {
        if (ge === "''") return "'";
        var Z = ge[0];
        if (Z === "'") return ok(ge);
        var X = fS[Z];
        if (X)
          return (
            !(n != null && n.useAdditionalWeekYearTokens) &&
              Uy(ge) &&
              es(ge, t, String(e)),
            !(n != null && n.useAdditionalDayOfYearTokens) &&
              Fy(ge) &&
              es(ge, t, String(e)),
            X(me, ge, P.localize, fe)
          );
        if (Z.match(ak))
          throw new RangeError(
            "Format string contains an unescaped latin alphabet character `" +
              Z +
              "`",
          );
        return ge;
      })
      .join("");
  return Ae;
}
function ok(e) {
  var t = e.match(rk);
  return t ? t[1].replace(ik, "'") : e;
}
function lk(e, t) {
  if (e == null)
    throw new TypeError(
      "assign requires that input parameter not be null or undefined",
    );
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
  return e;
}
function Iy(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getDay();
  return n;
}
function Os(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getHours();
  return n;
}
function Rs(e) {
  Y(1, arguments);
  var t = V(e),
    n = t.getMinutes();
  return n;
}
function uf(e) {
  Y(1, arguments);
  var t = V(e.start),
    n = V(e.end);
  if (isNaN(t.getTime())) throw new RangeError("Start Date is invalid");
  if (isNaN(n.getTime())) throw new RangeError("End Date is invalid");
  var r = {};
  r.years = Math.abs(rS(n, t));
  var i = Oi(n, t),
    a = Zn(t, { years: i * r.years });
  r.months = Math.abs(tS(n, a));
  var o = Zn(a, { months: i * r.months });
  r.days = Math.abs(Kx(n, o));
  var l = Zn(o, { days: i * r.days });
  r.hours = Math.abs(Xx(n, l));
  var s = Zn(l, { hours: i * r.hours });
  r.minutes = Math.abs(Jx(n, s));
  var u = Zn(s, { minutes: i * r.minutes });
  return (r.seconds = Math.abs(nS(n, u))), r;
}
function dp(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function sk(e, t) {
  if (!!e) {
    if (typeof e == "string") return dp(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (n === "Object" && e.constructor && (n = e.constructor.name),
      n === "Map" || n === "Set")
    )
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return dp(e, t);
  }
}
function fp(e, t) {
  var n = (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (!n) {
    if (
      Array.isArray(e) ||
      (n = sk(e)) ||
      (t && e && typeof e.length == "number")
    ) {
      n && (e = n);
      var r = 0,
        i = function () {};
      return {
        s: i,
        n: function () {
          return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
        },
        e: function (u) {
          throw u;
        },
        f: i,
      };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var a = !0,
    o = !1,
    l;
  return {
    s: function () {
      n = n.call(e);
    },
    n: function () {
      var u = n.next();
      return (a = u.done), u;
    },
    e: function (u) {
      (o = !0), (l = u);
    },
    f: function () {
      try {
        !a && n.return != null && n.return();
      } finally {
        if (o) throw l;
      }
    },
  };
}
function $(e) {
  if (e === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  return e;
}
function Lc(e, t) {
  return (
    (Lc = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, i) {
          return (r.__proto__ = i), r;
        }),
    Lc(e, t)
  );
}
function ce(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Lc(e, t);
}
function ts(e) {
  return (
    (ts = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (n) {
          return n.__proto__ || Object.getPrototypeOf(n);
        }),
    ts(e)
  );
}
function uk() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
    return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return (
      Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      ),
      !0
    );
  } catch {
    return !1;
  }
}
function ck(e, t) {
  if (t && (sn(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0)
    throw new TypeError(
      "Derived constructors may only return object or undefined",
    );
  return $(e);
}
function de(e) {
  var t = uk();
  return function () {
    var r = ts(e),
      i;
    if (t) {
      var a = ts(this).constructor;
      i = Reflect.construct(r, arguments, a);
    } else i = r.apply(this, arguments);
    return ck(this, i);
  };
}
function le(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function dk(e, t) {
  if (sn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (sn(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function $y(e) {
  var t = dk(e, "string");
  return sn(t) == "symbol" ? t : String(t);
}
function hp(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, $y(r.key), r);
  }
}
function se(e, t, n) {
  return (
    t && hp(e.prototype, t),
    n && hp(e, n),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function A(e, t, n) {
  return (
    (t = $y(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
var fk = 10,
  jy = (function () {
    function e() {
      le(this, e), A(this, "priority", void 0), A(this, "subPriority", 0);
    }
    return (
      se(e, [
        {
          key: "validate",
          value: function (n, r) {
            return !0;
          },
        },
      ]),
      e
    );
  })(),
  hk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n(r, i, a, o, l) {
      var s;
      return (
        le(this, n),
        (s = t.call(this)),
        (s.value = r),
        (s.validateValue = i),
        (s.setValue = a),
        (s.priority = o),
        l && (s.subPriority = l),
        s
      );
    }
    return (
      se(n, [
        {
          key: "validate",
          value: function (i, a) {
            return this.validateValue(i, this.value, a);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return this.setValue(i, a, this.value, o);
          },
        },
      ]),
      n
    );
  })(jy),
  pk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", fk),
        A($(r), "subPriority", -1),
        r
      );
    }
    return (
      se(n, [
        {
          key: "set",
          value: function (i, a) {
            if (a.timestampIsSet) return i;
            var o = new Date(0);
            return (
              o.setFullYear(
                i.getUTCFullYear(),
                i.getUTCMonth(),
                i.getUTCDate(),
              ),
              o.setHours(
                i.getUTCHours(),
                i.getUTCMinutes(),
                i.getUTCSeconds(),
                i.getUTCMilliseconds(),
              ),
              o
            );
          },
        },
      ]),
      n
    );
  })(jy),
  pe = (function () {
    function e() {
      le(this, e),
        A(this, "incompatibleTokens", void 0),
        A(this, "priority", void 0),
        A(this, "subPriority", void 0);
    }
    return (
      se(e, [
        {
          key: "run",
          value: function (n, r, i, a) {
            var o = this.parse(n, r, i, a);
            return o
              ? {
                  setter: new hk(
                    o.value,
                    this.validate,
                    this.set,
                    this.priority,
                    this.subPriority,
                  ),
                  rest: o.rest,
                }
              : null;
          },
        },
        {
          key: "validate",
          value: function (n, r, i) {
            return !0;
          },
        },
      ]),
      e
    );
  })(),
  mk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 140),
        A($(r), "incompatibleTokens", ["R", "u", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "G":
              case "GG":
              case "GGG":
                return (
                  o.era(i, { width: "abbreviated" }) ||
                  o.era(i, { width: "narrow" })
                );
              case "GGGGG":
                return o.era(i, { width: "narrow" });
              case "GGGG":
              default:
                return (
                  o.era(i, { width: "wide" }) ||
                  o.era(i, { width: "abbreviated" }) ||
                  o.era(i, { width: "narrow" })
                );
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return (
              (a.era = o),
              i.setUTCFullYear(o, 0, 1),
              i.setUTCHours(0, 0, 0, 0),
              i
            );
          },
        },
      ]),
      n
    );
  })(pe),
  je = {
    month: /^(1[0-2]|0?\d)/,
    date: /^(3[0-1]|[0-2]?\d)/,
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    week: /^(5[0-3]|[0-4]?\d)/,
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    hour11h: /^(1[0-1]|0?\d)/,
    hour12h: /^(1[0-2]|0?\d)/,
    minute: /^[0-5]?\d/,
    second: /^[0-5]?\d/,
    singleDigit: /^\d/,
    twoDigits: /^\d{1,2}/,
    threeDigits: /^\d{1,3}/,
    fourDigits: /^\d{1,4}/,
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    twoDigitsSigned: /^-?\d{1,2}/,
    threeDigitsSigned: /^-?\d{1,3}/,
    fourDigitsSigned: /^-?\d{1,4}/,
  },
  xn = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/,
  };
function ze(e, t) {
  return e && { value: t(e.value), rest: e.rest };
}
function Me(e, t) {
  var n = t.match(e);
  return n ? { value: parseInt(n[0], 10), rest: t.slice(n[0].length) } : null;
}
function Sn(e, t) {
  var n = t.match(e);
  if (!n) return null;
  if (n[0] === "Z") return { value: 0, rest: t.slice(1) };
  var r = n[1] === "+" ? 1 : -1,
    i = n[2] ? parseInt(n[2], 10) : 0,
    a = n[3] ? parseInt(n[3], 10) : 0,
    o = n[5] ? parseInt(n[5], 10) : 0;
  return { value: r * (i * Py + a * Ty + o * Bx), rest: t.slice(n[0].length) };
}
function zy(e) {
  return Me(je.anyDigitsSigned, e);
}
function Ue(e, t) {
  switch (e) {
    case 1:
      return Me(je.singleDigit, t);
    case 2:
      return Me(je.twoDigits, t);
    case 3:
      return Me(je.threeDigits, t);
    case 4:
      return Me(je.fourDigits, t);
    default:
      return Me(new RegExp("^\\d{1," + e + "}"), t);
  }
}
function ns(e, t) {
  switch (e) {
    case 1:
      return Me(je.singleDigitSigned, t);
    case 2:
      return Me(je.twoDigitsSigned, t);
    case 3:
      return Me(je.threeDigitsSigned, t);
    case 4:
      return Me(je.fourDigitsSigned, t);
    default:
      return Me(new RegExp("^-?\\d{1," + e + "}"), t);
  }
}
function cf(e) {
  switch (e) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function Hy(e, t) {
  var n = t > 0,
    r = n ? t : 1 - t,
    i;
  if (r <= 50) i = e || 100;
  else {
    var a = r + 50,
      o = Math.floor(a / 100) * 100,
      l = e >= a % 100;
    i = e + o - (l ? 100 : 0);
  }
  return n ? i : 1 - i;
}
function Wy(e) {
  return e % 400 === 0 || (e % 4 === 0 && e % 100 !== 0);
}
var vk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 130),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "u",
          "w",
          "I",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            var l = function (u) {
              return { year: u, isTwoDigitYear: a === "yy" };
            };
            switch (a) {
              case "y":
                return ze(Ue(4, i), l);
              case "yo":
                return ze(o.ordinalNumber(i, { unit: "year" }), l);
              default:
                return ze(Ue(a.length, i), l);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a.isTwoDigitYear || a.year > 0;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            var l = i.getUTCFullYear();
            if (o.isTwoDigitYear) {
              var s = Hy(o.year, l);
              return i.setUTCFullYear(s, 0, 1), i.setUTCHours(0, 0, 0, 0), i;
            }
            var u = !("era" in a) || a.era === 1 ? o.year : 1 - o.year;
            return i.setUTCFullYear(u, 0, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  yk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 130),
        A($(r), "incompatibleTokens", [
          "y",
          "R",
          "u",
          "Q",
          "q",
          "M",
          "L",
          "I",
          "d",
          "D",
          "i",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            var l = function (u) {
              return { year: u, isTwoDigitYear: a === "YY" };
            };
            switch (a) {
              case "Y":
                return ze(Ue(4, i), l);
              case "Yo":
                return ze(o.ordinalNumber(i, { unit: "year" }), l);
              default:
                return ze(Ue(a.length, i), l);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a.isTwoDigitYear || a.year > 0;
          },
        },
        {
          key: "set",
          value: function (i, a, o, l) {
            var s = sf(i, l);
            if (o.isTwoDigitYear) {
              var u = Hy(o.year, s);
              return (
                i.setUTCFullYear(u, 0, l.firstWeekContainsDate),
                i.setUTCHours(0, 0, 0, 0),
                Zr(i, l)
              );
            }
            var c = !("era" in a) || a.era === 1 ? o.year : 1 - o.year;
            return (
              i.setUTCFullYear(c, 0, l.firstWeekContainsDate),
              i.setUTCHours(0, 0, 0, 0),
              Zr(i, l)
            );
          },
        },
      ]),
      n
    );
  })(pe),
  gk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 130),
        A($(r), "incompatibleTokens", [
          "G",
          "y",
          "Y",
          "u",
          "Q",
          "q",
          "M",
          "L",
          "w",
          "d",
          "D",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a) {
            return ns(a === "R" ? 4 : a.length, i);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            var l = new Date(0);
            return l.setUTCFullYear(o, 0, 4), l.setUTCHours(0, 0, 0, 0), na(l);
          },
        },
      ]),
      n
    );
  })(pe),
  wk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 130),
        A($(r), "incompatibleTokens", [
          "G",
          "y",
          "Y",
          "R",
          "w",
          "I",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a) {
            return ns(a === "u" ? 4 : a.length, i);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCFullYear(o, 0, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  xk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 120),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "q",
          "M",
          "L",
          "w",
          "I",
          "d",
          "D",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "Q":
              case "QQ":
                return Ue(a.length, i);
              case "Qo":
                return o.ordinalNumber(i, { unit: "quarter" });
              case "QQQ":
                return (
                  o.quarter(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) || o.quarter(i, { width: "narrow", context: "formatting" })
                );
              case "QQQQQ":
                return o.quarter(i, { width: "narrow", context: "formatting" });
              case "QQQQ":
              default:
                return (
                  o.quarter(i, { width: "wide", context: "formatting" }) ||
                  o.quarter(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.quarter(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 4;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMonth((o - 1) * 3, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Sk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 120),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "Q",
          "M",
          "L",
          "w",
          "I",
          "d",
          "D",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "q":
              case "qq":
                return Ue(a.length, i);
              case "qo":
                return o.ordinalNumber(i, { unit: "quarter" });
              case "qqq":
                return (
                  o.quarter(i, {
                    width: "abbreviated",
                    context: "standalone",
                  }) || o.quarter(i, { width: "narrow", context: "standalone" })
                );
              case "qqqqq":
                return o.quarter(i, { width: "narrow", context: "standalone" });
              case "qqqq":
              default:
                return (
                  o.quarter(i, { width: "wide", context: "standalone" }) ||
                  o.quarter(i, {
                    width: "abbreviated",
                    context: "standalone",
                  }) ||
                  o.quarter(i, { width: "narrow", context: "standalone" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 4;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMonth((o - 1) * 3, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  kk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "q",
          "Q",
          "L",
          "w",
          "I",
          "D",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        A($(r), "priority", 110),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            var l = function (u) {
              return u - 1;
            };
            switch (a) {
              case "M":
                return ze(Me(je.month, i), l);
              case "MM":
                return ze(Ue(2, i), l);
              case "Mo":
                return ze(o.ordinalNumber(i, { unit: "month" }), l);
              case "MMM":
                return (
                  o.month(i, { width: "abbreviated", context: "formatting" }) ||
                  o.month(i, { width: "narrow", context: "formatting" })
                );
              case "MMMMM":
                return o.month(i, { width: "narrow", context: "formatting" });
              case "MMMM":
              default:
                return (
                  o.month(i, { width: "wide", context: "formatting" }) ||
                  o.month(i, { width: "abbreviated", context: "formatting" }) ||
                  o.month(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 11;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMonth(o, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Ck = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 110),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "q",
          "Q",
          "M",
          "w",
          "I",
          "D",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            var l = function (u) {
              return u - 1;
            };
            switch (a) {
              case "L":
                return ze(Me(je.month, i), l);
              case "LL":
                return ze(Ue(2, i), l);
              case "Lo":
                return ze(o.ordinalNumber(i, { unit: "month" }), l);
              case "LLL":
                return (
                  o.month(i, { width: "abbreviated", context: "standalone" }) ||
                  o.month(i, { width: "narrow", context: "standalone" })
                );
              case "LLLLL":
                return o.month(i, { width: "narrow", context: "standalone" });
              case "LLLL":
              default:
                return (
                  o.month(i, { width: "wide", context: "standalone" }) ||
                  o.month(i, { width: "abbreviated", context: "standalone" }) ||
                  o.month(i, { width: "narrow", context: "standalone" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 11;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMonth(o, 1), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe);
function Ek(e, t, n) {
  Y(2, arguments);
  var r = V(e),
    i = re(t),
    a = _y(r, n) - i;
  return r.setUTCDate(r.getUTCDate() - a * 7), r;
}
var Tk = (function (e) {
  ce(n, e);
  var t = de(n);
  function n() {
    var r;
    le(this, n);
    for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
      a[o] = arguments[o];
    return (
      (r = t.call.apply(t, [this].concat(a))),
      A($(r), "priority", 100),
      A($(r), "incompatibleTokens", [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T",
      ]),
      r
    );
  }
  return (
    se(n, [
      {
        key: "parse",
        value: function (i, a, o) {
          switch (a) {
            case "w":
              return Me(je.week, i);
            case "wo":
              return o.ordinalNumber(i, { unit: "week" });
            default:
              return Ue(a.length, i);
          }
        },
      },
      {
        key: "validate",
        value: function (i, a) {
          return a >= 1 && a <= 53;
        },
      },
      {
        key: "set",
        value: function (i, a, o, l) {
          return Zr(Ek(i, o, l), l);
        },
      },
    ]),
    n
  );
})(pe);
function Pk(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = re(t),
    i = Ry(n) - r;
  return n.setUTCDate(n.getUTCDate() - i * 7), n;
}
var Dk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 100),
        A($(r), "incompatibleTokens", [
          "y",
          "Y",
          "u",
          "q",
          "Q",
          "M",
          "L",
          "w",
          "d",
          "D",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "I":
                return Me(je.week, i);
              case "Io":
                return o.ordinalNumber(i, { unit: "week" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 53;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return na(Pk(i, o));
          },
        },
      ]),
      n
    );
  })(pe),
  bk = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  Nk = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  Mk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "subPriority", 1),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "q",
          "Q",
          "w",
          "I",
          "D",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "d":
                return Me(je.date, i);
              case "do":
                return o.ordinalNumber(i, { unit: "date" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            var o = i.getUTCFullYear(),
              l = Wy(o),
              s = i.getUTCMonth();
            return l ? a >= 1 && a <= Nk[s] : a >= 1 && a <= bk[s];
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCDate(o), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Ok = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "subpriority", 1),
        A($(r), "incompatibleTokens", [
          "Y",
          "R",
          "q",
          "Q",
          "M",
          "L",
          "w",
          "I",
          "d",
          "E",
          "i",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "D":
              case "DD":
                return Me(je.dayOfYear, i);
              case "Do":
                return o.ordinalNumber(i, { unit: "date" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            var o = i.getUTCFullYear(),
              l = Wy(o);
            return l ? a >= 1 && a <= 366 : a >= 1 && a <= 365;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMonth(0, o), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe);
function df(e, t, n) {
  var r, i, a, o, l, s, u, c;
  Y(2, arguments);
  var d = Er(),
    p = re(
      (r =
        (i =
          (a =
            (o = n == null ? void 0 : n.weekStartsOn) !== null && o !== void 0
              ? o
              : n == null ||
                (l = n.locale) === null ||
                l === void 0 ||
                (s = l.options) === null ||
                s === void 0
              ? void 0
              : s.weekStartsOn) !== null && a !== void 0
            ? a
            : d.weekStartsOn) !== null && i !== void 0
          ? i
          : (u = d.locale) === null ||
            u === void 0 ||
            (c = u.options) === null ||
            c === void 0
          ? void 0
          : c.weekStartsOn) !== null && r !== void 0
        ? r
        : 0,
    );
  if (!(p >= 0 && p <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var v = V(e),
    y = re(t),
    C = v.getUTCDay(),
    k = y % 7,
    f = (k + 7) % 7,
    h = (f < p ? 7 : 0) + y - C;
  return v.setUTCDate(v.getUTCDate() + h), v;
}
var Rk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "E":
              case "EE":
              case "EEE":
                return (
                  o.day(i, { width: "abbreviated", context: "formatting" }) ||
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
              case "EEEEE":
                return o.day(i, { width: "narrow", context: "formatting" });
              case "EEEEEE":
                return (
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
              case "EEEE":
              default:
                return (
                  o.day(i, { width: "wide", context: "formatting" }) ||
                  o.day(i, { width: "abbreviated", context: "formatting" }) ||
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 6;
          },
        },
        {
          key: "set",
          value: function (i, a, o, l) {
            return (i = df(i, o, l)), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  _k = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "incompatibleTokens", [
          "y",
          "R",
          "u",
          "q",
          "Q",
          "M",
          "L",
          "I",
          "d",
          "D",
          "E",
          "i",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o, l) {
            var s = function (c) {
              var d = Math.floor((c - 1) / 7) * 7;
              return ((c + l.weekStartsOn + 6) % 7) + d;
            };
            switch (a) {
              case "e":
              case "ee":
                return ze(Ue(a.length, i), s);
              case "eo":
                return ze(o.ordinalNumber(i, { unit: "day" }), s);
              case "eee":
                return (
                  o.day(i, { width: "abbreviated", context: "formatting" }) ||
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
              case "eeeee":
                return o.day(i, { width: "narrow", context: "formatting" });
              case "eeeeee":
                return (
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
              case "eeee":
              default:
                return (
                  o.day(i, { width: "wide", context: "formatting" }) ||
                  o.day(i, { width: "abbreviated", context: "formatting" }) ||
                  o.day(i, { width: "short", context: "formatting" }) ||
                  o.day(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 6;
          },
        },
        {
          key: "set",
          value: function (i, a, o, l) {
            return (i = df(i, o, l)), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Lk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "incompatibleTokens", [
          "y",
          "R",
          "u",
          "q",
          "Q",
          "M",
          "L",
          "I",
          "d",
          "D",
          "E",
          "i",
          "e",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o, l) {
            var s = function (c) {
              var d = Math.floor((c - 1) / 7) * 7;
              return ((c + l.weekStartsOn + 6) % 7) + d;
            };
            switch (a) {
              case "c":
              case "cc":
                return ze(Ue(a.length, i), s);
              case "co":
                return ze(o.ordinalNumber(i, { unit: "day" }), s);
              case "ccc":
                return (
                  o.day(i, { width: "abbreviated", context: "standalone" }) ||
                  o.day(i, { width: "short", context: "standalone" }) ||
                  o.day(i, { width: "narrow", context: "standalone" })
                );
              case "ccccc":
                return o.day(i, { width: "narrow", context: "standalone" });
              case "cccccc":
                return (
                  o.day(i, { width: "short", context: "standalone" }) ||
                  o.day(i, { width: "narrow", context: "standalone" })
                );
              case "cccc":
              default:
                return (
                  o.day(i, { width: "wide", context: "standalone" }) ||
                  o.day(i, { width: "abbreviated", context: "standalone" }) ||
                  o.day(i, { width: "short", context: "standalone" }) ||
                  o.day(i, { width: "narrow", context: "standalone" })
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 6;
          },
        },
        {
          key: "set",
          value: function (i, a, o, l) {
            return (i = df(i, o, l)), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe);
function Fk(e, t) {
  Y(2, arguments);
  var n = re(t);
  n % 7 === 0 && (n = n - 7);
  var r = 1,
    i = V(e),
    a = i.getUTCDay(),
    o = n % 7,
    l = (o + 7) % 7,
    s = (l < r ? 7 : 0) + n - a;
  return i.setUTCDate(i.getUTCDate() + s), i;
}
var Uk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 90),
        A($(r), "incompatibleTokens", [
          "y",
          "Y",
          "u",
          "q",
          "Q",
          "M",
          "L",
          "w",
          "d",
          "D",
          "E",
          "e",
          "c",
          "t",
          "T",
        ]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            var l = function (u) {
              return u === 0 ? 7 : u;
            };
            switch (a) {
              case "i":
              case "ii":
                return Ue(a.length, i);
              case "io":
                return o.ordinalNumber(i, { unit: "day" });
              case "iii":
                return ze(
                  o.day(i, { width: "abbreviated", context: "formatting" }) ||
                    o.day(i, { width: "short", context: "formatting" }) ||
                    o.day(i, { width: "narrow", context: "formatting" }),
                  l,
                );
              case "iiiii":
                return ze(
                  o.day(i, { width: "narrow", context: "formatting" }),
                  l,
                );
              case "iiiiii":
                return ze(
                  o.day(i, { width: "short", context: "formatting" }) ||
                    o.day(i, { width: "narrow", context: "formatting" }),
                  l,
                );
              case "iiii":
              default:
                return ze(
                  o.day(i, { width: "wide", context: "formatting" }) ||
                    o.day(i, { width: "abbreviated", context: "formatting" }) ||
                    o.day(i, { width: "short", context: "formatting" }) ||
                    o.day(i, { width: "narrow", context: "formatting" }),
                  l,
                );
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 7;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return (i = Fk(i, o)), i.setUTCHours(0, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Ak = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 80),
        A($(r), "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "a":
              case "aa":
              case "aaa":
                return (
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
              case "aaaaa":
                return o.dayPeriod(i, {
                  width: "narrow",
                  context: "formatting",
                });
              case "aaaa":
              default:
                return (
                  o.dayPeriod(i, { width: "wide", context: "formatting" }) ||
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCHours(cf(o), 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Ik = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 80),
        A($(r), "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "b":
              case "bb":
              case "bbb":
                return (
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
              case "bbbbb":
                return o.dayPeriod(i, {
                  width: "narrow",
                  context: "formatting",
                });
              case "bbbb":
              default:
                return (
                  o.dayPeriod(i, { width: "wide", context: "formatting" }) ||
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCHours(cf(o), 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  $k = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 80),
        A($(r), "incompatibleTokens", ["a", "b", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "B":
              case "BB":
              case "BBB":
                return (
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
              case "BBBBB":
                return o.dayPeriod(i, {
                  width: "narrow",
                  context: "formatting",
                });
              case "BBBB":
              default:
                return (
                  o.dayPeriod(i, { width: "wide", context: "formatting" }) ||
                  o.dayPeriod(i, {
                    width: "abbreviated",
                    context: "formatting",
                  }) ||
                  o.dayPeriod(i, { width: "narrow", context: "formatting" })
                );
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCHours(cf(o), 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  jk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 70),
        A($(r), "incompatibleTokens", ["H", "K", "k", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "h":
                return Me(je.hour12h, i);
              case "ho":
                return o.ordinalNumber(i, { unit: "hour" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 12;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            var l = i.getUTCHours() >= 12;
            return (
              l && o < 12
                ? i.setUTCHours(o + 12, 0, 0, 0)
                : !l && o === 12
                ? i.setUTCHours(0, 0, 0, 0)
                : i.setUTCHours(o, 0, 0, 0),
              i
            );
          },
        },
      ]),
      n
    );
  })(pe),
  zk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 70),
        A($(r), "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "H":
                return Me(je.hour23h, i);
              case "Ho":
                return o.ordinalNumber(i, { unit: "hour" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 23;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCHours(o, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Hk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 70),
        A($(r), "incompatibleTokens", ["h", "H", "k", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "K":
                return Me(je.hour11h, i);
              case "Ko":
                return o.ordinalNumber(i, { unit: "hour" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 11;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            var l = i.getUTCHours() >= 12;
            return (
              l && o < 12
                ? i.setUTCHours(o + 12, 0, 0, 0)
                : i.setUTCHours(o, 0, 0, 0),
              i
            );
          },
        },
      ]),
      n
    );
  })(pe),
  Wk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 70),
        A($(r), "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "k":
                return Me(je.hour24h, i);
              case "ko":
                return o.ordinalNumber(i, { unit: "hour" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 1 && a <= 24;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            var l = o <= 24 ? o % 24 : o;
            return i.setUTCHours(l, 0, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Bk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 60),
        A($(r), "incompatibleTokens", ["t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "m":
                return Me(je.minute, i);
              case "mo":
                return o.ordinalNumber(i, { unit: "minute" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 59;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMinutes(o, 0, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Qk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 50),
        A($(r), "incompatibleTokens", ["t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a, o) {
            switch (a) {
              case "s":
                return Me(je.second, i);
              case "so":
                return o.ordinalNumber(i, { unit: "second" });
              default:
                return Ue(a.length, i);
            }
          },
        },
        {
          key: "validate",
          value: function (i, a) {
            return a >= 0 && a <= 59;
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCSeconds(o, 0), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Yk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 30),
        A($(r), "incompatibleTokens", ["t", "T"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a) {
            var o = function (s) {
              return Math.floor(s * Math.pow(10, -a.length + 3));
            };
            return ze(Ue(a.length, i), o);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return i.setUTCMilliseconds(o), i;
          },
        },
      ]),
      n
    );
  })(pe),
  Vk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 10),
        A($(r), "incompatibleTokens", ["t", "T", "x"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a) {
            switch (a) {
              case "X":
                return Sn(xn.basicOptionalMinutes, i);
              case "XX":
                return Sn(xn.basic, i);
              case "XXXX":
                return Sn(xn.basicOptionalSeconds, i);
              case "XXXXX":
                return Sn(xn.extendedOptionalSeconds, i);
              case "XXX":
              default:
                return Sn(xn.extended, i);
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return a.timestampIsSet ? i : new Date(i.getTime() - o);
          },
        },
      ]),
      n
    );
  })(pe),
  qk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 10),
        A($(r), "incompatibleTokens", ["t", "T", "X"]),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i, a) {
            switch (a) {
              case "x":
                return Sn(xn.basicOptionalMinutes, i);
              case "xx":
                return Sn(xn.basic, i);
              case "xxxx":
                return Sn(xn.basicOptionalSeconds, i);
              case "xxxxx":
                return Sn(xn.extendedOptionalSeconds, i);
              case "xxx":
              default:
                return Sn(xn.extended, i);
            }
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return a.timestampIsSet ? i : new Date(i.getTime() - o);
          },
        },
      ]),
      n
    );
  })(pe),
  Kk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 40),
        A($(r), "incompatibleTokens", "*"),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i) {
            return zy(i);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return [new Date(o * 1e3), { timestampIsSet: !0 }];
          },
        },
      ]),
      n
    );
  })(pe),
  Gk = (function (e) {
    ce(n, e);
    var t = de(n);
    function n() {
      var r;
      le(this, n);
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
        a[o] = arguments[o];
      return (
        (r = t.call.apply(t, [this].concat(a))),
        A($(r), "priority", 20),
        A($(r), "incompatibleTokens", "*"),
        r
      );
    }
    return (
      se(n, [
        {
          key: "parse",
          value: function (i) {
            return zy(i);
          },
        },
        {
          key: "set",
          value: function (i, a, o) {
            return [new Date(o), { timestampIsSet: !0 }];
          },
        },
      ]),
      n
    );
  })(pe),
  Xk = {
    G: new mk(),
    y: new vk(),
    Y: new yk(),
    R: new gk(),
    u: new wk(),
    Q: new xk(),
    q: new Sk(),
    M: new kk(),
    L: new Ck(),
    w: new Tk(),
    I: new Dk(),
    d: new Mk(),
    D: new Ok(),
    E: new Rk(),
    e: new _k(),
    c: new Lk(),
    i: new Uk(),
    a: new Ak(),
    b: new Ik(),
    B: new $k(),
    h: new jk(),
    H: new zk(),
    K: new Hk(),
    k: new Wk(),
    m: new Bk(),
    s: new Qk(),
    S: new Yk(),
    X: new Vk(),
    x: new qk(),
    t: new Kk(),
    T: new Gk(),
  },
  Jk = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  Zk = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  eC = /^'([^]*?)'?$/,
  tC = /''/g,
  nC = /\S/,
  rC = /[a-zA-Z]/;
function ra(e, t, n, r) {
  var i, a, o, l, s, u, c, d, p, v, y, C, k, f, h, g, T, M;
  Y(3, arguments);
  var w = String(e),
    P = String(t),
    b = Er(),
    _ =
      (i =
        (a = r == null ? void 0 : r.locale) !== null && a !== void 0
          ? a
          : b.locale) !== null && i !== void 0
        ? i
        : Ay;
  if (!_.match) throw new RangeError("locale must contain match property");
  var I = re(
    (o =
      (l =
        (s =
          (u = r == null ? void 0 : r.firstWeekContainsDate) !== null &&
          u !== void 0
            ? u
            : r == null ||
              (c = r.locale) === null ||
              c === void 0 ||
              (d = c.options) === null ||
              d === void 0
            ? void 0
            : d.firstWeekContainsDate) !== null && s !== void 0
          ? s
          : b.firstWeekContainsDate) !== null && l !== void 0
        ? l
        : (p = b.locale) === null ||
          p === void 0 ||
          (v = p.options) === null ||
          v === void 0
        ? void 0
        : v.firstWeekContainsDate) !== null && o !== void 0
      ? o
      : 1,
  );
  if (!(I >= 1 && I <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively",
    );
  var G = re(
    (y =
      (C =
        (k =
          (f = r == null ? void 0 : r.weekStartsOn) !== null && f !== void 0
            ? f
            : r == null ||
              (h = r.locale) === null ||
              h === void 0 ||
              (g = h.options) === null ||
              g === void 0
            ? void 0
            : g.weekStartsOn) !== null && k !== void 0
          ? k
          : b.weekStartsOn) !== null && C !== void 0
        ? C
        : (T = b.locale) === null ||
          T === void 0 ||
          (M = T.options) === null ||
          M === void 0
        ? void 0
        : M.weekStartsOn) !== null && y !== void 0
      ? y
      : 0,
  );
  if (!(G >= 0 && G <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if (P === "") return w === "" ? V(n) : new Date(NaN);
  var me = { firstWeekContainsDate: I, weekStartsOn: G, locale: _ },
    fe = [new pk()],
    Ae = P.match(Zk)
      .map(function (He) {
        var we = He[0];
        if (we in _c) {
          var xt = _c[we];
          return xt(He, _.formatLong);
        }
        return He;
      })
      .join("")
      .match(Jk),
    ge = [],
    Z = fp(Ae),
    X;
  try {
    var R = function () {
      var we = X.value;
      !(r != null && r.useAdditionalWeekYearTokens) && Uy(we) && es(we, P, e),
        !(r != null && r.useAdditionalDayOfYearTokens) &&
          Fy(we) &&
          es(we, P, e);
      var xt = we[0],
        Ge = Xk[xt];
      if (Ge) {
        var jn = Ge.incompatibleTokens;
        if (Array.isArray(jn)) {
          var ha = ge.find(function (dn) {
            return jn.includes(dn.token) || dn.token === xt;
          });
          if (ha)
            throw new RangeError(
              "The format string mustn't contain `"
                .concat(ha.fullToken, "` and `")
                .concat(we, "` at the same time"),
            );
        } else if (Ge.incompatibleTokens === "*" && ge.length > 0)
          throw new RangeError(
            "The format string mustn't contain `".concat(
              we,
              "` and any other token at the same time",
            ),
          );
        ge.push({ token: xt, fullToken: we });
        var pa = Ge.run(w, we, _.match, me);
        if (!pa) return { v: new Date(NaN) };
        fe.push(pa.setter), (w = pa.rest);
      } else {
        if (xt.match(rC))
          throw new RangeError(
            "Format string contains an unescaped latin alphabet character `" +
              xt +
              "`",
          );
        if (
          (we === "''" ? (we = "'") : xt === "'" && (we = iC(we)),
          w.indexOf(we) === 0)
        )
          w = w.slice(we.length);
        else return { v: new Date(NaN) };
      }
    };
    for (Z.s(); !(X = Z.n()).done; ) {
      var W = R();
      if (sn(W) === "object") return W.v;
    }
  } catch (He) {
    Z.e(He);
  } finally {
    Z.f();
  }
  if (w.length > 0 && nC.test(w)) return new Date(NaN);
  var B = fe
      .map(function (He) {
        return He.priority;
      })
      .sort(function (He, we) {
        return we - He;
      })
      .filter(function (He, we, xt) {
        return xt.indexOf(He) === we;
      })
      .map(function (He) {
        return fe
          .filter(function (we) {
            return we.priority === He;
          })
          .sort(function (we, xt) {
            return xt.subPriority - we.subPriority;
          });
      })
      .map(function (He) {
        return He[0];
      }),
    ae = V(n);
  if (isNaN(ae.getTime())) return new Date(NaN);
  var he = My(ae, Zl(ae)),
    Dt = {},
    _e = fp(B),
    wt;
  try {
    for (_e.s(); !(wt = _e.n()).done; ) {
      var Ke = wt.value;
      if (!Ke.validate(he, me)) return new Date(NaN);
      var bt = Ke.set(he, Dt, me);
      Array.isArray(bt) ? ((he = bt[0]), lk(Dt, bt[1])) : (he = bt);
    }
  } catch (He) {
    _e.e(He);
  } finally {
    _e.f();
  }
  return he;
}
function iC(e) {
  return e.match(eC)[1].replace(tC, "'");
}
function aC(e, t) {
  Y(2, arguments);
  var n = V(e),
    r = V(t);
  return n.getFullYear() === r.getFullYear() && n.getMonth() === r.getMonth();
}
function oC(e) {
  return Y(1, arguments), ii(e, Date.now());
}
function lC(e, t) {
  Y(2, arguments);
  var n = re(t);
  return af(e, -n);
}
function sC() {
  return mo(Date.now());
}
function uC(e, t) {
  Y(2, arguments);
  var n = re(t);
  return ky(e, -n);
}
function cC(e, t) {
  if ((Y(2, arguments), !t || sn(t) !== "object")) return new Date(NaN);
  var n = t.years ? re(t.years) : 0,
    r = t.months ? re(t.months) : 0,
    i = t.weeks ? re(t.weeks) : 0,
    a = t.days ? re(t.days) : 0,
    o = t.hours ? re(t.hours) : 0,
    l = t.minutes ? re(t.minutes) : 0,
    s = t.seconds ? re(t.seconds) : 0,
    u = uC(e, r + n * 12),
    c = lC(u, a + i * 7),
    d = l + o * 60,
    p = s + d * 60,
    v = p * 1e3,
    y = new Date(c.getTime() - v);
  return y;
}
function dC(e, t) {
  Y(2, arguments);
  var n = re(t);
  return Ey(e, -n);
}
const El = (e) =>
  by({ start: Cy(e, { weekStartsOn: 1 }), end: Ny(e, { weekStartsOn: 1 }) });
function fC(e, t) {
  switch (t.type) {
    case "setEvents":
      return { ...e, events: t.value };
    case "goToNextWeek": {
      const n = e.displayedDays[0],
        r = El(Ey(n, 1));
      return { ...e, displayedDays: r };
    }
    case "goToPrevWeek": {
      const n = e.displayedDays[0],
        r = El(dC(n, 1));
      return { ...e, displayedDays: r };
    }
    case "goToToday": {
      const n = El(new Date());
      return { ...e, displayedDays: n };
    }
    case "showBookingModal":
      return { ...e, modalEvent: t.value };
    case "hideBookingModal":
      return { ...e, modalEvent: void 0 };
  }
}
const hC = () => {
  const [e, t] = rt.useReducer(fC, {
    displayedDays: El(new Date()),
    events: [],
  });
  return { state: e, dispatch: t };
};
function pC({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        fillRule: "evenodd",
        d: "M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z",
        clipRule: "evenodd",
      }),
    ],
  });
}
const mC = S.exports.forwardRef(pC),
  ff = mC;
function vC({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        fillRule: "evenodd",
        d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
        clipRule: "evenodd",
      }),
    ],
  });
}
const yC = S.exports.forwardRef(vC),
  hf = yC,
  gC = ({ state: e, dispatch: t }) => {
    const n = e.displayedDays[0],
      r = We(n, "MMMM yyyy");
    return F("header", {
      className:
        "flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50",
      children: [
        m("h1", {
          className: "text-base font-semibold leading-6 text-gray-900",
          children: m("time", { dateTime: n.toDateString(), children: r }),
        }),
        m("div", {
          className: "flex items-center",
          children: F("div", {
            className:
              "relative flex items-center rounded-md bg-white shadow-sm md:items-stretch",
            children: [
              F("button", {
                type: "button",
                onClick: () => t({ type: "goToPrevWeek" }),
                className:
                  "flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50",
                children: [
                  m("span", {
                    className: "sr-only",
                    children: "Previous week",
                  }),
                  m(ff, { className: "h-5 w-5", "aria-hidden": "true" }),
                ],
              }),
              m("button", {
                type: "button",
                onClick: () => t({ type: "goToToday" }),
                className:
                  "hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block",
                children: "Today",
              }),
              m("span", {
                className: "relative -mx-px h-5 w-px bg-gray-300 md:hidden",
              }),
              F("button", {
                type: "button",
                onClick: () => t({ type: "goToNextWeek" }),
                className:
                  "flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50",
                children: [
                  m("span", { className: "sr-only", children: "Next week" }),
                  m(hf, { className: "h-5 w-5", "aria-hidden": "true" }),
                ],
              }),
            ],
          }),
        }),
      ],
    });
  },
  wC = ({ state: e }) =>
    m("div", {
      className:
        "sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 pr-8",
      children: F("div", {
        className:
          "-mr-px grid grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500",
        children: [
          m("div", { className: "col-end-1 w-14" }),
          e.displayedDays.map((t) => {
            const n = ii(new Date(), t);
            return m(
              "div",
              {
                className: "flex items-center justify-center py-3",
                children: F("span", {
                  className: "flex items-baseline",
                  children: [
                    We(t, "iii"),
                    " ",
                    m("span", {
                      className: `
                    flex items-center justify-center font-semibold h-8 w-8
                    ${
                      n
                        ? "rounded-full bg-indigo-600 text-white ml-1.5"
                        : "text-gray-900"
                    }
                  `,
                      children: We(t, "d"),
                    }),
                  ],
                }),
              },
              t.toString(),
            );
          }),
        ],
      }),
    }),
  xC = [...Array.from(Array(24).keys())],
  By = () =>
    F("div", {
      className:
        "col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100",
      style: { gridTemplateRows: "repeat(48, minmax(1.5rem, 1fr))" },
      children: [
        m("div", { className: "row-end-1 h-7" }),
        xC.map((e) => {
          const t = ra(e.toString(), "H", new Date());
          return F(
            rt.Fragment,
            {
              children: [
                m("div", {
                  children: m("div", {
                    className:
                      "sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400",
                    children: We(t, "HH:mm"),
                  }),
                }),
                m("div", {}),
              ],
            },
            e,
          );
        }),
      ],
    }),
  SC = () =>
    F("div", {
      className:
        "col-start-1 col-end-2 row-start-1 grid grid-cols-7 grid-rows-1 divide-x divide-gray-100",
      children: [
        m("div", { className: "col-start-1 row-span-full" }),
        m("div", { className: "col-start-2 row-span-full" }),
        m("div", { className: "col-start-3 row-span-full" }),
        m("div", { className: "col-start-4 row-span-full" }),
        m("div", { className: "col-start-5 row-span-full" }),
        m("div", { className: "col-start-6 row-span-full" }),
        m("div", { className: "col-start-7 row-span-full" }),
        m("div", { className: "col-start-8 row-span-full w-8" }),
      ],
    }),
  kC = ({ children: e }) =>
    m("ol", {
      className:
        "col-start-1 col-end-2 row-start-1 grid grid-cols-7 pr-8 select-none",
      style: { gridTemplateRows: "1.75rem repeat(1440, 1.2px) auto" },
      children: e,
    });
var ca = class {
    constructor() {
      (this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this));
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          this.listeners.delete(e), this.onUnsubscribe();
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  ia = typeof window > "u" || "Deno" in window;
function Bt() {}
function CC(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Fc(e) {
  return typeof e == "number" && e >= 0 && e !== 1 / 0;
}
function Qy(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function pp(e, t) {
  const {
    type: n = "all",
    exact: r,
    fetchStatus: i,
    predicate: a,
    queryKey: o,
    stale: l,
  } = e;
  if (o) {
    if (r) {
      if (t.queryHash !== pf(o, t.options)) return !1;
    } else if (!yo(t.queryKey, o)) return !1;
  }
  if (n !== "all") {
    const s = t.isActive();
    if ((n === "active" && !s) || (n === "inactive" && s)) return !1;
  }
  return !(
    (typeof l == "boolean" && t.isStale() !== l) ||
    (typeof i < "u" && i !== t.state.fetchStatus) ||
    (a && !a(t))
  );
}
function mp(e, t) {
  const { exact: n, status: r, predicate: i, mutationKey: a } = e;
  if (a) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (vo(t.options.mutationKey) !== vo(a)) return !1;
    } else if (!yo(t.options.mutationKey, a)) return !1;
  }
  return !((r && t.state.status !== r) || (i && !i(t)));
}
function pf(e, t) {
  return ((t == null ? void 0 : t.queryKeyHashFn) || vo)(e);
}
function vo(e) {
  return JSON.stringify(e, (t, n) =>
    Uc(n)
      ? Object.keys(n)
          .sort()
          .reduce((r, i) => ((r[i] = n[i]), r), {})
      : n,
  );
}
function yo(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
    ? !1
    : e && t && typeof e == "object" && typeof t == "object"
    ? !Object.keys(t).some((n) => !yo(e[n], t[n]))
    : !1;
}
function Yy(e, t) {
  if (e === t) return e;
  const n = vp(e) && vp(t);
  if (n || (Uc(e) && Uc(t))) {
    const r = n ? e.length : Object.keys(e).length,
      i = n ? t : Object.keys(t),
      a = i.length,
      o = n ? [] : {};
    let l = 0;
    for (let s = 0; s < a; s++) {
      const u = n ? s : i[s];
      (o[u] = Yy(e[u], t[u])), o[u] === e[u] && l++;
    }
    return r === a && l === r ? e : o;
  }
  return t;
}
function rs(e, t) {
  if ((e && !t) || (t && !e)) return !1;
  for (const n in e) if (e[n] !== t[n]) return !1;
  return !0;
}
function vp(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function Uc(e) {
  if (!yp(e)) return !1;
  const t = e.constructor;
  if (typeof t > "u") return !0;
  const n = t.prototype;
  return !(!yp(n) || !n.hasOwnProperty("isPrototypeOf"));
}
function yp(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function Vy(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function gp(e) {
  Vy(0).then(e);
}
function Ac(e, t, n) {
  return typeof n.structuralSharing == "function"
    ? n.structuralSharing(e, t)
    : n.structuralSharing !== !1
    ? Yy(e, t)
    : t;
}
function EC(e, t, n = 0) {
  const r = [...e, t];
  return n && r.length > n ? r.slice(1) : r;
}
function TC(e, t, n = 0) {
  const r = [t, ...e];
  return n && r.length > n ? r.slice(0, -1) : r;
}
var Fr,
  er,
  _i,
  Lp,
  PC =
    ((Lp = class extends ca {
      constructor() {
        super();
        z(this, Fr, void 0);
        z(this, er, void 0);
        z(this, _i, void 0);
        L(this, _i, (t) => {
          if (!ia && window.addEventListener) {
            const n = () => t();
            return (
              window.addEventListener("visibilitychange", n, !1),
              () => {
                window.removeEventListener("visibilitychange", n);
              }
            );
          }
        });
      }
      onSubscribe() {
        x(this, er) || this.setEventListener(x(this, _i));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = x(this, er)) == null || t.call(this), L(this, er, void 0));
      }
      setEventListener(t) {
        var n;
        L(this, _i, t),
          (n = x(this, er)) == null || n.call(this),
          L(
            this,
            er,
            t((r) => {
              typeof r == "boolean" ? this.setFocused(r) : this.onFocus();
            }),
          );
      }
      setFocused(t) {
        x(this, Fr) !== t && (L(this, Fr, t), this.onFocus());
      }
      onFocus() {
        this.listeners.forEach((t) => {
          t();
        });
      }
      isFocused() {
        var t;
        return typeof x(this, Fr) == "boolean"
          ? x(this, Fr)
          : ((t = globalThis.document) == null ? void 0 : t.visibilityState) !==
              "hidden";
      }
    }),
    (Fr = new WeakMap()),
    (er = new WeakMap()),
    (_i = new WeakMap()),
    Lp),
  is = new PC(),
  Li,
  tr,
  Fi,
  Fp,
  DC =
    ((Fp = class extends ca {
      constructor() {
        super();
        z(this, Li, !0);
        z(this, tr, void 0);
        z(this, Fi, void 0);
        L(this, Fi, (t) => {
          if (!ia && window.addEventListener) {
            const n = () => t(!0),
              r = () => t(!1);
            return (
              window.addEventListener("online", n, !1),
              window.addEventListener("offline", r, !1),
              () => {
                window.removeEventListener("online", n),
                  window.removeEventListener("offline", r);
              }
            );
          }
        });
      }
      onSubscribe() {
        x(this, tr) || this.setEventListener(x(this, Fi));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = x(this, tr)) == null || t.call(this), L(this, tr, void 0));
      }
      setEventListener(t) {
        var n;
        L(this, Fi, t),
          (n = x(this, tr)) == null || n.call(this),
          L(this, tr, t(this.setOnline.bind(this)));
      }
      setOnline(t) {
        x(this, Li) !== t &&
          (L(this, Li, t),
          this.listeners.forEach((r) => {
            r(t);
          }));
      }
      isOnline() {
        return x(this, Li);
      }
    }),
    (Li = new WeakMap()),
    (tr = new WeakMap()),
    (Fi = new WeakMap()),
    Fp),
  as = new DC();
function bC(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function _s(e) {
  return (e != null ? e : "online") === "online" ? as.isOnline() : !0;
}
var qy = class {
  constructor(e) {
    (this.revert = e == null ? void 0 : e.revert),
      (this.silent = e == null ? void 0 : e.silent);
  }
};
function bu(e) {
  return e instanceof qy;
}
function Ky(e) {
  let t = !1,
    n = 0,
    r = !1,
    i,
    a,
    o;
  const l = new Promise((k, f) => {
      (a = k), (o = f);
    }),
    s = (k) => {
      var f;
      r || (v(new qy(k)), (f = e.abort) == null || f.call(e));
    },
    u = () => {
      t = !0;
    },
    c = () => {
      t = !1;
    },
    d = () => !is.isFocused() || (e.networkMode !== "always" && !as.isOnline()),
    p = (k) => {
      var f;
      r ||
        ((r = !0),
        (f = e.onSuccess) == null || f.call(e, k),
        i == null || i(),
        a(k));
    },
    v = (k) => {
      var f;
      r ||
        ((r = !0),
        (f = e.onError) == null || f.call(e, k),
        i == null || i(),
        o(k));
    },
    y = () =>
      new Promise((k) => {
        var f;
        (i = (h) => {
          const g = r || !d();
          return g && k(h), g;
        }),
          (f = e.onPause) == null || f.call(e);
      }).then(() => {
        var k;
        (i = void 0), r || (k = e.onContinue) == null || k.call(e);
      }),
    C = () => {
      if (r) return;
      let k;
      try {
        k = e.fn();
      } catch (f) {
        k = Promise.reject(f);
      }
      Promise.resolve(k)
        .then(p)
        .catch((f) => {
          var w, P, b;
          if (r) return;
          const h = (w = e.retry) != null ? w : ia ? 0 : 3,
            g = (P = e.retryDelay) != null ? P : bC,
            T = typeof g == "function" ? g(n, f) : g,
            M =
              h === !0 ||
              (typeof h == "number" && n < h) ||
              (typeof h == "function" && h(n, f));
          if (t || !M) {
            v(f);
            return;
          }
          n++,
            (b = e.onFail) == null || b.call(e, n, f),
            Vy(T)
              .then(() => {
                if (d()) return y();
              })
              .then(() => {
                t ? v(f) : C();
              });
        });
    };
  return (
    _s(e.networkMode) ? C() : y().then(C),
    {
      promise: l,
      cancel: s,
      continue: () => ((i == null ? void 0 : i()) ? l : Promise.resolve()),
      cancelRetry: u,
      continueRetry: c,
    }
  );
}
function NC() {
  let e = [],
    t = 0,
    n = (c) => {
      c();
    },
    r = (c) => {
      c();
    };
  const i = (c) => {
      let d;
      t++;
      try {
        d = c();
      } finally {
        t--, t || l();
      }
      return d;
    },
    a = (c) => {
      t
        ? e.push(c)
        : gp(() => {
            n(c);
          });
    },
    o =
      (c) =>
      (...d) => {
        a(() => {
          c(...d);
        });
      },
    l = () => {
      const c = e;
      (e = []),
        c.length &&
          gp(() => {
            r(() => {
              c.forEach((d) => {
                n(d);
              });
            });
          });
    };
  return {
    batch: i,
    batchCalls: o,
    schedule: a,
    setNotifyFunction: (c) => {
      n = c;
    },
    setBatchNotifyFunction: (c) => {
      r = c;
    },
  };
}
var Ve = NC(),
  Ur,
  Up,
  Gy =
    ((Up = class {
      constructor() {
        z(this, Ur, void 0);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        this.clearGcTimeout(),
          Fc(this.gcTime) &&
            L(
              this,
              Ur,
              setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime),
            );
      }
      updateGcTime(e) {
        this.gcTime = Math.max(
          this.gcTime || 0,
          e != null ? e : ia ? 1 / 0 : 5 * 60 * 1e3,
        );
      }
      clearGcTimeout() {
        x(this, Ur) && (clearTimeout(x(this, Ur)), L(this, Ur, void 0));
      }
    }),
    (Ur = new WeakMap()),
    Up),
  Ui,
  Ai,
  $t,
  nr,
  jt,
  Ze,
  go,
  Ar,
  Ii,
  Tl,
  en,
  En,
  Ap,
  MC =
    ((Ap = class extends Gy {
      constructor(t) {
        super();
        z(this, Ii);
        z(this, en);
        z(this, Ui, void 0);
        z(this, Ai, void 0);
        z(this, $t, void 0);
        z(this, nr, void 0);
        z(this, jt, void 0);
        z(this, Ze, void 0);
        z(this, go, void 0);
        z(this, Ar, void 0);
        L(this, Ar, !1),
          L(this, go, t.defaultOptions),
          J(this, Ii, Tl).call(this, t.options),
          L(this, Ze, []),
          L(this, $t, t.cache),
          (this.queryKey = t.queryKey),
          (this.queryHash = t.queryHash),
          L(this, Ui, t.state || OC(this.options)),
          (this.state = x(this, Ui)),
          this.scheduleGc();
      }
      get meta() {
        return this.options.meta;
      }
      optionalRemove() {
        !x(this, Ze).length &&
          this.state.fetchStatus === "idle" &&
          x(this, $t).remove(this);
      }
      setData(t, n) {
        const r = Ac(this.state.data, t, this.options);
        return (
          J(this, en, En).call(this, {
            data: r,
            type: "success",
            dataUpdatedAt: n == null ? void 0 : n.updatedAt,
            manual: n == null ? void 0 : n.manual,
          }),
          r
        );
      }
      setState(t, n) {
        J(this, en, En).call(this, {
          type: "setState",
          state: t,
          setStateOptions: n,
        });
      }
      cancel(t) {
        var r;
        const n = x(this, nr);
        return (
          (r = x(this, jt)) == null || r.cancel(t),
          n ? n.then(Bt).catch(Bt) : Promise.resolve()
        );
      }
      destroy() {
        super.destroy(), this.cancel({ silent: !0 });
      }
      reset() {
        this.destroy(), this.setState(x(this, Ui));
      }
      isActive() {
        return x(this, Ze).some((t) => t.options.enabled !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0 && !this.isActive();
      }
      isStale() {
        return (
          this.state.isInvalidated ||
          !this.state.dataUpdatedAt ||
          x(this, Ze).some((t) => t.getCurrentResult().isStale)
        );
      }
      isStaleByTime(t = 0) {
        return (
          this.state.isInvalidated ||
          !this.state.dataUpdatedAt ||
          !Qy(this.state.dataUpdatedAt, t)
        );
      }
      onFocus() {
        var n;
        const t = x(this, Ze).find((r) => r.shouldFetchOnWindowFocus());
        t == null || t.refetch({ cancelRefetch: !1 }),
          (n = x(this, jt)) == null || n.continue();
      }
      onOnline() {
        var n;
        const t = x(this, Ze).find((r) => r.shouldFetchOnReconnect());
        t == null || t.refetch({ cancelRefetch: !1 }),
          (n = x(this, jt)) == null || n.continue();
      }
      addObserver(t) {
        x(this, Ze).includes(t) ||
          (x(this, Ze).push(t),
          this.clearGcTimeout(),
          x(this, $t).notify({
            type: "observerAdded",
            query: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        x(this, Ze).includes(t) &&
          (L(
            this,
            Ze,
            x(this, Ze).filter((n) => n !== t),
          ),
          x(this, Ze).length ||
            (x(this, jt) &&
              (x(this, Ar)
                ? x(this, jt).cancel({ revert: !0 })
                : x(this, jt).cancelRetry()),
            this.scheduleGc()),
          x(this, $t).notify({
            type: "observerRemoved",
            query: this,
            observer: t,
          }));
      }
      getObserversCount() {
        return x(this, Ze).length;
      }
      invalidate() {
        this.state.isInvalidated ||
          J(this, en, En).call(this, { type: "invalidate" });
      }
      fetch(t, n) {
        var u, c, d, p;
        if (this.state.fetchStatus !== "idle") {
          if (
            this.state.dataUpdatedAt &&
            (n == null ? void 0 : n.cancelRefetch)
          )
            this.cancel({ silent: !0 });
          else if (x(this, nr))
            return (u = x(this, jt)) == null || u.continueRetry(), x(this, nr);
        }
        if ((t && J(this, Ii, Tl).call(this, t), !this.options.queryFn)) {
          const v = x(this, Ze).find((y) => y.options.queryFn);
          v && J(this, Ii, Tl).call(this, v.options);
        }
        const r = new AbortController(),
          i = { queryKey: this.queryKey, meta: this.meta },
          a = (v) => {
            Object.defineProperty(v, "signal", {
              enumerable: !0,
              get: () => (L(this, Ar, !0), r.signal),
            });
          };
        a(i);
        const o = () =>
            this.options.queryFn
              ? (L(this, Ar, !1),
                this.options.persister
                  ? this.options.persister(this.options.queryFn, i, this)
                  : this.options.queryFn(i))
              : Promise.reject(
                  new Error(`Missing queryFn: '${this.options.queryHash}'`),
                ),
          l = {
            fetchOptions: n,
            options: this.options,
            queryKey: this.queryKey,
            state: this.state,
            fetchFn: o,
          };
        a(l),
          (c = this.options.behavior) == null || c.onFetch(l, this),
          L(this, Ai, this.state),
          (this.state.fetchStatus === "idle" ||
            this.state.fetchMeta !==
              ((d = l.fetchOptions) == null ? void 0 : d.meta)) &&
            J(this, en, En).call(this, {
              type: "fetch",
              meta: (p = l.fetchOptions) == null ? void 0 : p.meta,
            });
        const s = (v) => {
          var y, C, k, f;
          (bu(v) && v.silent) ||
            J(this, en, En).call(this, { type: "error", error: v }),
            bu(v) ||
              ((C = (y = x(this, $t).config).onError) == null ||
                C.call(y, v, this),
              (f = (k = x(this, $t).config).onSettled) == null ||
                f.call(k, this.state.data, v, this)),
            this.isFetchingOptimistic || this.scheduleGc(),
            (this.isFetchingOptimistic = !1);
        };
        return (
          L(
            this,
            jt,
            Ky({
              fn: l.fetchFn,
              abort: r.abort.bind(r),
              onSuccess: (v) => {
                var y, C, k, f;
                if (typeof v > "u") {
                  s(new Error(`${this.queryHash} data is undefined`));
                  return;
                }
                this.setData(v),
                  (C = (y = x(this, $t).config).onSuccess) == null ||
                    C.call(y, v, this),
                  (f = (k = x(this, $t).config).onSettled) == null ||
                    f.call(k, v, this.state.error, this),
                  this.isFetchingOptimistic || this.scheduleGc(),
                  (this.isFetchingOptimistic = !1);
              },
              onError: s,
              onFail: (v, y) => {
                J(this, en, En).call(this, {
                  type: "failed",
                  failureCount: v,
                  error: y,
                });
              },
              onPause: () => {
                J(this, en, En).call(this, { type: "pause" });
              },
              onContinue: () => {
                J(this, en, En).call(this, { type: "continue" });
              },
              retry: l.options.retry,
              retryDelay: l.options.retryDelay,
              networkMode: l.options.networkMode,
            }),
          ),
          L(this, nr, x(this, jt).promise),
          x(this, nr)
        );
      }
    }),
    (Ui = new WeakMap()),
    (Ai = new WeakMap()),
    ($t = new WeakMap()),
    (nr = new WeakMap()),
    (jt = new WeakMap()),
    (Ze = new WeakMap()),
    (go = new WeakMap()),
    (Ar = new WeakMap()),
    (Ii = new WeakSet()),
    (Tl = function (t) {
      (this.options = { ...x(this, go), ...t }),
        this.updateGcTime(this.options.gcTime);
    }),
    (en = new WeakSet()),
    (En = function (t) {
      const n = (r) => {
        var i, a;
        switch (t.type) {
          case "failed":
            return {
              ...r,
              fetchFailureCount: t.failureCount,
              fetchFailureReason: t.error,
            };
          case "pause":
            return { ...r, fetchStatus: "paused" };
          case "continue":
            return { ...r, fetchStatus: "fetching" };
          case "fetch":
            return {
              ...r,
              fetchFailureCount: 0,
              fetchFailureReason: null,
              fetchMeta: (i = t.meta) != null ? i : null,
              fetchStatus: _s(this.options.networkMode) ? "fetching" : "paused",
              ...(!r.dataUpdatedAt && { error: null, status: "pending" }),
            };
          case "success":
            return {
              ...r,
              data: t.data,
              dataUpdateCount: r.dataUpdateCount + 1,
              dataUpdatedAt: (a = t.dataUpdatedAt) != null ? a : Date.now(),
              error: null,
              isInvalidated: !1,
              status: "success",
              ...(!t.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
          case "error":
            const o = t.error;
            return bu(o) && o.revert && x(this, Ai)
              ? { ...x(this, Ai), fetchStatus: "idle" }
              : {
                  ...r,
                  error: o,
                  errorUpdateCount: r.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: r.fetchFailureCount + 1,
                  fetchFailureReason: o,
                  fetchStatus: "idle",
                  status: "error",
                };
          case "invalidate":
            return { ...r, isInvalidated: !0 };
          case "setState":
            return { ...r, ...t.state };
        }
      };
      (this.state = n(this.state)),
        Ve.batch(() => {
          x(this, Ze).forEach((r) => {
            r.onQueryUpdate();
          }),
            x(this, $t).notify({ query: this, type: "updated", action: t });
        });
    }),
    Ap);
function OC(e) {
  const t =
      typeof e.initialData == "function" ? e.initialData() : e.initialData,
    n = typeof t < "u",
    r = n
      ? typeof e.initialDataUpdatedAt == "function"
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: n ? (r != null ? r : Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: n ? "success" : "pending",
    fetchStatus: "idle",
  };
}
var mn,
  Ip,
  RC =
    ((Ip = class extends ca {
      constructor(t = {}) {
        super();
        z(this, mn, void 0);
        (this.config = t), L(this, mn, new Map());
      }
      build(t, n, r) {
        var l;
        const i = n.queryKey,
          a = (l = n.queryHash) != null ? l : pf(i, n);
        let o = this.get(a);
        return (
          o ||
            ((o = new MC({
              cache: this,
              queryKey: i,
              queryHash: a,
              options: t.defaultQueryOptions(n),
              state: r,
              defaultOptions: t.getQueryDefaults(i),
            })),
            this.add(o)),
          o
        );
      }
      add(t) {
        x(this, mn).has(t.queryHash) ||
          (x(this, mn).set(t.queryHash, t),
          this.notify({ type: "added", query: t }));
      }
      remove(t) {
        const n = x(this, mn).get(t.queryHash);
        n &&
          (t.destroy(),
          n === t && x(this, mn).delete(t.queryHash),
          this.notify({ type: "removed", query: t }));
      }
      clear() {
        Ve.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      get(t) {
        return x(this, mn).get(t);
      }
      getAll() {
        return [...x(this, mn).values()];
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => pp(n, r));
      }
      findAll(t = {}) {
        const n = this.getAll();
        return Object.keys(t).length > 0 ? n.filter((r) => pp(t, r)) : n;
      }
      notify(t) {
        Ve.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      onFocus() {
        Ve.batch(() => {
          this.getAll().forEach((t) => {
            t.onFocus();
          });
        });
      }
      onOnline() {
        Ve.batch(() => {
          this.getAll().forEach((t) => {
            t.onOnline();
          });
        });
      }
    }),
    (mn = new WeakMap()),
    Ip),
  vn,
  wo,
  Mt,
  $i,
  yn,
  Vn,
  $p,
  _C =
    (($p = class extends Gy {
      constructor(t) {
        super();
        z(this, yn);
        z(this, vn, void 0);
        z(this, wo, void 0);
        z(this, Mt, void 0);
        z(this, $i, void 0);
        (this.mutationId = t.mutationId),
          L(this, wo, t.defaultOptions),
          L(this, Mt, t.mutationCache),
          L(this, vn, []),
          (this.state = t.state || Xy()),
          this.setOptions(t.options),
          this.scheduleGc();
      }
      setOptions(t) {
        (this.options = { ...x(this, wo), ...t }),
          this.updateGcTime(this.options.gcTime);
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(t) {
        x(this, vn).includes(t) ||
          (x(this, vn).push(t),
          this.clearGcTimeout(),
          x(this, Mt).notify({
            type: "observerAdded",
            mutation: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        L(
          this,
          vn,
          x(this, vn).filter((n) => n !== t),
        ),
          this.scheduleGc(),
          x(this, Mt).notify({
            type: "observerRemoved",
            mutation: this,
            observer: t,
          });
      }
      optionalRemove() {
        x(this, vn).length ||
          (this.state.status === "pending"
            ? this.scheduleGc()
            : x(this, Mt).remove(this));
      }
      continue() {
        var t, n;
        return (n = (t = x(this, $i)) == null ? void 0 : t.continue()) != null
          ? n
          : this.execute(this.state.variables);
      }
      async execute(t) {
        var i, a, o, l, s, u, c, d, p, v, y, C, k, f, h, g, T, M, w, P;
        const n = () => {
            var b;
            return (
              L(
                this,
                $i,
                Ky({
                  fn: () =>
                    this.options.mutationFn
                      ? this.options.mutationFn(t)
                      : Promise.reject(new Error("No mutationFn found")),
                  onFail: (_, I) => {
                    J(this, yn, Vn).call(this, {
                      type: "failed",
                      failureCount: _,
                      error: I,
                    });
                  },
                  onPause: () => {
                    J(this, yn, Vn).call(this, { type: "pause" });
                  },
                  onContinue: () => {
                    J(this, yn, Vn).call(this, { type: "continue" });
                  },
                  retry: (b = this.options.retry) != null ? b : 0,
                  retryDelay: this.options.retryDelay,
                  networkMode: this.options.networkMode,
                }),
              ),
              x(this, $i).promise
            );
          },
          r = this.state.status === "pending";
        try {
          if (!r) {
            J(this, yn, Vn).call(this, { type: "pending", variables: t }),
              await ((a = (i = x(this, Mt).config).onMutate) == null
                ? void 0
                : a.call(i, t, this));
            const _ = await ((l = (o = this.options).onMutate) == null
              ? void 0
              : l.call(o, t));
            _ !== this.state.context &&
              J(this, yn, Vn).call(this, {
                type: "pending",
                context: _,
                variables: t,
              });
          }
          const b = await n();
          return (
            await ((u = (s = x(this, Mt).config).onSuccess) == null
              ? void 0
              : u.call(s, b, t, this.state.context, this)),
            await ((d = (c = this.options).onSuccess) == null
              ? void 0
              : d.call(c, b, t, this.state.context)),
            await ((v = (p = x(this, Mt).config).onSettled) == null
              ? void 0
              : v.call(
                  p,
                  b,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                )),
            await ((C = (y = this.options).onSettled) == null
              ? void 0
              : C.call(y, b, null, t, this.state.context)),
            J(this, yn, Vn).call(this, { type: "success", data: b }),
            b
          );
        } catch (b) {
          try {
            throw (
              (await ((f = (k = x(this, Mt).config).onError) == null
                ? void 0
                : f.call(k, b, t, this.state.context, this)),
              await ((g = (h = this.options).onError) == null
                ? void 0
                : g.call(h, b, t, this.state.context)),
              await ((M = (T = x(this, Mt).config).onSettled) == null
                ? void 0
                : M.call(
                    T,
                    void 0,
                    b,
                    this.state.variables,
                    this.state.context,
                    this,
                  )),
              await ((P = (w = this.options).onSettled) == null
                ? void 0
                : P.call(w, void 0, b, t, this.state.context)),
              b)
            );
          } finally {
            J(this, yn, Vn).call(this, { type: "error", error: b });
          }
        }
      }
    }),
    (vn = new WeakMap()),
    (wo = new WeakMap()),
    (Mt = new WeakMap()),
    ($i = new WeakMap()),
    (yn = new WeakSet()),
    (Vn = function (t) {
      const n = (r) => {
        switch (t.type) {
          case "failed":
            return {
              ...r,
              failureCount: t.failureCount,
              failureReason: t.error,
            };
          case "pause":
            return { ...r, isPaused: !0 };
          case "continue":
            return { ...r, isPaused: !1 };
          case "pending":
            return {
              ...r,
              context: t.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: !_s(this.options.networkMode),
              status: "pending",
              variables: t.variables,
              submittedAt: Date.now(),
            };
          case "success":
            return {
              ...r,
              data: t.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: !1,
            };
          case "error":
            return {
              ...r,
              data: void 0,
              error: t.error,
              failureCount: r.failureCount + 1,
              failureReason: t.error,
              isPaused: !1,
              status: "error",
            };
        }
      };
      (this.state = n(this.state)),
        Ve.batch(() => {
          x(this, vn).forEach((r) => {
            r.onMutationUpdate(t);
          }),
            x(this, Mt).notify({ mutation: this, type: "updated", action: t });
        });
    }),
    $p);
function Xy() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var zt,
  xo,
  Ir,
  jp,
  LC =
    ((jp = class extends ca {
      constructor(t = {}) {
        super();
        z(this, zt, void 0);
        z(this, xo, void 0);
        z(this, Ir, void 0);
        (this.config = t), L(this, zt, []), L(this, xo, 0);
      }
      build(t, n, r) {
        const i = new _C({
          mutationCache: this,
          mutationId: ++Wo(this, xo)._,
          options: t.defaultMutationOptions(n),
          state: r,
        });
        return this.add(i), i;
      }
      add(t) {
        x(this, zt).push(t), this.notify({ type: "added", mutation: t });
      }
      remove(t) {
        L(
          this,
          zt,
          x(this, zt).filter((n) => n !== t),
        ),
          this.notify({ type: "removed", mutation: t });
      }
      clear() {
        Ve.batch(() => {
          x(this, zt).forEach((t) => {
            this.remove(t);
          });
        });
      }
      getAll() {
        return x(this, zt);
      }
      find(t) {
        const n = { exact: !0, ...t };
        return x(this, zt).find((r) => mp(n, r));
      }
      findAll(t = {}) {
        return x(this, zt).filter((n) => mp(t, n));
      }
      notify(t) {
        Ve.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      resumePausedMutations() {
        var t;
        return (
          L(
            this,
            Ir,
            ((t = x(this, Ir)) != null ? t : Promise.resolve())
              .then(() => {
                const n = x(this, zt).filter((r) => r.state.isPaused);
                return Ve.batch(() =>
                  n.reduce(
                    (r, i) => r.then(() => i.continue().catch(Bt)),
                    Promise.resolve(),
                  ),
                );
              })
              .then(() => {
                L(this, Ir, void 0);
              }),
          ),
          x(this, Ir)
        );
      }
    }),
    (zt = new WeakMap()),
    (xo = new WeakMap()),
    (Ir = new WeakMap()),
    jp);
function FC(e) {
  return {
    onFetch: (t, n) => {
      const r = async () => {
        var y, C, k, f, h, g;
        const i = t.options,
          a =
            (k =
              (C = (y = t.fetchOptions) == null ? void 0 : y.meta) == null
                ? void 0
                : C.fetchMore) == null
              ? void 0
              : k.direction,
          o = ((f = t.state.data) == null ? void 0 : f.pages) || [],
          l = ((h = t.state.data) == null ? void 0 : h.pageParams) || [],
          s = { pages: [], pageParams: [] };
        let u = !1;
        const c = (T) => {
            Object.defineProperty(T, "signal", {
              enumerable: !0,
              get: () => (
                t.signal.aborted
                  ? (u = !0)
                  : t.signal.addEventListener("abort", () => {
                      u = !0;
                    }),
                t.signal
              ),
            });
          },
          d =
            t.options.queryFn ||
            (() =>
              Promise.reject(
                new Error(`Missing queryFn: '${t.options.queryHash}'`),
              )),
          p = async (T, M, w) => {
            if (u) return Promise.reject();
            if (M == null && T.pages.length) return Promise.resolve(T);
            const P = {
              queryKey: t.queryKey,
              pageParam: M,
              direction: w ? "backward" : "forward",
              meta: t.options.meta,
            };
            c(P);
            const b = await d(P),
              { maxPages: _ } = t.options,
              I = w ? TC : EC;
            return {
              pages: I(T.pages, b, _),
              pageParams: I(T.pageParams, M, _),
            };
          };
        let v;
        if (a && o.length) {
          const T = a === "backward",
            M = T ? UC : wp,
            w = { pages: o, pageParams: l },
            P = M(i, w);
          v = await p(w, P, T);
        } else {
          v = await p(s, (g = l[0]) != null ? g : i.initialPageParam);
          const T = e != null ? e : o.length;
          for (let M = 1; M < T; M++) {
            const w = wp(i, v);
            v = await p(v, w);
          }
        }
        return v;
      };
      t.options.persister
        ? (t.fetchFn = () => {
            var i, a;
            return (a = (i = t.options).persister) == null
              ? void 0
              : a.call(
                  i,
                  r,
                  {
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  n,
                );
          })
        : (t.fetchFn = r);
    },
  };
}
function wp(e, { pages: t, pageParams: n }) {
  const r = t.length - 1;
  return e.getNextPageParam(t[r], t, n[r], n);
}
function UC(e, { pages: t, pageParams: n }) {
  var r;
  return (r = e.getPreviousPageParam) == null
    ? void 0
    : r.call(e, t[0], t, n[0], n);
}
var Qe,
  rr,
  ir,
  ji,
  zi,
  ar,
  Hi,
  Wi,
  zp,
  AC =
    ((zp = class {
      constructor(e = {}) {
        z(this, Qe, void 0);
        z(this, rr, void 0);
        z(this, ir, void 0);
        z(this, ji, void 0);
        z(this, zi, void 0);
        z(this, ar, void 0);
        z(this, Hi, void 0);
        z(this, Wi, void 0);
        L(this, Qe, e.queryCache || new RC()),
          L(this, rr, e.mutationCache || new LC()),
          L(this, ir, e.defaultOptions || {}),
          L(this, ji, new Map()),
          L(this, zi, new Map()),
          L(this, ar, 0);
      }
      mount() {
        Wo(this, ar)._++,
          x(this, ar) === 1 &&
            (L(
              this,
              Hi,
              is.subscribe(() => {
                is.isFocused() &&
                  (this.resumePausedMutations(), x(this, Qe).onFocus());
              }),
            ),
            L(
              this,
              Wi,
              as.subscribe(() => {
                as.isOnline() &&
                  (this.resumePausedMutations(), x(this, Qe).onOnline());
              }),
            ));
      }
      unmount() {
        var e, t;
        Wo(this, ar)._--,
          x(this, ar) === 0 &&
            ((e = x(this, Hi)) == null || e.call(this),
            L(this, Hi, void 0),
            (t = x(this, Wi)) == null || t.call(this),
            L(this, Wi, void 0));
      }
      isFetching(e) {
        return x(this, Qe).findAll({ ...e, fetchStatus: "fetching" }).length;
      }
      isMutating(e) {
        return x(this, rr).findAll({ ...e, status: "pending" }).length;
      }
      getQueryData(e) {
        var t;
        return (t = x(this, Qe).find({ queryKey: e })) == null
          ? void 0
          : t.state.data;
      }
      ensureQueryData(e) {
        const t = this.getQueryData(e.queryKey);
        return t ? Promise.resolve(t) : this.fetchQuery(e);
      }
      getQueriesData(e) {
        return this.getQueryCache()
          .findAll(e)
          .map(({ queryKey: t, state: n }) => {
            const r = n.data;
            return [t, r];
          });
      }
      setQueryData(e, t, n) {
        const r = x(this, Qe).find({ queryKey: e }),
          i = r == null ? void 0 : r.state.data,
          a = CC(t, i);
        if (typeof a > "u") return;
        const o = this.defaultQueryOptions({ queryKey: e });
        return x(this, Qe)
          .build(this, o)
          .setData(a, { ...n, manual: !0 });
      }
      setQueriesData(e, t, n) {
        return Ve.batch(() =>
          this.getQueryCache()
            .findAll(e)
            .map(({ queryKey: r }) => [r, this.setQueryData(r, t, n)]),
        );
      }
      getQueryState(e) {
        var t;
        return (t = x(this, Qe).find({ queryKey: e })) == null
          ? void 0
          : t.state;
      }
      removeQueries(e) {
        const t = x(this, Qe);
        Ve.batch(() => {
          t.findAll(e).forEach((n) => {
            t.remove(n);
          });
        });
      }
      resetQueries(e, t) {
        const n = x(this, Qe),
          r = { type: "active", ...e };
        return Ve.batch(
          () => (
            n.findAll(e).forEach((i) => {
              i.reset();
            }),
            this.refetchQueries(r, t)
          ),
        );
      }
      cancelQueries(e = {}, t = {}) {
        const n = { revert: !0, ...t },
          r = Ve.batch(() =>
            x(this, Qe)
              .findAll(e)
              .map((i) => i.cancel(n)),
          );
        return Promise.all(r).then(Bt).catch(Bt);
      }
      invalidateQueries(e = {}, t = {}) {
        return Ve.batch(() => {
          var r, i;
          if (
            (x(this, Qe)
              .findAll(e)
              .forEach((a) => {
                a.invalidate();
              }),
            e.refetchType === "none")
          )
            return Promise.resolve();
          const n = {
            ...e,
            type:
              (i = (r = e.refetchType) != null ? r : e.type) != null
                ? i
                : "active",
          };
          return this.refetchQueries(n, t);
        });
      }
      refetchQueries(e = {}, t) {
        var i;
        const n = {
            ...t,
            cancelRefetch:
              (i = t == null ? void 0 : t.cancelRefetch) != null ? i : !0,
          },
          r = Ve.batch(() =>
            x(this, Qe)
              .findAll(e)
              .filter((a) => !a.isDisabled())
              .map((a) => {
                let o = a.fetch(void 0, n);
                return (
                  n.throwOnError || (o = o.catch(Bt)),
                  a.state.fetchStatus === "paused" ? Promise.resolve() : o
                );
              }),
          );
        return Promise.all(r).then(Bt);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        typeof t.retry > "u" && (t.retry = !1);
        const n = x(this, Qe).build(this, t);
        return n.isStaleByTime(t.staleTime)
          ? n.fetch(t)
          : Promise.resolve(n.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(Bt).catch(Bt);
      }
      fetchInfiniteQuery(e) {
        return (e.behavior = FC(e.pages)), this.fetchQuery(e);
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(Bt).catch(Bt);
      }
      resumePausedMutations() {
        return x(this, rr).resumePausedMutations();
      }
      getQueryCache() {
        return x(this, Qe);
      }
      getMutationCache() {
        return x(this, rr);
      }
      getDefaultOptions() {
        return x(this, ir);
      }
      setDefaultOptions(e) {
        L(this, ir, e);
      }
      setQueryDefaults(e, t) {
        x(this, ji).set(vo(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...x(this, ji).values()];
        let n = {};
        return (
          t.forEach((r) => {
            yo(e, r.queryKey) && (n = { ...n, ...r.defaultOptions });
          }),
          n
        );
      }
      setMutationDefaults(e, t) {
        x(this, zi).set(vo(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...x(this, zi).values()];
        let n = {};
        return (
          t.forEach((r) => {
            yo(e, r.mutationKey) && (n = { ...n, ...r.defaultOptions });
          }),
          n
        );
      }
      defaultQueryOptions(e) {
        if (e != null && e._defaulted) return e;
        const t = {
          ...x(this, ir).queries,
          ...((e == null ? void 0 : e.queryKey) &&
            this.getQueryDefaults(e.queryKey)),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = pf(t.queryKey, t)),
          typeof t.refetchOnReconnect > "u" &&
            (t.refetchOnReconnect = t.networkMode !== "always"),
          typeof t.throwOnError > "u" && (t.throwOnError = !!t.suspense),
          typeof t.networkMode > "u" &&
            t.persister &&
            (t.networkMode = "offlineFirst"),
          t
        );
      }
      defaultMutationOptions(e) {
        return e != null && e._defaulted
          ? e
          : {
              ...x(this, ir).mutations,
              ...((e == null ? void 0 : e.mutationKey) &&
                this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        x(this, Qe).clear(), x(this, rr).clear();
      }
    }),
    (Qe = new WeakMap()),
    (rr = new WeakMap()),
    (ir = new WeakMap()),
    (ji = new WeakMap()),
    (zi = new WeakMap()),
    (ar = new WeakMap()),
    (Hi = new WeakMap()),
    (Wi = new WeakMap()),
    zp),
  St,
  ke,
  Bi,
  ct,
  $r,
  Qi,
  gn,
  So,
  Yi,
  Vi,
  jr,
  zr,
  or,
  Hr,
  Wr,
  Aa,
  ko,
  Ic,
  Co,
  $c,
  Eo,
  jc,
  To,
  zc,
  Po,
  Hc,
  Do,
  Wc,
  bo,
  Bc,
  ds,
  Jy,
  Hp,
  IC =
    ((Hp = class extends ca {
      constructor(t, n) {
        super();
        z(this, Wr);
        z(this, ko);
        z(this, Co);
        z(this, Eo);
        z(this, To);
        z(this, Po);
        z(this, Do);
        z(this, bo);
        z(this, ds);
        z(this, St, void 0);
        z(this, ke, void 0);
        z(this, Bi, void 0);
        z(this, ct, void 0);
        z(this, $r, void 0);
        z(this, Qi, void 0);
        z(this, gn, void 0);
        z(this, So, void 0);
        z(this, Yi, void 0);
        z(this, Vi, void 0);
        z(this, jr, void 0);
        z(this, zr, void 0);
        z(this, or, void 0);
        z(this, Hr, void 0);
        L(this, ke, void 0),
          L(this, Bi, void 0),
          L(this, ct, void 0),
          L(this, Hr, new Set()),
          L(this, St, t),
          (this.options = n),
          L(this, gn, null),
          this.bindMethods(),
          this.setOptions(n);
      }
      bindMethods() {
        this.refetch = this.refetch.bind(this);
      }
      onSubscribe() {
        this.listeners.size === 1 &&
          (x(this, ke).addObserver(this),
          xp(x(this, ke), this.options) && J(this, Wr, Aa).call(this),
          J(this, To, zc).call(this));
      }
      onUnsubscribe() {
        this.hasListeners() || this.destroy();
      }
      shouldFetchOnReconnect() {
        return Qc(x(this, ke), this.options, this.options.refetchOnReconnect);
      }
      shouldFetchOnWindowFocus() {
        return Qc(x(this, ke), this.options, this.options.refetchOnWindowFocus);
      }
      destroy() {
        (this.listeners = new Set()),
          J(this, Po, Hc).call(this),
          J(this, Do, Wc).call(this),
          x(this, ke).removeObserver(this);
      }
      setOptions(t, n) {
        const r = this.options,
          i = x(this, ke);
        if (
          ((this.options = x(this, St).defaultQueryOptions(t)),
          rs(r, this.options) ||
            x(this, St)
              .getQueryCache()
              .notify({
                type: "observerOptionsUpdated",
                query: x(this, ke),
                observer: this,
              }),
          typeof this.options.enabled < "u" &&
            typeof this.options.enabled != "boolean")
        )
          throw new Error("Expected enabled to be a boolean");
        this.options.queryKey || (this.options.queryKey = r.queryKey),
          J(this, bo, Bc).call(this);
        const a = this.hasListeners();
        a && Sp(x(this, ke), i, this.options, r) && J(this, Wr, Aa).call(this),
          this.updateResult(n),
          a &&
            (x(this, ke) !== i ||
              this.options.enabled !== r.enabled ||
              this.options.staleTime !== r.staleTime) &&
            J(this, ko, Ic).call(this);
        const o = J(this, Co, $c).call(this);
        a &&
          (x(this, ke) !== i ||
            this.options.enabled !== r.enabled ||
            o !== x(this, or)) &&
          J(this, Eo, jc).call(this, o);
      }
      getOptimisticResult(t) {
        const n = x(this, St).getQueryCache().build(x(this, St), t),
          r = this.createResult(n, t);
        return (
          jC(this, r) &&
            (L(this, ct, r),
            L(this, Qi, this.options),
            L(this, $r, x(this, ke).state)),
          r
        );
      }
      getCurrentResult() {
        return x(this, ct);
      }
      trackResult(t) {
        const n = {};
        return (
          Object.keys(t).forEach((r) => {
            Object.defineProperty(n, r, {
              configurable: !1,
              enumerable: !0,
              get: () => (x(this, Hr).add(r), t[r]),
            });
          }),
          n
        );
      }
      getCurrentQuery() {
        return x(this, ke);
      }
      refetch({ ...t } = {}) {
        return this.fetch({ ...t });
      }
      fetchOptimistic(t) {
        const n = x(this, St).defaultQueryOptions(t),
          r = x(this, St).getQueryCache().build(x(this, St), n);
        return (
          (r.isFetchingOptimistic = !0),
          r.fetch().then(() => this.createResult(r, n))
        );
      }
      fetch(t) {
        var n;
        return J(this, Wr, Aa)
          .call(this, {
            ...t,
            cancelRefetch: (n = t.cancelRefetch) != null ? n : !0,
          })
          .then(() => (this.updateResult(), x(this, ct)));
      }
      createResult(t, n) {
        var w;
        const r = x(this, ke),
          i = this.options,
          a = x(this, ct),
          o = x(this, $r),
          l = x(this, Qi),
          u = t !== r ? t.state : x(this, Bi),
          { state: c } = t;
        let { error: d, errorUpdatedAt: p, fetchStatus: v, status: y } = c,
          C = !1,
          k;
        if (n._optimisticResults) {
          const P = this.hasListeners(),
            b = !P && xp(t, n),
            _ = P && Sp(t, r, n, i);
          (b || _) &&
            ((v = _s(t.options.networkMode) ? "fetching" : "paused"),
            c.dataUpdatedAt || (y = "pending")),
            n._optimisticResults === "isRestoring" && (v = "idle");
        }
        if (n.select && typeof c.data < "u")
          if (
            a &&
            c.data === (o == null ? void 0 : o.data) &&
            n.select === x(this, So)
          )
            k = x(this, Yi);
          else
            try {
              L(this, So, n.select),
                (k = n.select(c.data)),
                (k = Ac(a == null ? void 0 : a.data, k, n)),
                L(this, Yi, k),
                L(this, gn, null);
            } catch (P) {
              L(this, gn, P);
            }
        else k = c.data;
        if (
          typeof n.placeholderData < "u" &&
          typeof k > "u" &&
          y === "pending"
        ) {
          let P;
          if (
            (a == null ? void 0 : a.isPlaceholderData) &&
            n.placeholderData === (l == null ? void 0 : l.placeholderData)
          )
            P = a.data;
          else if (
            ((P =
              typeof n.placeholderData == "function"
                ? n.placeholderData(
                    (w = x(this, Vi)) == null ? void 0 : w.state.data,
                    x(this, Vi),
                  )
                : n.placeholderData),
            n.select && typeof P < "u")
          )
            try {
              (P = n.select(P)), L(this, gn, null);
            } catch (b) {
              L(this, gn, b);
            }
          typeof P < "u" &&
            ((y = "success"),
            (k = Ac(a == null ? void 0 : a.data, P, n)),
            (C = !0));
        }
        x(this, gn) &&
          ((d = x(this, gn)),
          (k = x(this, Yi)),
          (p = Date.now()),
          (y = "error"));
        const f = v === "fetching",
          h = y === "pending",
          g = y === "error",
          T = h && f;
        return {
          status: y,
          fetchStatus: v,
          isPending: h,
          isSuccess: y === "success",
          isError: g,
          isInitialLoading: T,
          isLoading: T,
          data: k,
          dataUpdatedAt: c.dataUpdatedAt,
          error: d,
          errorUpdatedAt: p,
          failureCount: c.fetchFailureCount,
          failureReason: c.fetchFailureReason,
          errorUpdateCount: c.errorUpdateCount,
          isFetched: c.dataUpdateCount > 0 || c.errorUpdateCount > 0,
          isFetchedAfterMount:
            c.dataUpdateCount > u.dataUpdateCount ||
            c.errorUpdateCount > u.errorUpdateCount,
          isFetching: f,
          isRefetching: f && !h,
          isLoadingError: g && c.dataUpdatedAt === 0,
          isPaused: v === "paused",
          isPlaceholderData: C,
          isRefetchError: g && c.dataUpdatedAt !== 0,
          isStale: mf(t, n),
          refetch: this.refetch,
        };
      }
      updateResult(t) {
        const n = x(this, ct),
          r = this.createResult(x(this, ke), this.options);
        if (
          (L(this, $r, x(this, ke).state), L(this, Qi, this.options), rs(r, n))
        )
          return;
        x(this, $r).data !== void 0 && L(this, Vi, x(this, ke)), L(this, ct, r);
        const i = {},
          a = () => {
            if (!n) return !0;
            const { notifyOnChangeProps: o } = this.options,
              l = typeof o == "function" ? o() : o;
            if (l === "all" || (!l && !x(this, Hr).size)) return !0;
            const s = new Set(l != null ? l : x(this, Hr));
            return (
              this.options.throwOnError && s.add("error"),
              Object.keys(x(this, ct)).some((u) => {
                const c = u;
                return x(this, ct)[c] !== n[c] && s.has(c);
              })
            );
          };
        (t == null ? void 0 : t.listeners) !== !1 && a() && (i.listeners = !0),
          J(this, ds, Jy).call(this, { ...i, ...t });
      }
      onQueryUpdate() {
        this.updateResult(), this.hasListeners() && J(this, To, zc).call(this);
      }
    }),
    (St = new WeakMap()),
    (ke = new WeakMap()),
    (Bi = new WeakMap()),
    (ct = new WeakMap()),
    ($r = new WeakMap()),
    (Qi = new WeakMap()),
    (gn = new WeakMap()),
    (So = new WeakMap()),
    (Yi = new WeakMap()),
    (Vi = new WeakMap()),
    (jr = new WeakMap()),
    (zr = new WeakMap()),
    (or = new WeakMap()),
    (Hr = new WeakMap()),
    (Wr = new WeakSet()),
    (Aa = function (t) {
      J(this, bo, Bc).call(this);
      let n = x(this, ke).fetch(this.options, t);
      return (t != null && t.throwOnError) || (n = n.catch(Bt)), n;
    }),
    (ko = new WeakSet()),
    (Ic = function () {
      if (
        (J(this, Po, Hc).call(this),
        ia || x(this, ct).isStale || !Fc(this.options.staleTime))
      )
        return;
      const n = Qy(x(this, ct).dataUpdatedAt, this.options.staleTime) + 1;
      L(
        this,
        jr,
        setTimeout(() => {
          x(this, ct).isStale || this.updateResult();
        }, n),
      );
    }),
    (Co = new WeakSet()),
    ($c = function () {
      var t;
      return (t =
        typeof this.options.refetchInterval == "function"
          ? this.options.refetchInterval(x(this, ke))
          : this.options.refetchInterval) != null
        ? t
        : !1;
    }),
    (Eo = new WeakSet()),
    (jc = function (t) {
      J(this, Do, Wc).call(this),
        L(this, or, t),
        !(
          ia ||
          this.options.enabled === !1 ||
          !Fc(x(this, or)) ||
          x(this, or) === 0
        ) &&
          L(
            this,
            zr,
            setInterval(
              () => {
                (this.options.refetchIntervalInBackground || is.isFocused()) &&
                  J(this, Wr, Aa).call(this);
              },
              x(this, or),
            ),
          );
    }),
    (To = new WeakSet()),
    (zc = function () {
      J(this, ko, Ic).call(this),
        J(this, Eo, jc).call(this, J(this, Co, $c).call(this));
    }),
    (Po = new WeakSet()),
    (Hc = function () {
      x(this, jr) && (clearTimeout(x(this, jr)), L(this, jr, void 0));
    }),
    (Do = new WeakSet()),
    (Wc = function () {
      x(this, zr) && (clearInterval(x(this, zr)), L(this, zr, void 0));
    }),
    (bo = new WeakSet()),
    (Bc = function () {
      const t = x(this, St).getQueryCache().build(x(this, St), this.options);
      if (t === x(this, ke)) return;
      const n = x(this, ke);
      L(this, ke, t),
        L(this, Bi, t.state),
        this.hasListeners() &&
          (n == null || n.removeObserver(this), t.addObserver(this));
    }),
    (ds = new WeakSet()),
    (Jy = function (t) {
      Ve.batch(() => {
        t.listeners &&
          this.listeners.forEach((n) => {
            n(x(this, ct));
          }),
          x(this, St)
            .getQueryCache()
            .notify({ query: x(this, ke), type: "observerResultsUpdated" });
      });
    }),
    Hp);
function $C(e, t) {
  return (
    t.enabled !== !1 &&
    !e.state.dataUpdatedAt &&
    !(e.state.status === "error" && t.retryOnMount === !1)
  );
}
function xp(e, t) {
  return $C(e, t) || (e.state.dataUpdatedAt > 0 && Qc(e, t, t.refetchOnMount));
}
function Qc(e, t, n) {
  if (t.enabled !== !1) {
    const r = typeof n == "function" ? n(e) : n;
    return r === "always" || (r !== !1 && mf(e, t));
  }
  return !1;
}
function Sp(e, t, n, r) {
  return (
    n.enabled !== !1 &&
    (e !== t || r.enabled === !1) &&
    (!n.suspense || e.state.status !== "error") &&
    mf(e, n)
  );
}
function mf(e, t) {
  return e.isStaleByTime(t.staleTime);
}
function jC(e, t) {
  return !rs(e.getCurrentResult(), t);
}
var lr,
  pt,
  Ht,
  Dn,
  qi,
  Pl,
  No,
  Yc,
  Wp,
  zC =
    ((Wp = class extends ca {
      constructor(t, n) {
        super();
        z(this, qi);
        z(this, No);
        z(this, lr, void 0);
        z(this, pt, void 0);
        z(this, Ht, void 0);
        z(this, Dn, void 0);
        L(this, pt, void 0),
          L(this, lr, t),
          this.setOptions(n),
          this.bindMethods(),
          J(this, qi, Pl).call(this);
      }
      bindMethods() {
        (this.mutate = this.mutate.bind(this)),
          (this.reset = this.reset.bind(this));
      }
      setOptions(t) {
        var r;
        const n = this.options;
        (this.options = x(this, lr).defaultMutationOptions(t)),
          rs(n, this.options) ||
            x(this, lr)
              .getMutationCache()
              .notify({
                type: "observerOptionsUpdated",
                mutation: x(this, Ht),
                observer: this,
              }),
          (r = x(this, Ht)) == null || r.setOptions(this.options);
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          (t = x(this, Ht)) == null ||
          t.removeObserver(this);
      }
      onMutationUpdate(t) {
        J(this, qi, Pl).call(this), J(this, No, Yc).call(this, t);
      }
      getCurrentResult() {
        return x(this, pt);
      }
      reset() {
        L(this, Ht, void 0),
          J(this, qi, Pl).call(this),
          J(this, No, Yc).call(this);
      }
      mutate(t, n) {
        var r;
        return (
          L(this, Dn, n),
          (r = x(this, Ht)) == null || r.removeObserver(this),
          L(
            this,
            Ht,
            x(this, lr).getMutationCache().build(x(this, lr), this.options),
          ),
          x(this, Ht).addObserver(this),
          x(this, Ht).execute(t)
        );
      }
    }),
    (lr = new WeakMap()),
    (pt = new WeakMap()),
    (Ht = new WeakMap()),
    (Dn = new WeakMap()),
    (qi = new WeakSet()),
    (Pl = function () {
      var n, r;
      const t =
        (r = (n = x(this, Ht)) == null ? void 0 : n.state) != null ? r : Xy();
      L(this, pt, {
        ...t,
        isPending: t.status === "pending",
        isSuccess: t.status === "success",
        isError: t.status === "error",
        isIdle: t.status === "idle",
        mutate: this.mutate,
        reset: this.reset,
      });
    }),
    (No = new WeakSet()),
    (Yc = function (t) {
      Ve.batch(() => {
        var n, r, i, a, o, l, s, u;
        x(this, Dn) &&
          this.hasListeners() &&
          ((t == null ? void 0 : t.type) === "success"
            ? ((r = (n = x(this, Dn)).onSuccess) == null ||
                r.call(n, t.data, x(this, pt).variables, x(this, pt).context),
              (a = (i = x(this, Dn)).onSettled) == null ||
                a.call(
                  i,
                  t.data,
                  null,
                  x(this, pt).variables,
                  x(this, pt).context,
                ))
            : (t == null ? void 0 : t.type) === "error" &&
              ((l = (o = x(this, Dn)).onError) == null ||
                l.call(o, t.error, x(this, pt).variables, x(this, pt).context),
              (u = (s = x(this, Dn)).onSettled) == null ||
                u.call(
                  s,
                  void 0,
                  t.error,
                  x(this, pt).variables,
                  x(this, pt).context,
                ))),
          this.listeners.forEach((c) => {
            c(x(this, pt));
          });
      });
    }),
    Wp),
  Zy = S.exports.createContext(void 0),
  vf = (e) => {
    const t = S.exports.useContext(Zy);
    if (e) return e;
    if (!t)
      throw new Error("No QueryClient set, use QueryClientProvider to set one");
    return t;
  },
  HC = ({ client: e, children: t }) => (
    S.exports.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e],
    ),
    m(Zy.Provider, { value: e, children: t })
  ),
  eg = S.exports.createContext(!1),
  WC = () => S.exports.useContext(eg);
eg.Provider;
function BC() {
  let e = !1;
  return {
    clearReset: () => {
      e = !1;
    },
    reset: () => {
      e = !0;
    },
    isReset: () => e,
  };
}
var QC = S.exports.createContext(BC()),
  YC = () => S.exports.useContext(QC);
function tg(e, t) {
  return typeof e == "function" ? e(...t) : !!e;
}
var VC = (e, t) => {
    (e.suspense || e.throwOnError) && (t.isReset() || (e.retryOnMount = !1));
  },
  qC = (e) => {
    S.exports.useEffect(() => {
      e.clearReset();
    }, [e]);
  },
  KC = ({ result: e, errorResetBoundary: t, throwOnError: n, query: r }) =>
    e.isError && !t.isReset() && !e.isFetching && tg(n, [e.error, r]),
  GC = (e) => {
    e.suspense && typeof e.staleTime != "number" && (e.staleTime = 1e3);
  },
  XC = (e, t) => e.isLoading && e.isFetching && !t,
  JC = (e, t, n) => (e == null ? void 0 : e.suspense) && XC(t, n),
  ZC = (e, t, n) =>
    t.fetchOptimistic(e).catch(() => {
      n.clearReset();
    });
function eE(e, t, n) {
  const r = vf(n),
    i = WC(),
    a = YC(),
    o = r.defaultQueryOptions(e);
  (o._optimisticResults = i ? "isRestoring" : "optimistic"),
    GC(o),
    VC(o, a),
    qC(a);
  const [l] = S.exports.useState(() => new t(r, o)),
    s = l.getOptimisticResult(o);
  if (
    (S.exports.useSyncExternalStore(
      S.exports.useCallback(
        (u) => {
          const c = i ? () => {} : l.subscribe(Ve.batchCalls(u));
          return l.updateResult(), c;
        },
        [l, i],
      ),
      () => l.getCurrentResult(),
      () => l.getCurrentResult(),
    ),
    S.exports.useEffect(() => {
      l.setOptions(o, { listeners: !1 });
    }, [o, l]),
    JC(o, s, i))
  )
    throw ZC(o, l, a);
  if (
    KC({
      result: s,
      errorResetBoundary: a,
      throwOnError: o.throwOnError,
      query: l.getCurrentQuery(),
    })
  )
    throw s.error;
  return o.notifyOnChangeProps ? s : l.trackResult(s);
}
function Ls(e, t) {
  return eE(e, IC, t);
}
function tE(e, t) {
  const n = vf(t),
    [r] = S.exports.useState(() => new zC(n, e));
  S.exports.useEffect(() => {
    r.setOptions(e);
  }, [r, e]);
  const i = S.exports.useSyncExternalStore(
      S.exports.useCallback((o) => r.subscribe(Ve.batchCalls(o)), [r]),
      () => r.getCurrentResult(),
      () => r.getCurrentResult(),
    ),
    a = S.exports.useCallback(
      (o, l) => {
        r.mutate(o, l).catch(nE);
      },
      [r],
    );
  if (i.error && tg(r.options.throwOnError, [i.error])) throw i.error;
  return { ...i, mutate: a, mutateAsync: i.mutate };
}
function nE() {}
/*! js-cookie v3.0.5 | MIT */ function sl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];
    for (var r in n) e[r] = n[r];
  }
  return e;
}
var rE = {
  read: function (e) {
    return (
      e[0] === '"' && (e = e.slice(1, -1)),
      e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    );
  },
  write: function (e) {
    return encodeURIComponent(e).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent,
    );
  },
};
function Vc(e, t) {
  function n(i, a, o) {
    if (!(typeof document > "u")) {
      (o = sl({}, t, o)),
        typeof o.expires == "number" &&
          (o.expires = new Date(Date.now() + o.expires * 864e5)),
        o.expires && (o.expires = o.expires.toUTCString()),
        (i = encodeURIComponent(i)
          .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
          .replace(/[()]/g, escape));
      var l = "";
      for (var s in o)
        !o[s] ||
          ((l += "; " + s), o[s] !== !0 && (l += "=" + o[s].split(";")[0]));
      return (document.cookie = i + "=" + e.write(a, i) + l);
    }
  }
  function r(i) {
    if (!(typeof document > "u" || (arguments.length && !i))) {
      for (
        var a = document.cookie ? document.cookie.split("; ") : [],
          o = {},
          l = 0;
        l < a.length;
        l++
      ) {
        var s = a[l].split("="),
          u = s.slice(1).join("=");
        try {
          var c = decodeURIComponent(s[0]);
          if (((o[c] = e.read(u, c)), i === c)) break;
        } catch {}
      }
      return i ? o[i] : o;
    }
  }
  return Object.create(
    {
      set: n,
      get: r,
      remove: function (i, a) {
        n(i, "", sl({}, a, { expires: -1 }));
      },
      withAttributes: function (i) {
        return Vc(this.converter, sl({}, this.attributes, i));
      },
      withConverter: function (i) {
        return Vc(sl({}, this.converter, i), this.attributes);
      },
    },
    {
      attributes: { value: Object.freeze(t) },
      converter: { value: Object.freeze(e) },
    },
  );
}
var yf = Vc(rE, { path: "/" });
const iE = "http://localhost:4000";
function aE(e) {
  return `https://${e}-{{ENCORE_APP_ID}}.encr.app`;
}
class oE {
  constructor(t, n) {
    Nt(this, "booking");
    Nt(this, "frontend");
    const r = new uE(t, n != null ? n : {});
    (this.booking = new qc.ServiceClient(r)),
      (this.frontend = new Kc.ServiceClient(r));
  }
}
var qc;
((e) => {
  class t {
    constructor(r) {
      Nt(this, "baseClient");
      this.baseClient = r;
    }
    async Book(r) {
      await this.baseClient.callAPI("POST", "/booking", JSON.stringify(r));
    }
    async GetAvailability() {
      return await (
        await this.baseClient.callAPI("GET", "/availability")
      ).json();
    }
    async GetBookableSlots(r) {
      return await (
        await this.baseClient.callAPI("GET", `/slots/${encodeURIComponent(r)}`)
      ).json();
    }
    async ListBookings() {
      return await (await this.baseClient.callAPI("GET", "/booking")).json();
    }
    async SetAvailability(r) {
      await this.baseClient.callAPI("POST", "/availability", JSON.stringify(r));
    }
  }
  e.ServiceClient = t;
})(qc || (qc = {}));
var Kc;
((e) => {
  class t {
    constructor(r) {
      Nt(this, "baseClient");
      this.baseClient = r;
    }
    async Serve(r, i, a, o) {
      return this.baseClient.callAPI(
        r,
        `/frontend/${i.map(encodeURIComponent).join("/")}`,
        a,
        o,
      );
    }
  }
  e.ServiceClient = t;
})(Kc || (Kc = {}));
function lE(e) {
  const t = [];
  for (const n in e) {
    const r = Array.isArray(e[n]) ? e[n] : [e[n]];
    for (const i of r) t.push(`${n}=${encodeURIComponent(i)}`);
  }
  return t.join("&");
}
const sE = fetch.bind(void 0);
class uE {
  constructor(t, n) {
    Nt(this, "baseURL");
    Nt(this, "fetcher");
    Nt(this, "headers");
    Nt(this, "requestInit");
    Nt(this, "authGenerator");
    var r;
    if (
      ((this.baseURL = t),
      (this.headers = {
        "Content-Type": "application/json",
        "User-Agent": "{{ENCORE_APP_ID}}-Generated-TS-Client (Encore/v1.28.0)",
      }),
      (this.requestInit = (r = n.requestInit) != null ? r : {}),
      n.fetcher !== void 0 ? (this.fetcher = n.fetcher) : (this.fetcher = sE),
      n.auth !== void 0)
    ) {
      const i = n.auth;
      typeof i == "function"
        ? (this.authGenerator = i)
        : (this.authGenerator = () => i);
    }
  }
  async callAPI(t, n, r, i) {
    let { query: a, headers: o, ...l } = i != null ? i : {};
    const s = {
      ...this.requestInit,
      ...l,
      method: t,
      body: r != null ? r : null,
    };
    s.headers = { ...this.headers, ...s.headers, ...o };
    let u;
    this.authGenerator && (u = this.authGenerator()),
      u && (s.headers.authorization = u.Authorization);
    const c = a ? "?" + lE(a) : "",
      d = await this.fetcher(this.baseURL + n + c, s);
    if (!d.ok) {
      let p = {
        code: gf.Unknown,
        message: `request failed: status ${d.status}`,
      };
      try {
        const v = await d.text();
        try {
          const y = JSON.parse(v);
          cE(y) ? (p = y) : (p.message += ": " + JSON.stringify(y));
        } catch {
          p.message += ": " + v;
        }
      } catch (v) {
        p.message += ": " + String(v);
      }
      throw new os(d.status, p);
    }
    return d;
  }
}
function cE(e) {
  return (
    e != null &&
    dE(e.code) &&
    typeof e.message == "string" &&
    (e.details === void 0 || e.details === null || typeof e.details == "object")
  );
}
function dE(e) {
  return e !== void 0 && Object.values(gf).includes(e);
}
class os extends Error {
  constructor(n, r) {
    super(r.message);
    Nt(this, "status");
    Nt(this, "code");
    Nt(this, "details");
    Object.defineProperty(this, "name", {
      value: "APIError",
      enumerable: !1,
      configurable: !0,
    }),
      Object.setPrototypeOf == null
        ? (this.__proto__ = os.prototype)
        : Object.setPrototypeOf(this, os.prototype),
      Error.captureStackTrace !== void 0 &&
        Error.captureStackTrace(this, this.constructor),
      (this.status = n),
      (this.code = r.code),
      (this.details = r.details);
  }
}
var gf = ((e) => (
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
))(gf || {});
const ng = () => {
    const e = yf.get("auth-token"),
      t = window.location.host.includes("localhost") ? iE : aE("staging");
    return new oE(t, { auth: { Authorization: `Bearer ${e}` } });
  },
  Fs = ng(),
  fE = (e) => [...e.slice(1), e[0]],
  hE = (e) => [e[e.length - 1], ...e.slice(0, e.length - 1)],
  pE = async () => {
    const e = await Fs.booking.GetAvailability();
    return fE(e.Availability);
  },
  mE = async (e) => await Fs.booking.SetAvailability({ Availability: hE(e) }),
  rg = () => ({ queryKey: ["availability"], queryFn: async () => pE() }),
  vE = (e) => {
    const t = We(e, "yyyy-MM-dd");
    return {
      queryKey: ["bookableSlots", t],
      queryFn: async () =>
        (await Fs.booking.GetBookableSlots(t)).Slots.map(
          ({ start: r, end: i }) => ({
            start: r.split("Z")[0],
            end: i.split("Z")[0],
          }),
        ) || [],
    };
  },
  yE = () => ({
    queryKey: ["scheduledEvents"],
    queryFn: async () => await Fs.booking.ListBookings(),
  }),
  kp = "1440",
  Cp = (e) => Os(e) * 60 + Rs(e),
  gE = () => {
    const { data: e, error: t } = Ls(rg());
    return e
      ? m(un, {
          children: e.map(({ start: n, end: r }, i) => {
            const a = i + 1;
            if (!n || !r)
              return m(Nu, { day: a, gridRow: `1 / span ${kp}` }, a);
            const o = ra(`${a} ${n}`, "i HH:mm", new Date()),
              l = ra(`${a} ${r}`, "i HH:mm", new Date());
            return F(
              rt.Fragment,
              {
                children: [
                  m(Nu, { day: a, gridRow: `1 / span ${Cp(o)}` }, o.toString()),
                  m(
                    Nu,
                    { day: a, gridRow: `${Cp(l)} / span ${kp}` },
                    l.toString(),
                  ),
                ],
              },
              o.toDateString(),
            );
          }),
        })
      : null;
  },
  Nu = ({ day: e, gridRow: t }) =>
    m("li", {
      className: `relative mt-px flex col-start-${e}`,
      style: { gridRow: t },
      children: m("div", {
        className:
          "group absolute inset-1 flex flex-col overflow-y-auto p-2 bg-repeat bg-contain",
        style: { backgroundImage: "url(/frontend/unavailable-bg.svg)" },
      }),
    }),
  wE = ({ state: e, dispatch: t }) => {
    const n = e.displayedDays[0],
      { data: r } = Ls(vE(n));
    return m(un, {
      children: (r || []).map((i) => {
        const a = new Date(i.start),
          o = new Date(i.end),
          l = Os(a) * 60 + Rs(a),
          s = uf({ start: a, end: o }),
          u = (s.hours || 0) * 60 + (s.minutes || 0),
          c = Iy(a);
        return m(
          "li",
          {
            className: `relative mt-[5px] flex col-start-${c || 7}`,
            style: { gridRow: l + " / span " + u },
            children: m(xE, { event: i, state: e, dispatch: t }),
          },
          i.start,
        );
      }),
    });
  },
  xE = ({ event: e, dispatch: t }) => {
    const n = new Date(e.start.split("Z")[0]),
      r = n < new Date(),
      i = "blue",
      a = "Available";
    return m(un, {
      children: F("div", {
        onClick: () => t({ type: "showBookingModal", value: e }),
        className: `
        group absolute inset-1 flex flex-col overflow-y-auto rounded-lg
        bg-${i}-50 p-2 text-xs leading-5
        ${r ? "hidden" : `hover:bg-${i}-100 cursor-pointer`}
      `,
        children: [
          m("p", {
            className: `order-1 font-semibold text-${i}-700`,
            children: a,
          }),
          m("p", {
            className: `text-${i}-500 group-hover:text-${i}-700`,
            children: m("time", {
              dateTime: n.toString(),
              children: We(n, "HH:mm"),
            }),
          }),
        ],
      }),
    });
  },
  SE = ({ displayedDays: e }) => {
    const t = e.find((n) => ii(new Date(), n));
    return t ? m(ig, { colStart: Iy(t) }) : null;
  },
  kE = ({ displayedDay: e }) => (ii(new Date(), e) ? m(ig, {}) : null),
  ig = ({ colStart: e }) => {
    const t = new Date(),
      n = Os(t) * 60 + Rs(t);
    return m("li", {
      className: `relative flex ${e ? "col-start-" + e : ""}`,
      style: { gridRow: n + " / span 1" },
      children: F("div", {
        className: "group absolute inset-0 flex items-center",
        children: [
          m("div", {
            className:
              "absolute bg-red-500 rounded-full h-[10px] w-[10px] -top-[5px]",
          }),
          m("div", { className: "bg-red-500 h-[2px] w-full" }),
        ],
      }),
    });
  },
  Us = typeof window > "u" || typeof document > "u";
let $n = Us ? S.exports.useEffect : S.exports.useLayoutEffect;
function Rn(e) {
  let t = S.exports.useRef(e);
  return (
    $n(() => {
      t.current = e;
    }, [e]),
    t
  );
}
function As(e) {
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
function Ao() {
  let e = [],
    t = [],
    n = {
      enqueue(r) {
        t.push(r);
      },
      addEventListener(r, i, a, o) {
        return (
          r.addEventListener(i, a, o),
          n.add(() => r.removeEventListener(i, a, o))
        );
      },
      requestAnimationFrame(...r) {
        let i = requestAnimationFrame(...r);
        return n.add(() => cancelAnimationFrame(i));
      },
      nextFrame(...r) {
        return n.requestAnimationFrame(() => n.requestAnimationFrame(...r));
      },
      setTimeout(...r) {
        let i = setTimeout(...r);
        return n.add(() => clearTimeout(i));
      },
      microTask(...r) {
        let i = { current: !0 };
        return (
          As(() => {
            i.current && r[0]();
          }),
          n.add(() => {
            i.current = !1;
          })
        );
      },
      add(r) {
        return (
          e.push(r),
          () => {
            let i = e.indexOf(r);
            if (i >= 0) {
              let [a] = e.splice(i, 1);
              a();
            }
          }
        );
      },
      dispose() {
        for (let r of e.splice(0)) r();
      },
      async workQueue() {
        for (let r of t.splice(0)) await r();
      },
    };
  return n;
}
function ag() {
  let [e] = S.exports.useState(Ao);
  return S.exports.useEffect(() => () => e.dispose(), [e]), e;
}
let ft = function (e) {
    let t = Rn(e);
    return rt.useCallback((...n) => t.current(...n), [t]);
  },
  Mu = { serverHandoffComplete: !1 };
function da() {
  let [e, t] = S.exports.useState(Mu.serverHandoffComplete);
  return (
    S.exports.useEffect(() => {
      e !== !0 && t(!0);
    }, [e]),
    S.exports.useEffect(() => {
      Mu.serverHandoffComplete === !1 && (Mu.serverHandoffComplete = !0);
    }, []),
    e
  );
}
var Ep;
let CE = 0;
function Tp() {
  return ++CE;
}
let fa =
  (Ep = rt.useId) != null
    ? Ep
    : function () {
        let e = da(),
          [t, n] = rt.useState(e ? Tp : null);
        return (
          $n(() => {
            t === null && n(Tp());
          }, [t]),
          t != null ? "" + t : void 0
        );
      };
function tt(e, t, ...n) {
  if (e in t) {
    let i = t[e];
    return typeof i == "function" ? i(...n) : i;
  }
  let r = new Error(
    `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      t,
    )
      .map((i) => `"${i}"`)
      .join(", ")}.`,
  );
  throw (Error.captureStackTrace && Error.captureStackTrace(r, tt), r);
}
function wf(e) {
  return Us
    ? null
    : e instanceof Node
    ? e.ownerDocument
    : e != null && e.hasOwnProperty("current") && e.current instanceof Node
    ? e.current.ownerDocument
    : document;
}
let Gc = [
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
  .join(",");
var ls = ((e) => (
    (e[(e.First = 1)] = "First"),
    (e[(e.Previous = 2)] = "Previous"),
    (e[(e.Next = 4)] = "Next"),
    (e[(e.Last = 8)] = "Last"),
    (e[(e.WrapAround = 16)] = "WrapAround"),
    (e[(e.NoScroll = 32)] = "NoScroll"),
    e
  ))(ls || {}),
  og = ((e) => (
    (e[(e.Error = 0)] = "Error"),
    (e[(e.Overflow = 1)] = "Overflow"),
    (e[(e.Success = 2)] = "Success"),
    (e[(e.Underflow = 3)] = "Underflow"),
    e
  ))(og || {}),
  EE = ((e) => (
    (e[(e.Previous = -1)] = "Previous"), (e[(e.Next = 1)] = "Next"), e
  ))(EE || {});
function TE(e = document.body) {
  return e == null ? [] : Array.from(e.querySelectorAll(Gc));
}
var lg = ((e) => (
  (e[(e.Strict = 0)] = "Strict"), (e[(e.Loose = 1)] = "Loose"), e
))(lg || {});
function PE(e, t = 0) {
  var n;
  return e === ((n = wf(e)) == null ? void 0 : n.body)
    ? !1
    : tt(t, {
        [0]() {
          return e.matches(Gc);
        },
        [1]() {
          let r = e;
          for (; r !== null; ) {
            if (r.matches(Gc)) return !0;
            r = r.parentElement;
          }
          return !1;
        },
      });
}
function Ri(e) {
  e == null || e.focus({ preventScroll: !0 });
}
let DE = ["textarea", "input"].join(",");
function bE(e) {
  var t, n;
  return (n =
    (t = e == null ? void 0 : e.matches) == null ? void 0 : t.call(e, DE)) !=
    null
    ? n
    : !1;
}
function NE(e, t = (n) => n) {
  return e.slice().sort((n, r) => {
    let i = t(n),
      a = t(r);
    if (i === null || a === null) return 0;
    let o = i.compareDocumentPosition(a);
    return o & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : o & Node.DOCUMENT_POSITION_PRECEDING
      ? 1
      : 0;
  });
}
function Xc(e, t, n = !0, r = null) {
  let i = Array.isArray(e)
      ? e.length > 0
        ? e[0].ownerDocument
        : document
      : e.ownerDocument,
    a = Array.isArray(e) ? (n ? NE(e) : e) : TE(e);
  r = r != null ? r : i.activeElement;
  let o = (() => {
      if (t & 5) return 1;
      if (t & 10) return -1;
      throw new Error(
        "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
      );
    })(),
    l = (() => {
      if (t & 1) return 0;
      if (t & 2) return Math.max(0, a.indexOf(r)) - 1;
      if (t & 4) return Math.max(0, a.indexOf(r)) + 1;
      if (t & 8) return a.length - 1;
      throw new Error(
        "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
      );
    })(),
    s = t & 32 ? { preventScroll: !0 } : {},
    u = 0,
    c = a.length,
    d;
  do {
    if (u >= c || u + c <= 0) return 0;
    let p = l + u;
    if (t & 16) p = (p + c) % c;
    else {
      if (p < 0) return 3;
      if (p >= c) return 1;
    }
    (d = a[p]), d == null || d.focus(s), (u += o);
  } while (d !== i.activeElement);
  return (
    t & 6 && bE(d) && d.select(),
    d.hasAttribute("tabindex") || d.setAttribute("tabindex", "0"),
    2
  );
}
function Ou(e, t, n) {
  let r = Rn(t);
  S.exports.useEffect(() => {
    function i(a) {
      r.current(a);
    }
    return (
      document.addEventListener(e, i, n),
      () => document.removeEventListener(e, i, n)
    );
  }, [e, n]);
}
function ME(e, t, n = !0) {
  let r = S.exports.useRef(!1);
  S.exports.useEffect(() => {
    requestAnimationFrame(() => {
      r.current = n;
    });
  }, [n]);
  function i(o, l) {
    if (!r.current || o.defaultPrevented) return;
    let s = (function c(d) {
        return typeof d == "function"
          ? c(d())
          : Array.isArray(d) || d instanceof Set
          ? d
          : [d];
      })(e),
      u = l(o);
    if (u !== null && !!u.ownerDocument.documentElement.contains(u)) {
      for (let c of s) {
        if (c === null) continue;
        let d = c instanceof HTMLElement ? c : c.current;
        if (d != null && d.contains(u)) return;
      }
      return (
        !PE(u, lg.Loose) && u.tabIndex !== -1 && o.preventDefault(), t(o, u)
      );
    }
  }
  let a = S.exports.useRef(null);
  Ou(
    "mousedown",
    (o) => {
      r.current && (a.current = o.target);
    },
    !0,
  ),
    Ou(
      "click",
      (o) => {
        !a.current || (i(o, () => a.current), (a.current = null));
      },
      !0,
    ),
    Ou(
      "blur",
      (o) =>
        i(o, () =>
          window.document.activeElement instanceof HTMLIFrameElement
            ? window.document.activeElement
            : null,
        ),
      !0,
    );
}
let sg = Symbol();
function OE(e, t = !0) {
  return Object.assign(e, { [sg]: t });
}
function cn(...e) {
  let t = S.exports.useRef(e);
  S.exports.useEffect(() => {
    t.current = e;
  }, [e]);
  let n = ft((r) => {
    for (let i of t.current)
      i != null && (typeof i == "function" ? i(r) : (i.current = r));
  });
  return e.every((r) => r == null || (r == null ? void 0 : r[sg])) ? void 0 : n;
}
var ss = ((e) => (
    (e[(e.None = 0)] = "None"),
    (e[(e.RenderStrategy = 1)] = "RenderStrategy"),
    (e[(e.Static = 2)] = "Static"),
    e
  ))(ss || {}),
  Mn = ((e) => (
    (e[(e.Unmount = 0)] = "Unmount"), (e[(e.Hidden = 1)] = "Hidden"), e
  ))(Mn || {});
function Xt({
  ourProps: e,
  theirProps: t,
  slot: n,
  defaultTag: r,
  features: i,
  visible: a = !0,
  name: o,
}) {
  let l = ug(t, e);
  if (a) return ul(l, n, r, o);
  let s = i != null ? i : 0;
  if (s & 2) {
    let { static: u = !1, ...c } = l;
    if (u) return ul(c, n, r, o);
  }
  if (s & 1) {
    let { unmount: u = !0, ...c } = l;
    return tt(u ? 0 : 1, {
      [0]() {
        return null;
      },
      [1]() {
        return ul({ ...c, hidden: !0, style: { display: "none" } }, n, r, o);
      },
    });
  }
  return ul(l, n, r, o);
}
function ul(e, t = {}, n, r) {
  let {
      as: i = n,
      children: a,
      refName: o = "ref",
      ...l
    } = Ru(e, ["unmount", "static"]),
    s = e.ref !== void 0 ? { [o]: e.ref } : {},
    u = typeof a == "function" ? a(t) : a;
  l.className &&
    typeof l.className == "function" &&
    (l.className = l.className(t));
  let c = {};
  if (t) {
    let d = !1,
      p = [];
    for (let [v, y] of Object.entries(t))
      typeof y == "boolean" && (d = !0), y === !0 && p.push(v);
    d && (c["data-headlessui-state"] = p.join(" "));
  }
  if (i === S.exports.Fragment && Object.keys(Pp(l)).length > 0) {
    if (!S.exports.isValidElement(u) || (Array.isArray(u) && u.length > 1))
      throw new Error(
        [
          'Passing props on "Fragment"!',
          "",
          `The current component <${r} /> is rendering a "Fragment".`,
          "However we need to passthrough the following props:",
          Object.keys(l).map((d) => `  - ${d}`).join(`
`),
          "",
          "You can apply a few solutions:",
          [
            'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
            "Render a single element as the child so that we can forward the props onto that element.",
          ].map((d) => `  - ${d}`).join(`
`),
        ].join(`
`),
      );
    return S.exports.cloneElement(
      u,
      Object.assign(
        {},
        ug(u.props, Pp(Ru(l, ["ref"]))),
        c,
        s,
        RE(u.ref, s.ref),
      ),
    );
  }
  return S.exports.createElement(
    i,
    Object.assign(
      {},
      Ru(l, ["ref"]),
      i !== S.exports.Fragment && s,
      i !== S.exports.Fragment && c,
    ),
    u,
  );
}
function RE(...e) {
  return {
    ref: e.every((t) => t == null)
      ? void 0
      : (t) => {
          for (let n of e)
            n != null && (typeof n == "function" ? n(t) : (n.current = t));
        },
  };
}
function ug(...e) {
  if (e.length === 0) return {};
  if (e.length === 1) return e[0];
  let t = {},
    n = {};
  for (let r of e)
    for (let i in r)
      i.startsWith("on") && typeof r[i] == "function"
        ? (n[i] != null || (n[i] = []), n[i].push(r[i]))
        : (t[i] = r[i]);
  if (t.disabled || t["aria-disabled"])
    return Object.assign(
      t,
      Object.fromEntries(Object.keys(n).map((r) => [r, void 0])),
    );
  for (let r in n)
    Object.assign(t, {
      [r](i, ...a) {
        let o = n[r];
        for (let l of o) {
          if (
            (i instanceof Event ||
              (i == null ? void 0 : i.nativeEvent) instanceof Event) &&
            i.defaultPrevented
          )
            return;
          l(i, ...a);
        }
      },
    });
  return t;
}
function At(e) {
  var t;
  return Object.assign(S.exports.forwardRef(e), {
    displayName: (t = e.displayName) != null ? t : e.name,
  });
}
function Pp(e) {
  let t = Object.assign({}, e);
  for (let n in t) t[n] === void 0 && delete t[n];
  return t;
}
function Ru(e, t = []) {
  let n = Object.assign({}, e);
  for (let r of t) r in n && delete n[r];
  return n;
}
function _E(e) {
  let t = e.parentElement,
    n = null;
  for (; t && !(t instanceof HTMLFieldSetElement); )
    t instanceof HTMLLegendElement && (n = t), (t = t.parentElement);
  let r = (t == null ? void 0 : t.getAttribute("disabled")) === "";
  return r && LE(n) ? !1 : r;
}
function LE(e) {
  if (!e) return !1;
  let t = e.previousElementSibling;
  for (; t !== null; ) {
    if (t instanceof HTMLLegendElement) return !1;
    t = t.previousElementSibling;
  }
  return !0;
}
let FE = "div";
var us = ((e) => (
  (e[(e.None = 1)] = "None"),
  (e[(e.Focusable = 2)] = "Focusable"),
  (e[(e.Hidden = 4)] = "Hidden"),
  e
))(us || {});
let Jc = At(function (e, t) {
    let { features: n = 1, ...r } = e,
      i = {
        ref: t,
        "aria-hidden": (n & 2) === 2 ? !0 : void 0,
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
          ...((n & 4) === 4 && (n & 2) !== 2 && { display: "none" }),
        },
      };
    return Xt({
      ourProps: i,
      theirProps: r,
      slot: {},
      defaultTag: FE,
      name: "Hidden",
    });
  }),
  xf = S.exports.createContext(null);
xf.displayName = "OpenClosedContext";
var ei = ((e) => (
  (e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e
))(ei || {});
function Sf() {
  return S.exports.useContext(xf);
}
function UE({ value: e, children: t }) {
  return rt.createElement(xf.Provider, { value: e }, t);
}
var cg = ((e) => (
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
))(cg || {});
function dg(e, t) {
  let n = S.exports.useRef([]),
    r = ft(e);
  S.exports.useEffect(() => {
    let i = [...n.current];
    for (let [a, o] of t.entries())
      if (n.current[a] !== o) {
        let l = r(t, i);
        return (n.current = t), l;
      }
  }, [r, ...t]);
}
function AE(e, t, n) {
  let r = Rn(t);
  S.exports.useEffect(() => {
    function i(a) {
      r.current(a);
    }
    return (
      window.addEventListener(e, i, n),
      () => window.removeEventListener(e, i, n)
    );
  }, [e, n]);
}
var Zc = ((e) => (
  (e[(e.Forwards = 0)] = "Forwards"), (e[(e.Backwards = 1)] = "Backwards"), e
))(Zc || {});
function IE() {
  let e = S.exports.useRef(0);
  return (
    AE(
      "keydown",
      (t) => {
        t.key === "Tab" && (e.current = t.shiftKey ? 1 : 0);
      },
      !0,
    ),
    e
  );
}
function Is() {
  let e = S.exports.useRef(!1);
  return (
    $n(
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
function $s(...e) {
  return S.exports.useMemo(() => wf(...e), [...e]);
}
function kf(e, t, n, r) {
  let i = Rn(n);
  S.exports.useEffect(() => {
    e = e != null ? e : window;
    function a(o) {
      i.current(o);
    }
    return e.addEventListener(t, a, r), () => e.removeEventListener(t, a, r);
  }, [e, t, r]);
}
let $E = "div";
var fg = ((e) => (
  (e[(e.None = 1)] = "None"),
  (e[(e.InitialFocus = 2)] = "InitialFocus"),
  (e[(e.TabLock = 4)] = "TabLock"),
  (e[(e.FocusLock = 8)] = "FocusLock"),
  (e[(e.RestoreFocus = 16)] = "RestoreFocus"),
  (e[(e.All = 30)] = "All"),
  e
))(fg || {});
let Ra = Object.assign(
  At(function (e, t) {
    let n = S.exports.useRef(null),
      r = cn(n, t),
      { initialFocus: i, containers: a, features: o = 30, ...l } = e;
    da() || (o = 1);
    let s = $s(n);
    jE({ ownerDocument: s }, Boolean(o & 16));
    let u = zE(
      { ownerDocument: s, container: n, initialFocus: i },
      Boolean(o & 2),
    );
    HE(
      {
        ownerDocument: s,
        container: n,
        containers: a,
        previousActiveElement: u,
      },
      Boolean(o & 8),
    );
    let c = IE(),
      d = ft(() => {
        let v = n.current;
        !v ||
          tt(c.current, {
            [Zc.Forwards]: () => Xc(v, ls.First),
            [Zc.Backwards]: () => Xc(v, ls.Last),
          });
      }),
      p = { ref: r };
    return rt.createElement(
      rt.Fragment,
      null,
      Boolean(o & 4) &&
        m(Jc, {
          as: "button",
          type: "button",
          onFocus: d,
          features: us.Focusable,
        }),
      Xt({ ourProps: p, theirProps: l, defaultTag: $E, name: "FocusTrap" }),
      Boolean(o & 4) &&
        m(Jc, {
          as: "button",
          type: "button",
          onFocus: d,
          features: us.Focusable,
        }),
    );
  }),
  { features: fg },
);
function jE({ ownerDocument: e }, t) {
  let n = S.exports.useRef(null);
  kf(
    e == null ? void 0 : e.defaultView,
    "focusout",
    (i) => {
      !t || n.current || (n.current = i.target);
    },
    !0,
  ),
    dg(() => {
      t ||
        ((e == null ? void 0 : e.activeElement) ===
          (e == null ? void 0 : e.body) && Ri(n.current),
        (n.current = null));
    }, [t]);
  let r = S.exports.useRef(!1);
  S.exports.useEffect(
    () => (
      (r.current = !1),
      () => {
        (r.current = !0),
          As(() => {
            !r.current || (Ri(n.current), (n.current = null));
          });
      }
    ),
    [],
  );
}
function zE({ ownerDocument: e, container: t, initialFocus: n }, r) {
  let i = S.exports.useRef(null),
    a = Is();
  return (
    dg(() => {
      if (!r) return;
      let o = t.current;
      !o ||
        As(() => {
          if (!a.current) return;
          let l = e == null ? void 0 : e.activeElement;
          if (n != null && n.current) {
            if ((n == null ? void 0 : n.current) === l) {
              i.current = l;
              return;
            }
          } else if (o.contains(l)) {
            i.current = l;
            return;
          }
          n != null && n.current
            ? Ri(n.current)
            : Xc(o, ls.First) === og.Error &&
              console.warn(
                "There are no focusable elements inside the <FocusTrap />",
              ),
            (i.current = e == null ? void 0 : e.activeElement);
        });
    }, [r]),
    i
  );
}
function HE(
  { ownerDocument: e, container: t, containers: n, previousActiveElement: r },
  i,
) {
  let a = Is();
  kf(
    e == null ? void 0 : e.defaultView,
    "focus",
    (o) => {
      if (!i || !a.current) return;
      let l = new Set(n == null ? void 0 : n.current);
      l.add(t);
      let s = r.current;
      if (!s) return;
      let u = o.target;
      u && u instanceof HTMLElement
        ? WE(l, u)
          ? ((r.current = u), Ri(u))
          : (o.preventDefault(), o.stopPropagation(), Ri(s))
        : Ri(r.current);
    },
    !0,
  );
}
function WE(e, t) {
  var n;
  for (let r of e) if ((n = r.current) != null && n.contains(t)) return !0;
  return !1;
}
let ci = new Set(),
  qn = new Map();
function Dp(e) {
  e.setAttribute("aria-hidden", "true"), (e.inert = !0);
}
function bp(e) {
  let t = qn.get(e);
  !t ||
    (t["aria-hidden"] === null
      ? e.removeAttribute("aria-hidden")
      : e.setAttribute("aria-hidden", t["aria-hidden"]),
    (e.inert = t.inert));
}
function BE(e, t = !0) {
  $n(() => {
    if (!t || !e.current) return;
    let n = e.current,
      r = wf(n);
    if (r) {
      ci.add(n);
      for (let i of qn.keys()) i.contains(n) && (bp(i), qn.delete(i));
      return (
        r.querySelectorAll("body > *").forEach((i) => {
          if (i instanceof HTMLElement) {
            for (let a of ci) if (i.contains(a)) return;
            ci.size === 1 &&
              (qn.set(i, {
                "aria-hidden": i.getAttribute("aria-hidden"),
                inert: i.inert,
              }),
              Dp(i));
          }
        }),
        () => {
          if ((ci.delete(n), ci.size > 0))
            r.querySelectorAll("body > *").forEach((i) => {
              if (i instanceof HTMLElement && !qn.has(i)) {
                for (let a of ci) if (i.contains(a)) return;
                qn.set(i, {
                  "aria-hidden": i.getAttribute("aria-hidden"),
                  inert: i.inert,
                }),
                  Dp(i);
              }
            });
          else for (let i of qn.keys()) bp(i), qn.delete(i);
        }
      );
    }
  }, [t]);
}
let hg = S.exports.createContext(!1);
function QE() {
  return S.exports.useContext(hg);
}
function ed(e) {
  return rt.createElement(hg.Provider, { value: e.force }, e.children);
}
function YE(e) {
  let t = QE(),
    n = S.exports.useContext(pg),
    r = $s(e),
    [i, a] = S.exports.useState(() => {
      if ((!t && n !== null) || Us) return null;
      let o = r == null ? void 0 : r.getElementById("headlessui-portal-root");
      if (o) return o;
      if (r === null) return null;
      let l = r.createElement("div");
      return (
        l.setAttribute("id", "headlessui-portal-root"), r.body.appendChild(l)
      );
    });
  return (
    S.exports.useEffect(() => {
      i !== null &&
        ((r != null && r.body.contains(i)) ||
          r == null ||
          r.body.appendChild(i));
    }, [i, r]),
    S.exports.useEffect(() => {
      t || (n !== null && a(n.current));
    }, [n, a, t]),
    i
  );
}
let VE = S.exports.Fragment,
  qE = At(function (e, t) {
    let n = e,
      r = S.exports.useRef(null),
      i = cn(
        OE((c) => {
          r.current = c;
        }),
        t,
      ),
      a = $s(r),
      o = YE(r),
      [l] = S.exports.useState(() => {
        var c;
        return Us
          ? null
          : (c = a == null ? void 0 : a.createElement("div")) != null
          ? c
          : null;
      }),
      s = da(),
      u = S.exports.useRef(!1);
    return (
      $n(() => {
        if (((u.current = !1), !(!o || !l)))
          return (
            o.contains(l) ||
              (l.setAttribute("data-headlessui-portal", ""), o.appendChild(l)),
            () => {
              (u.current = !0),
                As(() => {
                  var c;
                  !u.current ||
                    !o ||
                    !l ||
                    (o.removeChild(l),
                    o.childNodes.length <= 0 &&
                      ((c = o.parentElement) == null || c.removeChild(o)));
                });
            }
          );
      }, [o, l]),
      s
        ? !o || !l
          ? null
          : Mo.exports.createPortal(
              Xt({
                ourProps: { ref: i },
                theirProps: n,
                defaultTag: VE,
                name: "Portal",
              }),
              l,
            )
        : null
    );
  }),
  KE = S.exports.Fragment,
  pg = S.exports.createContext(null),
  GE = At(function (e, t) {
    let { target: n, ...r } = e,
      i = { ref: cn(t) };
    return m(pg.Provider, {
      value: n,
      children: Xt({
        ourProps: i,
        theirProps: r,
        defaultTag: KE,
        name: "Popover.Group",
      }),
    });
  }),
  td = Object.assign(qE, { Group: GE }),
  mg = S.exports.createContext(null);
function vg() {
  let e = S.exports.useContext(mg);
  if (e === null) {
    let t = new Error(
      "You used a <Description /> component, but it is not inside a relevant parent.",
    );
    throw (Error.captureStackTrace && Error.captureStackTrace(t, vg), t);
  }
  return e;
}
function XE() {
  let [e, t] = S.exports.useState([]);
  return [
    e.length > 0 ? e.join(" ") : void 0,
    S.exports.useMemo(
      () =>
        function (n) {
          let r = ft(
              (a) => (
                t((o) => [...o, a]),
                () =>
                  t((o) => {
                    let l = o.slice(),
                      s = l.indexOf(a);
                    return s !== -1 && l.splice(s, 1), l;
                  })
              ),
            ),
            i = S.exports.useMemo(
              () => ({
                register: r,
                slot: n.slot,
                name: n.name,
                props: n.props,
              }),
              [r, n.slot, n.name, n.props],
            );
          return rt.createElement(mg.Provider, { value: i }, n.children);
        },
      [t],
    ),
  ];
}
let JE = "p",
  ZE = At(function (e, t) {
    let n = vg(),
      r = `headlessui-description-${fa()}`,
      i = cn(t);
    $n(() => n.register(r), [r, n.register]);
    let a = e,
      o = { ref: i, ...n.props, id: r };
    return Xt({
      ourProps: o,
      theirProps: a,
      slot: n.slot || {},
      defaultTag: JE,
      name: n.name || "Description",
    });
  }),
  Cf = S.exports.createContext(() => {});
Cf.displayName = "StackContext";
var nd = ((e) => ((e[(e.Add = 0)] = "Add"), (e[(e.Remove = 1)] = "Remove"), e))(
  nd || {},
);
function eT() {
  return S.exports.useContext(Cf);
}
function tT({ children: e, onUpdate: t, type: n, element: r, enabled: i }) {
  let a = eT(),
    o = ft((...l) => {
      t == null || t(...l), a(...l);
    });
  return (
    $n(() => {
      let l = i === void 0 || i === !0;
      return (
        l && o(0, n, r),
        () => {
          l && o(1, n, r);
        }
      );
    }, [o, n, r, i]),
    rt.createElement(Cf.Provider, { value: o }, e)
  );
}
function nT() {
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) &&
      window.navigator.maxTouchPoints > 0)
  );
}
var rT = ((e) => (
    (e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e
  ))(rT || {}),
  iT = ((e) => ((e[(e.SetTitleId = 0)] = "SetTitleId"), e))(iT || {});
let aT = {
    [0](e, t) {
      return e.titleId === t.id ? e : { ...e, titleId: t.id };
    },
  },
  cs = S.exports.createContext(null);
cs.displayName = "DialogContext";
function Io(e) {
  let t = S.exports.useContext(cs);
  if (t === null) {
    let n = new Error(`<${e} /> is missing a parent <Dialog /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(n, Io), n);
  }
  return t;
}
function oT(e, t) {
  S.exports.useEffect(() => {
    var n;
    if (!t || !e) return;
    let r = Ao();
    function i(l, s, u) {
      let c = l.style.getPropertyValue(s);
      return (
        Object.assign(l.style, { [s]: u }),
        r.add(() => {
          Object.assign(l.style, { [s]: c });
        })
      );
    }
    let a = e.documentElement,
      o = ((n = e.defaultView) != null ? n : window).innerWidth - a.clientWidth;
    if ((i(a, "overflow", "hidden"), o > 0)) {
      let l = a.clientWidth - a.offsetWidth,
        s = o - l;
      i(a, "paddingRight", `${s}px`);
    }
    if (nT()) {
      let l = window.pageYOffset;
      i(a, "position", "fixed"),
        i(a, "marginTop", `-${l}px`),
        i(a, "width", "100%"),
        r.add(() => window.scrollTo(0, l));
    }
    return r.dispose;
  }, [e, t]);
}
function lT(e, t) {
  return tt(t.type, aT, e, t);
}
let sT = "div",
  uT = ss.RenderStrategy | ss.Static,
  cT = At(function (e, t) {
    let { open: n, onClose: r, initialFocus: i, __demoMode: a = !1, ...o } = e,
      [l, s] = S.exports.useState(0),
      u = Sf();
    n === void 0 &&
      u !== null &&
      (n = tt(u, { [ei.Open]: !0, [ei.Closed]: !1 }));
    let c = S.exports.useRef(new Set()),
      d = S.exports.useRef(null),
      p = cn(d, t),
      v = S.exports.useRef(null),
      y = $s(d),
      C = e.hasOwnProperty("open") || u !== null,
      k = e.hasOwnProperty("onClose");
    if (!C && !k)
      throw new Error(
        "You have to provide an `open` and an `onClose` prop to the `Dialog` component.",
      );
    if (!C)
      throw new Error(
        "You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.",
      );
    if (!k)
      throw new Error(
        "You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.",
      );
    if (typeof n != "boolean")
      throw new Error(
        `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${n}`,
      );
    if (typeof r != "function")
      throw new Error(
        `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${r}`,
      );
    let f = n ? 0 : 1,
      [h, g] = S.exports.useReducer(lT, {
        titleId: null,
        descriptionId: null,
        panelRef: S.exports.createRef(),
      }),
      T = ft(() => r(!1)),
      M = ft((Z) => g({ type: 0, id: Z })),
      w = da() ? (a ? !1 : f === 0) : !1,
      P = l > 1,
      b = S.exports.useContext(cs) !== null,
      _ = P ? "parent" : "leaf";
    BE(d, P ? w : !1),
      ME(
        () => {
          var Z, X;
          return [
            ...Array.from(
              (Z =
                y == null
                  ? void 0
                  : y.querySelectorAll("body > *, [data-headlessui-portal]")) !=
                null
                ? Z
                : [],
            ).filter(
              (R) =>
                !(
                  !(R instanceof HTMLElement) ||
                  R.contains(v.current) ||
                  (h.panelRef.current && R.contains(h.panelRef.current))
                ),
            ),
            (X = h.panelRef.current) != null ? X : d.current,
          ];
        },
        T,
        w && !P,
      ),
      kf(y == null ? void 0 : y.defaultView, "keydown", (Z) => {
        Z.defaultPrevented ||
          (Z.key === cg.Escape &&
            f === 0 &&
            (P || (Z.preventDefault(), Z.stopPropagation(), T())));
      }),
      oT(y, f === 0 && !b),
      S.exports.useEffect(() => {
        if (f !== 0 || !d.current) return;
        let Z = new IntersectionObserver((X) => {
          for (let R of X)
            R.boundingClientRect.x === 0 &&
              R.boundingClientRect.y === 0 &&
              R.boundingClientRect.width === 0 &&
              R.boundingClientRect.height === 0 &&
              T();
        });
        return Z.observe(d.current), () => Z.disconnect();
      }, [f, d, T]);
    let [I, G] = XE(),
      me = `headlessui-dialog-${fa()}`,
      fe = S.exports.useMemo(
        () => [{ dialogState: f, close: T, setTitleId: M }, h],
        [f, h, T, M],
      ),
      Ae = S.exports.useMemo(() => ({ open: f === 0 }), [f]),
      ge = {
        ref: p,
        id: me,
        role: "dialog",
        "aria-modal": f === 0 ? !0 : void 0,
        "aria-labelledby": h.titleId,
        "aria-describedby": I,
      };
    return rt.createElement(
      tT,
      {
        type: "Dialog",
        enabled: f === 0,
        element: d,
        onUpdate: ft((Z, X, R) => {
          X === "Dialog" &&
            tt(Z, {
              [nd.Add]() {
                c.current.add(R), s((W) => W + 1);
              },
              [nd.Remove]() {
                c.current.add(R), s((W) => W - 1);
              },
            });
        }),
      },
      m(ed, {
        force: !0,
        children: m(td, {
          children: m(cs.Provider, {
            value: fe,
            children: m(td.Group, {
              target: d,
              children: m(ed, {
                force: !1,
                children: m(G, {
                  slot: Ae,
                  name: "Dialog.Description",
                  children: m(Ra, {
                    initialFocus: i,
                    containers: c,
                    features: w
                      ? tt(_, {
                          parent: Ra.features.RestoreFocus,
                          leaf: Ra.features.All & ~Ra.features.FocusLock,
                        })
                      : Ra.features.None,
                    children: Xt({
                      ourProps: ge,
                      theirProps: o,
                      slot: Ae,
                      defaultTag: sT,
                      features: uT,
                      visible: f === 0,
                      name: "Dialog",
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
      m(Jc, { features: us.Hidden, ref: v }),
    );
  }),
  dT = "div",
  fT = At(function (e, t) {
    let [{ dialogState: n, close: r }] = Io("Dialog.Overlay"),
      i = cn(t),
      a = `headlessui-dialog-overlay-${fa()}`,
      o = ft((s) => {
        if (s.target === s.currentTarget) {
          if (_E(s.currentTarget)) return s.preventDefault();
          s.preventDefault(), s.stopPropagation(), r();
        }
      }),
      l = S.exports.useMemo(() => ({ open: n === 0 }), [n]);
    return Xt({
      ourProps: { ref: i, id: a, "aria-hidden": !0, onClick: o },
      theirProps: e,
      slot: l,
      defaultTag: dT,
      name: "Dialog.Overlay",
    });
  }),
  hT = "div",
  pT = At(function (e, t) {
    let [{ dialogState: n }, r] = Io("Dialog.Backdrop"),
      i = cn(t),
      a = `headlessui-dialog-backdrop-${fa()}`;
    S.exports.useEffect(() => {
      if (r.panelRef.current === null)
        throw new Error(
          "A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.",
        );
    }, [r.panelRef]);
    let o = S.exports.useMemo(() => ({ open: n === 0 }), [n]);
    return m(ed, {
      force: !0,
      children: m(td, {
        children: Xt({
          ourProps: { ref: i, id: a, "aria-hidden": !0 },
          theirProps: e,
          slot: o,
          defaultTag: hT,
          name: "Dialog.Backdrop",
        }),
      }),
    });
  }),
  mT = "div",
  vT = At(function (e, t) {
    let [{ dialogState: n }, r] = Io("Dialog.Panel"),
      i = cn(t, r.panelRef),
      a = `headlessui-dialog-panel-${fa()}`,
      o = S.exports.useMemo(() => ({ open: n === 0 }), [n]),
      l = ft((s) => {
        s.stopPropagation();
      });
    return Xt({
      ourProps: { ref: i, id: a, onClick: l },
      theirProps: e,
      slot: o,
      defaultTag: mT,
      name: "Dialog.Panel",
    });
  }),
  yT = "h2",
  gT = At(function (e, t) {
    let [{ dialogState: n, setTitleId: r }] = Io("Dialog.Title"),
      i = `headlessui-dialog-title-${fa()}`,
      a = cn(t);
    S.exports.useEffect(() => (r(i), () => r(null)), [i, r]);
    let o = S.exports.useMemo(() => ({ open: n === 0 }), [n]);
    return Xt({
      ourProps: { ref: a, id: i },
      theirProps: e,
      slot: o,
      defaultTag: yT,
      name: "Dialog.Title",
    });
  }),
  aa = Object.assign(cT, {
    Backdrop: pT,
    Panel: vT,
    Overlay: fT,
    Title: gT,
    Description: ZE,
  });
function wT(e) {
  let t = { called: !1 };
  return (...n) => {
    if (!t.called) return (t.called = !0), e(...n);
  };
}
function _u(e, ...t) {
  e && t.length > 0 && e.classList.add(...t);
}
function Lu(e, ...t) {
  e && t.length > 0 && e.classList.remove(...t);
}
var rd = ((e) => ((e.Ended = "ended"), (e.Cancelled = "cancelled"), e))(
  rd || {},
);
function xT(e, t) {
  let n = Ao();
  if (!e) return n.dispose;
  let { transitionDuration: r, transitionDelay: i } = getComputedStyle(e),
    [a, o] = [r, i].map((l) => {
      let [s = 0] = l
        .split(",")
        .filter(Boolean)
        .map((u) => (u.includes("ms") ? parseFloat(u) : parseFloat(u) * 1e3))
        .sort((u, c) => c - u);
      return s;
    });
  if (a + o !== 0) {
    let l = [];
    l.push(
      n.addEventListener(e, "transitionrun", (s) => {
        s.target === s.currentTarget &&
          (l.splice(0).forEach((u) => u()),
          l.push(
            n.addEventListener(e, "transitionend", (u) => {
              u.target === u.currentTarget &&
                (t("ended"), l.splice(0).forEach((c) => c()));
            }),
            n.addEventListener(e, "transitioncancel", (u) => {
              u.target === u.currentTarget &&
                (t("cancelled"), l.splice(0).forEach((c) => c()));
            }),
          ));
      }),
    );
  } else t("ended");
  return n.add(() => t("cancelled")), n.dispose;
}
function ST(e, t, n, r) {
  let i = n ? "enter" : "leave",
    a = Ao(),
    o = r !== void 0 ? wT(r) : () => {};
  i === "enter" && (e.removeAttribute("hidden"), (e.style.display = ""));
  let l = tt(i, { enter: () => t.enter, leave: () => t.leave }),
    s = tt(i, { enter: () => t.enterTo, leave: () => t.leaveTo }),
    u = tt(i, { enter: () => t.enterFrom, leave: () => t.leaveFrom });
  return (
    Lu(
      e,
      ...t.enter,
      ...t.enterTo,
      ...t.enterFrom,
      ...t.leave,
      ...t.leaveFrom,
      ...t.leaveTo,
      ...t.entered,
    ),
    _u(e, ...l, ...u),
    a.nextFrame(() => {
      Lu(e, ...u),
        _u(e, ...s),
        xT(
          e,
          (c) => (c === "ended" && (Lu(e, ...l), _u(e, ...t.entered)), o(c)),
        );
    }),
    a.dispose
  );
}
function kT({ container: e, direction: t, classes: n, onStart: r, onStop: i }) {
  let a = Is(),
    o = ag(),
    l = Rn(t);
  $n(() => {
    let s = Ao();
    o.add(s.dispose);
    let u = e.current;
    if (!!u && l.current !== "idle" && !!a.current)
      return (
        s.dispose(),
        r.current(l.current),
        s.add(
          ST(u, n.current, l.current === "enter", (c) => {
            s.dispose(),
              tt(c, {
                [rd.Ended]() {
                  i.current(l.current);
                },
                [rd.Cancelled]: () => {},
              });
          }),
        ),
        s.dispose
      );
  }, [t]);
}
function Pr(e = "") {
  return e.split(" ").filter((t) => t.trim().length > 1);
}
let js = S.exports.createContext(null);
js.displayName = "TransitionContext";
var CT = ((e) => ((e.Visible = "visible"), (e.Hidden = "hidden"), e))(CT || {});
function ET() {
  let e = S.exports.useContext(js);
  if (e === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.",
    );
  return e;
}
function TT() {
  let e = S.exports.useContext(zs);
  if (e === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.",
    );
  return e;
}
let zs = S.exports.createContext(null);
zs.displayName = "NestingContext";
function Hs(e) {
  return "children" in e
    ? Hs(e.children)
    : e.current
        .filter(({ el: t }) => t.current !== null)
        .filter(({ state: t }) => t === "visible").length > 0;
}
function yg(e, t) {
  let n = Rn(e),
    r = S.exports.useRef([]),
    i = Is(),
    a = ag(),
    o = ft((v, y = Mn.Hidden) => {
      let C = r.current.findIndex(({ el: k }) => k === v);
      C !== -1 &&
        (tt(y, {
          [Mn.Unmount]() {
            r.current.splice(C, 1);
          },
          [Mn.Hidden]() {
            r.current[C].state = "hidden";
          },
        }),
        a.microTask(() => {
          var k;
          !Hs(r) && i.current && ((k = n.current) == null || k.call(n));
        }));
    }),
    l = ft((v) => {
      let y = r.current.find(({ el: C }) => C === v);
      return (
        y
          ? y.state !== "visible" && (y.state = "visible")
          : r.current.push({ el: v, state: "visible" }),
        () => o(v, Mn.Unmount)
      );
    }),
    s = S.exports.useRef([]),
    u = S.exports.useRef(Promise.resolve()),
    c = S.exports.useRef({ enter: [], leave: [], idle: [] }),
    d = ft((v, y, C) => {
      s.current.splice(0),
        t &&
          (t.chains.current[y] = t.chains.current[y].filter(([k]) => k !== v)),
        t == null ||
          t.chains.current[y].push([
            v,
            new Promise((k) => {
              s.current.push(k);
            }),
          ]),
        t == null ||
          t.chains.current[y].push([
            v,
            new Promise((k) => {
              Promise.all(c.current[y].map(([f, h]) => h)).then(() => k());
            }),
          ]),
        y === "enter"
          ? (u.current = u.current
              .then(() => (t == null ? void 0 : t.wait.current))
              .then(() => C(y)))
          : C(y);
    }),
    p = ft((v, y, C) => {
      Promise.all(c.current[y].splice(0).map(([k, f]) => f))
        .then(() => {
          var k;
          (k = s.current.shift()) == null || k();
        })
        .then(() => C(y));
    });
  return S.exports.useMemo(
    () => ({
      children: r,
      register: l,
      unregister: o,
      onStart: d,
      onStop: p,
      wait: u,
      chains: c,
    }),
    [l, o, r, d, p, c, u],
  );
}
function PT() {}
let DT = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
function Np(e) {
  var t;
  let n = {};
  for (let r of DT) n[r] = (t = e[r]) != null ? t : PT;
  return n;
}
function bT(e) {
  let t = S.exports.useRef(Np(e));
  return (
    S.exports.useEffect(() => {
      t.current = Np(e);
    }, [e]),
    t
  );
}
let NT = "div",
  gg = ss.RenderStrategy,
  wg = At(function (e, t) {
    let {
        beforeEnter: n,
        afterEnter: r,
        beforeLeave: i,
        afterLeave: a,
        enter: o,
        enterFrom: l,
        enterTo: s,
        entered: u,
        leave: c,
        leaveFrom: d,
        leaveTo: p,
        ...v
      } = e,
      y = S.exports.useRef(null),
      C = cn(y, t),
      k = v.unmount ? Mn.Unmount : Mn.Hidden,
      { show: f, appear: h, initial: g } = ET(),
      [T, M] = S.exports.useState(f ? "visible" : "hidden"),
      w = TT(),
      { register: P, unregister: b } = w,
      _ = S.exports.useRef(null);
    S.exports.useEffect(() => P(y), [P, y]),
      S.exports.useEffect(() => {
        if (k === Mn.Hidden && !!y.current) {
          if (f && T !== "visible") {
            M("visible");
            return;
          }
          return tt(T, { hidden: () => b(y), visible: () => P(y) });
        }
      }, [T, y, P, b, f, k]);
    let I = Rn({
        enter: Pr(o),
        enterFrom: Pr(l),
        enterTo: Pr(s),
        entered: Pr(u),
        leave: Pr(c),
        leaveFrom: Pr(d),
        leaveTo: Pr(p),
      }),
      G = bT({ beforeEnter: n, afterEnter: r, beforeLeave: i, afterLeave: a }),
      me = da();
    S.exports.useEffect(() => {
      if (me && T === "visible" && y.current === null)
        throw new Error(
          "Did you forget to passthrough the `ref` to the actual DOM node?",
        );
    }, [y, T, me]);
    let fe = g && !h,
      Ae = (() =>
        !me || fe || _.current === f ? "idle" : f ? "enter" : "leave")(),
      ge = ft((B) =>
        tt(B, {
          enter: () => G.current.beforeEnter(),
          leave: () => G.current.beforeLeave(),
          idle: () => {},
        }),
      ),
      Z = ft((B) =>
        tt(B, {
          enter: () => G.current.afterEnter(),
          leave: () => G.current.afterLeave(),
          idle: () => {},
        }),
      ),
      X = yg(() => {
        M("hidden"), b(y);
      }, w);
    kT({
      container: y,
      classes: I,
      direction: Ae,
      onStart: Rn((B) => {
        X.onStart(y, B, ge);
      }),
      onStop: Rn((B) => {
        X.onStop(y, B, Z), B === "leave" && !Hs(X) && (M("hidden"), b(y));
      }),
    }),
      S.exports.useEffect(() => {
        !fe || (k === Mn.Hidden ? (_.current = null) : (_.current = f));
      }, [f, fe, T]);
    let R = v,
      W = { ref: C };
    return m(zs.Provider, {
      value: X,
      children: m(UE, {
        value: tt(T, { visible: ei.Open, hidden: ei.Closed }),
        children: Xt({
          ourProps: W,
          theirProps: R,
          defaultTag: NT,
          features: gg,
          visible: T === "visible",
          name: "Transition.Child",
        }),
      }),
    });
  }),
  id = At(function (e, t) {
    let { show: n, appear: r = !1, unmount: i, ...a } = e,
      o = S.exports.useRef(null),
      l = cn(o, t);
    da();
    let s = Sf();
    if (
      (n === void 0 &&
        s !== null &&
        (n = tt(s, { [ei.Open]: !0, [ei.Closed]: !1 })),
      ![!0, !1].includes(n))
    )
      throw new Error(
        "A <Transition /> is used but it is missing a `show={true | false}` prop.",
      );
    let [u, c] = S.exports.useState(n ? "visible" : "hidden"),
      d = yg(() => {
        c("hidden");
      }),
      [p, v] = S.exports.useState(!0),
      y = S.exports.useRef([n]);
    $n(() => {
      p !== !1 &&
        y.current[y.current.length - 1] !== n &&
        (y.current.push(n), v(!1));
    }, [y, n]);
    let C = S.exports.useMemo(
      () => ({ show: n, appear: r, initial: p }),
      [n, r, p],
    );
    S.exports.useEffect(() => {
      if (n) c("visible");
      else if (!Hs(d)) c("hidden");
      else {
        let f = o.current;
        if (!f) return;
        let h = f.getBoundingClientRect();
        h.x === 0 &&
          h.y === 0 &&
          h.width === 0 &&
          h.height === 0 &&
          c("hidden");
      }
    }, [n, d]);
    let k = { unmount: i };
    return m(zs.Provider, {
      value: d,
      children: m(js.Provider, {
        value: C,
        children: Xt({
          ourProps: {
            ...k,
            as: S.exports.Fragment,
            children: rt.createElement(wg, { ref: l, ...k, ...a }),
          },
          theirProps: {},
          defaultTag: S.exports.Fragment,
          features: gg,
          visible: u === "visible",
          name: "Transition",
        }),
      }),
    });
  }),
  MT = At(function (e, t) {
    let n = S.exports.useContext(js) !== null,
      r = Sf() !== null;
    return m(un, {
      children:
        !n && r
          ? rt.createElement(id, { ref: t, ...e })
          : rt.createElement(wg, { ref: t, ...e }),
    });
  }),
  Lr = Object.assign(id, { Child: MT, Root: id });
function OT({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        fillRule: "evenodd",
        d: "M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z",
        clipRule: "evenodd",
      }),
    ],
  });
}
const RT = S.exports.forwardRef(OT),
  _T = RT;
function LT({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
      }),
    ],
  });
}
const FT = S.exports.forwardRef(LT),
  UT = FT;
function AT({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
      }),
    ],
  });
}
const IT = S.exports.forwardRef(AT),
  xg = IT;
function $T({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ],
  });
}
const jT = S.exports.forwardRef($T),
  Sg = jT;
function zT({ title: e, titleId: t, ...n }, r) {
  return F("svg", {
    ...Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        ref: r,
        "aria-labelledby": t,
      },
      n,
    ),
    children: [
      e ? m("title", { id: t, children: e }) : null,
      m("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M6 18L18 6M6 6l12 12",
      }),
    ],
  });
}
const HT = S.exports.forwardRef(zT),
  WT = HT,
  BT = ({ children: e, open: t, setOpen: n }) =>
    m(Lr.Root, {
      show: t,
      as: S.exports.Fragment,
      children: F(aa, {
        as: "div",
        className: "relative z-10",
        onClose: n,
        children: [
          m(Lr.Child, {
            as: S.exports.Fragment,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: m("div", {
              className:
                "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
            }),
          }),
          m("div", {
            className: "fixed inset-0 z-10 w-screen overflow-y-auto",
            children: m("div", {
              className:
                "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
              children: m(Lr.Child, {
                as: S.exports.Fragment,
                enter: "ease-out duration-300",
                enterFrom:
                  "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                enterTo: "opacity-100 translate-y-0 sm:scale-100",
                leave: "ease-in duration-200",
                leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
                leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                children: m(aa.Panel, {
                  className:
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg",
                  children: e,
                }),
              }),
            }),
          }),
        ],
      }),
    }),
  QT = ng(),
  YT = ({ event: e, setClose: t }) => {
    const [n, r] = S.exports.useState(!1),
      i = () => {
        r(!1), t();
      },
      a = vf(),
      o = tE({
        mutationFn: (l) => QT.booking.Book({ ...l, start: l.start + "Z" }),
        onSuccess: async () => {
          r(!0), await a.invalidateQueries({ queryKey: ["bookableSlots"] });
        },
      });
    return m(BT, {
      open: !!e,
      setOpen: t,
      children:
        e &&
        m(un, {
          children: n
            ? m(qT, { event: e, onClose: i })
            : m(VT, { event: e, onClose: i, onConfirm: o.mutate }),
        }),
    });
  },
  VT = ({ event: e, onClose: t, onConfirm: n }) => {
    const [r, i] = S.exports.useState(""),
      [a, o] = S.exports.useState(""),
      l = !r || !a;
    return F(un, {
      children: [
        m("div", {
          className: "bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4",
          children: m("div", {
            className: "sm:flex sm:items-start",
            children: F("div", {
              className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full",
              children: [
                m(aa.Title, {
                  as: "h3",
                  className: "text-lg font-semibold leading-6 text-gray-900",
                  children: "Enter Details",
                }),
                F("div", {
                  className: "mt-4 w-full",
                  children: [
                    m(kg, { event: e }),
                    F("form", {
                      className: "space-y-4 mt-4",
                      children: [
                        F("div", {
                          children: [
                            m("label", {
                              htmlFor: "name",
                              className:
                                "block text-sm font-medium leading-6 text-gray-900",
                              children: "Name",
                            }),
                            m("div", {
                              className: "mt-2",
                              children: m("input", {
                                type: "text",
                                required: !0,
                                value: r,
                                onChange: (s) => i(s.target.value),
                                name: "name",
                                id: "name",
                                className:
                                  "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                placeholder: "John Smith",
                              }),
                            }),
                          ],
                        }),
                        F("div", {
                          children: [
                            m("label", {
                              htmlFor: "email",
                              className:
                                "block text-sm font-medium leading-6 text-gray-900",
                              children: "Email",
                            }),
                            m("div", {
                              className: "mt-2",
                              children: m("input", {
                                type: "email",
                                required: !0,
                                value: a,
                                onChange: (s) => o(s.target.value),
                                name: "email",
                                id: "email",
                                className:
                                  "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                placeholder: "you@example.com",
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        }),
        F("div", {
          className:
            "bg-gray-50 px-4 py-3 mt-4 sm:flex sm:flex-row-reverse sm:px-6",
          children: [
            m("button", {
              type: "button",
              disabled: l,
              className: `
            inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto
            ${l ? "opacity-50 cursor-not-allowed" : ""}
          `,
              onClick: () => n({ Email: a, start: e.start }),
              children: "Schedule Event",
            }),
            m("button", {
              type: "button",
              className:
                "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto",
              onClick: t,
              children: "Cancel",
            }),
          ],
        }),
      ],
    });
  },
  qT = ({ event: e, onClose: t }) =>
    F("div", {
      className: "px-4 pb-4 pt-5 sm:p-6",
      children: [
        F("div", {
          children: [
            m("div", {
              className:
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100",
              children: m(_T, {
                className: "h-6 w-6 text-green-600",
                "aria-hidden": "true",
              }),
            }),
            F("div", {
              className: "mt-3 flex flex-col items-center text-center sm:mt-5",
              children: [
                m(aa.Title, {
                  as: "h3",
                  className: "text-lg font-semibold leading-6 text-gray-900",
                  children: "You are scheduled",
                }),
                m("div", {
                  className: "mt-2",
                  children: m("p", {
                    className: "text-sm text-gray-500",
                    children:
                      "A calendar invitation has been sent to your email address.",
                  }),
                }),
                m("div", {
                  className:
                    "flex flex-col mt-4 border border-gray-300 rounded p-4 w-full",
                  children: m(kg, { event: e }),
                }),
              ],
            }),
          ],
        }),
        m("div", {
          className: "mt-5 sm:mt-6",
          children: m("button", {
            type: "button",
            className:
              "inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            onClick: t,
            children: "Close",
          }),
        }),
      ],
    }),
  kg = ({ event: e }) => {
    const t = new Date(e.start),
      n = new Date(e.end),
      r = uf({ start: t, end: n }),
      i = (r.hours || 0) + (r.minutes || 0) / 60 + "h",
      a =
        We(t, "HH:mm") +
        " - " +
        We(n, "HH:mm") +
        ", " +
        We(t, "EEEE, LLLL dd, yyyy");
    return F("ul", {
      className: "divide-y divide-gray-200 w-full",
      children: [
        F("li", {
          className: "flex items-center space-x-2 pb-2",
          children: [
            m(xg, { className: "h-5 w-5" }),
            " ",
            m("span", { className: "text-gray-500", children: a }),
          ],
        }),
        F("li", {
          className: "flex items-center space-x-2 pt-2",
          children: [
            m(Sg, { className: "h-5 w-5" }),
            " ",
            m("span", { className: "text-gray-500", children: i }),
          ],
        }),
      ],
    });
  };
function KT() {
  const { state: e, dispatch: t } = hC(),
    n = { state: e, dispatch: t };
  return F("div", {
    className: "p-4 h-[calc(100vh-80px)] overflow-hidden",
    children: [
      m(YT, {
        event: e.modalEvent,
        setClose: () => t({ type: "hideBookingModal" }),
      }),
      F("div", {
        className: "flex flex-col h-full border border-gray-300",
        children: [
          m(gC, { ...n }),
          m("div", {
            className: "isolate flex flex-auto flex-col overflow-auto bg-white",
            children: F("div", {
              style: { width: "165%" },
              className: "flex flex-none flex-col max-w-none md:max-w-full",
              children: [
                m(wC, { ...n }),
                F("div", {
                  className: "flex flex-auto",
                  children: [
                    m("div", {
                      className:
                        "sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100",
                    }),
                    F("div", {
                      className: "grid flex-auto grid-cols-1 grid-rows-1",
                      children: [
                        m(By, {}),
                        m(SC, {}),
                        F(kC, {
                          children: [
                            m(gE, {}),
                            m(wE, { ...n }),
                            m(SE, { displayedDays: e.displayedDays }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
const GT = () => {
    const e = window.location.pathname.includes("login");
    return m("header", {
      className: "bg-gray-900 text-white",
      children: F("nav", {
        className: "flex items-center justify-between p-6 lg:px-8",
        "aria-label": "Global",
        children: [
          m("div", {
            className: "flex flex-1",
            children: m("a", {
              href: "/frontend/",
              className: "-m-1.5 p-1.5",
              children: m("h2", {
                className:
                  "text-2xl font-bold leading-7 text-white tracking-tight",
                children: "Booking Calendar",
              }),
            }),
          }),
          !e &&
            m("div", {
              className: "flex flex-1 justify-end",
              children: F("a", {
                href: "/frontend/login",
                className: "text-sm font-semibold leading-6 text-white",
                children: [
                  "Admin ",
                  m("span", { "aria-hidden": "true", children: "\u2192" }),
                ],
              }),
            }),
        ],
      }),
    });
  },
  XT = async ({ request: e }) => {
    let t = await e.formData(),
      n = t.get("email"),
      r = t.get("password");
    return (
      console.log(n, r), yf.set("auth-token", "abc123"), oy("/frontend/admin")
    );
  },
  JT = () =>
    m("div", {
      className: "flex-1",
      children: F("div", {
        className:
          "flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8",
        children: [
          m("div", {
            className: "sm:mx-auto sm:w-full sm:max-w-sm",
            children: m("h2", {
              className:
                "mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900",
              children: "Sign in to your account",
            }),
          }),
          m("div", {
            className: "mt-10 sm:mx-auto sm:w-full sm:max-w-sm",
            children: F(xy, {
              className: "space-y-6",
              method: "post",
              children: [
                F("div", {
                  children: [
                    m("label", {
                      htmlFor: "email",
                      className:
                        "block text-sm font-medium leading-6 text-gray-900",
                      children: "Email address",
                    }),
                    m("div", {
                      className: "mt-2",
                      children: m("input", {
                        id: "email",
                        name: "email",
                        type: "email",
                        autoComplete: "email",
                        required: !0,
                        className:
                          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      }),
                    }),
                  ],
                }),
                F("div", {
                  children: [
                    F("div", {
                      className: "flex items-center justify-between",
                      children: [
                        m("label", {
                          htmlFor: "password",
                          className:
                            "block text-sm font-medium leading-6 text-gray-900",
                          children: "Password",
                        }),
                        m("div", {
                          className: "text-sm",
                          children: m("a", {
                            href: "#",
                            className:
                              "font-semibold text-indigo-600 hover:text-indigo-500",
                            children: "Forgot password?",
                          }),
                        }),
                      ],
                    }),
                    m("div", {
                      className: "mt-2",
                      children: m("input", {
                        id: "password",
                        name: "password",
                        type: "password",
                        autoComplete: "current-password",
                        required: !0,
                        className:
                          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      }),
                    }),
                  ],
                }),
                m("div", {
                  children: m("button", {
                    type: "submit",
                    className:
                      "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    children: "Sign in",
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
    }),
  Mp = [
    { name: "Calendar", href: "/frontend/admin", icon: xg },
    { name: "Availability", href: "/frontend/admin/availability", icon: Sg },
  ],
  Op = [{ name: "Log out", href: "/frontend/logout" }];
function cl(...e) {
  return e.filter(Boolean).join(" ");
}
const ZT = () => {
  const [e, t] = S.exports.useState(!1),
    n = (r) => window.location.pathname === r;
  return m(un, {
    children: F("div", {
      className: "w-full",
      children: [
        m(Lr.Root, {
          show: e,
          as: S.exports.Fragment,
          children: F(aa, {
            as: "div",
            className: "relative z-50 lg:hidden",
            onClose: t,
            children: [
              m(Lr.Child, {
                as: S.exports.Fragment,
                enter: "transition-opacity ease-linear duration-300",
                enterFrom: "opacity-0",
                enterTo: "opacity-100",
                leave: "transition-opacity ease-linear duration-300",
                leaveFrom: "opacity-100",
                leaveTo: "opacity-0",
                children: m("div", {
                  className: "fixed inset-0 bg-gray-900/80",
                }),
              }),
              m("div", {
                className: "fixed inset-0 flex",
                children: m(Lr.Child, {
                  as: S.exports.Fragment,
                  enter: "transition ease-in-out duration-300 transform",
                  enterFrom: "-translate-x-full",
                  enterTo: "translate-x-0",
                  leave: "transition ease-in-out duration-300 transform",
                  leaveFrom: "translate-x-0",
                  leaveTo: "-translate-x-full",
                  children: F(aa.Panel, {
                    className: "relative mr-16 flex w-full max-w-xs flex-1",
                    children: [
                      m(Lr.Child, {
                        as: S.exports.Fragment,
                        enter: "ease-in-out duration-300",
                        enterFrom: "opacity-0",
                        enterTo: "opacity-100",
                        leave: "ease-in-out duration-300",
                        leaveFrom: "opacity-100",
                        leaveTo: "opacity-0",
                        children: m("div", {
                          className:
                            "absolute left-full top-0 flex w-16 justify-center pt-5",
                          children: F("button", {
                            type: "button",
                            className: "-m-2.5 p-2.5",
                            onClick: () => t(!1),
                            children: [
                              m("span", {
                                className: "sr-only",
                                children: "Close sidebar",
                              }),
                              m(WT, {
                                className: "h-6 w-6 text-white",
                                "aria-hidden": "true",
                              }),
                            ],
                          }),
                        }),
                      }),
                      m("div", {
                        className:
                          "flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10",
                        children: F("nav", {
                          className: "flex flex-1 flex-col mt-4",
                          children: [
                            m("div", {
                              className:
                                "text-sm font-semibold leading-6 text-white",
                              children: "Admin Dashboard",
                            }),
                            F("ul", {
                              role: "list",
                              className: "flex flex-1 flex-col gap-y-7 mt-4",
                              children: [
                                m("li", {
                                  children: m("ul", {
                                    role: "list",
                                    className: "-mx-2 space-y-1",
                                    children: Mp.map((r) =>
                                      m(
                                        "li",
                                        {
                                          children: F("a", {
                                            href: r.href,
                                            className: cl(
                                              n(r.href)
                                                ? "bg-gray-800 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                            ),
                                            children: [
                                              m(r.icon, {
                                                className: "h-6 w-6 shrink-0",
                                                "aria-hidden": "true",
                                              }),
                                              r.name,
                                            ],
                                          }),
                                        },
                                        r.name,
                                      ),
                                    ),
                                  }),
                                }),
                                F("li", {
                                  children: [
                                    m("div", {
                                      className:
                                        "text-xs font-semibold leading-6 text-gray-400",
                                      children: "Your teams",
                                    }),
                                    m("ul", {
                                      role: "list",
                                      className: "-mx-2 mt-2 space-y-1",
                                      children: Op.map((r) =>
                                        m(
                                          "li",
                                          {
                                            children: m("a", {
                                              href: r.href,
                                              className: cl(
                                                "text-gray-400 hover:text-white hover:bg-gray-800",
                                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                              ),
                                              children: m("span", {
                                                className: "truncate",
                                                children: r.name,
                                              }),
                                            }),
                                          },
                                          r.name,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
        }),
        m("div", {
          className:
            "hidden lg:absolute lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
          children: F("div", {
            className:
              "flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6",
            children: [
              m("div", {
                className: "flex h-16 shrink-0 items-center",
                children: m("h2", {
                  className:
                    "text-2xl font-bold leading-7 text-white tracking-tight",
                  children: "Admin Dashboard",
                }),
              }),
              m("nav", {
                className: "flex flex-1 flex-col",
                children: F("ul", {
                  role: "list",
                  className: "flex flex-1 flex-col gap-y-7",
                  children: [
                    m("li", {
                      children: m("ul", {
                        role: "list",
                        className: "-mx-2 space-y-1",
                        children: Mp.map((r) =>
                          m(
                            "li",
                            {
                              children: F("a", {
                                href: r.href,
                                className: cl(
                                  n(r.href)
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                ),
                                children: [
                                  m(r.icon, {
                                    className: "h-6 w-6 shrink-0",
                                    "aria-hidden": "true",
                                  }),
                                  r.name,
                                ],
                              }),
                            },
                            r.name,
                          ),
                        ),
                      }),
                    }),
                    F("li", {
                      children: [
                        m("div", {
                          className:
                            "text-xs font-semibold leading-6 text-gray-400",
                          children: "Actions",
                        }),
                        m("ul", {
                          role: "list",
                          className: "-mx-2 mt-2 space-y-1",
                          children: Op.map((r) =>
                            m(
                              "li",
                              {
                                children: m("a", {
                                  href: r.href,
                                  className: cl(
                                    "text-gray-400 hover:text-white hover:underline",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  ),
                                  children: m("span", {
                                    className: "truncate",
                                    children: r.name,
                                  }),
                                }),
                              },
                              r.name,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
        F("div", {
          className:
            "sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden",
          children: [
            F("button", {
              type: "button",
              className: "-m-2.5 p-2.5 text-gray-400 lg:hidden",
              onClick: () => t(!0),
              children: [
                m("span", { className: "sr-only", children: "Open sidebar" }),
                m(UT, { className: "h-6 w-6", "aria-hidden": "true" }),
              ],
            }),
            m("div", {
              className: "flex-1 text-sm font-semibold leading-6 text-white",
              children: "Admin Dashboard",
            }),
          ],
        }),
        m("main", {
          className: "lg:pl-72 h-screen overflow-hidden",
          children: m(wy, {}),
        }),
      ],
    }),
  });
};
function Rp(...e) {
  return e.filter(Boolean).join(" ");
}
const eP = ({ state: e, dispatch: t }) => {
    const n = sC(),
      [r, i] = S.exports.useState(() => We(n, "MMM-yyyy"));
    let a = ra(r, "MMM-yyyy", new Date());
    const o = by({
        start: Cy(a, { weekStartsOn: 1 }),
        end: Ny(Dy(a), { weekStartsOn: 1 }),
      }),
      l = () => {
        const u = Zn(a, { months: -1 });
        i(We(u, "MMM-yyyy"));
      },
      s = () => {
        const u = Zn(a, { months: 1 });
        i(We(u, "MMM-yyyy"));
      };
    return (
      S.exports.useEffect(() => {
        i(We(e.displayedDay, "MMM-yyyy"));
      }, [e.displayedDay]),
      F("div", {
        className: "select-none",
        children: [
          F("div", {
            className: "flex items-center text-center text-gray-900",
            children: [
              m(ff, {
                className:
                  "h-5 w-5 flex flex-none items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer",
                onClick: l,
              }),
              m("p", {
                className: "flex-auto text-sm font-semibold",
                children: We(a, "MMMM yyyy"),
              }),
              m(hf, {
                className:
                  "h-5 w-5 flex flex-none items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer",
                onClick: s,
              }),
            ],
          }),
          m("div", {
            className:
              "mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500",
            children: [1, 2, 3, 4, 5, 6, 7].map((u, c) => {
              const d = ra(u.toString(), "i", new Date());
              return m(
                "div",
                { className: "font-semibold", children: We(d, "EEEEE") },
                c,
              );
            }),
          }),
          m("div", {
            className:
              "isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200",
            children: o.map((u, c) => {
              const d = ii(u, e.displayedDay),
                p = aC(u, a),
                v = oC(u);
              return m(
                "button",
                {
                  type: "button",
                  onClick: () => t({ type: "setDay", value: u }),
                  className: Rp(
                    "py-1.5 hover:bg-gray-100 focus:z-10",
                    p ? "bg-white" : "bg-gray-50",
                    d || (v && "font-semibold"),
                    d && "text-white",
                    !d && p && !v && "text-gray-900",
                    !d && !p && !v && "text-gray-400",
                    v && !d && "text-indigo-600",
                    c === 0 && "rounded-tl-lg",
                    c === 6 && "rounded-tr-lg",
                    c === o.length - 7 && "rounded-bl-lg",
                    c === o.length - 1 && "rounded-br-lg",
                  ),
                  children: m("time", {
                    dateTime: u.toISOString(),
                    className: Rp(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                      d && v && "bg-indigo-600",
                      d && !v && "bg-gray-900",
                    ),
                    children: We(u, "d"),
                  }),
                },
                c,
              );
            }),
          }),
        ],
      })
    );
  },
  tP = ({ state: e, dispatch: t }) =>
    F("header", {
      className:
        "flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50",
      children: [
        F("div", {
          children: [
            m("h1", {
              className: "text-base font-semibold leading-6 text-gray-900",
              children: m("time", {
                dateTime: e.displayedDay.toDateString(),
                children: We(e.displayedDay, "MMMM yyyy"),
              }),
            }),
            m("p", {
              className: "mt-1 text-sm text-gray-500",
              children: We(e.displayedDay, "cccc"),
            }),
          ],
        }),
        m("div", {
          className: "flex items-center",
          children: F("div", {
            className:
              "relative flex items-center rounded-md bg-white shadow-sm md:items-stretch",
            children: [
              F("button", {
                type: "button",
                onClick: () => t({ type: "goToPrevDay" }),
                className:
                  "flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50",
                children: [
                  m("span", { className: "sr-only", children: "Previous day" }),
                  m(ff, { className: "h-5 w-5", "aria-hidden": "true" }),
                ],
              }),
              m("button", {
                type: "button",
                onClick: () => t({ type: "goToToday" }),
                className:
                  "hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block",
                children: "Today",
              }),
              m("span", {
                className: "relative -mx-px h-5 w-px bg-gray-300 md:hidden",
              }),
              F("button", {
                type: "button",
                onClick: () => t({ type: "goToNextDay" }),
                className:
                  "flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50",
                children: [
                  m("span", { className: "sr-only", children: "Next day" }),
                  m(hf, { className: "h-5 w-5", "aria-hidden": "true" }),
                ],
              }),
            ],
          }),
        }),
      ],
    });
function nP(e, t) {
  switch (t.type) {
    case "setEvents":
      return { ...e, events: t.value };
    case "goToNextDay": {
      const n = Zn(e.displayedDay, { days: 1 });
      return { ...e, displayedDay: n };
    }
    case "goToPrevDay": {
      const n = cC(e.displayedDay, { days: 1 });
      return { ...e, displayedDay: n };
    }
    case "goToToday":
      return { ...e, displayedDay: new Date() };
    case "setDay":
      return { ...e, displayedDay: t.value };
  }
}
const rP = () => {
    const [e, t] = rt.useReducer(nP, { displayedDay: new Date(), events: [] });
    return { state: e, dispatch: t };
  },
  iP = ({ children: e }) =>
    m("ol", {
      className:
        "col-start-1 col-end-2 row-start-1 grid grid-cols-1 select-none",
      style: { gridTemplateRows: "1.75rem repeat(1440, 1.2px) auto" },
      children: e,
    }),
  aP = ({ displayedDay: e }) => {
    const { data: t } = Ls(yE()),
      n = S.exports.useMemo(
        () =>
          ((t == null ? void 0 : t.bookings) || []).filter((r) => {
            const i = new Date(r.start);
            return ii(i, e);
          }),
        [t, e],
      );
    return m(un, {
      children: n.map((r) => {
        const i = new Date(r.start),
          a = new Date(r.end),
          o = Os(i) * 60 + Rs(i),
          l = uf({ start: i, end: a }),
          s = (l.hours || 0) * 60 + (l.minutes || 0);
        return m(
          "li",
          {
            className: "relative mt-px flex",
            style: { gridRow: o + " / span " + s },
            children: m(oP, { event: r }),
          },
          r.Email + r.start,
        );
      }),
    });
  },
  oP = ({ event: e }) => {
    const t = new Date(e.start),
      n = ii(new Date(), t),
      r = t < new Date(),
      i = S.exports.useMemo(() => (r ? "gray" : n ? "pink" : "blue"), [n, r]);
    return F("div", {
      className: `
        group absolute inset-1 flex flex-col overflow-y-auto rounded-lg
        bg-${i}-50 p-2 text-xs leading-5
        hover:bg-${i}-100 cursor-pointer
      `,
      children: [
        m("p", {
          className: `order-1 font-semibold text-${i}-700`,
          children: e.Email,
        }),
        m("p", {
          className: `text-${i}-500 group-hover:text-${i}-700`,
          children: m("time", {
            dateTime: t.toString(),
            children: We(t, "HH:mm"),
          }),
        }),
      ],
    });
  },
  lP = () => {
    const { state: e, dispatch: t } = rP(),
      n = { state: e, dispatch: t };
    return F("div", {
      className: "flex flex-col h-screen",
      children: [
        m(tP, { ...n }),
        F("div", {
          className: "isolate flex flex-auto overflow-hidden bg-white",
          children: [
            m("div", {
              className: "flex flex-auto flex-col overflow-auto",
              children: F("div", {
                className: "flex w-full flex-auto",
                children: [
                  m("div", {
                    className: "w-14 flex-none bg-white ring-1 ring-gray-100",
                  }),
                  F("div", {
                    className: "grid flex-auto grid-cols-1 grid-rows-1",
                    children: [
                      m(By, {}),
                      F(iP, {
                        children: [
                          m(aP, { displayedDay: e.displayedDay }),
                          m(kE, { displayedDay: e.displayedDay }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            m("div", {
              className:
                "hidden w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10 md:block",
              children: m(eP, { ...n }),
            }),
          ],
        }),
      ],
    });
  },
  sP =
    (e) =>
    async ({ request: t }) => {
      const n = await t.json();
      return (
        await mE(n),
        await e.invalidateQueries({ queryKey: ["availability"] }),
        { ok: !0 }
      );
    },
  _p = () => {
    const e = Sy(),
      t = gy(),
      { data: n } = Ls(rg()),
      [r, i] = S.exports.useState([]);
    S.exports.useEffect(() => {
      !n || i(n);
    }, [n]);
    const a = (o, l) => {
      i((s) => [...s.slice(0, l), o, ...s.slice(l + 1, s.length)]);
    };
    return F("div", {
      className: "p-6",
      children: [
        m("h2", {
          className: "text-lg font-semibold leading-6 text-gray-900",
          children: "Weekly hours",
        }),
        F(xy, {
          method: "post",
          onSubmit: (o) => {
            o.preventDefault(),
              e(JSON.stringify(r), {
                method: "POST",
                encType: "application/json",
              });
          },
          children: [
            m("ul", {
              className: "space-y-2 mt-4",
              children: r.map((o, l) => {
                const s = ra((l + 1).toString(), "i", new Date()),
                  u = !!o.start || !!o.end;
                return F(
                  "li",
                  {
                    className: "flex items-center h-10",
                    children: [
                      m("div", {
                        className: "w-10",
                        children: m("input", {
                          checked: u,
                          onChange: (c) => {
                            const d = c.target.checked;
                            a(
                              {
                                ...o,
                                start: d ? "08:00" : void 0,
                                end: d ? "18:00" : void 0,
                              },
                              l,
                            );
                          },
                          type: "checkbox",
                          className:
                            "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
                        }),
                      }),
                      m("div", {
                        className: "w-14",
                        children: m("span", {
                          className: "font-semibold",
                          children: We(s, "EEE"),
                        }),
                      }),
                      m("div", {
                        className: "flex items-center space-x-2",
                        children: u
                          ? F(un, {
                              children: [
                                m("input", {
                                  type: "text",
                                  value: o.start,
                                  onChange: (c) => {
                                    const d = c.target.value;
                                    a({ ...o, start: d }, l);
                                  },
                                  required: !0,
                                  className:
                                    "block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                }),
                                m("span", { children: "-" }),
                                m("input", {
                                  type: "text",
                                  value: o.end,
                                  onChange: (c) => {
                                    const d = c.target.value;
                                    a({ ...o, end: d }, l);
                                  },
                                  required: !0,
                                  className:
                                    "block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                                }),
                              ],
                            })
                          : m("span", {
                              className: "text-gray-400",
                              children: "Unavailable",
                            }),
                      }),
                    ],
                  },
                  l,
                );
              }),
            }),
            t &&
              m("p", {
                className: "mt-4 text-sm text-red-600",
                id: "email-error",
                children: t.message,
              }),
            m("button", {
              type: "submit",
              className: `
            mt-4 inline-flex w-fit justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
          `,
              children: "Save",
            }),
          ],
        }),
      ],
    });
  },
  Cg = new AC({ defaultOptions: { queries: { staleTime: 1e3 * 10 } } }),
  uP = Ex([
    {
      id: "root",
      path: "frontend",
      children: [
        {
          path: "",
          element: F("div", {
            className: "flex flex-col h-screen",
            children: [m(GT, {}), m(wy, {})],
          }),
          children: [
            { index: !0, element: m(KT, {}) },
            { path: "login", action: XT, element: m(JT, {}) },
          ],
        },
        {
          path: "logout",
          loader() {
            return yf.remove("auth-token"), oy("/frontend/");
          },
        },
        {
          path: "admin",
          element: m(ZT, {}),
          children: [
            { index: !0, element: m(lP, {}) },
            {
              path: "availability",
              action: sP(Cg),
              element: m(_p, {}),
              errorElement: m(_p, {}),
            },
          ],
        },
      ],
    },
  ]);
function cP() {
  return m(HC, {
    client: Cg,
    children: m(_x, {
      router: uP,
      fallbackElement: m("p", { children: "Initial Load..." }),
    }),
  });
}
Fu.createRoot(document.getElementById("root")).render(m(cP, {}));
