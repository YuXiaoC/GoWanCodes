/*测试地址：
    英雄训练师：http://h5.07073.com/gameplay/wap-yxxls*/
FN.log('07073sdk.use.js')

window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    let Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    let uid = Params.uid
    let uname = Params.uname
    let time = Params.time
    let sign = Params.sign
    let sign_type = Params.sign_type
    let ext_param = Params.ext_param    //我们自己的登录参数也参与验签
    let yisdk_param = Params.yisdk_param    //我们自己的登录参数也参与验签
    let header = {
      uid,
      uname,
      time,
      sign,
      sign_type,
      ext_param,
      yisdk_param,
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {

          window.h5sdk07073cp.initConfig({
            gamekey: res.data.ext.gamekey,   //07073开放平台游戏KEY
            uid: res.data.user_id,    //07073开放平台登录时uid
            debug: true,  // 是否打印数据日志
            onSubscribeCallback: subscribe_callback, // 关注回调
            onShareOkCallback: share_callback, // 分享回调
            onIsSubscribeCallback: issubscribe_callback, // 是否关注回调
          });

          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          callback({
            statusCode: 0,
            loginParams: res.data
          })
          window.__ext__ = res.data
        } else {
          callback({
            statusCode: res.code,
            status: res.msg
          })
        }
      })
    } else {
      callback({
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      })
    }
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    let uid = FN.getSession('FUSE_USER_INFO').user_id
    let cpData = data
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))

    //上报数据赋值
    //基础数据
    let gBaseData = {
        "role": cpData.roleId,            //游戏角色的唯一ID
        "nickname": cpData.roleName,    //游戏中角色的昵称，没有昵称的可以传空字符串
        "area": cpData.serverId,           //游戏区标志
        "group": cpData.serverName          //游戏服务器标志
    };
    //支付上报数据
    let extendData = {
        "goods_name":  cpData.productName ? cpData.productName : cpData.chargeDesc, // 商品名称
        "money": cpData.amount, //默认为0，金额 分
        "game_ordersn": cpData.order_id, // 游戏订单号
    };

    var paydata = {
      gamekey: cpData.ext.gamekey,  //H5开放平台游戏KEY
      uid: uid,  //07073开放平台登录时uid
      goods_id: cpData.cpProductId, //商品ID
      goods_name: data.productName ? data.productName : data.chargeDesc, //商品名称
      fee: cpData.amount,  //商品价格(分)
      time: cpData.ext.time, //下单时间
      game_ordersn: cpData.order_id, //游戏商品订单号
      //ext_sdk: '',  //07073开放平台登陆时传递的ext_sdk(原样传回)
      ext_cp: cpData.ext.ext_cp, //游戏额外透传参数
      sign_type: 'MD5', //固定md5
      sign: cpData.ext.sign,  //签名
      onPayCallback: payok_report(gBaseData, extendData),  // 支付成功的回调函数（此方法不能作为充值成功的依据，需要通过服务器异步获取充值信息）
      onPayCancel: payfail_report   // 取消支付回调函数 
    }
    FN.log('paydata', paydata)
    window.h5sdk07073cp.pay(paydata)

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    let uid = FN.getSession('FUSE_USER_INFO').user_id
    window.__payData__ = {
      uid: uid,
      goods_id: data.cpProductId,
      goods_name: data.productName ? data.productName : data.chargeDesc,
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
  //创建角色
  createRole ({token, data = {}, callback}) {
    FN.log('创建角色', data)

    //基础数据
    let gBaseData = {
        "role": data.role_id,            //游戏角色的唯一ID
        "nickname": data.role_name,    //游戏中角色的昵称，没有昵称的可以传空字符串
        "area": data.server_id,           //游戏区标志
        "group": cpData.server_name          //游戏服务器标志
    };

    let extendData = {
        "level": data.role_level, //默认为0，当前等级
        "vipLevel": data.vip_level, //整型，默认为0，VIP等级
        "score": 0, //整型，默认为0，战力、综合评分等
        "isNew": 1, //如果是创建角色后第一次登录为1，默认为0
        "relevel": 0,  // 角色转生等级
    };
    window.h5sdk07073cp.gameReport("enterGame", gBaseData, extendData, function(data) {
        FN.log('enterGame is ok');
    });
  },
  //切换角色
  changeRole ({token, data = {}, callback}) {
    FN.log('切换角色', data)

    //基础数据
    let gBaseData = {
        "role": data.role_id,            //游戏角色的唯一ID
        "nickname": data.role_name,    //游戏中角色的昵称，没有昵称的可以传空字符串
        "area": data.server_id,           //游戏区标志
        "group": data.server_name          //游戏服务器标志
    };

    let extendData = {
        "level": data.role_level, //默认为0，当前等级
        "vipLevel": data.vip_level, //整型，默认为0，VIP等级
        "score": 0, //整型，默认为0，战力、综合评分等
        "isNew": 1, //如果是创建角色后第一次登录为1，默认为0
        "relevel": 0,  // 角色转生等级
    };
    window.h5sdk07073cp.gameReport("enterGame", gBaseData, extendData, function(data) {
        FN.log('enterGame0 is ok');
    });
  },
  //角色升级
  upgradeRole ({token, data = {}, callback}) {
    FN.log('角色升级', data)

    //基础数据
    let gBaseData = {
        "role": data.role_id,            //游戏角色的唯一ID
        "nickname": data.role_name,    //游戏中角色的昵称，没有昵称的可以传空字符串
        "area": data.server_id,           //游戏区标志
        "group": cpData.server_name          //游戏服务器标志
    };

    let extendData = {
        "level": data.role_level, //默认为0，当前等级
    };
    window.h5sdk07073cp.gameReport("levelUpgrade", gBaseData, extendData, function(data) {
        FN.log('levelUpgrade is ok');
    });
  },
}


// 充值成功
function payok_report(gBaseData, extendData)
{   
    window.h5sdk07073cp.gameReport("payOk", gBaseData, extendData, function(data) {
        FN.log('payOk is ok');
    });
}

// 充值失败
function payfail_report()
{
    FN.log('payfail is ok');
}

// 分享回调
function share_callback(msg) 
{
    FN.log('share_callback:', msg);
}

// 关注回调
function subscribe_callback(msg) 
{
    FN.log("subscribe_callback", msg);
}

// 是否关注回调
function issubscribe_callback(msg) 
{
    FN.log("issubscribe_callback", msg);
}

