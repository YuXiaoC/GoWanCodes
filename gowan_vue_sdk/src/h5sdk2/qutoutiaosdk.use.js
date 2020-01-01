// 游戏测试地址需要进入趣头条后台、
// 地址：http://newidea4-gamecenter-frontend.1sapp.com/opencms/prod/index.html
// 账号：zhijinwangluo
// 密码：2018Wluo
FN.log('qutoutiaosdk.use.js')
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('init_data', data)
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
    let params = FN.getURLparams() // 获取链接参数
    FN.log('Login---->>url_params', params)
    let app_id = params.app_id
    let platform = params.platform
    let ticket = params.ticket
    let time = params.time
    let deviceid = 'H5'
    let header = {deviceid, app_id, platform, ticket, time} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    let loadCompleteData = {
      open_id: FN.getSession('FUSE_USER_INFO').user_id,
      app_id: params.app_id,
      game_name: FN.getSession('FUSE_CHANNEL_INFO').game_name
    }
    qttGame.loadComplete(loadCompleteData)
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
    FN.log('渠道支付信息', data)
    let land = 0
    if (window.orientation === 180 || window.orientation === 0) land = 0
    if (window.orientation === 90 || window.orientation === -90) land = 1
    /**
    @param money {Number / String} [必填] 充值金额，单位：分，100分 = 1元。
    @param notifyUrl {String} [必填] 回调地址，请注意，这个是开发商的充值回调地址
    @param openId {String} [必填] openId
    @param platform {String} [必填] 平台 目前只有: qtt
    @param land {Sring} [0|1][必填] 游戏方向，0=竖屏，1=横屏
    @param gameName {String} [选填] 游戏名
    @param appId {String} [选填] appId
    @param ext {String} [选填] 扩展信息，json格式，比如充值的游戏区服等信息，透明转发
    **/
    // 示例
    let payData = {
      openId: FN.getSession('FUSE_USER_INFO').user_id,
      money: data.amount, // 单位：分
      appId: FN.getSession('FUSE_CHANNEL_INFO').app_id,
      notifyUrl: data.ext.notifyUrl,
      platform: 'qtt', // 平台 目前只有: qtt
      land,
      ext: data.ext.ext
    }
    qttGame.pay(payData)
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole', data)
    /**
    @param role { String} [必填] 角色名称
    @param region { String} [必填] 游戏区
    @param level { int} [必填] 等级
    @param ce { int} [选填] 战斗力
    @param round { int} [选填] 局数
    @param extend_info  [选填] json对象 {}
    **/
    let reportData = {
      role: data.role_name,
      region: data.server_name,
      level: data.role_level,
      extend_info: {
        user_id: data.user_id,
        vip: data.vip_level,
        serverId: data.server_id,
        balance: data.balance
      }
    }
    qttGame.userInfo(reportData)
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRoleData', data)
    /**
    @param user_name { String} [必填] 用户名称
    @param game_region { String} [必填] 游戏所属区域
    @param extend_info  [选填] json对象 {}
    **/
    let role_data = {
      user_name: data.role_name,
      game_region: data.server_name
    }
    qttGame.addNewRole(role_data)
  }
}
