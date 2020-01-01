// 测试地址http://togame.iqiyi.com/togame/entry_h5?game_id=9026
FN.log('iqiyisdk.use.js')
let UrlParams = FN.getURLparams()
var isOnline = true
FN.log('Login---->>url_params', UrlParams)
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    var obj = {
      type: 'dataCount',
      msg: 'server'
    }
    window.top.postMessage(obj, '*')
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },

  login ({ token, data = {}, callback }) {
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))
    console.log('UrlParams', UrlParams)
    let deviceid = 'H5'
    let user_id = UrlParams.user_id
    let agent = UrlParams.agent
    let time = UrlParams.time
    let sign = UrlParams.sign
    let header = {agent, deviceid, user_id, time, sign} // 用于融合登录传递给后端,进行登录校验
    FN.log('header-header-header1111', header)
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        FN.log('header-header-header4', res)
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            status: res.msg
          }
          callback(cbData)
        }
      })
    } else {
      let cbData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(cbData)
    }
  },
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    let user_info = FN.getSession('FUSE_USER_INFO')
    let params = {
      game_id: FN.getSession('FUSE_CHANNEL_INFO').app_id,
      user_id: FN.getSession('FUSE_USER_INFO').user_id,
      server_id: data.serverId,
      money: data.amount / 100,
      order_id: data.order_id
    }
    params['extra_param'] = encodeURIComponent(params.order_id + '|' + user_info.game_id)
    let msg = makeString(params)
    console.log('msg------->>>>', msg)
    window.parent.postMessage(msg, 'http://togame.iqiyi.com')
  },
  createRole ({token, data = {}, callback}) {
    var obj = {
      type: 'dataCount',
      msg: 'role'
    }
    window.top.postMessage(obj, '*')
  },
  changeRole ({token, data = {}, callback}) {
    var obj = {
      type: 'dataCount',
      msg: 'start'
    }
    window.top.postMessage(obj, '*')
  }
}
function makeString (params) {
  let ps = []
  for (let v in params) {
    ps.push(v + '=' + params[v])
  }
  return ps.join('&')
}
// 断网重连
window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})
window.addEventListener('offline', function () {
  isOnline = false
})
