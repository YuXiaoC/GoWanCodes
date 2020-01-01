import FN from '../utility/fn'
import store from '../store'
function getCookie (name) {
  var strcookie = document.cookie// 获取cookie字符串
  var arrcookie = strcookie.split('; ')// 分割
  // 遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split('=')
    if (arr[0] == name) {
      return arr[1]
    }
  }
  return ''
}
const global = {
  fuseLogin (res, input) {
    window.FUSESDK.login({
      user_id: res.data.old_id, // 从客户端获取的用户id,方便排查问题。比如步步高
      phone: res.data.phone, // 用户电话号码
      is_bind_phone: res.data.phone ? 1 : 0, // 是否绑定手机号码  1 是  0 不是
      is_realname: res.data.real_name_status, // 是否实名    1 是  0 不是
      data: JSON.stringify({
        uid: res.data.old_id,
        time: res.data.timestamp,
        sign: res.data.sign
        // wx_user: getCookie('wxcdninfo') // 微信登录获取cookie存储的openid
      }),
      ext: JSON.stringify(window.__ext__ || {})
    })
      .then(res2 => {
        if (res2.code === 0) {
        // 保存融合登录用户信息
          FN.saveSession('FUSE_USER_INFO', res2.data)
        }
        if (window.SDKDATA.loginWay) {
          // 调用usesdk.js中的登录
          window.SDKDATA.login.callback(res)
        } else {
          window.SDKDATA.flymeChangeAccount.callback(res)
        }
      })
      .catch(e => {
        FN.log('loginError:', e)
      })
  },
  realName (res) {
    if (res.data.login_real_name_cfg) { // 登陆实名检测模式 0不提示/1强制完善/2不强制
      // 强制实名弹框弹出
      global.realName(res)
    } else {
      FN.hide()
      // 浮标出现
      if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
        let testServeList = FN.getSession('testServerArray')
        for (let i in testServeList) {
          if (FN.getSession('FUSE_CHANNEL_INFO').game_id === testServeList[i]) {
            return false
          } else {
            store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
          }
        }
      } else {
        store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
      }
    }
  },
  saveAccount (res, mode) {
    // ！！！ 保存登录记录
    let loginRecord = Array.isArray(FN.getLocal('LOGIN_RECORD'))
      ? FN.getLocal('LOGIN_RECORD')
      : []

    let newRecord = {
      account: res.data.name, // 用于展示的帐号名， 帐号登录时 account == name， 手机登录时 account == phone
      name: res.data.name, // 实际登录时都是使用 name 和 password
      password: res.data.password,
      user_id: res.data.user_id,
      unionid: res.data.unionid
    }
    // 如有重复数据就删除，重新添加到队首
    loginRecord.forEach((item, index) => {
      if (item.name === newRecord.name) {
        // 使用name判断才能确保唯一性
        loginRecord.splice(index, 1)
      }
    })

    loginRecord.unshift(newRecord)
    // 最多保存5条数据
    loginRecord = loginRecord.slice(0, 5)
    FN.saveLocal('LOGIN_RECORD', loginRecord) // 这里的登录记录用于登录框显示登录记录
    // 存储cookie
    var KEY = String(new Date().getTime()).substr(0, 10)

    let domain = window.location.host.replace(/^[^.]+\./, '')

    newRecord['mode'] = mode
    var cookieValue = FN.requestEncrypt(JSON.stringify(newRecord), KEY).e

    FN.cookie('zjwl_acc', cookieValue, {expires: 7, domain: domain})
    FN.cookie('zjwl_key', KEY, {expires: 7, domain: domain})
  }
}
export default global
