/*测试地址：
    英雄训练师：http://www.333h5.com/index.php?ac=play&id=910*/
FN.log('333h5sdk.use.js')

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

    let uid = Params.uid
    let userName = Params.userName
    let time = Params.time
    let sign = Params.sign
    let signType = Params.signType
    let gameId = Params.gameId
    let header = {
      uid,
      userName,
      time,
      sign,
      signType,
      gameId,
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {

          var params = {
              gameId: gameId, //游戏的ID
              share: {
                success: function () {/*分享好友成功回调*/
                  Fn.log("game tell share success");
                }
              },
              pay: {
                success: function () {
                  /* 支付成功回调方法（仅针对于快捷支付方式有效，该方法不做回调处理，游戏发货请以服务端回调为准）*/
                  Fn.log("game tell pay success");
                }
              }
          };
          window.CY_GAME_SDK.config(params); //初始化


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
    let uid = FN.getSession('FUSE_USER_INFO').user_id
    let gameId = FN.getSession('FUSE_USER_INFO').ext.game_id
    let cpData = data

    var paydata = {
        gameId: gameId,
        uid: uid,
        time: cpData.ext.time, //10位时间戳
        server: cpData.serverId,
        role: cpData.roleId,
        goodsId: cpData.cpProductId,
        goodsName: data.productName ? data.productName : data.chargeDesc,
        money: cpData.ext.money, //服务端转化，元
        cpOrderId: cpData.order_id,
        ext: cpData.ext.ext,
        sign: cpData.ext.sign,
        signType: "md5" 
    }
    FN.log('paydata', paydata)
    window.CY_GAME_SDK.pay(paydata);

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    let gameId = FN.getSession('FUSE_USER_INFO').ext.game_id
    window.__payData__ = {
      gameId: gameId,
      goodsId: data.cpProductId,
      goodsName: data.productName ? data.productName : data.chargeDesc,
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
}


