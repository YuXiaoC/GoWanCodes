/*测试地址：
    英雄训练师：http://hlgame.mz30.cn/?code=yxxls3201
  */
FN.log('soeasysdk.use.js')

var t = new Promise((resolve, reject) => {
  window.zmInitSucc = function() {
    //TODO 必须在这里或者该方法调用之后进行 sdk 调用
    ZmSdk.getInstance().init(function(data){
      //初始化成功之后调用其他 sdk 能力 如 获取用户信息、支付、角色上报、设置分享信息、分享等…
      resolve(data)
    });
  }
})

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
    t.then(function(res){
        if(res.retcode === "0"){
          isStart = true;
          console.log('soeasysdk load is success');

          var userinfo = ZmSdk.getInstance().getUserInfo();
          console.log('userinfo', userinfo);

          let uid = userinfo.userdata.uid
          let t = userinfo.userdata.t
          let sign = userinfo.userdata.sign
          let header = {
            uid,
            t,
            sign,
          } // 用于融合登录传递给后端,进行登录校验
          let ext_header = {}
          if (!window.__ext__) {
            window.FUSESDK.login({
              ext: JSON.stringify(ext_header),
              data: JSON.stringify(header)
            }).then(res => {
              if (res.code === 0) {
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
        }else if(res.retcode === "1"){
          //初始化失败处理
          console.log('soeasysdk load is fail');
        }
    })
  },
  // 支付
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)

    var paydata = {
      check: data.ext.check,
      feeid: data.ext.feeid,  //自定义的计费 id
      fee: data.amount,   //金额 分
      feename: data.productName ? data.productName : data.chargeDesc, //商品名称
      extradata: data.ext.ext,  //透传参数
      serverid: data.serverId,
      rolename: data.roleName,
      roleid: data.roleId,
      servername: data.serverName,
    }
    FN.log('paydata', paydata)
    ZmSdk.getInstance().pay(paydata, function(data){
      FN.log('PAY_data', data);
    });

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

    let roleInfoJSON = {
      "datatype": 2, //1.选择服务器 2.创建角色 3.进入游戏 4.等级提升 5.退出游戏
      "serverid": data.server_id, //服务器 id
      "servername": data.server_name, //"服务器名称
      "roleid": data.role_id, //角色 id
      "rolename": data.role_name, //游戏角色昵称
      "rolelevel": data.role_level, //角色等级
      "fightvalue": 0, //战力
    };
    FN.log(roleInfoJSON);
    ZmSdk.getInstance().reportRoleStatus(roleInfoJSON);
  },
  //切换角色
  changeRole ({token, data = {}, callback}) {
    FN.log('切换角色', data)

    let roleInfoJSON = {
      "datatype": 3, //1.选择服务器 2.创建角色 3.进入游戏 4.等级提升 5.退出游戏
      "serverid": data.server_id, //服务器 id
      "servername": data.server_name, //"服务器名称
      "roleid": data.role_id, //角色 id
      "rolename": data.role_name, //游戏角色昵称
      "rolelevel": data.role_level, //角色等级
      "fightvalue": 0, //战力
    };
    FN.log(roleInfoJSON);
    ZmSdk.getInstance().reportRoleStatus(roleInfoJSON);
  },
  //角色升级
  upgradeRole ({token, data = {}, callback}) {
    FN.log('角色升级', data)

    let roleInfoJSON = {
      "datatype": 4, //1.选择服务器 2.创建角色 3.进入游戏 4.等级提升 5.退出游戏
      "serverid": data.server_id, //服务器 id
      "servername": data.server_name, //"服务器名称
      "roleid": data.role_id, //角色 id
      "rolename": data.role_name, //游戏角色昵称
      "rolelevel": data.role_level, //角色等级
      "fightvalue": 0, //战力
    };
    FN.log(roleInfoJSON);
    ZmSdk.getInstance().reportRoleStatus(roleInfoJSON);
  },
  // 分享
  shareToArk ({token, data = {}, callback}) {
    FN.log('分享信息', data)
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    FN.log('channelInfo', channelInfo)

    var shareData={
      'title': channelInfo.game_name,
      'content': data.summary,
      'imgurl': '',
      'ext': '',
    };

    if(ZmSdk.getInstance().isSupportMethod('setShareInfo')){
      ZmSdk.getInstance().setShareInfo(shareData, function(data){
        FN.log('setShareInfo', data);
      });
    } else{
      FN.log('setShareInfo', false)
    }

    if(ZmSdk.getInstance().isSupportMethod('share')){
      ZmSdk.getInstance().share(shareData, function(data){
        FN.log('share', data);
      });
    } else{
      FN.log('setShareInfo', false)
    }

  },
}

