import FN from '../common/fn.js'
import InitUi from '../html/initUi.js'
import RechargeBox from '../html/rechargeBox.js'
// 侧边栏表单输入内容
let SLIDEBAR_DATA = {
  old_password: '',
  new_password: '',

  phone: '',
  verify_code: '',
  verify_sign: '', // 验证码签名
  verify_timeout: '', // 验证码过期时间

  real_name: '',
  sf_id: ''
}

// 弹窗表单输入内容
let POPBOX_DATA = {
  account: '',
  password: '',

  phone: '',
  verify_code: '',
  verify_sign: '', // 验证码签名
  verify_timeout: '', // 验证码过期时间

  real_name: '',
  sf_id: ''
}

// 用户信息
let USER_DATA = {
  user_id: '',
  cp_id: '',
  name: '',
  password: '',
  phone: '',
  email: '',
  real_name_status: '',
  real_name_prompt: 0
}

window.GLOBAL_DATA = {
  slideBarInfo: Object.assign({}, SLIDEBAR_DATA),
  popboxInfo: Object.assign({}, POPBOX_DATA),
  userInfo: Object.assign({}, USER_DATA),
  status: {
    login_type: 0, // 登录类型  0 帐号登录， 1 手机登录
    register_type: 0, // 注册类型  0 帐号注册， 1 手机注册
    modify_type: 0, // 修改密码类型  0 旧密码 1 手机验证码 2 邮箱

    showType: '', // slideBar || popbox  表明当前展示的弹窗，便于提交时从哪个位置取数据
    tokens: {}
  },
  ajaxInfo: {
    login_notice: {}, // 登录成功需要展示的公告信息
    user_info: {} // 用户信息
  }
}

window.GLOBAL_API = {}

// 初始化弹窗输入信息
window.GLOBAL_API.initPopboxData = () => {
  window.GLOBAL_DATA.popboxInfo = Object.assign({}, POPBOX_DATA)
}

// 初始化侧边栏输入信息
window.GLOBAL_API.initSlideBarData = () => {
  window.GLOBAL_DATA.slideBarInfo = Object.assign({}, SLIDEBAR_DATA)
}

// 充值窗口
window.GLOBAL_API.getRechargeBox = RechargeBox

// 错误信息打印
window.GLOBAL_API.showMsg = txt => {
  let error = document.querySelector('.popbox-error')
  let container = error.querySelector('.popbox-container')
  container.innerText = txt || ''
  error.classList.add('show')
  setTimeout(() => {
    error.classList.remove('show')
  }, 1500)
}

// 窗口调整
// 调整弹窗，避免多个叠加的情况出现
window.GLOBAL_API.adjustPopbox = () => {
  let popboxs = [
    document.querySelector('.popbox-form'),
    document.querySelector('.popbox-verify'),
    document.querySelector('.popbox-notice')
  ]

  for (let i = popboxs.length - 1; i >= 0; i--) {
    if (popboxs[i].classList.contains('show')) {
      popboxs[i].style.display = 'block'
      for (let j = i - 1; j >= 0; j--) {
        if (popboxs[j].classList.contains('show')) {
          popboxs[j].style.display = 'none'
        }
      }
      break
    }
  }
}

// 直接响应flymeChangeAccount
window.GLOBAL_API.changeAccountBySdk = () => {
  window.SDKDATA.flymeChangeAccount.callback({
    statusCode: 0,
    status: '外部执行切换帐号'
  })

  window.GLOBAL_API.hidePopbox()
}


;(function() {
  // 1. 添加初始内容
  let uiNode = document.createElement('div')
  uiNode.id = 'ui'
  uiNode.innerHTML = InitUi.data
  document.body.appendChild(uiNode)

  // 2. 禁止整个视窗下拉滑动
  document.body.addEventListener('touchmove', e => {
    e.preventDefault()
  })

  // 3. 解决所有遮罩弹窗穿透, 以及加上点击弹窗阴影隐藏弹窗效果
  // 所有popbox下的overlay和popbox-close点击都可以隐藏当前弹窗
  let overlays = document.getElementsByClassName('overlay')
  FN.transformArray(overlays).forEach(item => {
    item.addEventListener('touchmove', e => {
      e.preventDefault()
    })

    item.addEventListener('click', e => {
      // if (e.target == item || e.target.classList.contains('popbox-close') || e.target.classList.contains('slide-bar-container')) {
      if (
        e.target.classList.contains('popbox-close') ||
        e.target.classList.contains('slide-bar-container')
      ) {
        let parentNode = FN.getParentNode(item, 'popbox')
        if (parentNode) {
          parentNode.classList.remove('show')
          window.GLOBAL_API.adjustPopbox()
        }
      }
      event.stopPropagation()
    })
  })
})()
