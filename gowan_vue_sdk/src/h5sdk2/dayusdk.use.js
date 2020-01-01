/*测试地址：
    英雄训练师：http://test.dayukeji.com/games51platform_backend/playerlogin/snsapi_base?game_id=10228*/
FN.log('8090sdk.use.js')
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

    let sign = Params.sign
    let UID = Params.UID
    let header = {sign, UID} // 用于融合登录传递给后端,进行登录校验
    if(Params.nickname){

      //这个渠道支持的登陆方式很多，nickname是在显示登陆下才有的字段
      header['nickname'] = Params.nickname;
      header['headimgurl'] = Params.headimgurl;
    }
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
          SDK_AREA51.init(1)
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
    console.log('支付信息', data)
    let userInfo = FN.getSession('FUSE_USER_INFO');
    let params = FN.getURLparams() // 获取链接参数
    var paydata = {
       UID:userInfo.user_id,
       game_id:data.ext.cpgame_id,
       recharge:parseFloat(data.amount/100).toFixed(2),
       order_id:data.order_id,
       ext:data.ext.ext,
       sign:data.ext.sign,
       success:function(){
        FN.log('支付回调', "支付成功")
       }
    }
    console.log('paydata', paydata)
    SDK_AREA51.recharge (params);

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  changeRole (p) {
    /*
    FN.log('changeRole角色data', p)
    let UrlParams = FN.getURLparams() // 获取链接参数
    var user_info = FN.getSession('FUSE_USER_INFO')
    // 注意：以下属性排列顺序不能随意改，签名所需
    var params = {
      gname: UrlParams.gname,
      username: UrlParams.username,
      server: p.data.server_id,
      role: p.data.role_name,
      level: p.data.role_level,
      power:0
    }

    let sing = md5(UrlParams.gname+UrlParams.username+params.server+params.role+params.level+user_info.ext.key);
    params['sign'] = sing
    console.log('角色登录params', params)
    window.GAME_8090_SDK.uploadGameRole(params)
    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    p.callback(cbData)*/
  },

  // 分享
  shareToArk ({token, data = {}, callback}) {
    if(SDK_AREA51.flags.share_flag){			//先判断接口状态

      var channelInfo = FN.getSession('FUSE_CHANNEL_INFO');
      let shareParams = {
        title:channelInfo.game_name,
        desc:data.summary,
        imgUrl:data.picUrl,
        link:"",
        success : function(){
          console.log('分享成功回调');
        }      
      }
      SDK_AREA51.share(shareParams);		//配置分享接口参数,参数见下方说明
      }else{
        //不可进行分享调用，需要隐藏分享按钮
      }
      
  }
}

