import '../common/config'
import FN from '../common/fn'
window.FN = FN

// import '../mock/interface.h5sdk'
// import '../mock/interface.fusesdk'
// import "../mock/interface.3ksdk"
import '../fuse/fusesdk'
import Client from '../client/client.sdk'

//微端传入的数据,存储到local
function Microend(){
    if(typeof gowanWebview ==='object'){
        //在微端调用H5页面
        return JSON.parse(gowanWebview.getPhoneParam())
    }else{
        //如果不是在微端调用H5页面
        FN.saveLocal("Microend",{
            imei: '',
            mac: '',
            utma: ''
        })
    }
  }
  //调用微端函数
  Microend()
  //判断,如果是微端就存储Microend
  if(typeof gowanWebview ==='object'){
    FN.saveLocal("Microend",Microend())
  }




let params = FN.getURLparams()   // 获取链接参数
Api.config({
    useMock: false,
    dataType: 'jsonp',
    urlModel: 1,
    domain: window.__3kapiDomain.get()
})

const getProp = (obj, props) => {
    let arr = props
    let target
    arr.forEach(e => {
        target = obj[arr.shift()]
    })
    return target
}
//监听接收数据
const initListener = SDK => {
    // TODO 来源验证
    window.addEventListener(
        'message',
        event => {
            let data = event.data
            // FN.log('message --->', data)
            if (data.type === 'CC') {
                //flymeChangeAccount需长时间监听，不需要校验
                if (!window.CLIENTSDK && data.fn != 'flymeChangeAccount' && data.fn != 'isWeb' && data.fn != 'isApp') {
                    if (data.fn != 'init' && JSON.stringify(FN.getSession('SDK_INIT_INFO')) == '{}') {
                        FN.showMsg('请先初始化')
                        return
                    } else if (data.fn != 'init' && data.fn != 'login' && JSON.stringify(FN.getSession('USER_INFO')) == '{}') {
                        FN.showMsg('请先登录')
                        return
                    } 
                }
                getProp(SDK, data.fn)(data.token, data.params)
            }
        },
        false
    )
}
;(async () => {
    let res = await FN.ajax(
        'jsLoad',
        {
            ct: 'h5',
            ac: 'js_load',
            yisdk_param: decodeURIComponent(params.yisdk_param || '') //TODO测试用  yes 游戏链接地址中获取到的yisdk_param
        },
        {
            domain: __h5apiDomain.get('jsLoad')
            // domain: 'http://yisdkdemo.3kwan.com:82/',
            // useMock: true
        }
    )

    if (res.code != 0) {
        FN.showMsg(res.msg)
        FN.removeSession('FUSE_CHANNEL_INFO')
        return
    } 
    // FN.log('h5 js_load:', res)  jsload存在sessionLocalstrag
    FN.saveSession('FUSE_CHANNEL_INFO', {
        ...res.data
    })

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

    let gameUrl = res.data.game_url
    // 在ios uc中支持WebViewJavascriptBridge
    if ((window.WebViewJavascriptBridge || window.BRIDGE.H5CallClient) && window.navigator.userAgent.indexOf('UCBrowser') == -1) {
        // 使用 原生SDK
        // FN.log('use Client SDK')
		console.log('use Client SDK')
        let src = window.DOMAIN_RH + 'h5sdk/useClient.js' + '?_cache=' + new Date().valueOf()
        // let src = window.location.origin + '/js/useClient.js'
        FN.inject('head', src, 'script')
            .then(res => {
                // FN.log('load useClient success!')
					console.log('load useClient success!')
                MARK = true
                window.CLIENTSDK.isApp = getMARK
                window.CLIENTSDK.isWeb = reverseMARK
                initListener(window.CLIENTSDK)
                // FN.log(window.CLIENTSDK,res.data.game_url)
                // 初始化游戏
                FN.inject('#main', gameUrl)
                    .then(res => {
                        // FN.log('init game success')
						  console.log('init game success')
                    })
                    .catch(e => {
                        // FN.log('game init:', e)
                         console.log('game init:', e)
                    })
            })
            .catch(e => {
                // FN.log('useClient:', e)
                //FN.warn('load useClient error!')
					console.log('load useClient error!')
            })
    } else {
        // 使用 JSSDK
        // FN.log('use JSSDK')
             console.log('use JSSDK')
        let { channel_js, channel } = res.data
        // TODO use.js 地址不同于渠道sdk，需要动态引入CDN
        let use_js = window.Chnnel_use_js_path + channel + '/' + channel + 'sdk.use.js' + `?_cache=${new Date().valueOf()}`
        // let use_js = window.DOMAIN_RH + channel + '/' + channel + 'sdk.use.js' + `?_cache=${new Date().valueOf()}`

        // 针对渠道需要加载多个js情况（如jquery）
        // let P1 = []
        async function loadChannelJs(callback) {
            // channel_js不为空时才加载
            if (channel_js != '') {
                let list = channel_js.split(',')
                for (let i = 0; i < list.length; i++) {
                    await FN.inject('head', list[i] + `?_cache=${new Date().valueOf()}`, 'script').then(() => {
                        // FN.log('load channelJS success!')
                            console.log('load channelJS success!')
                    })
                }
            }
            callback()
        }
        // 加载渠道JS
        loadChannelJs(() => {
            let P2 = FN.inject('head', use_js, 'script').then(() => {
                // FN.log('load useJS success!')
                    console.log('load useJS success!')

                // let useJSSDK = window.DOMAIN_RH + 'h5sdk/useH5.js' + `?_cache=${new Date().valueOf()}`
                let useJSSDK = window.DOMAIN_RH + 'js/useH5.js' + `?_cache=${new Date().valueOf()}`
                let P3 = FN.inject('head', useJSSDK, 'script').then(() => {
                     //FN.log('load useH5 success!')
						console.log('load useH5 success!')
                    window.JSSDK.isApp = getMARK
                    window.JSSDK.isWeb = reverseMARK
                    initListener(window.JSSDK)
                    // 初始化游戏
                    // 避免出现cp已经开始调用init，但是3ksdk中paramsLoad请求还未完成
                    if (channel === '3k') {
                        let id = setInterval(() => {
                            if (FN.getLocal('gw8').from_id) {
                                FN.inject('#main', res.data.game_url)
                                clearInterval(id)
                            }
                        }, 500)
                    } else {
                        FN.inject('#main', res.data.game_url)
                    }
                })
            })
        })
    }
})()
