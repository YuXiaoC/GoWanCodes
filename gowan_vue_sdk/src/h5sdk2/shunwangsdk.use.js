console.log('顺网sdkuse.js')
window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    let header = {guid: urlParams.guid, fcm: urlParams.fcm, card_state: urlParams.card_state, play_type: urlParams.play_type, platform: 'swjoy', time: urlParams.time, sign: urlParams.sign}
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        callback({
          statusCode: 0,
          loginParams: res.data
        })
      } else {
        callback({
          statusCode: res.code,
          status: res.msg
        })
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    function payClick () {
      H5Pay().init({
        gameId: data.ext.game_id,
        data: data.ext.data,
        sign: data.ext.game_sign
      }, swPayCallBack)
    }
    function swPayCallBack (json) {
      // alert(json.response.msg);
      // 二维码扫码付款
      if (json.response.code == 0) {
        var el = document.createElement('div')
        el.setAttribute('id', 'payCode')
        el.setAttribute('onclick', 'document.body.removeChild(this)')
        el.style = 'position:relative;width:100%;height:100%;background:rgba(0,0,0,.5);'
        el.innerHTML = '<div style="position: absolute;left: 50%;top: 50%;margin-left: -150px;margin-top: -150px;background: #fff;width: 300px;height: 229px;"><img style="margin: 5px auto;display: block;" src="data:image/jpeg;base64,' + json.response.qrcode + '"><p style="line-height: 30px;font-size: 16px;text-align: center;">请使用支付宝或者微信扫描二维码支付</p><div style="background:#F4A73B;line-height:42px;text-align:center;width:200px;margin:0 auto;font-size:20px;color:#fff;">继续游戏</div></div>'
        document.getElementsByTagName('body').item(0).appendChild(el)
      }
    }
    payClick()
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: data.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  getEXT (data) {
    let urlParams = FN.getURLparams()
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, callbackInfo, amount} = data
    window.__payData__ = {
      rmb: amount / 100,
      guid: urlParams.guid
    }
    return window.__payData__
  }
}
