/*测试地址：
    英雄训练师：
*/
FN.log('xyhelpersdk.use.js')
var counter = 0;

window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {

    try
    {
      __channelLogin({ token, data, callback });
    }catch(e){
       if(counter>10){
         callback({
              statusCode: 1,
              status: '进入游戏失败，请刷新页面'
            })
         return false;
       }
       counter++;

       setTimeout(function(){
          window.FUSESDKAPI.login({ token, data, callback });
       },1500)
    }
    
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    let cpData = data

    var payData = {
        productId: cpData.cpProductId,
        productName: cpData.productName ? cpData.productName : cpData.chargeDesc,
        mchOrderId: cpData.order_id,
        amount: cpData.ext.amount,    //元，服务端
        roleName: cpData.roleName,
        extra: cpData.ext.extra,
        serverId: cpData.serverId,
        isDev: 0,   //是否为测试订单，1：是，0：否
        sign:cpData.ext.sign
    };
    FN.log('paydata', payData)
    E7Gamer.pay(payData);

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    window.__payData__ = {
      productId: data.cpProductId,
      productName: data.productName ? data.productName : data.chargeDesc,
      roleName: data.roleName,
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
}

function __channelLogin({ token, data, callback }){
  //渠道初始化
  E7Gamer.config({
    appid: FN.getSession('FUSE_CHANNEL_INFO').app_id, 
    gameUrl: window.location.href
  });

  //token会过期，uid存在也登录不了
  // var uid = E7Gamer.getUid()
  // if(uid){
  //   __login({ token, data, callback })
  // } else{
      //渠道登录
      E7Gamer.login(function(uid){
        __login({ token, data, callback })
      })
  //}
}


function __login({token, data = {}, callback})
{   
    FN.log('E7Gamer', E7Gamer)
    FN.log('E7Gameruid', E7Gamer.getUid())
    FN.log('channel_token', E7Gamer.getToken())
    var uid = E7Gamer.getUid()
    var channel_token = E7Gamer.getToken()
    let header = {
      uid:uid,
      token:encodeURIComponent(channel_token)
    }
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
}