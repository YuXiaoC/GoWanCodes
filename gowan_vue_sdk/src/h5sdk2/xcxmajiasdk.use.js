/*!
 * vconsole v2.5.1 (https://github.com/WechatFE/vConsole)
 * Copyright 2016, WechatFE Team
 * MIT license
 */
FN.log('xcxmajiasdk.use.js!')
FN.log('game_Url:--->', window.location.href)
// 游戏测试地址 http://h5.gowanme.com/?yisdk_param=nJ9hq87vzs_O3Mg%3D&ext_param=a5lp&openId=oYVOQ4v_ouxdMKeJlsJ33TbV5kR0&unionId=oezs35-QhRyT5nljHaCL-Sno5LSw&timestamp=1555995093&sign=350129c96e23b2e12bf45d9cf1450bc3&gameName=sgqxz&appId=wxa16ef811358314e7&system=iOS
window.SDKDATA = {}
var openId = ''
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('融合初始化', data)
    let cbData = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(cbData)
  },
  login ({ token, data = {}, callback }) {
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))
    let UrlParams = FN.getURLparams()
    let deviceid = 'H5'
    openId = UrlParams.openId
    let unionId = UrlParams.unionId
    let timestamp = UrlParams.timestamp
    let sign = UrlParams.sign
    let appId = UrlParams.appId
    let gameName = FN.getSession('FUSE_CHANNEL_INFO').game_name
    // let scene = UrlParams.scene ? UrlParams.scene : 0
    let header = {openId, deviceid, unionId, timestamp, sign, appId, gameName} // 用于融合登录传递给后端,进行登录校验
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

          let from_id = FN.getSession('FUSE_CHANNEL_INFO').from_id

          if (res.data.from_id != from_id) {
            let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
            channel_info.from_id = res.data.from_id
            FN.saveSession('FUSE_CHANNEL_INFO', channel_info)
          }
          // 回传给CP
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cbData)
          window.__ext__ = res.data
        } else {
          wx.miniProgram.navigateTo({
            url: '/pages/content/content'
          })
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
  changeAccount ({ token, callback }) {
    // 切换帐号必定注销用户信息
    FN.removeSession('USER_INFO')
    FN.removeSession('FUSE_USER_INFO')
    // 浮标隐藏
    // document.getElementById('float-ball').remove(0)
    // 直接响应成功，cp会主动使用one方法调用login
    let cbData = {
      statusCode: 0,
      status: '调用切换帐号成功'
    }
    callback(cbData)
  },
  recharge ({ token, data = {}, callback }) {
    FN.log('支付信息', data)
    if (data.ext.prepay) {
      wx.miniProgram.navigateTo({
        url: '/pages/wxpay/wxpay?' + data.ext.prepay
      })
    } else {
      let order_id = data.order_id
      let payData = `&order_id=${order_id}`
      wx.miniProgram.navigateTo({
        url: '/pages/service/service?' + payData
      })
    }
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    let UrlParams = FN.getURLparams()
    window.__payData__ = {
      openid: openId,
      body: data.chargeDesc,
      appid: UrlParams.appId
    }
    return window.__payData__
  }
}
