window.SDKDATA = {}
var post = function (data) {
  var el = document.getElementsByTagName('iframe')[0]
  var ctx = el.contentWindow
  ctx.postMessage(data, '*')
}

window.FUSESDKAPI = {
  flymeChangeAccount: function ({ token, data = {}, callback }) {
    // 保存回调函数
    // 在外部点击切换帐号时会执行
    window.SDKDATA.flymeChangeAccount = {}
    window.SDKDATA.flymeChangeAccount.callback = function (res) {
      if (typeof callback === 'function') {
        FN.log('toCp:flymeChangeAccount', res)
        callback(res)
      }
    }
  }
}

function jsBridge (res) {
  console.log('clientFn.use success---res!', res)
  var post = function (data) {
    var el = document.getElementsByTagName('iframe')[0]
    var ctx = el.contentWindow
    ctx.postMessage(data, '*')
  }
  if (typeof res === 'object') {
    data = res
  } else {
    data = JSON.parse(res)
  }
  // var data = JSON.parse(res)
  var callbackCode = data.callback
  // alert(typeof data.callback)
  switch (callbackCode) {
    // 登录回调
    case '1':
      // 保存登录信息
      sessionStorage.setItem('CLIENT_FUSE_USER_INFO', JSON.stringify(data.param))
      // var cpData = {statusCode: 0, loginParams: data.param}
      loginParams = data.param
      loginParams.statusCode = data.statusCode
      loginParams.hasCheck = false
      loginParams.isChangeUser = false
      loginParams.isReward = false
      loginParams.cp_ext = JSON.stringify(data.param.cp_ext)
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
  }
}
