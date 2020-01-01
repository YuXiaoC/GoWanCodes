// import require from '../ledou/require.min.js'
// import MobGi from '../ledou/mobgi_jssdk_1.0.0'
import '../ledou/mobgi_jssdk_1.0.0'
console.log(MobGi)
console.log('meitusdk.use.js')
// 乐逗创建广告容器
var el = document.createElement('div')
el.setAttribute('id', 'adContainer')
el.style.display = 'none'
document.body.appendChild(el)
// 如果接入了乐逗广告,则初始化乐逗广告SDK
if (FN.getSession('FUSE_CHANNEL_INFO').is_ledou) {
  console.log('接入了乐逗广告')
  let config = {
    containerId: 'adContainer',
    appKey: 'CABE2B73C2223743DE2A',
    adType: 1,
    blockId: '2018111213321556583343',
    appVersion: '2.3.4'
  }
  var mobGi = new MobGi(config)
  mobGi.addEventListener('loaded', function (state) {
    console.log('加载完成，状态', state)
  })
  mobGi.addEventListener('complete', function () {
    let payload = {
      statusCode: 0,
      status: '观看完成'
    }
    FN.post({
      type: 'CC',
      token: FN.getSession('gowantoken'),
      payload
    })
  })
  mobGi.addEventListener('close', function () {
    console.log('关闭播放')
  })
  mobGi.addEventListener('skip', function () {
    callback()
    let payload = {
      statusCode: 1,
      status: '关闭视频webview'
    }
    FN.post({
      type: 'CC',
      token: FN.getSession('gowantoken'),
      payload
    })
  })
  mobGi.addEventListener('click', function () {
    console.log('点击')
    let payload = {
      statusCode: 0,
      status: '观看完成'
    }
    FN.post({
      type: 'CC',
      token: FN.getSession('gowantoken'),
      payload
    })
  })
  mobGi.init()
}

window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('initdata', data)
    FN.saveSession('shareData', data)
    let initdata = {
      share: {
        title: data.share.title, // 分享标题
        pic: data.share.pic, // 分享图片的地址
        summary: data.share.summary // 分享描述
      }
    }

    mtgsdk.init(initdata)
    // sdk已经加载完成，可执行游戏的初始化逻辑
    callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
  },
  login ({token, data = {}, callback}) {
    FN.log('融合登录')
    // console.log(FN.getURLparams())
    let header = {openid: FN.getURLparams().open_id, access_token: FN.getURLparams().access_token}
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
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let {productName} = data
    let a = 'app_id=' + data.ext.app_id + '&amount=' + data.amount + '&open_id=' + FN.getURLparams().open_id + '&game_order_id=' + data.order_id + '&game_callback_uri=' + data.ext.game_callback_uri + '&product_name=' + productName + '&method=wap&sign=' + data.ext.game_sign + '&game_callback_ext=' + data.ext.game_callback_ext
    console.log(a)
    /* setTimeout(function () {
	  let paydata = {'payParams': a}
	  mtgsdk.openPayLayer(paydata)
	}, 100) */

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
    let url = 'https://pay.yx.meitu.com/e-wallet?' + a
    window.open(url)
  },
  videoAd ({token, data = {}, callback}) {
    console.log('视频')

    // 接入乐逗广告,直接调用该方法
    if (FN.getSession('FUSE_CHANNEL_INFO').is_ledou) {
      FN.saveSession('gowantoken', token)
      var isReady = mobGi.isReady()
      console.log('isReady', isReady)
      if (isReady === true) {
        mobGi.showAds()
      }
    } else { // 否则调用渠道的广告,如果渠道没有广告接口,则返回"敬请期待"
      console.log('没有广告')
      callback({
        statusCode: 2,
        status: '敬请期待'
      })
    }
  },
  getEXT (data) {
    FN.log(data)
    let {productName} = data
    window.__payData__ = {
      product_name: productName,
      method: 'wap'
    }
    return window.__payData__
  },
  shareToArk ({token, data = {}, callback}) {
    console.log(data)
    let shareParams = {
      title: data.summary ? data.summary : FN.getSession('shareData').share.title, // 标题，非必填，无该字段则取初始化的值
      pic: data.picUrl ? data.picUrl : FN.getSession('shareData').share.pic, // 图片，非必填，无该字段则取初始化的值
      summary: data.summary ? data.summary : FN.getSession('shareData').share.summary, // 内容，非必填，无该字段则取初始化的值
      callback: function (result) {
        FN.showMsg('分享成功')
      }
    }

    mtgsdk.openShareLayer(shareParams)
    setTimeout(function () {
      callback({
        statusCode: 0,
        aioType: 4, // 1: 个人  4:群聊
        status: '分享成功'
      })
    }, 5000)
  }
}
