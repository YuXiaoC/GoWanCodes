require = (function(r, e, n) {
  function t(n, o) {
    function i(r) {
      return t(i.resolve(r))
    }
    function f(e) {
      return r[n][1][e] || e
    }
    if (!e[n]) {
      if (!r[n]) {
        var c = "function" == typeof require && require
        if (!o && c) return c(n, !0)
        if (u) return u(n, !0)
        var l = new Error("Cannot find module '" + n + "'")
        throw ((l.code = "MODULE_NOT_FOUND"), l)
      }
      i.resolve = f
      var a = (e[n] = new t.Module())
      r[n][0].call(a.exports, i, a, a.exports)
    }
    return e[n].exports
  }
  function o() {
    ;(this.bundle = t), (this.exports = {})
  }
  var u = "function" == typeof require && require
  ;(t.Module = o), (t.modules = r), (t.cache = e), (t.parent = u)
  for (var i = 0; i < n.length; i++) t(n[i])
  return t
})(
  {
    8: [
      function(require, module, exports) {
        function n(n) {
          document.documentElement.style.fontSize = n / 750 * 100 / 16 * 100 + "%"
        }
        function e() {
          var e = document.documentElement.clientWidth,
            t = document.documentElement.clientHeight
          n(e < t ? e : t)
        }
        function t() {
          90 == window.orientation || -90 == window.orientation
            ? (document.getElementById("tips").style.display = "block")
            : (document.getElementById("tips").style.display = "none")
        }
        window.addEventListener(
          "onorientationchange" in window ? "orientationchange" : "resize",
          t,
          !1
        ),
          window.addEventListener(
            "DOMContentLoaded",
            function() {
              e()
            },
            !1
          )
      },
      {}
    ]
  },
  {},
  [8]
)
