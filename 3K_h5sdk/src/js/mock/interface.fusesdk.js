let globalHeader = {
  channel: "", //	必填	渠道标志，请参考渠道和渠道标志对应表
  game_id: 0, //	必填	游戏id
  game_name: "", //	必填	游戏名
  from_id: 0, //	必填	包ID
  is_jsdk: 1 //	必填	是否JSDK，1:是， 0：否
}

let extFooter = {
  imei: "", //手机IMEI/IDFA
  mac: "", //手机mac网卡地址
  utma: "", //设备标识
  model: "", //手机机型

  screen: "", //分辨率

  os: 4, //手机系统1、android；2、越狱ios；3、其他；4、正版ios
  os_version: "", //系统版本号

  simulator: "", //是否模拟器，0不是；1是
  isroot: 0, //是否root/越狱，0不是1是
  serial_number: "", //设备序列号
  imsi: "", //手机卡的编号
  android_id: "", //设备标识 ANDROID_iD

  cookie_uuid: "", //唯一标识码，客户端生成一个唯一标识存到cookie

  net: 4, //手机网络1、2G；2、3G；3、wifi；4、其他
  operators: 4, //运营商 1、移动；2、联通；3、电信；4、其他
  location: "", //地址位置

  version: "", //必填	融合SDK版本号
  game_version: "", //必填	游戏版本号
  platform_version: "", //	必填	渠道版本号
  server_version: "" //服务端版本号
}

let userBaseMsg = {
  user_id: "", //必填	用户id
  phone: "", //用户电话号码
  is_bind_phone: 0, //是否绑定手机号码  1 是  0 不是
  is_realname: 0 //是否实名    1 是  0 不是
}

let roleBaseConfig = {
  server_id: "", //必填	服务器ID
  server_name: "", //必填	服务器名称
  role_id: "", //必填	角色id
  role_name: "", //必填	角色名称
  role_level: "" //必填	角色等级
}

let roleBaseMsg = {
  ...roleBaseConfig,
  balance: "", //必填	游戏币余额
  vip_level: "", //必填	VIP等级
  guild_name: "", //公会名称
  guild_id: "", //公会id
  fighting: "" //战力
}

//1.初始化
// 本接口是sdk初始化的时候调用，主要是记录激活信息，还有显示相应渠道和游戏的公告信息。
// 开发：https://yisdkdemo.3kwan.com/?ct=init
// 测试：https://yisdktest.3kwan.com/?ct=init
// 线上：https:// yisdk.3k.com/?ct=init

Api.define("fuse:init", {
  input: {
    ct: "init",
    ...globalHeader,
    ...extFooter
  },
  //   input: {
  //     ct: 'init',
  //     ac: 'xxx',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      // 初始化后公告信息
      init_notice: {
        title: "", //公告标题
        content: "", //公告内容
        image: "", //如果有图片公告就是一张图片广告
        image_land: "", //横版图片
        url: "", //公告底部超链接，空则没有超链接
        url_type: 0 //	公告底部超链接跳转类型：0:内部浏览器/1:外部浏览器
      }
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 2.账号登录
// 接口说明：
//     本接口是账号登录sdk成功之后触发调用，主要是验证账号id，以及记录玩家的账号注册信息和账号登录日志。
// 接口地址：
// 开发：https://yiuserdemo.3kwan.com/?ct=user&ac=login
// 测试：https://yiusertest.3kwan.com/?ct=user&ac=login
// 线上：https://yiuser.3k.com/?ct=user&ac=login

Api.define("fuse:login", {
  input: {
    ct: "user",
    ac: "login",
    ...globalHeader,

    ext: {}, //	额外渠道参数：

    data: {}, //必填，大部分渠道都会有特殊参数要传
    user_id: "", //从客户端获取的用户id,方便排查问题。比如步步高
    phone: "", //用户电话号码
    is_bind_phone: 0, //是否绑定手机号码  1 是  0 不是
    is_realname: 0, //是否实名    1 是  0 不是

    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'login',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      user_id: "", //第三方渠道用户id
      guid: "", //玩家ID  （这个值只是给cp那边显示作用）CP在角色信息页或设置页添加即可,具体可跟3K对应的游戏运营沟通协商.如昵称下方，设置页顶部标题处
      cp_ext: {
        test: "test"
      }, //	Cp扩展参数, 目前传demo  {‘test’:”test”} 例如：{‘test’:”test”}  方便以后增加多参数给cp那边用就不用改签名规则
      timestamp: 0, //时间戳
      ext: {
        a: "2123",
        b: "12222"
      }, //渠道扩展参数
      new_sign: "" //	新版本用户签名
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 3.角色登录
// 接口说明：
//     本接口是角色登录是调用，主要是记录角色注册信息和角色登录日志
// 接口地址：
// 开发：https://yiroledemo.3kwan.com/?ct=role&ac=login
// 测试：https://yiroletest.3kwan.com/?ct=role&ac=login
// 线上：https://yirole.3k.com/?ct=role&ac=login

Api.define("fuse:roleLogin", {
  input: {
    ct: "role",
    ac: "login",
    ...globalHeader,
    ...userBaseMsg,
    ...roleBaseMsg,
    ...extFooter
  },
  //   input: {
  //     ct: 'role',
  //     ac: 'login',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      user_id: "", //第三方渠道用户id
      guid: "", //玩家ID  （这个值只是给cp那边显示作用）CP在角色信息页或设置页添加即可,具体可跟3K对应的游戏运营沟通协商.如昵称下方，设置页顶部标题处
      cp_ext: {
        test: "test"
      }, //	Cp扩展参数, 目前传demo  {‘test’:”test”} 例如：{‘test’:”test”}  方便以后增加多参数给cp那边用就不用改签名规则
      timestamp: 0, //时间戳
      ext: {
        a: "2123",
        b: "12222"
      }, //渠道扩展参数
      new_sign: "" //	新版本用户签名
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 4.角色新增
// 接口说明：
//     本接口是创建角色昵称时调用，主要是记录角色注册信息和角色登录日志
// 接口地址：
// 开发：https://yiroledemo.3kwan.com/?ct=role&ac=add
// 测试：https://yiroletest.3kwan.com/?ct=role&ac=add
// 线上：https://yirole.3k.com/?ct=role&ac=add

Api.define("fuse:roleAdd", {
  input: {
    ct: "role",
    ac: "add",
    ...globalHeader,
    ...userBaseMsg,
    ...roleBaseMsg,
    ...extFooter
  },
  //   input: {
  //     ct: 'role',
  //     ac: 'add',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      // ...
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 5.角色等级
// 接口说明：
//     本接口是角色升级时调用，主要是记录角色等级日志，目前只记录文件日志没入数据库。
// 接口地址：
// 开发：https://yiroledemo.3kwan.com/?ct=role&ac=level
// 测试：https://yiroletest.3kwan.com/?ct=role&ac=level
// 线上：https://yirole.3k.com/?ct=role&ac=level

Api.define("fuse:roleLevel", {
  input: {
    ct: "role",
    ac: "level",
    ...globalHeader,
    ...userBaseMsg,
    ...roleBaseMsg,
    ...extFooter
  },
  //   input: {
  //     ct: 'role',
  //     ac: 'level',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      // ...
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 6.生成订单
// 接口说明：
//     本接口是玩家点击充值时触发，主要是记录玩家充值之前的订单信息记录以及生成订单日志。
// 接口地址：
// 开发：https://yipaydemo.3kwan.com?ct=pay&ac=make_order
// 测试：https://yipaytest.3kwan.com?ct=pay&ac=make_order
// 线上：https://yipay.3k.com/?ct=pay&ac=make_order

Api.define("fuse:makeOrder", {
  input: {
    ct: "pay",
    ac: "make_order",
    ...globalHeader,
    ...roleBaseConfig,
    user_id: "", //	必填	用户id
    amount: "", //	必填	充值金额，单位：分
    notify_url: "", //	必填	CP通知URL
    callback_info: "", //	CP回调参数
    ext: {}, //	额外渠道参数：
    ...extFooter
  },
  //   input: {
  //     ct: 'pay',
  //     ac: 'make_order',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      order_id: "1406241603486251524",
      order_sign: "xxxxxxxxxxxxxxxxxxx",
      ext: {},
      sign: ""
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 7.手机验证检测
// 接口说明：
// 本接口是用户启动游戏是触发调用，sdk需要判断用户是否绑定手机成功。如果没绑定会显示绑定手机那个页面。
// 接口地址：
// 开发：https://yiuserdemo.3kwan.com/?ct=user&ac=check_bind_phone
// 测试：https://yiusertest.3kwan.com/?ct=user&ac= check_bind_phone
// 线上：https://yiuser.3k.com/?ct=user&ac= check_bind_phone

Api.define("fuse:checkBindPhone", {
  input: {
    ct: "user",
    ac: "check_bind_phone",
    ...globalHeader,
    guid: "", //	必填	用户的guid，登录验证接口有返回
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'check_bind_phone',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",

    data: {
      // ...
      status: 1
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 8.手机验证
// 接口说明：
//     本接口是当用户某个服某个角色进入游戏后，满足cp某条件时才触发调用，主要是让用户绑定手机，绑定之后会给这角色自动发奖励。
// 接口地址：
// 开发：https://yiuserdemo.3kwan.com/?ct=user&ac=bind_phone
// 测试：https://yiusertest.3kwan.com/?ct=user&ac=bind_phone
// 线上：https://yiuser.3k.com/?ct=user&ac=bind_phone

Api.define("fuse:bindPhone", {
  input: {
    ct: "user",
    ac: "bind_phone",
    ...globalHeader,
    guid: "", //	必填	用户的guid，登录验证接口有返回
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'check_bind_phone',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      // ...
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})
