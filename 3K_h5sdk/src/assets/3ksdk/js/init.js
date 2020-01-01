//初始化 font-size
function setFontSize(k) {
  document.documentElement.style.fontSize = k / 750 * 100 / 16 * 100 + "%"
}

function initRem() {
  var W = document.documentElement.clientWidth
  var H = document.documentElement.clientHeight
  if (W < H) {
    setFontSize(W)
  } else {
    setFontSize(H)
  }
}
initRem()
function changeOrientation() {
  if (window.orientation == 90 || window.orientation == -90) {
    document.getElementById("tips").style.display = "block"
  } else {
    document.getElementById("tips").style.display = "none"
  }
}
window.addEventListener(
  "onorientationchange" in window ? "orientationchange" : "resize",
  changeOrientation,
  false
)
window.addEventListener(
  "DOMContentLoaded",
  () => {
    initRem()

    // 解决ios在qq浏览器和uc slide-bar不渲染的问题
    // document.getElementById('slide-bar').classList.remove('show')

    // setTimeout(() => {
    //     document.getElementById('slide-bar').style.transition = '0.3s ease'
    //     document.getElementById('slide-bar').style.webkitTransition = '0.3s ease'
    //     document.body.style.opacity = 1;
    // }, 400)
  },
  false
)
