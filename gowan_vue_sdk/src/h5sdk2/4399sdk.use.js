FN.log('4399game.use.js init success!')
// 接入文档地址 http://www.4399api.com/res/help/html5_v3
// 游戏测试地址 http://h.api.4399.com/g.php?gameId=100058270
// 游戏专用账号：ceshi@4399 密码：Aa123456
window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    let deviceid = 'H5'
    let gameId = urlParams.gameId
    let userId = urlParams.userId
    let userName = urlParams.userName
    let time = urlParams.time
    let sign = urlParams.sign
    let header = {gameId, userId, userName, time, sign, deviceid}
    FN.log('登录urlParams参数', urlParams)
    FN.log('登录header参数', header)
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        callback({
          statusCode: 0,
          loginParams: res.data
        })
      } else {
        callback({
          statusCode: res.code,
          status: res.msg
        })
      }
    })
  },
  changeAccount (token, args) {
    window.H5API.logout()
    callback({
      statusCode: 0,
      status: '切换成功'
    })
  },
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let money = parseInt(data.amount / 100)
    let mark = data.order_id
    let server = data.serverId
    let extra = data.ext.extra
    window.H5API.openPay(money, mark, server, extra)
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: cpData.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  videoAd ({token, data = {}, callback}) {
    window.H5API.playAd(function (data) {
      console.log('播放状态', data.code, data.message)
      // 10000 开始播放
      // 10001 播放结束
      // 10010 广告异常
      switch (data.code) {
        case 10000 : callback({statusCode: 0, status: '观看完成'})
          break
        case 10001 : callback({statusCode: 0, status: '观看完成'})
          break
        case 10010 : callback({statusCode: 0, status: '观看完成'})
          break
      }
    })
  }
}
