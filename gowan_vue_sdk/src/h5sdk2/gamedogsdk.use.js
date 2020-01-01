/*测试地址：
    英雄训练师：http://sdk.h5.gamedog.cn/game/612/2/*/
FN.log('gamedogsdk.use.js')

//请求地址
var yisdk_protocol = window.location.protocol;
var yisdk_host = window.location.host;
if(yisdk_host.indexOf('gowanme') >= 0){
  var yisdk_url = yisdk_protocol+'//yisdk-api.gowanme.com/';
} else{
  var yisdk_url = yisdk_protocol+'//yisdk-api.gowan8.com/';
}

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

    let appid = Params.appid
    let channel_token = Params.token
    let channel = Params.channel
    let timestamp  = Params.timestamp 
    let sign  = Params.sign 
    let header = {
      appid,
      'token':channel_token,
      timestamp,
      sign,
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {

          window.gameGD = new GameGD({
            "appid":appid,
            "token":channel_token
          });

          res.data.appid = appid
          res.data.channel_token = channel_token
          res.data.channel = channel
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
    let channel = FN.getSession('FUSE_USER_INFO').channel
    let appid = FN.getSession('FUSE_USER_INFO').appid
    let channel_token = FN.getSession('FUSE_USER_INFO').channel_token
    let cpData = data
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))

    var payData = {
        appid: appid,
        channel: channel,
        fee: cpData.ext.fee,  //单位元，服务端转
        orderno: cpData.order_id,  //CP方订单号
        subject: data.productName ? data.productName : data.chargeDesc,
        timestamp: cpData.ext.timestamp,
        sign: cpData.ext.sign,  //建议在服务端生成
        token: channel_token,
        ext: cpData.ext.ext,
    };
    FN.log('paydata', payData)
    window.gameGD.pay(payData);

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    let uid = FN.getSession('FUSE_USER_INFO').user_id
    let channel = FN.getSession('FUSE_USER_INFO').channel
    let channel_token = FN.getSession('FUSE_USER_INFO').channel_token
    window.__payData__ = {
      user_id: uid,
      channel: channel,
      subject: data.productName ? data.productName : data.chargeDesc,
      token: channel_token,
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
  //创建角色
  createRole ({token, data = {}, callback}) {
    FN.log('创建角色', data)

    let appid = FN.getSession('FUSE_USER_INFO').appid
    let channel_token = FN.getSession('FUSE_USER_INFO').channel_token
    let game_id = FN.getSession('FUSE_USER_INFO').ext.game_id

    var repData = {
      appid:appid,  //游戏appid  (必填, 参与加密)
      token:channel_token,   //token (必填, 参与加密)
      role:data.role_name,          //角色名称 (必填, 参与加密)
      roleid:data.role_id,       //角色id (必填, 参与加密)
      grade:data.role_level,       //角色等级 (必填, 参与加密)
      server:data.server_name,      //区服名称 (必填, 参与加密)
      serverid:data.server_id,   //区服id (必填, 参与加密)
    }

    var ajax_data = Pajax('fuse:logind', repData, {
      domain: yisdk_url+'?ct=api_extend&ac=role_login&channel=gamedog&zjwl_gid='+game_id+'&is_jsdk=1'
    })

    ajax_data.then(function(data){
      FN.log('ajax_data', data)
      repData.sign = data.data.sign
      repData.moneynum = ''
      repData.vip = data.vip_level
      repData.ext = ''

      FN.log('repData', repData)
      window.gameGD.reportrole(repData, function(t){
        console.log(t);  //返回true 上报成功
      });
    })
  },
  //切换角色
  changeRole ({token, data = {}, callback}) {
    FN.log('切换角色', data)

    let appid = FN.getSession('FUSE_USER_INFO').appid
    let channel_token = FN.getSession('FUSE_USER_INFO').channel_token
    let game_id = FN.getSession('FUSE_USER_INFO').ext.game_id

    var repData = {
      appid:appid,  //游戏appid  (必填, 参与加密)
      token:channel_token,   //token (必填, 参与加密)
      role:data.role_name,          //角色名称 (必填, 参与加密)
      roleid:data.role_id,       //角色id (必填, 参与加密)
      grade:data.role_level,       //角色等级 (必填, 参与加密)
      server:data.server_name,      //区服名称 (必填, 参与加密)
      serverid:data.server_id,   //区服id (必填, 参与加密)
    }

    var ajax_data = Pajax('fuse:logind', repData, {
      domain: yisdk_url+'?ct=api_extend&ac=role_login&channel=gamedog&zjwl_gid='+game_id+'&is_jsdk=1'
    })

    ajax_data.then(function(data){
      FN.log('ajax_data', data)
      repData.sign = data.data.sign
      repData.moneynum = ''
      repData.vip = data.vip_level
      repData.ext = ''

      FN.log('repData', repData)
      window.gameGD.reportrole(repData, function(t){
        console.log(t);  //返回true 上报成功
      });
    })
  },
  //角色升级
  upgradeRole ({token, data = {}, callback}) {
    FN.log('角色升级', data)

    let appid = FN.getSession('FUSE_USER_INFO').appid
    let channel_token = FN.getSession('FUSE_USER_INFO').channel_token
    let game_id = FN.getSession('FUSE_USER_INFO').ext.game_id

    var repData = {
      appid:appid,  //游戏appid  (必填, 参与加密)
      token:channel_token,   //token (必填, 参与加密)
      role:data.role_name,          //角色名称 (必填, 参与加密)
      roleid:data.role_id,       //角色id (必填, 参与加密)
      grade:data.role_level,       //角色等级 (必填, 参与加密)
      server:data.server_name,      //区服名称 (必填, 参与加密)
      serverid:data.server_id,   //区服id (必填, 参与加密)
    }

    var ajax_data = Pajax('fuse:logind', repData, {
      domain: yisdk_url+'?ct=api_extend&ac=role_login&channel=gamedog&zjwl_gid='+game_id+'&is_jsdk=1'
    })

    ajax_data.then(function(data){
      FN.log('ajax_data', data)
      repData.sign = data.data.sign
      repData.moneynum = ''
      repData.vip = data.vip_level
      repData.ext = ''

      FN.log('repData', repData)
      window.gameGD.reportrole(repData, function(t){
        console.log(t);  //返回true 上报成功
      });
    })
  },
}


//内部通讯AJAX函数
//api-mock-js
const Pajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    let newObj = { ...obj }

    FN.log(`${arg[0]}(input)`, arg[1])
    return {
      ...obj
    }
  }
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        FN.log('FN.ajax error:', e)
      })
  })
}