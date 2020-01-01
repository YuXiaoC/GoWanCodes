
// 测试地址http://m.tianyuyou.cn/index/h5game_jump.html?game_id=68691
FN.log('tianyuyousdk.use.js')
var _manbah5sdk = new manbah5sdk()
console.log('_manbah5sdk', _manbah5sdk)
var balance = ''
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    // var _manbah5sdk = new manbah5sdk()
    var str = _manbah5sdk.init()
    console.log('_manbah5sdk.init()', str)
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用22
    let params = FN.getURLparams() // 获取链接参数
    let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
    FN.log('header-header-header', params)
    let mbGameId = params.mbGameId
    let mbUserId = params.mbUserId
    let deviceid = 'H5'
    let mbToken = params.mbToken
    let channel = channel_info.channel
    let header = {mbGameId, deviceid, mbToken, channel, mbUserId} // 用于融合登录传递给后端,进行登录校验
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
  },

  // 支付
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    // let userID = FN.getSession('FUSE_USER_INFO').user_id
    // let spid = FN.getSession('FUSE_USER_INFO').ext.spid
    let gameID = FN.getSession('FUSE_CHANNEL_INFO').game_id
    let Report_data = {
      roleid: data.roleId, // 角色ID 必传
      rolename: data.roleName, // 角色名称
      rolelevel: data.roleLevel, // 角色等级
      zoneid: data.serverId, // 区服ID
      zonename: data.serverName, // 区服名称
      balance, // 游戏币
      vip: data.vipLevel, // VIP等级
      partyname: 1, // 是否有工会
      attach: 1 // 如果可以提供 用JSON字符串
    }
    console.log('支付上报角色信息', Report_data)
    _manbah5sdk.gradeReport(Report_data)
    let paydata = {
      amount: data.amount / 100,
      cporder_sn: data.order_id, // 游戏方订单号
      product_name: data.productName, // 商品名称,
      attach: gameID // 透传参数
    }
    _manbah5sdk.pay(paydata)
    console.log('paydata', paydata)
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
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole111', data)
    balance = data.balance
    let Report_data = {
      roleid: data.role_id, // 角色ID 必传
      rolename: data.role_name, // 角色名称
      rolelevel: data.role_level, // 角色等级
      zoneid: data.server_id, // 区服ID
      zonename: data.server_name, // 区服名称
      balance, // 游戏币
      vip: data.vip_level, // VIP等级
      partyname: 1, // 是否有工会
      attach: 1 // 如果可以提供 用JSON字符串
    }
    FN.log('changeRole222', Report_data)
    _manbah5sdk.gradeReport(Report_data)
  },
  flymeChangeAccount ({ token, data = {}, callback }) {
    window.top.location.reload()
  }
}
