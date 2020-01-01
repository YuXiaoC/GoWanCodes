FN.log('misdk.use.js init success!')

window.SDKDATA = {}
var _miBaseData = '' //登陆基本信息
var _counter = 0   //计数器

//登陆回调方法
function _loginCallback (callback) {
  let header = {uid: _miBaseData.appAccountId, session: _miBaseData.session}
  let ext_header = {}
  window.FUSESDK.login({
    ext: JSON.stringify(ext_header),
    data: JSON.stringify(header)
  }).then(res => {
    if (res.code === 0) {
      FN.saveSession('FUSE_USER_INFO', res.data)
      let cbArgs = {
        statusCode: 0,
        loginParams: res.data
      }
      callback(cbArgs)
    } else {
      let cbArgs = {
        statusCode: res.code,
        status: res.msg
      }
      callback(cbArgs)
    }
  })
}

//登录方法
function _login({ token, data = {}, callback })
{
  console.log('token----------->', token)
  _counter++;
  if (!_miBaseData) {
    window.hy_wy_sdk.ready({
      zIndex: 99999,
      pin: 0
    }, function () {
      FN.log('登录信息', hy_wy_sdk.getBaseData())
      _miBaseData = hy_wy_sdk.getBaseData()
      _loginCallback(callback)
    })
  } else{
    _loginCallback(callback)
  }
}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') {
      var el = document.createElement('div')
      el.setAttribute('id', 'payCode')
      el.setAttribute('onclick', 'document.body.removeChild(this)')
      el.style = 'position:relative;width:100%;height:100%;'
      el.innerHTML = '<div style="position: absolute;left: 30%;top: 50%;margin-left: -25%;margin-top: -2.5rem;width: 88%;height: 40px;background: #39689C;color: #fff;font-size: 15px;text-align: center;line-height: 40px;border-radius: 10px;">为了保证最好的游戏效果请关闭自动旋转功能</div>'
      document.getElementsByTagName('body').item(0).appendChild(el)
      setTimeout(() => {
        if (document.getElementById('payCode') !== null) { document.getElementById('payCode').style.display = 'none' }
      }, 3000)
    }
    try {
      window.hy_wy_sdk.ready({
        zIndex: 99999,
        pin: 0
      }, function () {
        console.log('登录信息', hy_wy_sdk.getBaseData())
        _miBaseData = hy_wy_sdk.getBaseData()
      })
    } catch (e) {
      FN.log('在初始化的时候实例化失败！')
    }
    // sdk已经加载完成，可执行游戏的初始化逻辑
    let cbData = {statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)}
    callback(cbData)
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    if(_counter>5){

      if(_setTimeout){
        _setTimeout = null;
        clearTimeout(_setTimeout);
      }
      callback({
        statusCode:1,
        status:'登录失败'
      });
      return false
    }
    try{
       _login({ token, data, callback })
    }catch(e){
       
      _setTimeout = setTimeout(function(){
        _login({ token, data, callback })
       },1200)
    }
    
  },
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let BaseData = hy_wy_sdk.getBaseData()
    let appAccountId = BaseData.appAccountId
    let session = BaseData.session
    let cpOrderId = data.order_id
    // let productName = data.chargeDesc
    let productName = data.productName ? data.productName : data.chargeDesc
    let amount = data.amount
    let prepay_params = {'appid': data.ext.appid, 'prepayid': data.ext.prepayid, 'time': data.ext.time, 'nonce': data.ext.nonce, 'sign_type': data.ext.sign_type, 'sign': data.ext.sign}

    let orderInfo = {
      appId: data.ext.appId.toString(),
      appAccountId: hy_wy_sdk.getBaseData().appAccountId.toString(),
      session: hy_wy_sdk.getBaseData().session,
      cpOrderId: cpOrderId,
      cpUserInfo: data.callbackInfo ? data.callbackInfo : '',
      displayName: productName,
      feeValue: Number(amount),
      sign: data.ext.game_sign
    }
    console.log('小米游戏支付', orderInfo)

    hy_wy_sdk.pay(orderInfo)

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
  changeRole ({token, data = {}, callback}) {
    callback()
  },
  changeAccount (token, args) {

  },
  getPlatform (token, args) {

  },
  getEXT (data) {
    // FN.log('getEXT', data)
    console.log('getEXT', data)
    let productName = data.productName ? data.productName : data.chargeDesc
    // let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, callbackInfo} = data
    let {cpProductId, roleId, roleLevel, chargeDesc, roleName, serverId} = data
    window.__payData__ = {
      merchant_id: cpProductId,
      product_name: productName,
      role_id: roleId,
      role_level: roleLevel,
      charge_desc: productName,
      role_name: roleName,
      server_id: serverId,
      cpUserInfo: data.callbackInfo ? data.callbackInfo : '',
      appAccountId: hy_wy_sdk.getBaseData().appAccountId,
      session: hy_wy_sdk.getBaseData().session
    }
    return window.__payData__
  },
  videoAd ({token, data = {}, callback}) {
    console.log('调起广告1111')
    hy_ad_sdk.playVideoAd(function (code) {
      console.log(code)
      // 这里是播放完广告的回调执行
      if (code === 0) {
        callback({
          statusCode: 0,
          status: '观看完成'
        })
      }
    })
  }
}
