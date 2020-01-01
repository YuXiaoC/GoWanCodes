/*测试地址：
    英雄训练师：http://www.hjygame.com/play/778.html#*/
FN.log('hjygamesdk.use.js')
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
    var params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', params)

    var gameId = params.gameId
    var uid = params.uid
    var userName = params.userName
    var time = params.time
    var sign = params.sign
    var signType = params.signType
    var header = {gameId,uid,userName,time,sign,signType} // 用于融合登录传递给后端,进行登录校验
    var ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          callback({
            statusCode: 0,
            loginParams: res.data
          })
          window.__ext__ = res.data

          sdk.config({
                gameId:gameId,
                uploadGameRole:{
                  success: function (e) {
                    /* 上报角色信息回调方法*/
                    console.log("game tell uploadGameRole success");
                  }
                },
                share:{
                  success: function (e) {
                      /* 分享成功回调方法*/
                      console.log ("game tell share success");
                  }
              },
              pay:{
                success:function(e){

                }
            }
          });
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
    var userInfo = FN.getSession('FUSE_USER_INFO');
    var params = FN.getURLparams() // 获取链接参数
    var goodsName = data.productName ? data.productName : data.chargeDesc // 商品名称，string
    var paydata = {
       gameId:params.gameId,
       uid:userInfo.user_id,
       time:data.ext.time,
       server:data.serverId,
       role:data.roleId,
       goodsId:"1",
       goodsName:goodsName,
       money:(parseFloat(data.amount/100)).toFixed(2),
       cpOrderId:data.order_id,
       ext:data.ext.ext,
       sign:data.ext.sign,
       signType:params.signType
    }
    console.log('paydata', paydata)
    sdk.pay(paydata);
    var cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    FN.log('ext_Data', data)
    var goodsName = data.productName ? data.productName : data.chargeDesc // 商品名称，string
    window.__payData__ = {
      goodsName:goodsName,
    }
    return window.__payData__
  },
  changeRole ({token,data = {},callback}) {
    FN.log('changeRole角色data', data)
    let UrlParams = FN.getURLparams() // 获取链接参数
    let roleParam = {
      isCreateRole:"false",
      gameId: UrlParams.gameId,
      uid:data.user_id,
      serverId:data.server_id,
      serverName:data.server_name,
      userRoleId:data.role_id,
      userRoleName:data.role_name,
      vipLevel:data.vip_level,
      userRoleLevel:data.role_level,
      rebornLevel : "0",
      gameRoleMoney:'0.00',
      gameRolePower:"0"
    }
    console.log('角色登录params', roleParam)
    sdk.uploadGameRole(roleParam);
    var cbData = {
      statusCode: 0,
      status: '角色登陆上报成功'
    }
    callback(cbData)
  },

  createRole ({token,data = {},callback}) {
    FN.log('changeRole角色data', data)
    let UrlParams = FN.getURLparams() // 获取链接参数
    let roleParam = {
      isCreateRole:"true",
      gameId: UrlParams.gameId,
      uid:data.user_id,
      serverId:data.server_id,
      serverName:data.server_name,
      userRoleId:data.role_id,
      userRoleName:data.role_name,
      vipLevel:data.vip_level,
      userRoleLevel:data.role_level,
      rebornLevel : "0",
      gameRoleMoney:'0.00',
      gameRolePower:"0"
    }
    console.log('创角params', roleParam)
    sdk.uploadGameRole(roleParam);
    var cbData = {
      statusCode: 0,
      status: '创角上报成功'
    }
    callback(cbData)
  },

  // 分享
  shareToArk ({token, data = {}, callback}) {

    sdk.showShare();
    var cbData = {
      statusCode: 0,
      aioType: 1, // 1: 个人  4:群聊
      status: '分享成功'
    }
    callback(cbData)
  }
}