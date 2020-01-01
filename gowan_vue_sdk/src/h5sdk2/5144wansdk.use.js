/*测试地址：
    英雄训练师：http://h5.5144wan.com/index.php?ac=play&id=1042
    */
FN.log('5144wansdk.use.js')
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

    let header = {
      time : Params.time, 
      uid : Params.uid, 
      userName : Params.userName, 
      sign : Params.sign, 
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          var params = {
              gameId: Params.gameId, //游戏的ID
              share: {
                  success: function () {/*分享好友成功回调*/
                      FN.log("game tell share success");//该方法仅供参考
                  }
              },
              pay: {
                  success: function () {/* 支付成功回调方法（仅针对于快捷支付方式有效，该方法不做回调处理，游戏发货请以服务端回调为准）*/
                      FN.log("game tell pay success");//该方法仅供参考
                  }
              }
          };
          window.CY_GAME_SDK.config(params); //初始化

          res.data.uid = Params.uid
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
    let uid = FN.getSession('FUSE_USER_INFO').uid
    let cpData = data

    var paydata = {
      cpOrderId: cpData.order_id, //  游戏订单号
      gameId: cpData.ext.gameId, //   产品合作ID
      goodsId: 1, // 商品ID 没有的话。可以写1
      goodsName: cpData.productName ? cpData.productName : cpData.chargeDesc, // 商品名称，string
      money: cpData.ext.money, // 商品价格(元) 例：1.00
      role: cpData.roleId, // 角色信息
      server: cpData.serverId, // 游戏服
      time: cpData.ext.time, // 当前时间unix时间戳
      uid: uid, // 用户UID
      ext: cpData.ext.ext, // 额外透传参数
      sign: cpData.ext.sign, // 签名，String，必要
      signType: 'md5', // 固定md5
    }
    console.log('paydata', paydata)
    window.CY_GAME_SDK.pay(paydata)

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
      goodsId: 1,
      goodsName: data.productName ? data.productName : data.chargeDesc,
      server: data.serverId,
    }

    return window.__payData__
  },
}

