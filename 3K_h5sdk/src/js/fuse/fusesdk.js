import FN from '../common/fn'

const VERSION = '1.2'

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



FN._fuse_sdk_ajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function(obj) {
    let { ct, ac } = obj
    let newObj = { ...obj }
    delete newObj.ac
    delete newObj.ct

    // FN.log(`${arg[0]}(input)`, arg[1])
	console.log(`${arg[0]}(input)`, arg[1])

    return {
      ct,
      ac,
      p: FN.requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      is_jsdk: 1
    }
  }
  // payload[2].domain = window.__3kapiDomain.get()
  return new Promise((resolve, reject) => {
    window.Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
        }
        if (res.code != 0) {
          // ... 错误处理

          FN.showMsg(res.msg)
        }
        // FN.log(`${arg[0]}(res)`, res)
		console.log(`${arg[0]}(res)`, res)
        resolve(res)
      })
      .catch(e => {
        // FN.log('FN._fuse_sdk_ajax error:', e)
		console.log('FN._fuse_sdk_ajax error:', e)
      })
  })
}

const getGlobalHeader = () => {
  let gw8 = FN.getLocal('gw8')
  let gw82 = FN.getSession('gw8')
  let local = FN.getSession('FUSE_CHANNEL_INFO')

  let from_id = local.channel == 'gowan' ? gw8.from_id || gw82.from_id : '0'
  let cookie_uuid = local.channel == 'gowan' ? gw8['cookie_uuid'] || gw82['cookie_uuid'] : ''

  return {
    channel: local.channel,
    game_id: local.game_id,
    game_name: local.game_name,
    from_id: from_id, // fuse 默认为 0
    is_jsdk: 1,
    cookie_uuid: cookie_uuid
  }
}

let extFooter = {
  imei: FN.getLocal('Microend').imei, //手机IMEI/IDFA
  mac: FN.getLocal('Microend').mac, //手机mac网卡地址
  utma: FN.getLocal('Microend').utma, //设备标识
  // imei: '', //手机IMEI/IDFA
  // mac: '', //手机mac网卡地址
  // utma: '', //设备标识
  model: '', //手机机型

  screen: window.screen.width + 'x' + window.screen.height,

  os: FN.OS.isMobile ? (FN.OS.isIOS ? 4 : FN.OS.isAndroid ? 1 : 3) : 3, //手机系统1、android；2、越狱ios；3、其他；4、正版ios
  os_version: '', //系统版本号

  simulator: '0', //是否模拟器，0不是；1是
  isroot: 0, //是否root/越狱，0不是1是
  serial_number: '', //设备序列号
  imsi: '', //手机卡的编号
  android_id: '', //设备标识 ANDROID_iD

  net: 4, //手机网络1、2G；2、3G；3、wifi；4、其他
  operators: 4, //运营商 1、移动；2、联通；3、电信；4、其他
  location: '', //地址位置

  version: VERSION, //必填	融合SDK版本号
  game_version: '1.0', //必填	游戏版本号
  platform_version: '1.0', //	必填	渠道版本号
  server_version: '1.2' //服务端版本号
}

let userBaseMsg = {
  user_id: '', //必填	用户id
  phone: '', //用户电话号码
  is_bind_phone: 0, //是否绑定手机号码  1 是  0 不是
  is_realname: 0 //是否实名    1 是  0 不是
}

let roleBaseConfig = {
  server_id: '1', //必填	服务器ID
  server_name: '1', //必填	服务器名称
  role_id: '1000', //必填	角色id
  role_name: '1', //必填	角色名称
  role_level: '1', //必填	角色等级
  balance: '1' //必填	游戏币余额
  //   vip_level: '1', //必填	vip等级
}

let roleBaseMsg = {
  ...roleBaseConfig,
  balance: '1', //必填	游戏币余额
  vip_level: '1', //必填	VIP等级
  guild_name: '', //公会名称
  guild_id: '', //公会id
  fighting: '' //战力
}

window.FUSESDK = {
  init(params = {}) {
    let input = {
      ct: 'init',
      ac: 'index',
      ...getGlobalHeader(),
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:init', input, {
      domain: __fuseDomain.get('init')
    })
  },
  login(params = {}) {
    let input = {
      ct: 'user',
      ac: 'login',
      ...getGlobalHeader(),

      ext: {}, //	额外渠道参数：

      data: {}, //大部分渠道都会有特殊参数要传
      user_id: '', //从客户端获取的用户id,方便排查问题。比如步步高
      phone: '', //用户电话号码
      is_bind_phone: 0, //是否绑定手机号码  1 是  0 不是
      is_realname: 0, //是否实名    1 是  0 不是
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:login', input, {
      domain: __fuseDomain.get('user')
    })
  },
  roleLogin(params = {}) {
    let input = {
      ct: 'role',
      ac: 'login',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:roleLogin', input, {
      domain: __fuseDomain.get('role')
    })
  },
  roleAdd(params = {}) {
    let input = {
      ct: 'role',
      ac: 'add',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:roleAdd', input, {
      domain: __fuseDomain.get('role')
    })
  },
  roleLevel(params = {}) {
    let input = {
      ct: 'role',
      ac: 'level',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:roleLevel', input, {
      domain: __fuseDomain.get('role')
    })
  },
  makeOrder(params = {}) {
    let input = {
      ct: 'pay',
      ac: 'make_order',
      ...getGlobalHeader(),
      ...roleBaseConfig,
      user_id: '', //	必填	用户id
      amount: '', //	必填	充值金额，单位：分
      notify_url: '', //	必填	CP通知URL
      callback_info: '', //	CP回调参数
      ext: '', //	额外渠道参数：  对象json化
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:makeOrder', input, {
      domain: __fuseDomain.get('pay')
    })
  },
  checkBindPhone(params = {}) {
    let input = {
      ct: 'user',
      ac: 'check_bind_phone',
      ...getGlobalHeader(),
      ...extFooter,
      ...params
    }
    return FN._fuse_sdk_ajax('fuse:checkBindPhone', input, {
      domain: __fuseDomain.get('user')
    })
  },
  bindPhone(params = {}) {
    let guid = FN.getSession('FUSE_USER_INFO').guid
    let KEY = String(new Date().getTime()).substr(0, 10)
    let obj = {
      ...getGlobalHeader(),
      //   guid: 1221, //	必填	用户的guid，登录验证接口有返回
      ...extFooter,
      ...params,
      guid
      // is_jsdk: 1
    }
    let c = FN.requestEncrypt(JSON.stringify(obj), KEY).e
    let search = FN.Obj2URL({
      ct: 'user',
      ac: 'bind_phone',
      p: c,
      ts: KEY,
      is_jsdk: 1
    })
    return __fuseDomain.get('user') + '?' + search
  },
  goToGM() {
    // let input = {
    //   ct: 'role',
    //   ac: 'csc',
    //   ...getGlobalHeader(),
    //   ...userBaseMsg,
    //   ...roleBaseMsg,
    //   ...extFooter,
    //   user_id: FN.getSession('FUSE_USER_INFO').user_id,
    //   phone: FN.getSession('FUSE_USER_INFO').phone,
    //   is_bind_phone: FN.getSession('FUSE_USER_INFO').is_bind_phone,
    //   is_realname: FN.getSession('FUSE_USER_INFO').is_realname
    // }
    // return FN._fuse_sdk_ajax('fuse:goToGM', input, {
    //   domain: __fuseDomain.get('role')
    // })
    let sdkInitInfo = FN.getSession("SDK_INIT_INFO")
    FN.showTip(sdkInitInfo.help_url)
  }
}
