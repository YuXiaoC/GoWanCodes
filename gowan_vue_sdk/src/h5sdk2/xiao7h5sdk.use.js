/* 测试：需要下载一个测试的App来进行测试。。。。
    英雄训练师：
    */
FN.log('xiao7h5sdk.use.js')
var xqhgame = null
// 请求地址
var yisdk_protocol = window.location.protocol
var yisdk_host = window.location.host
var yisdk_url = ''
if (yisdk_host.indexOf('gowanme') >= 0) {
  yisdk_url = yisdk_protocol + '//yisdk-api.gowanme.com/'
} else {
  yisdk_url = yisdk_protocol + '//yisdk-api.gowan8.com/'
}

window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
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
    let Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    let stime = Params.stime
    let ticket = Params.ticket
    let game_key = Params.game_key
    let sign = Params.sign
    let header = {
      stime,
      ticket,
      sign
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          xqhgame = new xqhGame()

          res.data.game_key = game_key
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          callback({
            statusCode: 0,
            loginParams: res.data
          })
          window.__ext__ = res.data
        } else {
          callback({
            statusCode: res.code,
            status: res.msg
          })
        }
      })
    } else {
      callback({
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      })
    }
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)

    FN.log('paydata', data.ext)
    xqhgame.pay({'pay_obj': data.ext,
      complete: function (ret) {
        FN.log('recharge_ret', ret)
      }})

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  // 支付透传参数
  getEXT (data) {
    FN.log('下单信息', data)
    let userInfo = FN.getSession('FUSE_USER_INFO')
    let game_key = userInfo.game_key
    let user_id = userInfo.user_id

    window.__payData__ = {
      description: data.productName ? data.productName : data.chargeDesc,
      game_area: data.serverId,
      game_group: '',
      game_key: game_key,
      game_level: data.roleLevel,
      game_role_id: data.roleId,
      notify_id: -1,
      subject: data.productName ? data.productName : data.chargeDesc,
      user_id: user_id
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
  // 创建角色
  createRole ({token, data = {}, callback}) {
    FN.log('创建角色', data)
    FN.log('FUSE_USER_INFO', FN.getSession('FUSE_USER_INFO'))
    let userInfo = FN.getSession('FUSE_USER_INFO')
    let game_id = userInfo.ext.game_id
    let game_key = userInfo.game_key
    let user_id = userInfo.user_id

    var ajaxData = {
      'game_key': game_key, // 游戏的 game_key
      'user_id': user_id, // 小 7 游戏中心提供的用户的唯一标识
      'role_name': data.role_name, // 用户设置的角色名称
      'game_area': data.server_id // 用户所在的区服信息
    }

    var ajax_data = Pajax('fuse:logind', ajaxData, {
      domain: yisdk_url + '?ct=api_extend&ac=role_login&channel=xiao7h5&zjwl_gid=' + game_id + '&is_jsdk=1'
    })
    ajax_data.then(function (data) {
      FN.log('ajax_data', data)

      ajaxData.role_sign = data.data.sign
      ajaxData.complete = function (ret) {
        FN.log('createRole_ret', ret)
      }
      FN.log('ajaxData', ajaxData)

      xqhgame.game_role_callback(ajaxData)
    })
  }
}

// 内部通讯AJAX函数
// api-mock-js
const Pajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    let newObj = { ...obj }

    FN.log(`${arg[0]}(input)`, arg[1])
    return {
      ...obj
    }
  }
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        FN.log('FN.ajax error:', e)
      })
  })
}
