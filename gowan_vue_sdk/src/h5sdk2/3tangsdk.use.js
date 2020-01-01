/*测试地址：
    英雄训练师：http://www.3tang.com/h/gametest.asp?gid=427548
*/
FN.log('3tangsdk.use.js')
var _shareCallback = ""; //分享回调函数,这里可以用订阅
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

    //openid才是用户id
    let openid = Params.openid
    let userid = Params.userid
    let logintime = Params.logintime
    let sid  = Params.sid
    let isAdult  = Params.isAdult
    let sign  = Params.sign
    let header = {
      openid,
      userid,
      logintime,
      sid,
      isAdult,
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
          res.data.userid = userid
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
    var userid = FN.getSession('FUSE_USER_INFO').userid
    var game_name = FN.getSession('FUSE_CHANNEL_INFO').game_name
    let cpData = data

    var ybcn = cpData.productName ? encodeURIComponent(cpData.productName) : encodeURIComponent(cpData.chargeDesc)
    if(cpData.roleName == '""'){
      var rolename = '';
    } else{
      var rolename = encodeURIComponent(cpData.roleName);
    }

    var payData = {
        userid: userid,
        gid: cpData.ext.gid,
        sid: cpData.serverId,
        money: cpData.ext.money,    //元，服务端
        gamename: encodeURI(game_name),
        cp_trade_no: cpData.order_id,
        openid: cpData.fuseParams.user_id,
        method: 'pay',
        item: cpData.ext.money*10+ybcn,
        gamerate: '10',
        ybcn: ybcn,
        roleid: cpData.roleId,
        rolename: rolename,
        sign: cpData.ext.sign
    };
    FN.log('paydata', payData)
    window.parent.postMessage(payData,'*')

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {
    var userid = FN.getSession('FUSE_USER_INFO').userid
    window.__payData__ = {
      userid: userid, //这个userid，唯一标识是openid
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
  // 分享
   shareToArk ({token, data = {}, callback}) {
     FN.log('分享信息', data)
     let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
     let userInfo = FN.getSession('FUSE_USER_INFO')
     let Params = FN.getURLparams() // 获取链接参数
     FN.log('channelInfo', channelInfo)
     var sharemsg={
       'method': 'sharegame',//注意方法名不能错
       'sharetitle': channelInfo.game_name,
       'shareDesc': data.summary,
       'userid':userInfo.userid,
       'openid':userInfo.user_id
     };
     _shareCallback = callback;
     window.parent.postMessage(sharemsg,'*');
   },

   createRole ({token, data = {}, callback}) {
      FN.log('createRole', data)
      let userInfo = FN.getSession('FUSE_USER_INFO');
      var roleInfoJson = {
        method:'report',
        isCreateRole: 0, //是创建角色就写1，其他写0
        roleCreateTime : Date.parse(new Date())/1000,
        userid : userInfo.userid,
        openid : userInfo.user_id,
        fightvalue : 0, //玩家角色战力
        serverId : data.server_id,
        serverName: data.server_name,
        userRoleId : data.role_id,
        userRoleName : data.role_name,
        userRoleLevel : data.role_level, // 角色级别
        userRoleBalance : data.balance , //角色游戏内货币余额
        vipLevel : data.vip_level,
        partyId : '',
        partyName :''
      }
      FN.log('createRole', roleInfoJson)
      window.parent.postMessage(roleInfoJson,'*');
  },
  changeRole ({token, data = {}, callback}) {

    FN.log('changeRole', data)
    let userInfo = FN.getSession('FUSE_USER_INFO');
    var roleInfoJson = {
      method:'report',
      isCreateRole: 0, //是创建角色就写1，其他写0
      roleCreateTime : Date.parse(new Date())/1000,
      userid : userInfo.userid,
      openid : userInfo.user_id,
      fightvalue : 0, //玩家角色战力
      serverId : data.server_id,
      serverName: data.server_name,
      userRoleId : data.role_id,
      userRoleName : data.role_name, // 区服名称,\
      userRoleLevel : data.role_level, // 角色级别
      userRoleBalance : data.balance , //角色游戏内货币余额
      vipLevel : data.vip_level,
      partyId : '',
      partyName :''
    }
    FN.log('changeRole', roleInfoJson)
    window.parent.postMessage(roleInfoJson,'*');
 }
}

//监听渠道发来的信息
window.addEventListener("message", function(data){
  console.log("message:");
  console.log(data);
  if ("shareSuccess" === data.data) {
       if(_shareCallback){
          _shareCallback({
              statusCode: 0,
              status: '调用分享成功'
          })
          _shareCallback = "";
       }
    }
  }, false);