var md5 = require('./utility/md5.js')
var auth = require('./utility/auth.js')
var { requestEncrypt, returnDecrypt, requestDecrypt } = auth
var LocalShareMsg = {
  img_url: 'https://yxfile.gowan8.com/share/sanguoji/share.jpg',
  title:'登录就送VIP5，吕布助你一统江山！'
}
var OnLineShareMsg = {}
var appid = 'wx4f5bbd3e032f8862'
const USER_INFO = 'go_wan_user_info'
const JS_LOAD_INFO = 'js_load_info'
const XCX_USER_INFO = 'xcx_user_info'
const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}
let version = '1.2'
var _scene = 0
let system = wx.getSystemInfoSync().system
const domain = 'https://yisdk-api.gowanme.com';
// 封装一个请求方法---->> request(ct, ac, params = {}, is_jsdk = 1, callback)
// is_jsdk = 1 代表是is_jsdk = 1 ， 其他代表为js
function request(ct, ac, params = {}, is_jsdk = 1, callback) {
  let KEY = String(new Date().getTime()).substr(0, 10)
  var url
  let _obj = { ts: KEY };
  if (ac===null){
    url=domain + `/${ct}`
    _obj = params
  }else{
    url= domain + `/?ct=${ct}&ac=${ac}`
    if (is_jsdk == 1) {
      _obj.is_jsdk = 1;
      params.is_jsdk = 1;
    } else {
      _obj.js = 1;
    }
    let p = requestEncrypt(JSON.stringify(params), KEY).e
    _obj.p = p
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: _obj,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      'method': 'POST',
      success(res) {
        console.log('request__res----->', res);
        resolve(res.data)
        if (callback) {
          callback()
        }
      }
    })
  })
}
function getRoleBaseMsg(arg) {
  return {
    server_id: arg.serverId,
    server_name: arg.serverName,
    role_id: arg.roleId,
    role_name: arg.roleName,
    role_level: arg.roleLevel,
    balance: arg.userMoney || 0,
    vip_level: arg.vipLevel
  }
}
function log (...msg){
  console.log(...msg)
}
function removeStorageSync(key = {}, callback) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    if (callback) {
      callback(e)
    }
  }
}
function setGoWanUserInfo(userInfo = {}) {
  wx.setStorageSync(USER_INFO, userInfo)
  log('存储用户信息')
}
function getGoWanUserInfo() {
  var data = wx.getStorageSync(USER_INFO)
  log('获取用户信息')
  return data
}
function setXcxUserInfo(XCXUserInfo = {}) {
  wx.setStorageSync(XCX_USER_INFO, XCXUserInfo)
  log('存储XCX用户信息')
}
function getXcxUserInfo() {
  var data = wx.getStorageSync(XCX_USER_INFO)
  log('获取XCX用户信息')
  return data
}
function setJsLoadInfo(jsLoadInfo = {}) {
  wx.setStorageSync(JS_LOAD_INFO, jsLoadInfo)
}
function getJsLoadInfo() {
  var data = wx.getStorageSync(JS_LOAD_INFO)
  return data
}
// log('分享进来的', wx.getLaunchOptionsSync())
let MicroParame = uuid() //生成IMEI值
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
wx.onShow((args) => {
  let query = args.query
  log('query-------->', args)
  _scene = query.scene || 0
})
let userBaseMsg = {
  // user_id: '', // 必填	用户id
  phone: '', // 用户电话号码
  is_bind_phone: 0, // 是否绑定手机号码  1 是  0 不是
  is_realname: 0 // 是否实名    1 是  0 不是
}

let extFooter = {
  screen: wx.getSystemInfoSync().windowWidth + 'x' + wx.getSystemInfoSync().windowHeight,
  // os:'', // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
  os_version: wx.getSystemInfoSync().version, // 系统版本号
  simulator: '0', // 是否模拟器，0不是；1是
  isroot: 0, // 是否root/越狱，0不是1是
  serial_number: '', // 设备序列号
  imsi: '', // 手机卡的编号
  android_id: '', // 设备标识 ANDROID_iD
  net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
  operators: 4, // 运营商 1、移动；2、联通；3、电信；4、其他
  location: '', // 地址位置
  version, // 必填	融合SDK版本号
  game_version: '1.0', // 必填	游戏版本号
  platform_version: '1.0', //	必填	渠道版本号
  server_version: '1.2', // 服务端版本号
  imei: MicroParame.replace(/-/g, ''), // 手机IMEI/IDFA
  mac: MicroParame.replace(/-/g, ''), // 手机mac网卡地址
  utma: MicroParame.replace(/-/g, ''), // 设备标识
  os: wx.getSystemInfoSync().system.indexOf('iOS') == 0 ? 2 : 1 // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
}
// 定义全局变量，在某个时刻会被赋值
let LocalUserInfo =  ''
let chanelInfo = ''
let getGlobalHeader = '' 
let minigameSDK = {
  apiStart() {
    this.apiRuning = true;
  },
  apiEnd() {
    this.apiRuning = false;
  },
  isApiRunning() {
    return this.apiRuning;
  },
  //初始化
  init(jsLoadParams = {}, callback) {
    let _this = this
    let jsLoad = {
      yisdk_param: decodeURIComponent(jsLoadParams.yisdk_param),
      ext_param: decodeURIComponent(jsLoadParams.ext_param),
      extend: 'scene=' + _scene
    }
    log('jsLoad---->', jsLoad)
    /** ********** 发送js_load请求*********************/
    request('h5', 'js_load', jsLoad, 0).then((resulte) => {
      log('发送js_load请求then---->res', resulte)
      let data = resulte.data
      let resData = returnDecrypt(data.d, String(data.ts)).d
      let initReslute = JSON.parse(resData)
      log('js_load_Reslute', initReslute)
      getGlobalHeader = {
        game_id: initReslute.game_id,
        channel: initReslute.channel,
        game_name: initReslute.game_name,
        from_id: initReslute.from_id, // fuse 默认为 0
        cookie_uuid: MicroParame
      }
      // 清除本地缓存
      removeStorageSync(JS_LOAD_INFO)
      setJsLoadInfo(initReslute)
      let input = {
        ...getGlobalHeader,
        ...extFooter
      }
      log('init_<input>------->', input)
      /** ********** 发送init初始化请求*********************/
      request('init', 'index', input, 1).then((resulte) => {
        log('init---------------->初始化请求回来的结果', resulte)
        log('init---------------->初始化请求回来的结果resulte.data', resulte.data)
        let cbData = {
          statusCode: 0,
          status: '初始化成功'
        }
        if (resulte.code == 0) {
          // _this.apiEnd()
          if (resulte.data) {
            let len = resulte.data.length ? resulte.data.length : 0
            if (len !== 0) {
              let data = resulte.data
              let d = data.d ? data.d : ''
              let ts = data.ts ? data.ts : ''
              let resData = returnDecrypt(d, String(ts)).d
              let initReslute = JSON.parse(resData)
              log('init---------------->解密后的初始化结果', initReslute)
              if (initReslute.share) {
                OnLineShareMsg = initReslute.share
              }
              let notice = initReslute.init_notice
              if (notice) {
                wx.showModal({
                  title: notice.title,
                  content: notice.content,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      if (callback) {
                        log('用户点击确定后执行的init回调')
                        callback(cbData)
                      }
                    }
                  }
                })} else {
                log('无需公告执行的init回调')
                if (callback) {
                  callback(cbData)
                }
              }
            } else {
              if (callback) {
                callback(cbData)
              }
            }
          } else {
            if (callback) {
              callback(cbData)
            }
          }
        } else {
          if (callback) {
            let cbData = {
              statusCode: 1,
              status: '初始化失败'
            }
            callback(cbData)
            // _this.apiEnd()
          }
        }
      })
    })
  },
  checkSession(checksession_callback) {
    //  防止重复请求
    if (this.isApiRunning()) {
      return;
    }
    this.apiStart();
    var _this = this
    wx.checkSession({
      success(res) {
        let systemInfo = wx.getSystemInfoSync()
        let gowan_userInfo = getGoWanUserInfo()
        let userXcxInfo = getXcxUserInfo()
        let channelInfo = getJsLoadInfo()
        log('channelInfo------->', channelInfo)
        let type = 'checkSession'
        log('session_key-------> 未过期go_wan_userInfo', gowan_userInfo)
        log('session_key-------> 未过期userXcxInfo', userXcxInfo)
        if (gowan_userInfo && userXcxInfo && gowan_userInfo.ext.openid) {
          _this._dologin(userXcxInfo, type, checksession_callback)
        } else {
          if (checksession_callback) {
            let cbData = {
              statusCode: 1,
              status: '登录已经过期'
            }
            _this.apiEnd()
            checksession_callback(cbData)
          }
        }
      },
      fail() {
        log('session_key 已经过期------->需要重新执行登录流程')
        _this.apiEnd()
        if (checksession_callback) {
          checksession_callback({
            statusCode: 1,
            status: 'session_key 已经过期'
          })
        }
      }
    })
  },
  login(XCXuserInfo = {}, callback) {
    //  防止重复请求
    if (this.isApiRunning()) {
      return;
    }
    this.apiStart();
    log('我是走login方法---------------------》login')
    setXcxUserInfo(XCXuserInfo)
    // let XCXuserInfo = getXcxUserInfo()
    log('XCXuserInfo', XCXuserInfo)
    let type = 'login'
    this._dologin(XCXuserInfo, type, callback)
  },
  _dologin(userInfo, type, callback) {
    console.log('登录类型', type)
    let _this = this
    let go_wan_userInfo = getGoWanUserInfo()
    log('go_wan_userInfo--------->', go_wan_userInfo)
    // go_wan_userInfo.ext.openid
    let channelInfo = getJsLoadInfo()
    let { game_id, channel, from_id, game_name, channel_id } = channelInfo
    wx.getSystemInfo({
      success(res) {
        log('wx.getSystemInfo--------------->', res)
      }
    })
    let systemInfo = wx.getSystemInfoSync()
    wx.login({
      success: ret => {
        log('login?->success.ret-------->', ret)
        let code = ret.code
        let is_jsdk = 1
        log('XCXuserInfo--------->', userInfo)
        let userinfo = encodeURIComponent(JSON.stringify(userInfo))
        // let userinfo = res.userInfo
        let ext_header = {}
        let header = { code, userinfo }
        log('type', type)
        if (type == 'checkSession') {
          log('登录时走了添加uopenid分支')
          header['uopenid'] = go_wan_userInfo.ext.openid
        }
        log('header---------->', header)
        // log('mode---------->', systemInfo.model.split('<'))
        let loginParams = {
          ext: JSON.stringify(ext_header),
          data: JSON.stringify(header),
          ...getGlobalHeader,
          ...extFooter,
          model: systemInfo.model.split('<')[0],
          user_id: '', // 从客户端获取的用户id,方便排查问题。比如步步高
          phone: '', // 用户电话号码
          is_bind_phone: 0, // 是否绑定手机号码  1 是  0 不是
          is_realname: 0,
          is_jsdk
        }
        log('loginParams------>p', loginParams)
        // 发送登录请求
        request('user', 'login', loginParams, 1).then((result) => {
          log('发送登录请求then------->result', result)
          if (result.code == 0) {
            log('登陆成功', result.data)
            let data = result.data
            let resData = returnDecrypt(data.d, String(data.ts)).d
            let loginReslut = JSON.parse(resData)
            log('loginReslut------->', loginReslut)
            log('go_wan_userInfo222222222222------->', getGoWanUserInfo())
            // 检查登录返回的from_id与jsload返回的from_id是否一致
            let login_from_id = loginReslut.from_id
            let jsLoad_from_id = getJsLoadInfo().from_id
            let channel_info = getJsLoadInfo()
            if (jsLoad_from_id != login_from_id) {
              log('登录后from_id与jsload的时候的from_id不一致---->')
              channel_info.old_from_id = channel_info.from_id
              channel_info.from_id = login_from_id
              setJsLoadInfo(channel_info)
            }
            // 清除本地缓存
            if (go_wan_userInfo) {
              log('清除本地go_wan_userInfo缓存---->')
              removeStorageSync(USER_INFO)
            }
            setGoWanUserInfo(loginReslut) // 存储gowan服务端返回的用户信息
            LocalUserInfo = loginReslut // 存储用户信息
            log('渠道信息--->', channelInfo)
            log('够玩用户信息--->', go_wan_userInfo)
            let cpRes = {
              statusCode: 0,
              userId: loginReslut.user_id,
              platformChanleId: Number(channel_id),
              userName: loginReslut.userName || '',
              timestamp: String(loginReslut.timestamp),
              sign: loginReslut.new_sign,
              guid: loginReslut.guid, // TODO
              cp_ext: loginReslut.cp_ext || '',
              ext: loginReslut.ext || '',
            }
            log('cpRes-------->', cpRes)
            if (callback) {
              let cbData = {
                statusCode: 0,
                loginParams: cpRes,
                status:'登录成功'
              }
              callback(cbData)
              _this.apiEnd()
            }
          } else {
            if (callback) {
              let cbData = {
                statusCode: 1,
                status: '登录失败'
              }
              callback(cbData)
              _this.apiEnd()
            }
          }
        })
      }
    })
  },
  recharge(args, callback) {
    wx.showLoading({
      title: '加载中……',
    })
    log('充值时研发传进来的参数------->',args)
    let GoWanUserInfo = getGoWanUserInfo()
    log('GoWanUserInfo', GoWanUserInfo)
    let user_id = GoWanUserInfo.user_id
    let openid = GoWanUserInfo.ext.openid
    let ext = {
      openid,
      pf: wx.getSystemInfoSync().system.indexOf('iOS') == 0 ? 'ios' : 'android'
    }
    // let order_id = LocalUserInfo.order_id
    let payParams = {
      ext: JSON.stringify(ext),
      user_id,
      ...extFooter,
      ...getRoleBaseMsg(args),
      ...getGlobalHeader,
      productName: args.productName, 
      amount: args.amount, // 必填充值金额 单位：分
      notify_url: args.callbackURL, // 必填 CP通知URL
      callback_info: args.callbackInfo, // cP回调参数
      cp_product_id: args.cpProductId,
      charge_mount: args.chargeMount, // 金钱数量/道具数量
      is_jsdk: 1
    }
    log('payParams--------->', payParams)
    // 下单
    this._doMakeOrder(payParams, callback)
  },
  _doMakeOrder(payParams, callback) {
    var that = this
    let GoWanUserInfo = getGoWanUserInfo()
    let chanelInfo = getJsLoadInfo()
    log('chanelInfo---->', chanelInfo)
    log('GoWanUserInfo---->', GoWanUserInfo)
    let order_id = ''
    let user_id = GoWanUserInfo.user_id
    let openid = GoWanUserInfo.ext.openid
    request('pay', 'make_order', payParams, 1).then((resulte) => {
      log('发送下单请求then返回结果---->resulte', resulte)
      if (resulte.code == 0) {
        log('下单成功', resulte.data)
        let data = resulte.data
        let resData = returnDecrypt(data.d, String(data.ts)).d
        let payReslute = JSON.parse(resData)
        let op_type = payReslute.ext.op_type // 保存op_type用于支付判断
        log('payReslute----->', payReslute)
        order_id = payReslute.order_id
        let dataFormidashi = {
          'mode': 'game',
          'env': payReslute.ext.env, // 0米大师正式环境，1米大师沙箱环境
          'offerId': payReslute.ext.offerId, // 米大师侧申请的应用Id
          'currencyType': 'CNY',
          'platform': 'android', // 写死安卓，有时间可以做苹果的判断
          'buyQuantity': payReslute.ext.buyQuantity,
          'zoneId': '1'
        }
        log('dataFormidashi------>111', dataFormidashi)
        let ts = Date.parse(new Date()) / 1000
        var paycbData = {
          op_msg: payReslute.ext.op_msg,
          op_type,
          money: payParams.amount, // 金额
          user_id, // 登录的时候可以获取
          order_id,
          openid,
          pf: wx.getSystemInfoSync().system.indexOf('iOS') == 0 ? 'ios' : 'android',
          ts,
          pay_item: payParams.productName,
          game_id: chanelInfo.game_id, // 支付的时cp传进来的参数里有
          sign: md5(order_id + user_id + openid + payParams.amount + chanelInfo.game_id + ts)
        }

        log('paycbData---------------->', paycbData)
        log('op_type', op_type)
        
        if (op_type !== -1) { //如果op_type不等于-1 那么走支付流程，否则不走
          if (op_type !== 0) {
            // 米大师支付
            log('midashipay___op_type', op_type)
            log('dataFormidashi--->', dataFormidashi)
            log('paycbData----->', paycbData)
            switch (op_type) {
              case 1:
                that._requestMidasPayment(dataFormidashi, paycbData, callback)
                break;
              case 2:
                that._requestMidasPayment(dataFormidashi, paycbData, callback)
                break;
              case 3:
                if (callback) {
                  callback({
                    statusCode: 0,
                    status: '下单成功'
                  })
                }
                break;
              case 4:
                if (callback) {
                  callback({
                    statusCode: 1,
                    status: '下单失败'
                  })
                }
                break;
              case 5:
                that._payCallback(paycbData, callback) //直接回调
                break;
            }
          } else {
            // 公众号支付
            that._CustomerService(paycbData, callback)
          }
        }else{
          wx.showToast({ // 下单失败提示
            title: 'iOS系统暂不支持支付',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 米大师下单
  _requestMidasPayment(data = {}, paycbData = {}, callback) {
    var that = this
    console.log('米大师调起支付data', data)
    console.log('米大师调起支付paycbData', paycbData)
    wx.requestMidasPayment( // 米大师下单
      {
        ...data,
        success(res) {
          log('米大师调起支付成功res', res)
          log('米大师支付success_分支查看payData--->', paycbData)
          // 发起支付回调请求
          that._payCallback(paycbData, callback)
        },
        fail(res) {
          log('米大师调起支付失败', res)
          if (callback) {
            callback({
              statusCode: 1,
              status: '米大师fail'
            })
          }
        }
      })
  },
  // 打开客服充值
  _CustomerService(paycbData = {}, callback) {
    wx.hideLoading()
    var that = this
    log('打开客服paycbData', paycbData)
    wx.showModal({
      title: '充值教程',
      showCancel: false,
      content: paycbData.op_msg,
      success(res) {
        if (res.confirm) {
          wx.openCustomerServiceConversation({
            sessionFrom: '', //会话来源
            showMessageCard: true,
            sendMessageTitle: paycbData.order_id,
            sendMessageImg: 'https://yxfile.gowan8.com/xcxmajia/mjwsw/imgs/xcx_pay.png',
            success: function (res) {
              log('打开客服消息成功', res)
            },
            fail: function (res) {
              // 用户取消打开客服或者打开客服失败
              wx.showModal({
                title: '温馨提示',
                cancelText: '朕知道了',
                confirmText: '前往充值',
                content: '因版本限制，须通过【客服会话】充值，请您谅解',
                success: function (res) {
                  if (res.confirm) {
                    wx.openCustomerServiceConversation({
                      sessionFrom: '', //会话来源
                      showMessageCard: true,
                      sendMessageTitle: paycbData.order_id,
                      sendMessageImg: 'https://yxfile.gowan8.com/xcxmajia/mjwsw/imgs/xcx_pay.png',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // 支付回调请求
  _payCallback(paycbData, callback) {
    request('notify_jsdk/minigame.php', null, paycbData, 1).then(res => {
      log('支付回调请求结果--->', res)
      if (res.code !== 0) {
        if (callback) {
          callback({
            statusCode: res.code,
            status: res.msg
          })
        }
      } else {
        if (callback) {
          callback({
            statusCode: res.code,
            status: res.msg
          })
        }
      }
    })
  },
  // 创建角色上报
  createRole(params = {}) {
    log('LocalUserInfo', LocalUserInfo)
    let type = 'add'
    let input = {
      user_id: LocalUserInfo.user_id,
      is_jsdk: 1,
      ...getGlobalHeader,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      ...getRoleBaseMsg(params)
    }
    log('createRole:<input>----->', input)
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },
  // 切换角色上报
  changeRole(params = {}) {
    log('LocalUserInfo', LocalUserInfo)
    let type = 'login'
    let input = {
      user_id: LocalUserInfo.user_id,
      ...getGlobalHeader,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      ...getRoleBaseMsg(params)
    }
    log('changeRole:<input>----->', input)
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },
  // 角色升级上报
  upgradeRole(params = {}) {
    log('LocalUserInfo', LocalUserInfo)
    let type = 'level'
    let input = {
      ...getGlobalHeader,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter,
      user_id: LocalUserInfo.user_id,
      ...getRoleBaseMsg(params)
    }
    log('upgradeRole:<input>----->', input)
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },
  // 上报请求
  _reportRequst(type, input, resolve) {
    request('role', type, input, 1).then(res => {
      log('角色' + type + '上报结果--->', res)
      let reportReslute = {
        statusCode: res.code,
        status: res.msg
      }
      resolve(reportReslute)
    })
  },
  // 分享
  shareToArk(callback) {
    let jsLoadInfo = getJsLoadInfo()
    log('jsLoadInfo', jsLoadInfo)
    log('LocalUserInfo', LocalUserInfo)
    wx.shareAppMessage({
      title: OnLineShareMsg.title ? OnLineShareMsg.title : LocalShareMsg.title,
      imageUrl: OnLineShareMsg.img_url ? OnLineShareMsg.img_url : LocalShareMsg.img_url,
      query: 'userId=' + LocalUserInfo.user_id
    })
    if (callback) {
      callback({
        statusCode: 0,
        status: '分享成功'
      })
    }
  },
  invite(callback) {
    let jsLoadInfo = getJsLoadInfo()
    let gowan_user_info = getGoWanUserInfo()
    wx.shareAppMessage({
      title: OnLineShareMsg.title ? OnLineShareMsg.title : LocalShareMsg.title,
      imageUrl: OnLineShareMsg.img_url ? OnLineShareMsg.img_url : LocalShareMsg.img_url,
      query: 'userId=' + LocalUserInfo.user_id
    })
    if (callback) {
      callback({
        statusCode: 0,
        status: '分享成功'
      })
    }
  },
  bannerAd(ad_msg = {}, callback){
    // 该接口未写完
    //appid wx8923a82ea75b7d81
    //原appid wx68abf8b1a432b5e7
    // banner广告单元id:adunit-e1d0a13524865172
   let bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-e1d0a13524865172',
      adIntervals: 30,
      style: {
        left: 30,
        top: 520,
        width: 320
      }
    })
    bannerAd.show().then(res => {
      log('res', res)
      if (callback) {
        callback(res)
      }
    })
    bannerAd.onError(err => {
      log(err)
      if (callback) {
        callback(res)
      }
    })
  },
  rewardedVideoAd(ad_msg,_callback){
    var _this = this
    let VideoAd = wx.createRewardedVideoAd({
      adUnitId: ad_msg.adUnitId
    })
    VideoAd.offClose()
    VideoAd.onClose(function (_res) {
      log('用户点击了广告关闭按钮', _res)
      if (_callback) {
        _callback(_res)
      }
      let result = _res.isEnded == true ? 1 : 0
      // 记录视频关闭类型
      _this.openVideoRecord(from_id, 1, result);
    });
    VideoAd.onError(function (_res) {
      // 广告出现错误的时候的一个处理。。。
      // if (_options.onAdError) {
      //   _options.onAdError();
      // }
    });
    if (VideoAd.isReady()) {
      VideoAd.show();
      return
    }
    VideoAd.onLoad(function () {
      VideoAd.show()
      VideoAd.offLoad()
    });
  },
  //记录打开视频接口
   //from_id ->广告视频位置(什么游戏)
  //type ->广告类型
  //result ->结果
  openVideoRecord(from_id, type, result){},

  // 插屏广告
  interstitialAd(ad_msg, _callback){
    let interstitialAd = wx.createInterstitialAd({ adUnitId: ad_msg.adUnitId })
    interstitialAd.show().catch((err) => {
      // console.error(err)
      log('错误信息', err)
    })
    interstitialAd.onClose(() => {
      console.log('插屏 广告关闭')
    })
  }
}
module.exports = {
  minigameSDK
}