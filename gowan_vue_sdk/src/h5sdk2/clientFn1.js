window.SDKDATA = {}
var post = function (data) {
  var el = document.getElementsByTagName('iframe')[0]
  var ctx = el.contentWindow
  ctx.postMessage(data, '*')
}
window.FUSESDKAPI = {flymeChangeAccount: function ($__2) {
  var $__4
  var $__3 = $__2,
    token = $__3.token,
    data = ($__4 = $__3.data) === void 0 ? {} : $__4,
    callback = $__3.callback
  window.SDKDATA.flymeChangeAccount = {}
  window.SDKDATA.flymeChangeAccount.callback = function (res) {
    if (typeof callback === 'function') {
      FN.log('toCp:flymeChangeAccount', res)
      callback(res)
    }
  }
}}
// 该方法是专门给客户端回调使用
window.jsBridge = function (res) {
  var data = res

  // var data = JSON.parse(res)
  var callbackCode = data.callback
  switch (callbackCode) {
    // 登录回调
    case '1':
      // 保存登录信息
      sessionStorage.setItem('CLIENT_FUSE_USER_INFO', JSON.stringify(data.param))
      // var cpData = {statusCode: 0, loginParams: data.param}
      loginParams = JSON.parse(data.param)
      // alert(loginParams)
      loginParams.statusCode = data.statusCode
      loginParams.hasCheck = false
      loginParams.isChangeUser = false
      loginParams.isReward = false
      // loginParams.cp_ext = JSON.stringify(JSON.parse(data.param).cp_ext)
      loginParams.cp_ext = JSON.parse(data.param).cp_ext
      loginParams.ext = JSON.stringify(JSON.parse(data.param).ext)
      loginParams.platformChanleId = Number(JSON.parse(sessionStorage.getItem('FUSE_CHANNEL_INFO')).channel_id)
      var cpData = {statusCode: 0, loginParams: loginParams}
      // 发布的token
      var token = data.token
      post({
        type: 'CC',
        token: token,
        payload: cpData
      })
      break
    // SDK内部登出回调
    case '2':
      var changeAccountData = {statusCode: 0, status: '外部执行切换帐号'}
      // 发布的token
      var changeAccountToken = data.token

      window.SDKDATA.flymeChangeAccount.callback({
        statusCode: 0,
        status: '外部执行切换帐号'
      })
      break
    case '3':

    // 支付通知游戏发货
      console.log('支付通知游戏发货_cpData', res)
      if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') {
        let cpData = data.cpData
        let token = data.token
        FN.post({
          type: 'CC',
          token,
          payload: {
            statusCode: 0,
            status: {
              orderId: cpData.order_id
            }
          }
        })
      }
      break
  }
}
