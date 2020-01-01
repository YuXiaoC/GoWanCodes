import FN from '../utility/fn'
import configUrl from '../common/config'
// let wxDomain = 'api.gowan8.com/?ct=wechat_auth&ac=user_oauth_base&callbackUrl='
// let wxDomain = `${configUrl.__gowanapiDomain.get()}?ct=login&ac=gzh&callback=`
// if (/MicroMessenger/i.test(navigator.userAgent.toLowerCase())) {
//   // document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')) == null && (window.location.href = '//' + wxDomain + encodeURIComponent(window.location.href))
//   let pkey = FN.getURLparams().pkey || ''
//   if (!pkey) {
//     window.location.href = '//' + wxDomain + encodeURIComponent(window.location.href)
//   }
//   console.log('cookie', document.cookie.match(new RegExp('(^| )' + 'AD5BDB6C223CA3' + '=([^;]*)(;|$)')))
// }

FN.log('channel:gowansdk init success!')

const VERSION = '1.2'

let params = FN.getURLparams()
let zjgw = FN.getLocal('zjgw')
let uuid = zjgw['cookie_uuid'] || FN.uuid()

FN.saveLocal('zjgw', {
  cookie_uuid: uuid,
  game_id: FN.getSession('FUSE_CHANNEL_INFO').gowan_game_id,
  from_id: FN.getSession('FUSE_CHANNEL_INFO').from_id
})
FN.saveSession('zjgw', {
  cookie_uuid: uuid,
  game_id: FN.getSession('FUSE_CHANNEL_INFO').gowan_game_id,
  from_id: FN.getSession('FUSE_CHANNEL_INFO').from_id
})
let globalHeader = {}
let extFooter = {}

let { from_id, game_id } = FN.getLocal('zjgw')

globalHeader = {
  from_id, // 必填    包ID
  game_id, // 必填    游戏id
  is_jsdk: 1 // 必填  是否JSDK，1:是， 0：否
}

extFooter = {
  imei: FN.getSession('MicroParame').imei, // 手机IMEI/IDFA
  mac: FN.getSession('MicroParame').mac, // 手机mac网卡地址
  device: uuid, // 设备标识（每次游戏安装之后生成并存储到本地; MD5(IMEI/IDFA+机型+MAC+分辨率)）
  screen: window.screen.width + 'x' + window.screen.height, // 分辨率
  platform: FN.OS.isMobile ? (FN.OS.isIOS ? 1 : FN.OS.isAndroid ? 2 : 3) : 3, // 手机系统: 1、ios；2、android；3、其他
  model: '', // 手机机型
  cookie_uuid: uuid, // 唯一标识码，客户端生成一个唯一标识存到cookie
  system: '', // 手机系统版本
  system_language: '', // 手机语言
  net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
  operator: '', // 运营商; 客户端传递运营商首字母简写大写
  location: '', // 地址位置
  version: VERSION // 必填SDK版本号
}
FN.Api.config({
  // useMock: true
})
// })()
window.zjgwSDK = {
  init () {
    let params = {
      ct: 'init',
      ac: 'index',

      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, '') // 手机mac网卡地址
    }
    return FN.gowanSdkAjax('gowansdk:init', params)
  },
  login (data) {
    let params = {
      ct: 'user',
      ac: 'login',
      mode: 0, // 必填 登陆模式：0:账号密码登陆/1:手机验证码登陆
      account: '', // 登陆账号:账号登陆为账号，手机登陆为手机
      password: '', // 登陆密码，账号登陆必填
      code: '', // 手机验证码，手机登陆必填
      code_sign: '', // 手机验证码签名信息，发送验证码时返回
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:login', params)
  },
  realNameAuth (data) {
    let params = {
      ct: 'user',
      ac: 'real_name',
      user_id: 0, // 必填用户uid
      real_mame: '', // 必填实名
      numner_id: '', // 必填身份证号
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:realName', params)
  },
  // 注册
  register (data) {
    let params = {
      ct: 'user',
      ac: 'register',
      mode: 0, // 必填注册模式：0:快速注册/1:手机注册
      account: '', // 必填账号: 快速注册为账号,手机注册为手机号
      password: '', // 登陆密码，快速注册必填
      code: '', // 手机验证码，手机注册必填
      code_sign: '', // 手机验证码签名信息，发送验证码时返回
      real_name: '', // 实名，强制实名注册填
      id_number: '', // 身份证号, 强制实名注册填
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:register', params)
  },
  // 发送验证码
  sendAuthCode (data) {
    let params = {
      ct: 'send_code',
      ac: 'index',
      user_id: 0, // 必填登陆后获取验证码必填，注册时不填
      phone: '', // 必填手机号，登陆后获取为用户绑定的手机号
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:sendAuthCode', params)
  },
  rechargeList (data) {
    let params = {
      ct: 'wap',
      ac: 'h5sdk',
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:rechargeList', params, {
      domain: configUrl.__gowanpayDomain.get()
    })
  },
  updatePassword (data) {
    let params = {
      ct: 'user',
      ac: 'password',
      mode: 0, // 必填 模式：0:旧密码/1:手机验证码/2:邮箱
      user_id: 0, // 必填 GO玩用户uid
      new_password: '', // 必填新密码
      old_password: '', // 旧密码，通过旧密码修改时填写
      code: '', // 手机验证码，通过手机验证码找回时填写
      code_sign: '', // 手机验证码签名信息，发送验证码时返回
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:updatePassword', params)
  },
  bindPhone (data) {
    let params = {
      ct: 'user',
      ac: 'bind_phone',
      'gowan_param': '',
      version: VERSION,
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:bindPhone', params)
  },
  unBindPhone (data) {
    let params = {
      ct: 'user',
      ac: 'unbind_phone',
      'gowan_param': '',
      version: VERSION,
      ...globalHeader,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      ...data
    }
    return FN.gowanSdkAjax('gowansdk:unBindPhone', params)
  }
}
