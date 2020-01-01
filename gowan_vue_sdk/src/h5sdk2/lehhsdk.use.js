// import md5 from 'blueimp-md5'
// 测试地址http://h5sdk.btgame01.com/index.php/index/autologin/gameid/10149/tgid/101/username/h5test/password/123456/type/1/test/1
FN.log('lehhsdk.use.js')
let UrlParams = FN.getURLparams()
FN.log('Login---->>url_params', UrlParams)
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

  login ({ token, data = {}, callback }) {
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))
    FN.log('callback', callback)
    console.log('UrlParams', UrlParams)
    let deviceid = 'H5'
    let appid = UrlParams.appid
    let uid = UrlParams.uid
    let lehh_token = UrlParams.token
    let time = UrlParams.time
    let sign = UrlParams.sign
    let header = {appid, deviceid, uid, token: lehh_token, time, sign} // 用于融合登录传递给后端,进行登录校验
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
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      token: UrlParams.token
    }
    return window.__payData__
  },
  recharge ({token, data = {}, callback}) {
    FN.log('渠道支付信息', data)
    // window.parent.openurl(data.ext.pay_url)
    window.location.href = data.ext.pay_url
  }
}
