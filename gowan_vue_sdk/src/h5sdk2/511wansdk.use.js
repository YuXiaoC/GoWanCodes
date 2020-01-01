// 511玩测试地址http://h5.511wan.com/play.jsp?game_id=577
// 文档地址http://h5.interface.511wan.com/
// 测试账号 test01
// 密码    testtest
// 安全码 111111
// import md5 from 'blueimp-md5'
FN.log('511wan.use.js')
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    let urlParams = FN.getURLparams()// 获取渠道信息
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
    let deviceid = 'H5'
    let uid = params.uid
	  let time = params.time
    let sign = params.sign

    let ext_header = {}

    let header = {uid, time, sign, deviceid}
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
      let cbData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(cbData)
    }
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    let params = FN.getURLparams()
    let baseUrl = 'http://h5.511wan.com/pay.jsp'

    console.log('链接参数', params)
	console.log('回传参数', data)
    // 组装参数
     var arr = {
		  game_id: data.ext.game_id,
		  amount: data.amount / 100,
		  goods: data.productName,
		  gold: 1,
		  gameOrderId: data.order_id,
		  time: data.ext.timestamp,
		  sign: data.ext.sign,
		  uid: params.uid
	  }

	   let _arr = []
	  for (let i in arr) {
		  _arr.push(i + '=' + arr[i])
	  }

	  console.log('支付跳转地址', baseUrl + '?' + _arr.join('&'))
	  window.top.location.href = baseUrl + '?' + _arr.join('&')
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    let params = FN.getURLparams()
    // timestamp = Date.parse(new Date()) / 1000
    window.__payData__ = {
      product_name: data.productName,
      channelExt: params.channelExt,
      sdkloginmodel: params.sdkloginmodel
    }
    return window.__payData__
  }
}
