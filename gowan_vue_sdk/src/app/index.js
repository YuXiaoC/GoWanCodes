import FN from '../utility/fn'
import './gowansdk'
window.FN = FN
let params = FN.getURLparams() // 获取连接参数
// const getProp = (obj, props) => {
//   let arr = props
//   FN.log(arr)
//   let target
//   arr.forEach(e => {
//     target = obj[arr.shift()]
//   })
//   return target
// }

// 监听接收数据
// const initListener = SDK => {
//   // TODO 来源验证
//   window.addEventListener(
//     'message',
//     event => {
//       let data = event.data
//       // FN.log('message --->', data)
//       if (data.type === 'CC') {
//         if (data.fn != 'listen' && data.fn != 'flymeChangeAccount' && data.fn != 'isWeb') {
//           if (data.fn != 'init' && JSON.stringify(FN.getSession('SDK_INIT_INFO')) == '{}') {
//             FN.showMsg('请先初始化')
//           }
//         }
//         getProp(SDK, data.fn)(data.token, data.params)
//       }
//     },
//     false
//   )
// }

;(async () => {
  // 请求渠道信息
  let channelRes = await FN.ajax(
    'jsLoad',
    {
      ct: 'h5',
      ac: 'js_load',
      yisdk_param: decodeURIComponent(params.yisdk_param || ''), // TODO测试用  yes 游戏链接地址中获取到的yisdk_param
      from_param: decodeURIComponent(params.from_param || '') // 为了获取渠道的from_id
    },
    {
      domain: '//yisdk-api.gowan8.com/'
      // domain: '//192.168.0.162:80',
      // useMock: true
    }

  )
  // 错误信息
  if (channelRes.code !== 0) {
    FN.showMsg(channelRes.msg)
    FN.removeSession('FUSE_CHANNEL_INFO')
  } else {
    // 缓存channel信息
    FN.saveSession('FUSE_CHANNEL_INFO', {
      ...channelRes.data
    })
  }
  // 保存zjgw

  // 加载融合sdk
  FN.log('load use JSSDK ing....')
  FN.log(channelRes.data)
  let { channel_js, channel } = channelRes.data
  // FN.log(channel_js)
  // use.js 地址不同于渠道sdk，需要动态引入CDN
  let channelUseJsUrl = window.ChnnelUseJsPath + channel + '/' + channel + 'sdk.use.js' + `?_cache=${new Date().valueOf()}`

  // 针对渠道需要加载多个js情况（如jquery）
  async function loadChannelJs (callback) {
    // channel_js不为空时才加载
    if (channel_js !== '') {
      let list = channel_js.split(',')
      for (let i = 0; i < list.length; i++) {
        await FN.inject('head', list[i] + `?_cache=${new Date().valueOf()}`, 'script').then(() => {
          FN.log('load channelJS success!')
        })
      }
    }
    callback()
  }

  loadChannelJs(() => {
    FN.inject('head', channelUseJsUrl, 'script').then(() => {
      FN.log('load useJs success!')
      // let useJSSDK = 'http://192.168.0.162:8081/useH5.js' + `?_cache=${new Date().valueOf()}`
      // FN.inject('head', useJSSDK, 'script').then(() => {
      FN.log('load useH5 success!')
      // initListener(window.JSSDK)
      // FN.inject('#main', channelRes.data.game_url)
      // 加载游戏链接
      document.getElementById('game').src = channelRes.data.game_url
      // })
    })
  })
}
)()
