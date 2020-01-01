/*测试地址：
    英雄训练师：
  遇到调不起支付，应用宝返回code：3，msg：支付插件错误，这种情况试下重装应用宝，它要的权限都给它
*/
FN.log('yaowanqqsdk.use.js')

//请求地址
var yisdk_protocol = window.location.protocol;
var yisdk_host = window.location.host;
if(yisdk_host.indexOf('gowanme') >= 0){
  var yisdk_url = yisdk_protocol+'//yisdk-api.gowanme.com/';
} else{
  var yisdk_url = yisdk_protocol+'//yisdk-api.gowan8.com/';
}

//配置
var payConfig = {
  login_type: 'qq',
  sdk_type: 'ysdk',
  zoneid: 1,
  type: 'online'    //online、test
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
    FN.log('H5YSDK', H5YSDK)

    let offerid = Params.offerid
    let openid = Params.openid
    let openkey = Params.openkey
    let header = {
      appid: offerid,
      login_type: payConfig.login_type,
      type: payConfig.type,
      openid,
      openkey,
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          FN.log('res', res)

          // 存储当前渠道用户信息
          res.data.urlParams = Params
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
    let urlParams = FN.getSession('FUSE_USER_INFO').urlParams
    let cpData = data

    //主动回调参数
    var notifyData = {
      order_id: cpData.order_id,
      amount: parseInt(cpData.amount/100),
      payChannel: 1,
      payState: 0,    //是否成功
      appid: urlParams.offerid,
      saveNum: parseInt(cpData.amount/10),
      login_type: payConfig.login_type,
      sdk_type: payConfig.sdk_type,
      //pay_token: '',
      openid: urlParams.openid,
      openkey: urlParams.openkey,
      pf: urlParams.pf,
      pfkey: urlParams.pfkey,
      zoneid: payConfig.zoneid,
      type: payConfig.type,
      op_type: 0
    }


    var paydata = {
      saveValue: parseInt(cpData.amount/10),    //充值数量，即游戏币的个数
      zoneId: payConfig.zoneid,      //服务器大区id
      offerid: urlParams.offerid,      //米大师支付的offerid 默认从url取
      openid: urlParams.openid,      //用户openid 默认从url取
      openkey: urlParams.openkey,      //用户openkey 默认从url取
      pf: urlParams.pf,      //充值平台标识 默认从url取
      pfkey: urlParams.pfkey,      //充值平台密钥 默认从url取
      onError: function(ret){
          FN.log(ret);
      },
      onSuccess: function(ret){
          FN.log(ret);
          FN.log('notifyData', notifyData)

          //主动回调
          payNotify(notifyData)
      }
    }

    //判断是否继续调起应用宝支付
    switch(cpData.ext.op_type){
      case 1:
        FN.log('paydata', paydata);
        H5YSDK.pay(paydata);
        break;
      case 2:
        FN.log('paydata', paydata);
        H5YSDK.pay(paydata);
        break;
      case 3:
        //回调成功
        break;
      case 4:
        let cbData = {
          statusCode: 0,
          status: '扣款失败，请重新点击该档次再次进行充值。'
        }
        callback(cbData)
        break;
      case 5:
        //查询成功，扣款失败，主动回调
        notifyData.op_type = cpData.ext.op_type
        FN.log('notifyData', notifyData)
        payNotify(notifyData)
        break;
      default:
        FN.log('paydata', paydata);
        H5YSDK.pay(paydata);
        break;
    }    

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    var urlParams = FN.getSession('FUSE_USER_INFO').urlParams

    window.__payData__ = {
      openkey: urlParams.openkey,
      pay_token: '',
      pf: urlParams.pf,
      pfkey: urlParams.pfkey,
      zoneid: payConfig.zoneid,
      type: payConfig.type,
      login_type: payConfig.login_type,
      sdk_type: payConfig.sdk_type
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
}


//内部通讯AJAX函数
//api-mock-js
const reqAjax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  // payload[2].filter = function (obj) {
  //   let newObj = { ...obj }

  //   FN.log(`${arg[0]}(input)`, arg[1])
  //   return {
  //     ...obj
  //   }
  // }
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

//回调函数
function payNotify(notifyData){
    var res = reqNotify(notifyData)

    var jishu = 1;
    if(res.code != 0){
      _interval = setInterval(function(){
          let res = reqNotify(notifyData);
          if(res.code == 0 || jishu > 3){
            clearInterval(_interval);
          }else{
            jishu++;
          }
          FN.log('jishu', jishu)
      },3000);
    }
}

//请求函数
function reqNotify(notifyData){
    let notifyUrl = yisdk_url+'notify_jsdk/yaowanqq.php';
    FN.log('notifyUrl', notifyUrl)

    var rs = reqAjax('fuse:logind', notifyData, {
      domain: notifyUrl
    }).then(function(rs){
      FN.log('rs', rs)
      return rs
    })
    return rs
}