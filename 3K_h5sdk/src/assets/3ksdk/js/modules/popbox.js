import FN from '../common/fn.js'
import Popbox from '../html/popbox.js'

// overlay默认点击不关闭，可通过绑定该事件来实现
let currentOverlay = null
function closeByOverlay(e) {
  if (e.target == currentOverlay) {
    let parentNode = FN.getParentNode(e.target, 'popbox')
    if (parentNode) {
      parentNode.classList.remove('show')
      window.GLOBAL_API.adjustPopbox()
    }
    e.target.removeEventListener('click', closeByOverlay)
    parentNode.getElementsByClassName('popbox-container')[0].innerHTML = ''
  }
}

// console.log(window)

// 显示弹窗
// type           'form'           | 'verify' | 'notice'
// id    1 2 3 4 5 6 7 8 9 10 11 12|   1 2    |   1 2
window.GLOBAL_API.showPopbox = ({
  type,
  id,
  data = {},
  clean = false,
  close = true
}) => {
  // 初始化弹窗输入信息
  window.GLOBAL_API.initPopboxData()
  window.GLOBAL_DATA.status.showType = 'popbox'

  let popbox = document.querySelector('.popbox-' + type)
  let container = popbox.getElementsByClassName('popbox-container')[0]

  // close　表示是否允许点击遮罩关闭弹窗
  // 20180417版本改为默认所有弹窗可关闭
  // if (close) {
  if (true) {
    let overlay = popbox.getElementsByClassName('overlay')[0]
    currentOverlay = overlay
    overlay.addEventListener('click', closeByOverlay)
  }

  container.innerHTML = Popbox({ type, id, data })
  let inputList = container.querySelectorAll('input')
  FN.transformArray(inputList).forEach(item => {
    item.addEventListener('change', e => {
      if (item.name) {
        window.GLOBAL_DATA.popboxInfo[item.name] = item.value.replace(/\s/g, '')
      }
    })
  })

  if (type == 'form' && (id == 11 || id == 12)) {
    let content = container.getElementsByClassName('popbox-content')[0]
    let tabs = container.querySelectorAll('.tab')
    tabs[0].addEventListener('click', () => {
      content.classList.add('use-account')
      content.classList.remove('use-phone')
    })
    tabs[1].addEventListener('click', () => {
      content.classList.add('use-phone')
      content.classList.remove('use-account')
    })
  }
  if (clean) window.GLOBAL_API.hidePopbox()

  // 阅读协议js控制
  if (type == 'form') {
    let readProtocol = container.querySelector('.read-protocol')
    if (readProtocol) {
      readProtocol.addEventListener('click', () => {
        if (readProtocol.classList.contains('active')) {
          readProtocol.classList.remove('active')
        } else {
          readProtocol.classList.add('active')
        }
      })
    }
  }

  // 公告倒计时控制
  if (type == 'notice' && id == '1') {
    let btn = container.querySelector('.btn-i-know')
    let getContent = count => `
              <a href="javascript:;" class="btn btn-big btn-i-know disabled">
                  <span>我知道了(${count}s)</span>
              </a>
          `
    if (btn) {
      let btnParent = btn.parentNode
      let temp = btnParent.innerHTML

      let count = 3
      btnParent.innerHTML = getContent(count)
      let intervalId = setInterval(() => {
        count--
        if (count < 0) {
          clearInterval(intervalId)
          btnParent.innerHTML = temp
          return
        }
        btnParent.innerHTML = getContent(count)
      }, 1000)
    }
  }

  // 登录记录控制
  if (type == 'form' && (id == '1' || id == '2')) {
    let showRecord = document.getElementsByClassName('show-record')[0]
    let logingRecordList = document.getElementsByClassName(
      'login-record-list'
    )[0]

    if (showRecord) {
      // alert(222)
      showRecord.addEventListener('click', () => {
        if (showRecord.classList.contains('active')) {
          showRecord.classList.remove('active')
          logingRecordList.classList.remove('show')
        } else {
          showRecord.classList.add('active')
          logingRecordList.classList.add('show')
        }
      })
    }

    // 切换帐号时，会自动填写当前用户帐号密码
    let userInfo = FN.getSession('USER_INFO')
    window.GLOBAL_DATA.popboxInfo.account = userInfo.name
    window.GLOBAL_DATA.popboxInfo.password = userInfo.password
  }

  popbox.classList.add('show')
  window.GLOBAL_API.adjustPopbox()

  // 生成随机帐号
  if (type == 'form' && id == '11') {
    let tempAccount = FN.getRandomChar(1, 'string') + FN.getRandomChar(10)
    let tempPassword = FN.getRandomChar(12)
    let account = container.querySelector('[name="account"]')
    account.value = tempAccount
    window.GLOBAL_DATA.popboxInfo.account = tempAccount

    let password = container.querySelector('[name="password"]')
    password.value = tempPassword
    window.GLOBAL_DATA.popboxInfo.password = tempPassword
  }
}
//隐藏弹框
window.GLOBAL_API.hidePopbox = () => {
  let popboxs = document.getElementsByClassName('popbox')

  FN.transformArray(popboxs).forEach(item => {
    item.classList.remove('show')
    // 对于登录框和注册框需要情况内容，否则会因为点击穿透造成多次登录
    if (item.classList.contains('popbox-form')) {
      setTimeout(() => {
        let container = item.getElementsByClassName('popbox-container')[0]
        if (!item.classList.contains('show')) {
          container.innerHTML = ''
        }
      }, 300)
    }
  })
}
