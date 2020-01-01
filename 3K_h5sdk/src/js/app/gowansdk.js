import "../../assets/3ksdk/js/init.js" // rem 设置
import FN from "../../assets/3ksdk/js/common/fn.js"  // 公共函数
import "../../assets/3ksdk/js/ui.js"

let wxDomain = 'api.gowan8.com/?ct=wechat_auth&ac=user_oauth_base&callbackUrl='
if (/MicroMessenger/i.test(navigator.userAgent.toLowerCase())) {
    document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')) == null && (window.location = '//' + wxDomain + encodeURIComponent(window.location.href))
    // document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')) == null && (window.location = '//' + wxDomain + window.location.href)
    // window.location = '//' + wxDomain + encodeURIComponent(window.location.href)
    console.log('cookie',document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')))
}

// FN.log('channel:3ksdk init success!')
	console.log('channel:3ksdk init success!')
window.__3kapi_cz = {
    local: 'pay.gowan8.com',
    dev: 'pay.gowan8.com',
    test: 'pay.gowan8.com',
    prod: 'pay.gowan8.com',
    get() {
        return `//${window.__3kapi_cz[window.ENV]}/`
    }
}

const VERSION = '0.1.0'

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


let params = FN.getURLparams()
let gw8 = FN.getLocal('gw8')
let uuid = gw8['cookie_uuid'] || FN.uuid()
let globalHeader = {}
let extFooter = {}
;(async () => {
    let res = await FN._3k_sdk_ajax('3ksdk:paramsLoad', {
        ct: 'h5sdk',
        ac: 'js_load',
        'gowan_param': decodeURIComponent(params['gowan_param'])
    })
    if (res.code !== 0) return
    FN.saveLocal('gw8', {
        ...gw8,
        cookie_uuid: uuid,
        ...res.data
    })
    FN.saveSession('gw8', {
        ...gw8,
        cookie_uuid: uuid,
        ...res.data
    })

    let { from_id, game_id } = res.data

    globalHeader = {
        from_id, //	必填	包ID
        game_id, //	必填	游戏id
        is_jsdk: 1 //	必填	是否JSDK，1:是， 0：否
    }

    extFooter = {
        imei: FN.getLocal('Microend').imei, //手机IMEI/IDFA
        mac: FN.getLocal('Microend').mac, //手机mac网卡地址
        utma: FN.getLocal('Microend').utma, //设备标识

        // imei: '', //手机IMEI/IDFA
        // mac: '', //手机mac网卡地址
        device: '', //设备标识（每次游戏安装之后生成并存储到本地; MD5(IMEI/IDFA+机型+MAC+分辨率)）
        screen: window.screen.width + 'x' + window.screen.height, //分辨率
        platform: FN.OS.isMobile ? (FN.OS.isIOS ? 1 : FN.OS.isAndroid ? 2 : 3) : 3, //手机系统: 1、ios；2、android；3、其他
        model: '', //手机机型
        cookie_uuid: uuid, //唯一标识码，客户端生成一个唯一标识存到cookie
        system: '', //手机系统版本
        system_language: '', //手机语言
        net: 4, //手机网络1、2G；2、3G；3、wifi；4、其他
        operator: '', //运营商; 客户端传递运营商首字母简写大写
        location: '', //	地址位置
        version: VERSION //必填	SDK版本号
    }
    FN.Api.config({
        useMock: false
    })
})()
//接收微端的信息

window.gw8SDK = {
    init() {
        let params = {
            ct: 'init',
            ac: 'index',

            ...globalHeader,
            ...extFooter
        }
        return FN._3k_sdk_ajax('3ksdk:init', params)
    },
    login(data) {
        let params = {
            ct: 'user',
            ac: 'login',
            mode: 0, //必填	登陆模式：0:账号密码登陆/1:手机验证码登陆
            account: '', //登陆账号:账号登陆为账号，手机登陆为手机
            password: '', //	登陆密码，账号登陆必填
            code: '', //手机验证码，手机登陆必填
            code_sign: '', //手机验证码签名信息，发送验证码时返回
            ...globalHeader,
            ...extFooter,
            ...data
        }

        return FN._3k_sdk_ajax('3ksdk:login', params)
    },
    rechargeList(data) {
        let params = {
            ct: 'wap',
            ac: 'h5sdk',
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:rechargeList', params, {
            domain: window.__3kapi_cz.get()
        })
    },
    recharge(data) {
        let KEY = String(new Date().getTime()).substr(0, 10)
        let obj = {
            ...globalHeader,
            ...extFooter,
            ...data
        }
        let c = FN.requestEncrypt(JSON.stringify(obj), KEY).e
        let search = window.FN.Obj2URL({
            ct: 'wap',
            p: c,
            ts: KEY,
            js: 1
        })
        // FN.log('params:', obj, {
        //     ct: 'wap',
        //     p: c,
        //     ts: KEY,
        //     js: 1
        // })
		console.log('params:', obj, {
				ct: 'wap',
				p: c,
				ts: KEY,
				js: 1
			})
        return window.__3kapi_cz.get() + '?' + search
    },
    register(data) {
        let params = {
            ct: 'user',
            ac: 'register',
            mode: 0, //必填	注册模式：0:快速注册/1:手机注册
            account: '', //必填	账号: 快速注册为账号,手机注册为手机号
            password: '', //登陆密码，快速注册必填
            code: '', //手机验证码，手机注册必填
            code_sign: '', //手机验证码签名信息，发送验证码时返回
            real_name: '', //实名，强制实名注册填
            id_number: '', //身份证号, 强制实名注册填
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:register', params)
    },
    sendAuthCode(data) {
        let params = {
            ct: 'send_code',
            ac: 'index',
            user_id: 0, //必填	登陆后获取验证码必填，注册时不填
            phone: '', //必填	手机号，登陆后获取为用户绑定的手机号
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:sendAuthCode', params)
    },
    updatePassword(data) {
        let params = {
            ct: 'user',
            ac: 'password',
            mode: 0, //	必填	模式：0:旧密码/1:手机验证码/2:邮箱
            user_id: 0, //	必填	3k用户uid
            new_password: '', //	必填	新密码
            old_password: '', //		旧密码，通过旧密码修改时填写
            code: '', //		手机验证码，通过手机验证码找回时填写
            code_sign: '', //		手机验证码签名信息，发送验证码时返回
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:password', params)
    },
    realNameAuth(data) {
        let params = {
            ct: 'user',
            ac: 'real_name',
            user_id: 0, //	必填	3k用户uid
            real_mame: '', //	必填	实名
            numner_id: '', //	必填	身份证号
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:login', params)
    },
    getUserInfo(data) {
        let params = {
            ct: 'user',
            ac: 'user_info',
            user_id: 0, //	必填	3k用户uid
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:userInfo', params)
    },
    updateUserInfo(data) {
        let params = {
            ct: 'user',
            ac: 'update_info',
            user_id: 0, //	必填	3k用户uid
            province: '', //	必填	省份
            city: '', //	必填	城市
            birthday: '', //	必填	生日
            sex: '', //	必填	性别 0女1男
            occupation: '', //	必填	职业
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:updateInfo', params)
    },
    getZoneList(data) {
        let params = {
            ct: 'cfg',
            ac: 'zone',
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:zone', params)
    },
    getOccupation(data) {
        let params = {
            ct: 'cfg',
            ac: 'occupation',
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:occupation', params)
    },
    paramsLoad(data) {
        let params =  {
            ct: 'h5sdk',
            ac: 'js_load',
            'gowan_param': '', // yes 游戏链接地址中获取到的gowan_param
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:paramsLoad',params)
    },
    bindPhone(data) {
        let params = {
            ct: 'user',
            ac: 'bind_phone',
            'gowan_param': '',
            version: VERSION,
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:bindPhone', params)
    },
    unBindPhone(data) {
        let params = {
            ct: 'user',
            ac: 'unbind_phone',
            'gowan_param': '',
            ...globalHeader,
            ...extFooter,
            ...data
        }
        return FN._3k_sdk_ajax('3ksdk:unBindPhone', params)
    }
}
