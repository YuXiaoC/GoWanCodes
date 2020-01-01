import FN from '../common/fn.js'
import BScroll from '../common/better-scroll.js'
import SlideBar from '../html/slideBar.js'

// 侧边栏控制
function slideBarControl() {
  let slideBar = document.getElementById('slide-bar')

  // 侧边栏滚动
  const options = {
    scrollY: true, // 因为scrollY默认为true，其实可以省略
    click: true
  }

  let scroll = new BScroll(document.querySelector('.slide-bar-content'), options)

  // 侧边栏选项显示隐藏
  let optionTitles = document.querySelectorAll('#slide-bar .option-title')
  let optionItem = document.querySelectorAll('#slide-bar .option-item')
  FN.transformArray(optionTitles).forEach(item => {
    item.addEventListener('click', e => {
      let targetClassList = item.parentNode.classList
      if (targetClassList.contains('active')) {
        targetClassList.remove('active')
      } else {
        // 收起所有下拉
        FN.transformArray(optionItem).forEach(item => {
          item.classList.remove('active')
        })
        targetClassList.add('active')
      }
    })
  })

  // 解决侧边栏中input在聚焦时安卓键盘挡住的问题
  if (FN.OS.isAndroid) {
    let slideBarContent = document.querySelector('.slide-bar-content')
    let slideBarContentWrap = document.querySelector('.slide-bar-content-wrap')
    let inputs = slideBarContent.querySelectorAll('input')

    let fullHeight = window.innerHeight
    let focusInput = null
    let nowOri = window.orientation
    slideBarContent.style.height = window.innerHeight + 'px'
    window.addEventListener('resize', () => {
      if (nowOri != window.orientation) {
        nowOri = window.orientation
      } else if (nowOri == 0) {
        if (window.innerHeight < fullHeight) {
          if (focusInput) {
            slideBarContentWrap.style.marginTop =
              -focusInput.getBoundingClientRect().top + window.innerHeight / 2 + 'px'
          }
        } else {
          slideBarContentWrap.style.marginTop = 0
        }
      }
    })
    let isFocusSomeOne = false
    FN.transformArray(inputs).forEach(item => {
      item.addEventListener('focus', e => {
        focusInput = e.target
      })
      item.addEventListener('blur', e => {
        focusInput = null
      })
    })
  }

  // 侧边栏输入数据保存
  let slideBarInput = document.querySelectorAll('#slide-bar input')
  FN.transformArray(slideBarInput).forEach(item => {
    item.addEventListener('change', e => {
      if (item.name) {
        window.GLOBAL_DATA.slideBarInfo[item.name] = item.value.replace(/\s/g, '')
      }
    })
  })
}

window.GLOBAL_API.initSlideBar = () => {
  let container = document.querySelector('#slide-bar .popbox-container')
  container.innerHTML = SlideBar(FN.getSession('USER_INFO'))
  slideBarControl()
  window.GLOBAL_API.initSlideBarData()
}

// 可传参数type，显示默认一个下拉    | 1 | 2 | 3
window.GLOBAL_API.showSlideBar = type => {
  if (typeof type != 'undefined') {
    document.querySelectorAll('#slide-bar .option-item')[type - 1].classList.add('active')
  }
  window.GLOBAL_API.hidePopbox()
  document.getElementById('slide-bar').classList.add('show')
  window.GLOBAL_DATA.status.showType = 'slideBar'
}
window.GLOBAL_API.hideSlideBar = () => {
  document.getElementById('slide-bar').classList.remove('show')
}

// 浮标初始化
;(() => {
  let floatBall = document.getElementById('float-ball')

  FN.startDrag(floatBall, floatBall) // 开始拖动效果
  floatBall.addEventListener('click', () => {
    // alert(!FN.startDrag.params.hasMove)
    if (!FN.startDrag.params.hasMove) {
      window.GLOBAL_API.showSlideBar()
      // alert(slideBar.classList)
    }
  })
})()

window.GLOBAL_API.showFloatBall = () => {
  // 侧边栏显示隐藏
  let floatBall = document.getElementById('float-ball')
  // let slideBar = document.getElementById('slide-bar')

  let floatLocation = FN.getSession('SDK_INIT_INFO').setting.floatLocation

  if (floatLocation) {
    let i = '',
      o = ''
    switch (floatLocation) {
      case 0:
        ;(i = '0.2rem'), (o = '1rem')
        break
      case 1:
        ;(i = '0.2rem'), (o = 'calc(50% - 0.4rem)')
        break
      case 2:
        ;(i = '0.2rem'), (o = 'calc(100% - 1.8rem)')
        break
      case 3:
        ;(i = '6.5rem'), (o = '1rem')
        break
      case 4:
        ;(i = '6.5rem'), (o = 'calc(50% - 0.4rem)')
        break
      case 5:
        ;(i = '6.5rem'), (o = 'calc(100% - 1.8rem)')
        break
      default:
    }
    ;(floatBall.style.left = i), (floatBall.style.top = o)
  }

  floatBall.classList = 'show'
  FN.floatBallAutoAdjust(floatBall)

  // window.GLOBAL_API.initSlideBar()
}

window.GLOBAL_API.hideFloatBall = () => {
  document.getElementById('float-ball').classList.remove('show')
}
