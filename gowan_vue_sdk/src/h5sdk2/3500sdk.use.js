/*测试地址：
    英雄训练师：http://m.3500.com/yxxls/game.html*/
FN.log('3500sdk.use.js')
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

    let channel_token = Params.token
    let uid = Params.uid
    let header = {channel_token, uid} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {

          var game35 = new Game35({
            uid: Params.uid,      //用户id
            token: Params.token   // 3500用户 token，登录口令
          });
          window.game35 = game35

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
    console.log('支付信息', data)
    let userID = FN.getSession('FUSE_USER_INFO').user_id
    let spid = FN.getSession('FUSE_USER_INFO').ext.spid
    let gameID = FN.getSession('FUSE_CHANNEL_INFO').game_id
    let cpData = data

    var paydata = {
      orderid: cpData.order_id, // 商户订单号
      money: cpData.amount, // 订单金额（单位：分），int
      product: cpData.productName ? cpData.productName : cpData.chargeDesc, // 商品名称，string
      appid: cpData.ext.appid, // 标识ID，string
      sign: cpData.ext.sign, // 签名，String，必要
      ext: gameID, // 扩展参数，不参与签名，可选
      onPayCallback: function(){}, // 支付完成前端回调，Function，可选
      onPayCancel: function(){} // 支付取消前端回调，Function，可选
    }
    console.log('paydata', paydata)
    window.game35.pay(paydata)

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      product_name: data.productName ? data.productName : data.chargeDesc,
    }

    return window.__payData__
  },
  // 分享
  shareToArk ({token, data = {}, callback}) {
    FN.log('分享信息', data)
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    window.game35.share({
      title: channelInfo.game_name,
      content: data.summary// 仅发送朋友或群显示，发送朋友圈不显示
    });
    //设置分享完成回调，当用户分享完成时执行
    window.game35.onShareOK(function() {
      let cbData = {
        statusCode: 0,
        aioType: 4, // 1: 个人  4:群聊
        status: '分享成功'
      }
      callback(cbData)
    });
  },
}

