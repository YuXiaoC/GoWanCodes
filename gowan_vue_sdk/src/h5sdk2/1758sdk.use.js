console.log('1758sdk.use.js')
var WinAlerts = window.alert
let gid = ''
window.alert = function (e) {
  if (e != null && e.indexOf && e.indexOf('sound') > -1) {
  } else {
    WinAlerts(e)
  }
}
window.onShareTimeline = function () {
  // 游戏在方法内实现自身逻辑，如：提示用户分享成功，并发放奖励
  let payload = {
    statusCode: 0,
    aioType: 4,
    status: '分享成功'
  }
  FN.post({
    type: 'CC',
    token: FN.getSession('gowansharetoken'),
    payload
  })
}
var _counter = 1; //计数器
function _initCallback(callback)
{
   // 获取链接参数
   let urlParams = FN.getURLparams()
  var hlmysdk = window.HLMY_SDK
  var authData = {
    appKey: urlParams.appKey, // 链接上携带的参数
    hlmy_gw: urlParams.hlmy_gw, // 渠道参数
    userToken: urlParams.userToken, // 用户令牌
    callback: function (data) {
      console.log('callback', data)
      hlmysdk.init({
        'gid': data.data.userInfo.gid, // 通过"用户验证"接口获取到的1758平台gid,
        'appKey': urlParams.appKey, // 游戏的appkey
        'hlmy_gw': urlParams.hlmy_gw // 1758平台的自定义参数，CP通过授权回调地址后的参数获得
      })
      hlmysdk.checkFollow(function (obj) {
        // obj为一个对象，obj.follow为用户关注状态，如{follow: 1}
        // 0为未关注，1为已关注
        console.log('关注查询', obj)
      })
      hlmysdk.adaptParams(function (data) {
        // obj为一个json对象
        console.log('适配对象', data)
        if (data.result) {
          let remote1 = JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
          remote1.is_share = Number(Boolean(data.data.adaptParams[0].value))
          remote1.is_ad = Number(Boolean(data.data.adaptParams[2].value))
          let callbackRes = {
            statusCode: 0,
            status: '初始化成功',
            remote: remote1
          }
          callback(callbackRes)
        }
      })
    }
  }
  hlmysdk.auth(authData)
}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
   
    try
    {
      _initCallback(callback);
    }catch(e){

      if(_counter>5){
        let callbackRes = {
          statusCode: 1,
          status: '初始化失败，请刷新重试',
          remote: {}
        }
        callback(callbackRes)
        return false;
      }
      _counter++;
      setTimeout(function(){
        _initCallback(callback);
      },1200);
    }

    
    // let callbackRes = {
    //   statusCode: 0,
    //   status: '初始化成功'
    // }
    // callback(callbackRes)
    // console.log('hlmysdk.auth', hlmysdk)
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    FN.log('融合登录urlParams', urlParams)
    let header = {appKey: urlParams.appKey, userToken: urlParams.userToken, state: urlParams.state, hlmy_gw: urlParams.hlmy_gw, hlmy_gp: urlParams.hlmy_gp, nonce: urlParams.nonce, timestamp: urlParams.timestamp, sign: urlParams.sign}
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        let cbData = {
          statusCode: 0,
          loginParams: res.data
        }
        callback(cbData)
      } else {
        let cbData = {
          statusCode: res.code,
          status: res.msg
        }
        callback(cbData)
      }
    })
  },
  shareToArk ({token, data = {}, callback}) {
    var hlmysdk = window.HLMY_SDK
    // 查询是否支持分享功能
    hlmysdk.adaptParams(function (data) {
      if (data.data.adaptParams[0].value === 'true') {
        FN.saveSession('gowansharetoken', token)
        console.log(data.summary)
        hlmysdk.setShareInfo({
          'state': '',
          'type': '', // 此项可空。当且仅当type为img时，表示分享方式为图片二维码（需要联系1758运营同学特别配置）；否则都认为是默认分享方式
          'tipInfo': true,
          'reward': [data.summary]
        })
      } else {
        let cbData = {
          statusCode: 2,
          state: '暂不支持分享功能'
        }
        callback(cbData)
      }
    })
  },
  videoAd ({token, data = {}, callback}) {
    var hlmysdk = window.HLMY_SDK
    // 查询是否支持分享功能
    hlmysdk.adaptParams(function (data) {
      if (data.data.adaptParams[3].value === 'true') {
        let cbdata = {
          statusCode: 0,
          status: '观看完成'
        }
        callback(cbdata)
      } else {
        let cbdata = {
          statusCode: 2,
          status: '功能没开发'
        }
        callback(cbdata)
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    var hlmysdk = window.HLMY_SDK
    var payData = {
      'paySafecode': data.ext.paySafeCode, // 通过“预下单接口”返回的支付安全码
      'callback': function (data) { // callback 不能保证一定会回调。
        console.log(data)// data为object,例如{status:1} 1:已支付,0:未支付
      }
    }
    hlmysdk.pay(payData)
    // if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '49') { // 注意: 这个game_id判断值要上线前要,检查清楚
    //   callback({
    //     statusCode: 0,
    //     status: {orderId: data.order_id}
    //   })
    // } else {
    //   callback({
    //     statusCode: 0,
    //     status: '调用支付成功'
    //   })
    // }
  },
  getEXT (data) {
    FN.log('getEXTdata', data)
    FN.log('userinfo', FN.getSession('FUSE_USER_INFO'))
    let urlParams = FN.getURLparams()
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, amount} = data
    window.__payData__ = {
      appKey: urlParams.appKey,
      hlmy_gw: urlParams.hlmy_gw,
      productDesc: data.productName,
      roleName,
      serverName: data.serverName,
      roleCoins: 0,
      roleLevel: data.roleLevel,
      vipLevel: data.vipLevel,
      gameRolePower: 0
    }
    console.log('window.__payData__', window.__payData__)
    return window.__payData__
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole', data)
    let roleInfo = {
      'serverId': data.server_id, // 区服id
      'serverName': data.server_name, // 区服名称
      'isNewRole': true, // 是否是新创建的角色
      'roleId': data.role_id, // 角色id
      'roleName': data.role_name, // 角色名称
      'roleLevel': data.role_level, // 角色级别
      'roleCoins': 0, // 角色当前的财富值
      'roleCreateTime': Date.parse(new Date()) / 1000, // 角色创建时间
      'gameRolePower': 0 // 角色战力值
    }
    window.HLMY_SDK.roleInfo(roleInfo)
    FN.log('createRole', roleInfo)
  }
}
