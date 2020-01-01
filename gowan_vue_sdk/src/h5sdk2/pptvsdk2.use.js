import md5 from 'blueimp-md5'
import Api from 'api-mock-js'
// 游戏测试地址http://m.g.pptv.com/game_list/h5detail/?url=http://game.g.pptv.com/go?gid=qgcj_h5
// Api.config({
// useMock: true,
// dataType: 'jsonp',
// urlModel: 1
// })
FN.log('pptvsdk.use.js')
var event = ''
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    let params = FN.getURLparams() // 获取链接参数
    FN.log('Login---->>url_params', params)
    let auth = params.auth
    let sign = params.sign
    let deviceid = 'H5'
    let header = {deviceid, auth, sign} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
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
  // 支付
  recharge ({token, data = {}, callback}) {
    console.log('recharge支付信息data', data)
    window.top.location.href = data.ext.pay_url
  },
  createRole ({token, data = {}, callback}) {
    let key = FN.getSession('FUSE_USER_INFO').ext.login_key
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    let role_info = {
      event: 2,
      gid: channelInfo.app_id,
      platform: 'pptv',
      rolename: data.role_name,
      sid: data.server_id,
      time: Date.parse(new Date()) / 1000,
      userid: data.user_id
    }
    role_info['sign'] = makeSign(role_info, key)
    ajaxRequest('/', role_info)
  },
  changeRole ({token, data = {}, callback}) {
    // FN.log('changeRole', data)
    let key = FN.getSession('FUSE_USER_INFO').ext.login_key
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    let role_info = {
      event: 1,
      gid: channelInfo.app_id,
      platform: 'pptv',
      rolename: data.role_name,
      sid: data.server_id,
      time: Date.parse(new Date()) / 1000,
      userid: data.user_id
    }
    role_info['sign'] = makeSign(role_info, key)
    ajaxRequest('/', role_info)
  }
}

function ajaxRequest (url, data) {
  console.log('进入了ajaxRequest方法')
  Api.require(url, data, {
    methods: 'GET',
    dataType: 'jsonp',
    urlModel: 1,
    header: {
      // 'Content-type': 'application/x-www-form-urlencoded'
    },
    domain: 'http://game.g.pptv.com/api/stat/notify_start_game.php'
  }).then((res) => {
    console.log(' Api.require', res)
  })
}
function makeSign (params, key) {
  let ps = []
  for (let v in params) {
    ps.push(v + '=' + encodeURIComponent(params[v]))
  }
  return md5(ps.join('&') + key).toLowerCase()
}
