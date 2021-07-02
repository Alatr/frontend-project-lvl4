/* eslint-disable */
let _rollbarConfig = {
  accessToken: '119359155be74a40a3d0ebe0973ee18f',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};
// Rollbar Snippet
!(function (r) {
  function e(n) {
    if (o[n]) return o[n].exports;
    const t = (o[n] = { exports: {}, id: n, loaded: !1 });
    return r[n].call(t.exports, t, t.exports, e), (t.loaded = !0), t.exports;
  }
  var o = {};
  return (e.m = r), (e.c = o), (e.p = ''), e(0);
})([
  function (r, e, o) {
    const n = o(1);
    const t = o(4);
    (_rollbarConfig = _rollbarConfig || {}),
      (_rollbarConfig.rollbarJsUrl =
        _rollbarConfig.rollbarJsUrl ||
        'https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.4.6/rollbar.min.js'),
      (_rollbarConfig.async = void 0 === _rollbarConfig.async || _rollbarConfig.async);
    const a = n.setupShim(window, _rollbarConfig);
    const l = t(_rollbarConfig);
    (window.rollbar = n.Rollbar),
      a.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, l);
  },
  function (r, e, o) {
    function n(r) {
      return function () {
        try {
          return r.apply(this, arguments);
        } catch (r) {
          try {
            console.error('[Rollbar]: Internal error', r);
          } catch (r) {}
        }
      };
    }
    function t(r, e) {
      (this.options = r), (this._rollbarOldOnError = null);
      const o = s++;
      (this.shimId = function () {
        return o;
      }),
        typeof window !== 'undefined' &&
          window._rollbarShims &&
          (window._rollbarShims[o] = { handler: e, messages: [] });
    }
    function a(r, e) {
      if (r) {
        const o = e.globalAlias || 'Rollbar';
        if (typeof r[o] === 'object') return r[o];
        (r._rollbarShims = {}), (r._rollbarWrappedError = null);
        const t = new p(e);
        return n(() => {
          e.captureUncaught &&
            ((t._rollbarOldOnError = r.onerror),
            i.captureUncaughtExceptions(r, t, !0),
            i.wrapGlobals(r, t, !0)),
            e.captureUnhandledRejections && i.captureUnhandledRejections(r, t, !0);
          const n = e.autoInstrument;
          return (
            e.enabled !== !1 &&
              (void 0 === n || n === !0 || (typeof n === 'object' && n.network)) &&
              r.addEventListener &&
              (r.addEventListener('load', t.captureLoad.bind(t)),
              r.addEventListener('DOMContentLoaded', t.captureDomContentLoaded.bind(t))),
            (r[o] = t),
            t
          );
        })();
      }
    }
    function l(r) {
      return n(function () {
        const e = this;
        const o = Array.prototype.slice.call(arguments, 0);
        const n = {
          shim: e,
          method: r,
          args: o,
          ts: new Date(),
        };
        window._rollbarShims[this.shimId()].messages.push(n);
      });
    }
    var i = o(2);
    var s = 0;
    const d = o(3);
    const c = function (r, e) {
      return new t(r, e);
    };
    var p = d.bind(null, c);
    (t.prototype.loadFull = function (r, e, o, t, a) {
      const l = function () {
        let e;
        if (void 0 === r._rollbarDidLoad) {
          e = new Error('rollbar.js did not load');
          for (var o, n, t, l, i = 0; (o = r._rollbarShims[i++]); ) {
            for (o = o.messages || []; (n = o.shift()); ) {
              for (t = n.args || [], i = 0; i < t.length; ++i) {
                if (((l = t[i]), typeof l === 'function')) {
                  l(e);
                  break;
                }
              }
            }
          }
        }
        typeof a === 'function' && a(e);
      };
      let i = !1;
      const s = e.createElement('script');
      const d = e.getElementsByTagName('script')[0];
      const c = d.parentNode;
      (s.crossOrigin = ''),
        (s.src = t.rollbarJsUrl),
        o || (s.async = !0),
        (s.onload = s.onreadystatechange =
          n(function () {
            if (
              !(
                i ||
                (this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete')
              )
            ) {
              s.onload = s.onreadystatechange = null;
              try {
                c.removeChild(s);
              } catch (r) {}
              (i = !0), l();
            }
          })),
        c.insertBefore(s, d);
    }),
      (t.prototype.wrap = function (r, e, o) {
        try {
          let n;
          if (
            ((n =
              typeof e === 'function'
                ? e
                : function () {
                    return e || {};
                  }),
            typeof r !== 'function')
          )
            return r;
          if (r._isWrap) return r;
          if (
            !r._rollbar_wrapped &&
            ((r._rollbar_wrapped = function () {
              o && typeof o === 'function' && o.apply(this, arguments);
              try {
                return r.apply(this, arguments);
              } catch (o) {
                let e = o;
                throw (
                  (e &&
                    (typeof e === 'string' && (e = new String(e)),
                    (e._rollbarContext = n() || {}),
                    (e._rollbarContext._wrappedSource = r.toString()),
                    (window._rollbarWrappedError = e)),
                  e)
                );
              }
            }),
            (r._rollbar_wrapped._isWrap = !0),
            r.hasOwnProperty)
          )
            for (const t in r) r.hasOwnProperty(t) && (r._rollbar_wrapped[t] = r[t]);
          return r._rollbar_wrapped;
        } catch (e) {
          return r;
        }
      });
    for (
      let u =
          'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad'.split(
            ','
          ),
        f = 0;
      f < u.length;
      ++f
    )
      t.prototype[u[f]] = l(u[f]);
    r.exports = { setupShim: a, Rollbar: p };
  },
  function (r, e) {
    function o(r, e, o) {
      if (r) {
        let t;
        typeof e._rollbarOldOnError === 'function'
          ? (t = e._rollbarOldOnError)
          : r.onerror && !r.onerror.belongsToShim && ((t = r.onerror), (e._rollbarOldOnError = t));
        const a = function () {
          const o = Array.prototype.slice.call(arguments, 0);
          n(r, e, t, o);
        };
        (a.belongsToShim = o), (r.onerror = a);
      }
    }
    function n(r, e, o, n) {
      r._rollbarWrappedError &&
        (n[4] || (n[4] = r._rollbarWrappedError),
        n[5] || (n[5] = r._rollbarWrappedError._rollbarContext),
        (r._rollbarWrappedError = null)),
        e.handleUncaughtException.apply(e, n),
        o && o.apply(r, n);
    }
    function t(r, e, o) {
      if (r) {
        typeof r._rollbarURH === 'function' &&
          r._rollbarURH.belongsToShim &&
          r.removeEventListener('unhandledrejection', r._rollbarURH);
        const n = function (r) {
          let o;
          let n;
          let t;
          try {
            o = r.reason;
          } catch (r) {
            o = void 0;
          }
          try {
            n = r.promise;
          } catch (r) {
            n = '[unhandledrejection] error getting `promise` from event';
          }
          try {
            (t = r.detail), !o && t && ((o = t.reason), (n = t.promise));
          } catch (r) {
            t = '[unhandledrejection] error getting `detail` from event';
          }
          o || (o = '[unhandledrejection] error getting `reason` from event'),
            e && e.handleUnhandledRejection && e.handleUnhandledRejection(o, n);
        };
        (n.belongsToShim = o), (r._rollbarURH = n), r.addEventListener('unhandledrejection', n);
      }
    }
    function a(r, e, o) {
      if (r) {
        let n;
        let t;
        const a =
          'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(
            ','
          );
        for (n = 0; n < a.length; ++n)
          (t = a[n]), r[t] && r[t].prototype && l(e, r[t].prototype, o);
      }
    }
    function l(r, e, o) {
      if (e.hasOwnProperty && e.hasOwnProperty('addEventListener')) {
        for (var n = e.addEventListener; n._rollbarOldAdd && n.belongsToShim; )
          n = n._rollbarOldAdd;
        const t = function (e, o, t) {
          n.call(this, e, r.wrap(o), t);
        };
        (t._rollbarOldAdd = n), (t.belongsToShim = o), (e.addEventListener = t);
        for (var a = e.removeEventListener; a._rollbarOldRemove && a.belongsToShim; )
          a = a._rollbarOldRemove;
        const l = function (r, e, o) {
          a.call(this, r, (e && e._rollbar_wrapped) || e, o);
        };
        (l._rollbarOldRemove = a), (l.belongsToShim = o), (e.removeEventListener = l);
      }
    }
    r.exports = {
      captureUncaughtExceptions: o,
      captureUnhandledRejections: t,
      wrapGlobals: a,
    };
  },
  function (r, e) {
    function o(r, e) {
      (this.impl = r(e, this)), (this.options = e), n(o.prototype);
    }
    function n(r) {
      for (
        let e = function (r) {
            return function () {
              const e = Array.prototype.slice.call(arguments, 0);
              if (this.impl[r]) return this.impl[r].apply(this.impl, e);
            };
          },
          o =
            'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad'.split(
              ','
            ),
          n = 0;
        n < o.length;
        n++
      )
        r[o[n]] = e(o[n]);
    }
    (o.prototype._swapAndProcessMessages = function (r, e) {
      this.impl = r(this.options);
      for (var o, n, t; (o = e.shift()); ) {
        (n = o.method),
          (t = o.args),
          this[n] &&
            typeof this[n] === 'function' &&
            (n === 'captureDomContentLoaded' || n === 'captureLoad'
              ? this[n].apply(this, [t[0], o.ts])
              : this[n].apply(this, t));
      }
      return this;
    }),
      (r.exports = o);
  },
  function (r, e) {
    r.exports = function (r) {
      return function (e) {
        if (!e && !window._rollbarInitialized) {
          r = r || {};
          for (
            var o,
              n,
              t = r.globalAlias || 'Rollbar',
              a = window.rollbar,
              l = function (r) {
                return new a(r);
              },
              i = 0;
            (o = window._rollbarShims[i++]);

          )
            n || (n = o.handler), o.handler._swapAndProcessMessages(l, o.messages);
          (window[t] = n), (window._rollbarInitialized = !0);
        }
      };
    };
  },
]);
