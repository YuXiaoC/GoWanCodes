// 1.初始化
// 接口地址：http://xxx.xxx.xxx/?ct=init

let globalHeader = {
  from_id: 0, //	必填	包ID
  game_id: 0, //	必填	游戏id
  is_jsdk: 1 //	必填	是否JSDK，1:是， 0：否
}

let extFooter = {
  imei: "", //手机IMEI/IDFA
  mac: "", //手机mac网卡地址
  device: "", //设备标识（每次游戏安装之后生成并存储到本地; MD5(IMEI/IDFA+机型+MAC+分辨率)）
  screen: "", //分辨率
  platform: 0, //手机系统: 1、ios；2、android；3、其他
  model: "", //手机机型
  cookie_uuid: "", //唯一标识码，客户端生成一个唯一标识存到cookie

  system: "", //手机系统版本
  system_language: "", //手机语言
  net: 1, //手机网络1、2G；2、3G；3、wifi；4、其他
  operator: "", //运营商; 客户端传递运营商首字母简写大写
  location: "", //	地址位置

  version: "" //必填	SDK版本号
}

// 1.初始化

Api.define("3ksdk:init", {
  input: {
    ct: "init",
    ...globalHeader,
    ...extFooter
  },
  //   input: {
  //     ct: 'init',
  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      // 初始化后公告信息
      init_notice: {
        title: "初始化公告", //公告标题
        content: "公告内容公告内容公告内容公告内容公告内容", //公告内容
        image: "", //图片
        url: "", //公告底部超链接，空则没有超链接
        url_type: 0 //公告底部超链接跳转类型：0:内部浏览器/1:外部浏览器
      },
      // 登陆后公告信息
      login_notice: {
        id: 0, //公告id
        title: "登录公告", //标题
        content: "公告内容公告内容公告内容公告内容公告内容" //公告内容
      },
      // 浮标菜单信息
      menu: {
        id: 0, //菜单id
        name: "", //名字
        icon: "", //图标
        Icon2: "", //图标2
        view: 0 //是否显示 0：不显示/1：显示
      },
      // 菜单广告信息
      menu_ad_cfg: {
        image: "", //广告图片
        url: "", //广告链接
        phone_login_cfg: 0, //是否显示手机登陆0：不显示/1：显示
        reg_auto_passwd_cfg: 0, //快速注册是否自动密码 0:否/1：是
        reg_ui_cfg: 0, //注册ui模式 0:无实名验证/1:必填实名/2:注册后补充
        gm_url: "", //	客服url
        xieyi_url: "", //协议url
        wx_app_name: "", //微信公众号名
        wx_code: "" //微信公众号二维码
      }
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 2.用户登陆
Api.define("3ksdk:login", {
  input: {
    ct: "user",
    ac: "login",
    ...globalHeader,
    mode: 0, //必填	登陆模式：0:账号密码登陆/1:手机验证码登陆
    account: "", //登陆账号:账号登陆为账号，手机登陆为手机
    password: "", //	登陆密码，账号登陆必填
    code: "", //手机验证码，手机登陆必填
    code_sign: "", //手机验证码签名信息，发送验证码时返回
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
      age: 0,
      user_id: 111111, //3k用户uid
      old_id: 222222222, //3k用户cp_uid
      name: "lee", //用户名
      password: "123456", //用户密码
      phone: "18721004820", //绑定手机号，空即没绑定
      email: "", //绑定邮箱，空即没绑定
      real_name_status: 0, //实名验证信息填写状态 0未填写/1已填写
      charge_limit: 0, //用户中心-充值限额是否显示 0不显示/1显示
      login_real_name_cfg: 2, //登陆实名检测模式 0不提示/1强制完善/2不强制
      gm_url: "http://gm.3k.com", //	string	客服url
      real_name_url: "http://gm.3k.com" //	string	实名验证地址
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 3.用户注册
Api.define("3ksdk:register", {
  input: {
    ct: "user",
    ac: "register",
    ...globalHeader,
    mode: 0, //必填	注册模式：0:快速注册/1:手机注册
    account: "", //必填	账号: 快速注册为账号,手机注册为手机号
    password: "", //登陆密码，快速注册必填
    code: "", //手机验证码，手机注册必填
    code_sign: "", //手机验证码签名信息，发送验证码时返回
    real_name: "", //实名，强制实名注册填
    id_number: "", //身份证号, 强制实名注册填
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'register',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      user_id: 0, //3k用户uid
      old_id: 0, //3k用户cp_uid
      name: "", //用户名
      password: "", //用户密码
      phone: "", //绑定手机号，空即没绑定
      email: "", //绑定邮箱，空即没绑定
      real_name_status: 0, //实名验证信息填写状态 0未填写/1已填写
      charge_limit: 0, //用户中心-充值限额是否显示 0不显示/1显示
      login_real_name_cfg: 0 //登陆实名检测模式 0不提示/1强制完善/2不强制
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 4.发送手机验证码
Api.define("3ksdk:sendAuthCode", {
  input: {
    ct: "send_code",
    ...globalHeader,
    user_id: 0, //必填	登陆后获取验证码必填，注册时不填
    phone: "", //必填	手机号，登陆后获取为用户绑定的手机号
    ...extFooter
  },
  //   input: {
  //     ct: 'send_code',
  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      sign: "", //手机验证码签名信息
      timeout: 0 //过期时间戳，秒
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 5.修改密码
Api.define("3ksdk:password", {
  input: {
    ct: "user",
    ac: "password",
    ...globalHeader,
    mode: 0, //	必填	模式：0:旧密码/1:手机验证码/2:邮箱
    user_id: 0, //	必填	3k用户uid
    new_password: "", //	必填	新密码
    old_password: "", //		旧密码，通过旧密码修改时填写
    code: "", //		手机验证码，通过手机验证码找回时填写
    code_sign: "", //		手机验证码签名信息，发送验证码时返回
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'register',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      password: "" //	修改后的密码 通过邮箱修改无返回
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 6.添加实名验证信息
Api.define("3ksdk:realName", {
  input: {
    ct: "user",
    ac: "real_name",
    ...globalHeader,
    user_id: 0, //	必填	3k用户uid
    real_mame: "", //	必填	实名
    numner_id: "", //	必填	身份证号
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'real_name',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      real_mame_status: "", //	用户实名状态 0未填写/1已填写
      age: ""
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 7.获取用户信息
Api.define("3ksdk:userInfo", {
  input: {
    ct: "user",
    ac: "user_info",
    ...globalHeader,
    user_id: 0, //	必填	3k用户uid
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'real_name',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      province: "", //	省份
      city: "", //	城市
      birthday: "", //	生日
      sex: "", //	性别 0女1男
      occupation: "", //	职业
      email: "" //	邮箱
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 8.修改用户信息
Api.define("3ksdk:updateInfo", {
  input: {
    ct: "user",
    ac: "update_info",
    ...globalHeader,
    user_id: 0, //	必填	3k用户uid
    province: "", //	必填	省份
    city: "", //	必填	城市
    birthday: "", //	必填	生日
    sex: "", //	必填	性别 0女1男
    occupation: "", //	必填	职业
    ...extFooter
  },
  //   input: {
  //     ct: 'user',
  //     ac: 'update_info',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      province: "", //	省份
      city: "", //	城市
      birthday: "", //	生日
      sex: "", //	性别 0女1男
      occupation: "", //	职业
      email: "" //	邮箱
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 9.获取地区列表
Api.define("3ksdk:zone", {
  input: {
    ct: "cfg",
    ac: "zone",
    ...globalHeader,
    ...extFooter
  },
  //   input: {
  //     ct: 'cfg',
  //     ac: 'zone',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      province: "", //	省份
      city: ["广州", "深圳"] //	array	城市 :[“广州”,”深圳”,…]
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 10.获取职业列表
Api.define("3ksdk:occupation", {
  input: {
    ct: "cfg",
    ac: "occupation",
    ...globalHeader,
    ...extFooter
  },
  //   input: {
  //     ct: 'cfg',
  //     ac: 'occupation',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    // data: {
    //   occupation: [], // [“程序员”,”教师”,…]  TODO 接口文档未确定，记得对接
    // },
    data: ["程序员", "教师"] // [“程序员”,”教师”,…]  TODO 接口文档未确定，记得对接
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// 3.H5版本3KSDK参数解析接⼜
// 开发：https://sdkapidemo.3kwan.com/?ct=h5sdk&ac=js_load
// 测试：https://yisdktest.3kwan.com/?ct=h5sdk&ac=js_load
// 线上：https://sdkapi.3k.com/?ct=h5sdk&ac=js_load

Api.define("3ksdk:paramsLoad", {
  input: {
    ct: "h5sdk",
    ac: "js_load",
    "3k_param": "" // yes 游戏链接地址中获取到的3k_param
  },
  //   input: {
  //     ct: 'h5sdk',
  //     ac: 'js_load',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      game_id: 10104, // 3k游戏ID
      from_id: 404 // 3k包ID
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// http://api.fishyoo.com/?ct=user&ac=bind_phone
Api.define("3ksdk:bindPhone", {
  input: {
    ...globalHeader,
    ct: "user",
    ac: "bind_phone",
    user_id: 11, //	int	必填	3K用户uid
    phone: "", //	string	必填	手机号
    code: "", //		string	必填	手机验证码
    code_sign: "", //		string	必填	手机验证码签名信息，发送验证码时返回
    code_timeout: 1000, //		int	必填	手机验证码过期时间，发送验证码时返回
    ...extFooter
  },
  //   input: {
  //     ct: 'h5sdk',
  //     ac: 'js_load',

  //     p: '密文',
  //     ts: ''
  //   },
  mock: {
    code: 0,
    msg: "",
    data: {
      phone: "" //	string	成功绑定的手机号
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

// http://api.fishyoo.com/?ct=user&ac=unbind_phone
Api.define("3ksdk:unBindPhone", {
  input: {
    ...globalHeader,
    ct: "user",
    ac: "unbind_phone",
    user_id: 11, //	int	必填	3K用户uid
    phone: "", //	string	必填	手机号
    code: "", //		string	必填	手机验证码
    code_sign: "", //		string	必填	手机验证码签名信息，发送验证码时返回
    code_timeout: 1000, //		int	必填	手机验证码过期时间，发送验证码时返回
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
      user_id: 1222 //	int	用户uid
      // ...
    }
    // data: {
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})

Api.define("3ksdk:recharge", {
  input: {
    ...globalHeader,
    ct: "wap",
    uid: 11, //	int	必填	用户user_id,对应old_id
    user_name: "", //	string	必填	用户名
    fee: 0, //	int	必填	充值金额，单位分
    server_id: 1, //	int	必填	分服编号
    server_name: "", //	string		分服名称
    role_id: "", //	string	必填	角色id
    callback_info: "", //	string	必填	回调信息
    notify_url: "", //	string	必填	通知地址
    ...extFooter
  },
  mock: {
    code: 0,
    msg: "",
    data: {
      user_id: 1222 //	int	用户uid
      // ...
    }
  }
})
