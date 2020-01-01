// 测试地址 http://wan.sogou.com/html/h5game/play/885/index.html

FN.log('sogousdk.use.js')

var isOnline = true

var sg_sdk = null

// 判断渠道js是否初始化

window.initSgsdk = function () {
  if (sg_sdk === null) {
    sg_sdk = new SGGAMESDK()
  }
}

let UrlParmas = FN.getURLparams()

let channel_info = FN.getSession('FUSE_CHANNEL_INFO')

console.log('UrlParmas', UrlParmas)

window.FUSESDKAPI = {

  init ({token, data = {}, callback}) {
    let cbData = {

      statusCode: 0,

      status: '初始化成功',

      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)

    }

    callback(cbData)
  },

  login ({token, data = {}, callback}) {
    // 推送登录信息

    let loginParams = {

      platform: 'sogo',

      uid: UrlParmas.uid,

      gid: UrlParmas.gid,

      sid: UrlParmas.sid,

      guest: UrlParmas.guest,

      mobile: UrlParmas.mobile,

      adult: UrlParmas.adult,

      client: UrlParmas.client,

      time: UrlParmas.time,

      auth: UrlParmas.auth,

      yisdk_param: UrlParmas.yisdk_param,

      ext_param: UrlParmas.ext_param,

      deviceid: 'H5'

    }

    let header = {...loginParams}

    console.log('header--header', header)

    console.log('header--header2222', loginParams)

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

            loginParams: res.msg

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

    initSgsdk()

    let payData = {

      gid: parseInt(UrlParmas.gid),

      sid: parseInt(data.serverId),

      money: parseInt(data.amount), // 单位是分

      product_name: data.productName,

      coin: 0,

      expire_time: '',

      uid: UrlParmas.uid,

      role: data.roleName,

      sname: data.serverName,

      extra: data.ext.extra

    }

    sg_sdk.pay(payData)

    console.log('payData', payData)
  },

  createRole ({token, data = {}, callback}) {
    FN.log('createRole创角', data)

    initSgsdk()

    let log_data = {

      uid: UrlParmas.uid,

      gid: UrlParmas.gid,

      sid: data.server_id,

      act: 'create',

      role: data.role_name,

      sname: data.server_name

    }

    sg_sdk._log(log_data)
  },

  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole角色登录/切换角色', data)

    initSgsdk()

    let log_data = {

      uid: UrlParmas.uid,

      gid: UrlParmas.gid,

      sid: data.server_id,

      act: 'login',

      role: data.role_name,

      sname: data.server_name

    }

    sg_sdk._log(log_data)
  }

}

window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})

window.addEventListener('offline', function () {
  isOnline = false
})
