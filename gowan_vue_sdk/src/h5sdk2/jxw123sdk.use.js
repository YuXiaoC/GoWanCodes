// 就想玩游戏测试地址http://www.jxw123.com/play/10469.html
// import md5 from 'blueimp-md5'
FN.log('jxw123.use.js')
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
  login ({ data = {}, callback }) {
	
    // 渠道登录方法在这里调用
    let params = FN.getURLparams() // 获取链接参数
    let deviceid = 'H5'
    let uid = params.uid
	let token = params.token
	
    let ext_header = {}
    let header = { deviceid, uid, token}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
		  console.log('登陆请求回调参数',res);
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
  recharge ({token,data = {}, callback}) {
	  console.log('token', token);
	  console.log('data', data);
	  let uid = data.fuseParams.user_id
	  
	  // 实例化GameJxw对象
	  var jxwSv = new JxwSv({
		  uid:uid,
		  token:token
	  });
    // 组装参数
    var pay = {}
	pay.orderid = data.order_id
	pay.money = parseInt(data.ext.money)
	pay.product = data.productName
	pay.appid = data.ext.appid
	pay.sign = data.ext.sign
	pay.onPayCallback = function(res){
		if(res.status == 10000){
			alert('支付成功');
		}else{
			alert('支付失败');
		}
	}
	pay.onPayCancel = function(res){
		alert('取消支付');
	}
    jxwSv.pay(pay);
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    let params = FN.getURLparams()

    window.__payData__ = {
      product_name: data.productName
    }
    return window.__payData__
  }
}
