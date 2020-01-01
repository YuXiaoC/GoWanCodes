<template>
<div></div>
</template>
<script>
import FN from '../utility/fn.js'
import Client from '../client/client.sdk'
import configUrl from '../common/config'
export default {
  mounted () {
    // this.saveMicroParame()
    this.setChannelMsg()
  },
  methods: {
    extendParams: function () {
      let params = FN.getURLparams() // 获取链接参数
      let ps = []
      for (let v in params) {
        if (v !== 'yisdk_param' && v !== 'ext_param') {
          ps.push(v + '=' + params[v])
        }
      }
      if (!ps) return ''
      return ps.join('&')
    },
    setChannelMsg () {
      var _this = this
      let params = FN.getURLparams() // 获取链接参数

      ;(async () => {
        let channelRes = await FN.ajax(
          'jsLoad',
          {
            ct: 'h5',
            ac: 'js_load',
            yisdk_param: decodeURIComponent(params.yisdk_param || ''), // TODO测试用  yes 游戏链接地址中获取到的yisdk_param
            ext_param: decodeURIComponent(params.ext_param || ''), // 为了获取渠道的from_id
            extend: _this.extendParams()
          },
          {
            // domain: '//yisdk-api.gowan8.com/'
            domain: '//yisdk-api.gowanme.com/'
            // domain: '//192.168.0.162:80',
            // useMock: true
          }

        )
        FN.log('channelRes------>', channelRes)
        // 错误信息
        if (channelRes.code !== 0) {
          FN.showMsg(channelRes.msg)
          FN.removeSession('FUSE_CHANNEL_INFO')
        } else {
          if (channelRes.data.channel === 'gowan' || channelRes.data.channel === 'applegw') {
            let wxDomain = `${configUrl.__gowanapiDomain.get()}?ct=login&ac=gzh&callback=`
            let urlparams = FN.getURLparams()
            if (FN.OS.isWX) { // /MicroMessenger/i.test(navigator.userAgent.toLowerCase())
              FN.log('是微信环境')
              // let RECORD = FN.getLocal('LOGIN_RECORD')
              // let LOGIN_RECORD = JSON.stringify(RECORD) !== '{}' && RECORD[0] ? RECORD[0].account : ''
              if (document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')) == null || FN.getCookieAccount() === false) {
                window.location.href = '//' + wxDomain + encodeURIComponent(window.location.href)
                return false
              }
            }
          }
          // 缓存channel信息
          FN.saveSession('FUSE_CHANNEL_INFO', {
            ...channelRes.data
          })
          _this.saveMicroParame()

          // 保存zjgw
          // if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'gowan') {
          //   let zjgw = FN.getLocal('zjgw')
          //   let uuid = zjgw['cookie_uuid'] || FN.uuid()
          //   FN.saveLocal('zjgw', {
          //     cookie_uuid: uuid,
          //     game_id: FN.getLocal('FUSE_CHANNEL_INFO').gowan_game_id,
          //     form: FN.getLocal('FUSE_CHANNEL_INFO').from_id
          //   })
          //   FN.saveSession('zjgw', {
          //     cookie_uuid: uuid,
          //     game_id: FN.getLocal('FUSE_CHANNEL_INFO').gowan_game_id,
          //     form: FN.getLocal('FUSE_CHANNEL_INFO').from_id
          //   })
          // }
          await Client.setup()
          let MARK = false
          let getMARK = (token, args) =>
            FN.post({
              type: 'CC',
              token,
              payload: {
                mark: MARK
              }
            })
          let reverseMARK = (token, args) =>
            FN.post({
              type: 'CC',
              token,
              payload: {
                mark: !MARK
              }
            })

          window.CLIENTSDK = {}

          // 显示游戏名称到标题栏
          document.title = FN.getSession('FUSE_CHANNEL_INFO').game_name
          // 使用原生sdk
          let params = FN.getURLparams() // 获取链接参数
          // if ((window.WebViewJavascriptBridge || window.BRIDGE.H5CallClient) && window.navigator.userAgent.indexOf('UCBrowser') === -1) {
          // if ((window.WebViewJavascriptBridge || window.BRIDGE.H5CallClient) && window.navigator.userAgent.indexOf('UCBrowser') === -1) {
          FN.log(params.isApp === 'true')
          FN.log('链接参数params', params)
          if (params.isApp === 'true') {
            // 使用 原生SDK
            FN.log(' >>> use Client SDK')
            const userAgent = navigator.userAgent.toLowerCase()
            const isIOS = /iphone|ipad|ipod/i.test(userAgent)

            let src = isIOS ? window.DOMAIN_RH + 'h5sdk/clientFn.js' + '?_cache=' + new Date().valueOf() : window.DOMAIN_RH + 'h5sdk/clientFn1.js' + '?_cache=' + new Date().valueOf()
            FN.inject('head', src, 'script')
              .then(res => {
                FN.log(' >>> load useClient success!')
                // MARK = true
                // window.CLIENTSDK.isApp = getMARK
                // window.CLIENTSDK.isWeb = reverseMARK
                // 初始化游戏
                FN.inject('#game', FN.getSession('FUSE_CHANNEL_INFO').game_url)
                  .then(res => {
                    FN.log('init game success')
                    document.getElementById('page-loading').style.display = 'none'
                  })
                  .catch(e => {
                    FN.log('game init:', e)
                  })
              })
              .catch(e => {
                FN.log('useClient:', e)
              })
          } else {
            // 加载渠道js 除了GO玩（千禧）之外的渠道
            let { channel_js, channel } = channelRes.data
            // FN.log(channel_js)
            // use.js 地址不同于渠道sdk，需要动态引入CDN
            let channelUseJsUrl = window.ChnnelUseJsPath + channel + '/' + channel + 'sdk.use.js' + `?_cache=${new Date().valueOf()}`
            // 针对渠道需要加载多个js情况（如jquery）

            let loadChannelJs = function (callback) {
            // channel_js不为空时才加载
              if (channel_js !== '') {
                let list = channel_js.split(',')
                for (let i = 0; i < list.length; i++) {
                  FN.inject('head', list[i] + `?_cache=${new Date().valueOf()}`, 'script').then(() => {
                  // FN.inject('head', list[i], 'script').then(() => {
                    // 加载sdk.js成功
                    FN.log('加载 channelJS success!')
                  })
                }
              }
              callback()
            }
            // 加载渠道的JS
            loadChannelJs(() => {
              FN.inject('head', channelUseJsUrl, 'script').then(() => {
                FN.log(' >><<<> load useJs success!')
                // window.JSSDK.isApp = getMARK
                // window.JSSDK.isWeb = reverseMARK
                // 初始化游戏
                FN.inject('#game', FN.getSession('FUSE_CHANNEL_INFO').game_url)
                  .then(res => {
                    FN.log('init game success')
                    document.getElementById('page-loading').style.display = 'none'
                  })
                  .catch(e => {
                    FN.log('game init:', e)
                  })
              })
            })
          }
        }
      })()
    },
    saveMicroParame () {
      // 微端传入的数据,存储到local
      function Microend () {
        if (typeof gowanWebview === 'object') {
        // 在微端调用H5页面
          FN.log(JSON.parse(gowanWebview.getPhoneParam()))
          return JSON.parse(gowanWebview.getPhoneParam())
        } else {
          let local = FN.getSession('FUSE_CHANNEL_INFO')

          // 给不是gowan渠道添加cookieuid
          if (JSON.stringify(FN.getLocal('uuid')) === '{}') {
            FN.saveLocal('uuid', FN.uuid())
            // 如果不是在微端调用H5页面
            FN.saveSession('MicroParame', {
              imei: FN.getLocal('uuid'),
              mac: FN.getLocal('uuid'),
              utma: FN.getLocal('uuid')
            })
          } else {
            FN.saveSession('MicroParame', {
              imei: FN.getLocal('uuid'),
              mac: FN.getLocal('uuid'),
              utma: FN.getLocal('uuid')
            })
          }
        }
      }
      // 调用微端函数
      Microend()
      // 判断,如果是微端就存储Microend
      if (typeof gowanWebview === 'object') {
        FN.saveSession('MicroParame', Microend())
      }
    },
    // 初始化配置
    initConfig () {
      FN.log('initConfig配置' + FN.getSession('init'))
    }
  }
}
</script>
<style lang="scss" scoped>
.params{
  width:100%;
  height:100%;
  position: fixed;

  .loading-com{
    width:.35rem;
    height:.35rem;
    top:50%;
    left: 50%;
    margin-left:.175rem;
    margin-top:.175rem;
    position: absolute;
    img{
      width:100%;
    }
  }
}
</style>
