// import md5 from 'blueimp-md5'
// import Api from 'api-mock-js'
// 8u测试地址http://h5.8uyx.com/webgame/qgcj/
FN.log('8usdk.use.js')
let urlParams = FN.getURLparams()// 获取渠道信息
console.log('urlParams', urlParams)
let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
console.log('channel_info', channel_info)
var _rolename = '' // 全局角色变量
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
    let params = FN.getURLparams() // 获取链接参数
    let uid = params.uid
    let appid = params.appid
    let time = params.time
    let sign = params.sign
    let support_share = params.support_share
    let support_follow = params.support_follow
    let deviceid = 'H5'
    let ext_header = {}

    let header = {uid, appid, time, sign, support_share, support_follow, deviceid}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            status: res.msg
          }
          callback(cbData)
        }
      })
    } else {
      let cpData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(cpData)
    }
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    console.log('支付支付', data)
    let url = data.ext.pay_url
    game8u_pay(url)
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      goodsName: data.productName ? data.productName : data.chargeDesc,
      rolename: (_rolename || data.roleName),
      rolelevel: data.roleLevel
    }
    return window.__payData__
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole创角', data)

    if (data.role_name && _rolename == '') {
      _rolename = data.role_name
    }
    var roledata = {
      datatype: 2, // 必填 1:选择服务器 2:创建角色3:进入游戏4:等级提升 5:退出游戏
      roleid: data.role_id,
      rolename: _rolename,
      rolelevel: data.role_level,
      serverid: data.server_id,
      servername: data.server_name,
      fightvalue: '', // 必填 战力
      moneynum: data.balance,
      vip: data.vip_level
    }
    game8u_reportrole(roledata)
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole角色登录/切换角色', data)

    if (data.role_name && _rolename == '') {
      _rolename = data.role_name
    }
    var roledata = {
      datatype: 3, // 必填 1:选择服务器 2:创建角色3:进入游戏4:等级提升 5:退出游戏
      roleid: data.role_id,
      rolename: _rolename,
      rolelevel: data.role_level,
      serverid: data.server_id,
      servername: data.server_name,
      fightvalue: '', // 必填 战力
      moneynum: data.balance,
      vip: data.vip_level
    }
    game8u_reportrole(roledata)
  },
  upgradeRole ({token, data = {}, callback}) {
    FN.log('upgradeRole角色升级', data)

    if (data.role_name && _rolename == '') {
      _rolename = data.role_name
    }
    var roledata = {
      datatype: 4, // 必填 1:选择服务器 2:创建角色3:进入游戏4:等级提升 5:退出游戏
      roleid: data.role_id,
      rolename: _rolename,
      rolelevel: data.role_level,
      serverid: data.server_id,
      servername: data.server_name,
      fightvalue: '', // 必填 战力
      moneynum: data.balance,
      vip: data.vip_level
    }
    game8u_reportrole(roledata)
  },
  slectServe ({token, data = {}, callback}) {
    FN.log('slectServe选择服务器', data)
    var roledata = {
      datatype: 1, // 必填 1:选择服务器 2:创建角色3:进入游戏4:等级提升 5:退出游戏
      roleid: data.role_id,
      rolename: data.role_name,
      rolelevel: data.role_level,
      serverid: data.server_id,
      servername: data.server_name,
      fightvalue: '', // 必填 战力
      moneynum: data.balance,
      vip: data.vip_level
    }
    game8u_reportrole(roledata)
  }

}
