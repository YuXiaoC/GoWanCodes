/* 测试地址：
    英雄训练师：http://h5.haoy666.com/index.php?ac=play&id=765
*/
FN.log('haoy666.use.js')

window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    var result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    var Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    var gameId = Params.gameId
    var time = Params.time
    var uid = Params.uid
    var userName = Params.userName
    var sign = Params.sign
    var header = {
      time,
      uid,
      userName,
      sign
    } // 用于融合登录传递给后端,进行登录校验
    var ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          var params = {
            gameId: gameId, // 游戏的ID
            share: {
              success: function () { /* 分享好友成功回调 */
                Fn.log('game tell share success')// 该方法仅供参考
              }
            },
            pay: {
              success: function () {
                /* 支付成功回调方法（仅针对于快捷支付方式有效，该方法不做回调处理，游戏发货请以服务端回调为准） */
                Fn.log('game tell pay success')// 该方法仅供参考
              }
            }
          }
          window.CY_GAME_SDK.config(params)

          // 存储当前渠道用户信息
          res.data.channel_game_id = gameId
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
    var user_id = FN.getSession('FUSE_USER_INFO').user_id
    var channel_game_id = FN.getSession('FUSE_USER_INFO').channel_game_id
    var cpData = data

    var payData = {
      gameId: channel_game_id,
      uid: user_id,
      time: cpData.ext.time, // 10位时间戳
      server: cpData.serverId,
      role: cpData.roleId,
      goodsId: cpData.cpProductId,
      goodsName: data.productName ? data.productName : data.chargeDesc,
      money: cpData.ext.money, // 元，服务端
      cpOrderId: cpData.order_id,
      ext: cpData.ext.ext,
      sign: cpData.ext.sign,
      signType: 'md5'
    }
    FN.log('paydata', payData)
    window.CY_GAME_SDK.pay(payData)

    var cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  // 支付透传参数
  getEXT (data) {
    var channel_game_id = FN.getSession('FUSE_USER_INFO').channel_game_id
    window.__payData__ = {
      channel_game_id: channel_game_id,
      goodsId: data.cpProductId,
      goodsName: data.productName ? data.productName : data.chargeDesc
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  }
}
