// import API from 'api-mock-js'
// 测试地址https://h.zixia.com/game-qgcjh
// 文档地址http://co.xigu.com/game-api/index.html?tdsourcetag=s_pctim_aiomsg
FN.log('zixiasdk.use.js')
let params = FN.getURLparams()// 获取渠道信息
console.log('路径参数', params)
var isOnline = true
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
    FN.log('路径参数', params)
    let uid = params.uid
    let platfrom = params.platfrom
    let gkey = params.gkey
    let skey = params.skey
    let time = params.time
    let back_url = params.back_url
    let is_adult = params.is_adult
    let type = params.type
    let sign = params.sign
    let deviceid = 'H5'
    let ext_header = {}
    let header = {deviceid, uid, platfrom, gkey, time, back_url, type, sign, is_adult, skey}

    if (!window.__ext__) {
      window.FUSESDK.login({

        ext: JSON.stringify(ext_header),

        data: JSON.stringify(header)

      }).then(res => {
        if (res.code === 0) {
          // 存储当前渠道用户信息

          FN.saveSession('FUSE_USER_INFO', res.data)

          // 回传给CP
          let cpData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cpData)

          window.__ext__ = res.data
        } else {
          let cpData = {
            statusCode: res.code,
            status: res.msg
          }
          callback(cpData)
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
    FN.log('支付信息', data)
    let payData = {
      uid: FN.getSession('FUSE_USER_INFO').user_id, // 用户登录ID
      gkey: data.ext.gkey, // 游戏名字(拼音字母缩写)
      skey: data.serverId, // 传用户角色所在的游戏区服id
      order_id: data.order_id, // 订单号
      money: parseInt(data.amount / 100), // 人民币数量 只能为正整数
      time: data.ext.time, // 时间戳
      sign: data.ext.sign
    }

    FN.log('payData', payData)
    ziXiaToPay.GetToPayUrl(payData)
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      gkey: params.gkey,
      skey: data.serverId
    }
    return window.__payData__
  }
}
function makeStringParams (obj) {
  let arr = []
  for (let i in obj) {
    arr.push(i + '=' + obj[i])
  }
  return arr.join('&')
}
// 断网重连
window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})
window.addEventListener('offline', function () {
  isOnline = false
})
