import FN from '../utility/fn'
import configUrl from '../common/config'
const VERSION = '1.2'
let getGlobalHeader = () => {
  let zjgw = FN.getLocal('zjgw')
  let zjgw2 = FN.getSession('zjgw')
  let local = FN.getSession('FUSE_CHANNEL_INFO')

  let from_id = local.channel === 'gowan' ? zjgw.from_id || zjgw2.from_id : FN.getSession('FUSE_CHANNEL_INFO').from_id
  let cookie_uuid = local.channel === 'gowan' ? zjgw['cookie_uuid'] || zjgw2['cookie_uuid'] : FN.getLocal('uuid')

  return {
    channel: local.channel,
    game_id: local.game_id,
    game_name: FN.getSession('FUSE_CHANNEL_INFO').game_name,
    from_id: from_id, // fuse 默认为 0
    is_jsdk: 1,
    cookie_uuid: cookie_uuid
  }
}

let extFooter = {
  imei: setTimeout(function () { return FN.getSession('MicroParame').imei }, 1), // 手机IMEI/IDFA
  mac: FN.getSession('MicroParame').mac, // 手机mac网卡地址
  utma: FN.getSession('MicroParame').utma, // 设备标识
  model: '', // 手机机型

  screen: window.screen.width + 'x' + window.screen.height,

  // os: setTimeout(function () { return FN.getSession('FUSE_CHANNEL_INFO').os }, 1), // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
  os_version: '', // 系统版本号

  simulator: '0', // 是否模拟器，0不是；1是
  isroot: 0, // 是否root/越狱，0不是1是
  serial_number: '', // 设备序列号
  imsi: '', // 手机卡的编号
  android_id: '', // 设备标识 ANDROID_iD

  net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
  operators: 4, // 运营商 1、移动；2、联通；3、电信；4、其他
  location: '', // 地址位置

  version: VERSION, // 必填	融合SDK版本号
  game_version: '1.0', // 必填	游戏版本号
  platform_version: '1.0', //	必填	渠道版本号
  server_version: '1.2' // 服务端版本号
}

let userBaseMsg = {
  user_id: '', // 必填	用户id
  phone: '', // 用户电话号码
  is_bind_phone: 0, // 是否绑定手机号码  1 是  0 不是
  is_realname: 0 // 是否实名    1 是  0 不是
}

let roleBaseConfig = {
  server_id: '1', // 必填	服务器ID
  server_name: '1', // 必填	服务器名称
  role_id: '1000', // 必填	角色id
  role_name: '1', // 必填	角色名称
  role_level: '1', // 必填	角色等级
  balance: '1' // 必填	游戏币余额
  //   vip_level: '1', //必填	vip等级
}

let roleBaseMsg = {
  ...roleBaseConfig,
  balance: '1', // 必填	游戏币余额
  vip_level: '1', // 必填	VIP等级
  guild_name: '', // 公会名称
  guild_id: '', // 公会id
  fighting: '' // 战力
}

window.FUSESDK = {
  init (params = {}) {
    let input = {
      ct: 'init',
      ac: 'index',
      ...getGlobalHeader(),
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:init', input, {
      domain: configUrl.__fuseDomain.get('init')
    })
  },
  login (params = {}) {
    let input = {
      ct: 'user',
      ac: 'login',
      ...getGlobalHeader(),

      ext: {}, // 额外渠道参数：

      data: {}, // 大部分渠道都会有特殊参数要传
      user_id: '', // 从客户端获取的用户id,方便排查问题。比如步步高
      phone: '', // 用户电话号码
      is_bind_phone: 0, // 是否绑定手机号码  1 是  0 不是
      is_realname: 0, // 是否实名    1 是  0 不是
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:login', input, {
      domain: configUrl.__fuseDomain.get('user')
    })
  },
  makeOrder (params = {}) {
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
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:makeOrder', input, {
      domain: configUrl.__fuseDomain.get('pay')
    })
  },
  roleAdd (params = {}) {
    let input = {
      ct: 'role',
      ac: 'add',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:roleAdd', input, {
      domain: configUrl.__fuseDomain.get('role')
    })
  },
  roleLogin (params = {}) {
    let input = {
      ct: 'role',
      ac: 'login',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:roleLogin', input, {
      domain: configUrl.__fuseDomain.get('role')
    })
  },
  roleLevel (params = {}) {
    let input = {
      ct: 'role',
      ac: 'level',
      ...getGlobalHeader(),
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:roleLevel', input, {
      domain: configUrl.__fuseDomain.get('role')
    })
  },
  checkBindPhone (params = {}) {
    let input = {
      ct: 'user',
      ac: 'check_bind_phone',
      ...getGlobalHeader(),
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      ...params,
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    return FN.fuseSdkAjax('fuse:checkBindPhone', input, {
      domain: configUrl.__fuseDomain.get('user')
    })
  },
  bindPhone (params = {}) {
    let guid = FN.getSession('FUSE_USER_INFO').guid
    let KEY = String(new Date().getTime()).substr(0, 10)
    let obj = {
      ...getGlobalHeader(),
      //   guid: 1221, // 必填用户的guid，登录验证接口有返回
      ...extFooter,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
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
    return configUrl.__fuseDomain.get('user') + '?' + search
  },
  h5pub (params = {}) {
    // 这个函数主要用来请求秘钥之类的,例如星云渠道
    let input = {
      ct: 'init',
      ac: 'h5pub',
      channel: FN.getSession('FUSE_CHANNEL_INFO').channel,
      is_jsdk: 1,
      ...getGlobalHeader(),
      ...extFooter,
      os: FN.getSession('FUSE_CHANNEL_INFO').os,
      ...params
    }
    return FN.fuseSdkAjax('fuse:h5pub', input, {
      domain: configUrl.__fuseDomain.get('init')
    })
  },
  someData (params = {}) {
    let input = {
      ct: 'loadlog',
      ac: params.type,
      channel: FN.getSession('FUSE_CHANNEL_INFO').channel,
      game_id: FN.getSession('FUSE_CHANNEL_INFO').game_id,
      from_id: FN.getSession('FUSE_CHANNEL_INFO').from_id, // fuse 默认为 0
      version: VERSION, // sdk版本号
      game_version: '1.0', // 游戏版本号
      platform_version: '1.0', // 渠道版本号
      ext: JSON.stringify(params),
      is_jsdk: 1,
      imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
      mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
      utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
      os: FN.getSession('FUSE_CHANNEL_INFO').os,
      user_id: FN.getSession('FUSE_USER_INFO').user_id
    }
    return FN.fuseSdkAjax('fuse:init', input, {
      domain: configUrl.__fuseDomain.get('init')
    })
  }
}
