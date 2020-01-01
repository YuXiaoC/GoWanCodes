// 文档地址 http://pulsdk.7724.com/apidoc/7724/readme.html
// 测试地址 http://www.7724.com/qgcj/game
/** @author zhoushen注：不能将打包后的7724sdk.use.js放上服务器，会报错。原因是：
开发的时候因为某种原因，直接下载了渠道的js并放在本文件中，
打包的时候会报错，但是直接将未打包的文件放到服务器上可以使用 */
FN.log('7724sdk.use.js')
var isinit = false
var user_info = FN.getSession('FUSE_USER_INFO')
var UrlParams = FN.getURLparams()
var ext = decodeURIComponent(UrlParams.ext)
var timestamp = Date.parse(new Date()) / 1000
var loginParams = {
  qqesuid: UrlParams.qqesuid,
  channelid: UrlParams.channelid,
  channeluid: UrlParams.channeluid,
  qqesnickname: UrlParams.qqesnickname,
  qqesavatar: UrlParams.qqesavatar,
  cpgameid: UrlParams.cpgameid,
  ext,
  qqestimestamp: UrlParams.qqestimestamp,
  sign: UrlParams.sign
}

window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    /** <---------------------注意:以下27至237行是7724自己本身的脚本--------------------------> */
    /**
 * 厦门舜邦网络发行sdk
 * @author zhoushen
 * @since 2016/09/09
 */

    // (function ($, window) {
    SbPulSdk = function (option) {

    }

    /**
   * version history
   * 1.0 初始版本
   * 2.0 添加初始化函数回调
   * @type {String}
   */
    SbPulSdk.version = '2.0'
    SbPulSdk.sourceRoot = '//pulsdk.7724.com/channelsdk/'
    SbPulSdk.payApi = '//pulsdk.7724.com/sdk/cppay'
    SbPulSdk.createRoleApi = '//pulsdk.7724.com/sdk/createRole'
    SbPulSdk.loginRoleApi = '//pulsdk.7724.com/sdk/loginRole'
    SbPulSdk.canPay = 1 // 1可以支付 2不可以支付

    /**
   * sdk初始话，登录回调后，cp调用
   * @param  json loginParams 登录回调参数
   * @param  func channelLoadedCall 渠道js加载完毕初始化回调
   * @param  func LoadedCall 初始化回调
   */
    SbPulSdk.init = function (loginParams, channelLoadedCallBack, loadedCallBack) {
      // 载入渠道业务逻辑
      var js = SbPulSdk.sourceRoot + 'channel' + loginParams.channelid + 'pay.js?v=20170123'

      SbPulSdk.loadJsSync(js, function () {
        SbPulSdk.debug('渠道js加载完毕' + SbPulSdkChannel)
        // 渠道sdk初始化
        SbPulSdkChannel.init(loginParams, channelLoadedCallBack)
        // 初始化回调
        if (loadedCallBack) {
          loadedCallBack()
        }
      })
    }

    /**
   * cp发起支付
   * @param  json cpPayParams cp支付参数
   */
    SbPulSdk.pay = function (cpPayParams) {
      if (SbPulSdk.canPay == 2) {
        SbPulSdk.debug(cpPayParams, '支付锁定，请等待上一次支付发起结束')
        return false
      }

      SbPulSdk.canPay = 2

      SbPulSdk.debug(cpPayParams, 'cp请求支付参数')

      // TODO:增加角色信息
      // {'roleName':'屠龙','serverId':'游戏区服id','level':'角色等级','ext':'其他透传信息'}

      // 获取支付参数
      $.ajax(
        {
          type: 'get',
          url: SbPulSdk.payApi,
          data: cpPayParams,
          dataType: 'jsonp',
          jsonp: 'jsoncallback',

          complete: function () {
            SbPulSdk.canPay = 1
          },

          success: function (respon) {
            SbPulSdk.debug(respon, 'sdk返回请求支付参数')
            if (respon.code == -1) {
              alert(respon.msg)
              return false
            }
            SbPulSdkChannel.pay(respon.payParams)
          },
          error: function () {
            alert('发起渠道支付错误')
          }
        }
      )
    }

    /**
   * 创建角色接口
   * @param  json roleInfo 角色json信息
   * 数据格式:
   * {'roleName':'屠龙','serverId':'游戏区服id','level':'角色等级','ext':'其他透传信息'}
   */
    SbPulSdk.createRole = function (roleInfo) {
      SbPulSdk.debug(roleInfo, 'cp请求创建角色接口')
      // 获取支付参数
      $.ajax(
        {
          type: 'get',
          url: SbPulSdk.createRoleApi,
          data: roleInfo,
          dataType: 'jsonp',
          jsonp: 'jsoncallback',
          success: function (respon) {
            if (respon.code == -1) {
              console.log(respon.msg)
              return false
            }

            // TODO：
            if (SbPulSdkChannel.createRole != undefined) {
              SbPulSdkChannel.createRole(respon.roleParams)
            }
          },
          error: function () {
            console.log('上送角色信息失败')
          }
        }
      )
    }

    /**
   * 上报登入角色信息接口
   * @param  json roleData 角色json信息
   * 数据格式:
   * {'rolename':'屠龙','serverid':'游戏区服id','level':'角色等级','ext':'其他透传信息'}
   */
    SbPulSdk.loginRole = function (roleData) {
      SbPulSdk.debug(roleData, 'cp请求上报登入角色信息接口')
      // 获取支付参数
      $.ajax(
        {
          type: 'get',
          url: SbPulSdk.loginRoleApi,
          data: roleData,
          dataType: 'jsonp',
          jsonp: 'jsoncallback',
          success: function (respon) {
            if (respon.code == -1) {
              console.log(respon.msg)
              return false
            }

            // TODO：
            if (SbPulSdkChannel.loginRole != undefined) {
              SbPulSdkChannel.loginRole(respon.roleParams)
            }
          },
          error: function () {
            console.log('上报登入角色信息失败')
          }
        }
      )
    }

    // 渠道是否开启分享
    SbPulSdk.isCanShareble = function () {
      if (SbPulSdkChannel.isCanShareble == true) {
        return true
      } else {
        return false
      }
    }
    // 通用化分享初始化，cp回调方法和cp自定义参数
    SbPulSdk.shareConfig = function (shareCallback, cpCustomerParams) {
      if (SbPulSdkChannel.shareConfig != undefined) {
        SbPulSdkChannel.shareConfig(shareCallback, cpCustomerParams)
      }
    }
    // 通用化分享玩家点击分享按钮
    SbPulSdk.share = function () {
      if (SbPulSdkChannel.share != undefined) {
        SbPulSdkChannel.share()
      }
    }

    // 字符串转json
    SbPulSdk.parseJson = function (string) {
      return $.parseJSON(string)
    }

    // 调试
    SbPulSdk.debug = function (params, msg) {
      // return true;
      msg && console.log(msg)
      params && console.log(params)
    }

    // 同步加载js
    SbPulSdk.loadJsSync = function loadJS (url, success) {
      var domScript = document.createElement('script')
      domScript.src = url
      success = success || function () {}
      domScript.onload = domScript.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          success()
          this.onload = this.onreadystatechange = null
          this.parentNode.removeChild(this)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(domScript)
    }

    window.SbPulSdk = SbPulSdk
    // })(jQuery, window)
    SbPulSdk.init(loginParams, function (channelSdk) {
      console.log('SbPulSdk.init', channelSdk)
    })

    /** <---------------------以上是7724本身的脚本--------------------------> */
    console.log('融合初始化', data)
    console.log('融合初始化UrlParams', UrlParams)
    let cbData = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(cbData)
  },
  login ({ token, data = {}, callback }) {
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))
    FN.log('callback', callback)
    var UrlParams = FN.getURLparams()
    console.log('UrlParams', UrlParams)
    var deviceid = 'H5'
    var qqesuid = UrlParams.qqesuid
    var channelid = UrlParams.channelid
    var channeluid = UrlParams.channeluid
    var qqesnickname = UrlParams.qqesnickname
    var qqesavatar = UrlParams.qqesavatar
    var cpgameid = UrlParams.cpgameid

    var qqestimestamp = UrlParams.qqestimestamp
    var sign = UrlParams.sign
    var header = {qqesuid, deviceid, channelid, channeluid, qqesnickname, qqesavatar, cpgameid, ext, qqestimestamp, sign} // 用于融合登录传递给后端,进行登录校验
    FN.log('header-header-header1111', header)
    var ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        FN.log('header-header-header4', res)
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            status: res.msg
          }
          callback(cbData)
        }
      })
    } else {
      let cbData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(cbData)
    }
  },
  recharge ({ token, data = {}, callback }) {
    FN.log('支付信息', data)
    var cpPayParams = {
      order: data.order_id, // cp生成的订单号(请保证每次下单的订单号都不同)
      cpgameid: UrlParams.cpgameid, // cp的游戏id
      qqesuid: UrlParams.qqesuid, // 平台用户id
      channelid: UrlParams.channelid, // 渠道id
      channeluid: UrlParams.channeluid, // 渠道用户id
      cpguid: data.ext.cpguid, // cp在我们平台的唯一ID(后台可查看)
      goodsname: data.productName, // 商品名称
      fee: (data.amount / 100).toFixed(2), // 商品价格(元),(最多两位小数点)
      ext,
      timestamp, // 请求时间戳(用来防止重放攻击)
      sign: data.ext.pay_sign

    }
    SbPulSdk.pay(cpPayParams)
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    // let UrlParams = FN.getURLparams()
    timestamp = Date.parse(new Date()) / 1000
    window.__payData__ = {
      fee: (data.amount / 100).toFixed(2),
      ext,
      timestamp,
      cpgameid: UrlParams.cpgameid,
      qqesuid: UrlParams.qqesuid,
      channelid: UrlParams.channelid,
      goodsname: data.productName,
      channeluid: UrlParams.channeluid
    }
    return window.__payData__
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole-->data', data)
    var createRoleParams = {
      // 注意：以下属性排列顺序不能随意改，签名所需
      channelid: UrlParams.channelid,
      cpgameid: UrlParams.cpgameid,
      cpguid: FN.getSession('FUSE_USER_INFO').ext.cpguid,
      ext,
      level: data.role_level,
      qqesuid: UrlParams.qqesuid,
      roleName: data.role_name,
      serverId: data.server_id,
      timestamp: Date.parse(new Date()) / 1000
    }
    createRoleParams['sign'] = makeSign(createRoleParams, user_info.ext.sign_key)
    SbPulSdk.createRole(createRoleParams)
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole', data)
    var channel_info = FN.getSession('FUSE_CHANNEL_INFO')
    var loginRoleParams = {
      // 注意：以下属性排列顺序不能随意改，签名所需
      channelid: UrlParams.channelid,
      cpgameid: UrlParams.cpgameid,
      cpguid: user_info.ext.cpguid,
      ext,
      level: data.role_level,
      qqesuid: UrlParams.qqesuid,
      rolename: data.role_name,
      serverid: data.server_id,
      servername: data.server_name,
      timestamp: Date.parse(new Date()) / 1000,
      vip: data.vip_level
    }
    loginRoleParams['sign'] = makeSign(loginRoleParams, user_info.ext.sign_key)
    FN.log('loginRoleParams', loginRoleParams)
    FN.log('sign', md5('123456'))
    SbPulSdk.loginRole(loginRoleParams)
  }
}

function makeSign (params, key) {
  var ps = []
  for (var v in params) {
    ps.push(v + '=' + params[v])
  }
  return md5(ps.join('&') + '&' + key)
}
