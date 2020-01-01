/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 * 对应白鹭里面的Platform.ts
 */
var ShSdk = require("./shsdk/shsdk.js");
var Fingerprint = require('./js/fingerprint.min.js');
class WxgamePlatform {   
	pageStart() {
		var res = wx.getSystemInfoSync();
		var flag = res.system;
		flag = flag.toLowerCase();//区分Android和IOS
		if(flag.indexOf('ios') != -1){
      platform.gameId = 'P0006747';
		}else{
      platform.gameId = 'P0006746';
		}
		console.log(platform);
		ShSdk.init({
			package_code: platform.gameId
		});
	}
	
	newHandRecord(step) {
  }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            if(platform.wxUserInfo){
                resolve(platform.wxUserInfo);
            }else{
                wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
                        var userInfo = res.userInfo;
                        var nickName = userInfo.nickName;
                        var avatarUrl = userInfo.avatarUrl;
                        var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                        var province = userInfo.province;
                        var city = userInfo.city;
                        var country = userInfo.country;
                        if(!platform.wxUserInfo){
                            platform.wxUserInfo = userInfo;
                        }
                        resolve(userInfo);
                    }
                });
            }                        
        });
    }

    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    resolve(res)
                }
            })
        })
    }    
	
    getSystemFlag(){
      var res = wx.getSystemInfoSync();
      var flag = res.system;
      flag = flag.toLowerCase();
      return flag;      
    }

    getSystemInfo(){
      var res = wx.getSystemInfoSync();
      var flag = res.system;
      flag = flag.toLowerCase();
      return flag;
    }
	
    /**安卓原生包登录*/
    doSDKlogin(){}

    /**安卓原生包sdk数据刷新 */
    uploadUserInfo(){}

    /**安卓原生包init */
    init(){}

    loginSdk(loginProxy){      
      //选服界面转发侦听
      ShSdk.share(()=>{
        console.log('转发成功');
      },'gameId='+platform.gameId);
      /*
	  //初始化在pageStart进行了，这里不要重复
	  var res = wx.getSystemInfoSync();
      var flag = res.system;
      flag = flag.toLowerCase();//区分Android和IOS
      if(flag.indexOf('ios') != -1){
        platform.gameId = 'P0002499';
      }else{
        platform.gameId = 'P0002498';
      }
      ShSdk.init({
        package_code: platform.gameId
      });*/  

      ShSdk.login((data) => {
        console.log("data:",data);        
        var idfa = platform.uuid;
        var param = {
          gameId:platform.gameId,
          tokenid: data.tokenid,
          cid: platform.channel,
          version: platform.version,
          idfa: idfa
        };        
        loginProxy.loginAccountReq(param);        
      });      
    }    

    pay(params){        
        ShSdk.pay(params,
            function (data) {
                if (data.ret == 'SUCCESS') { //前端通知，不能做为实际发货的凭证，真实情况以服务端通知为准
                    console.log("支付完成");
                    wx.showModal({
                      title: "支付成功",
                      content: "支付成功"
                    });
                } else if (data.ret == 'YD_TIPS') {                    
                    App.VM.open(10020, {open:true,content:data.msg,name:data.msg});
                } else if (data.ret =='NOT_ALLOW'){
                    wx.showModal({
                        title: "支付失败",
                        content: "暂不支持ios支付"
                    });
                } else {
                    console.log("支付取消或失败");
                }
            }
        );
    }

    share(aid,callback,callbackTarget){  
        ShSdk.share(()=>{
            //callback.call(callbackTarget);
        },'gameId='+platform.gameId+'&fromAid='+aid);          
        ShSdk.goShare();
        //2018-10-10以后没有分享回调的临时处理
        let t = setTimeout(()=>{
            clearTimeout(t);
            callback.call(callbackTarget);            
        },5000);
    }

    getInitQuery(){
        var query = wx.getLaunchOptionsSync().query;
        console.log("启动参数:");
        console.log(query);
        return query;
    }

    triggerGC(){
        wx.triggerGC();
    }

  /** 微信专用*/
  createAuthButton(callback, callbackTarget, stageW, stageH, measuredX, measuredY, imgW, imgH, imgName) {
    if (window.authButton) {
      window.authButton.destroy();
    }
    let width = platform.converGameWidthToWx(stageW, imgW); //显示在实际屏幕中的宽(宽度计算好就可以决定高度)
    let height = platform.converGameHeightToWx(stageH, imgH); //显示在实际屏幕中的高(由上面计算好的宽度决定)
    let leftVal = platform.converGameWidthToWx(stageW, measuredX); //该图片在实际屏幕中的x坐标
    let topVal = platform.converGameHeightToWx(stageH, measuredY); //该图片在实际屏幕中的y坐标(需要结合布局进行计算)
    let button = wx.createUserInfoButton({
      type: 'image',
      image: platform.resUrl + 'resource/special/' + imgName,
      style: {
        left: leftVal,
        top: topVal,
        width: width,
        height: height,
        lineHeight: 0,
        backgroundColor: '',
        color: '',
        textAlign: 'center',
        fontSize: 0,
        borderRadius: 0
      },
      withCredentials: true
    });
    window.authButton = button;
    button.onTap((res) => {
      if (res && res.userInfo) {
        //ShSdk.unionId(res);
        platform.getUserInfo().then(() => {
          callback.call(callbackTarget);
        });
      }
    });
  }

  /** 游戏的实际宽转换为微信实际的宽*/
  converGameWidthToWx(stageW, gameW) {
    let sysinfo = wx.getSystemInfoSync();
    let winwidth = sysinfo.windowWidth;
    let res = gameW * winwidth / stageW;
    return res;
  }
  /** 游戏的实际高转换为微信实际的高*/
  converGameHeightToWx(stageH, gameH) {
    let sysinfo = wx.getSystemInfoSync();
    let winheight = sysinfo.windowHeight;
    let res = gameH * winheight / stageH;
    return res;
  }

    /** 微信专用*/
    listenShare(aid,callback,callbackTarget){
        ShSdk.share(()=>{
            //callback.call(callbackTarget);
        },'gameId='+platform.gameId+'&fromAid='+aid);        
    }

    setClipboardData(str, callBack){
        wx.setClipboardData({
            data:str,
            success: function () {
                callBack && callBack();
            }
        })
    }

    /**角色数据上报接口(微信和繁体) */
    updateRole(roleInfo, tp) {//角色数据上报接口
      if (tp == 'createRole') {
        ShSdk.createRole(roleInfo,(ret) => {});
      } else if (tp == 'enterGame') {
        return new Promise((resolve, reject) => {
			console.log(roleInfo);
			ShSdk.enterGame(roleInfo,(ret) => {
				console.log("enterGame");            
				console.log(ret);
        platform.sp = true;
				/*if(ret.data.msg.sp){
					platform.sp = true;
				}else{
					App.CM.unregister(10005);//屏蔽整个充值相关模块
					platform.sp = false;
				}*/
				if(ret.data.msg.yd_show){
					platform.yd_show = true;
				}else{
					platform.yd_show = false;
				}
				if(ret.data.msg.follow){
					platform.public_follow = true;
				}else{
					platform.public_follow = false;
				}
				//三国计提审服判断
        /*if (roleInfo.server_id == 809999){
					App.CM.unregister(10005);//屏蔽整个充值相关模块
					platform.sp = false;
					window["wx_server_type"] = "audit";//全局提审服标识
				}*/
				resolve();
			});
        });                 
      } else if (tp == 'levelUp') {
        ShSdk.roleUpLevel(roleInfo,(ret) => {
            console.log("levelUp");            
            console.log(ret);
            /*if(ret.data.msg.sp){
                platform.sp = true;
                App.CM.register(10005,new VipController());//开启充值相关模块                
            }else{
                App.CM.unregister(10005);//屏蔽整个充值相关模块
                platform.sp = false;
            }*/
            if(ret.data.msg.yd_show){
                platform.yd_show = true;
            }else{
                platform.yd_show = false;
            }
            if(ret.data.msg.follow){
                platform.public_follow = true;
            }else{
                platform.public_follow = false;
            }
            //三国计提审服判断
          /*if (roleInfo.server_id == 809999){
                App.CM.unregister(10005);//屏蔽整个充值相关模块
                platform.sp = false;
                window["wx_server_type"] = "audit";//全局提审服标识
          }*/
            App.VM.open(10001);
        });
      }
    }

    /**微信专用客服聊天入口 */
    callCenter() {//客服聊天入口
      wx.openCustomerServiceConversation();
    }    

    /** 繁体专用*/
    collect(eventAction){}

     /**爱微游的实名验证 */
    autonym(awyAutonymProxy, account){}

    /**爱微游的关注公众号 */
    attention(awyAttentionProxy){}
    
    /**爱微游的邀请功能 */
    invite(awyInviteProxy){}
    
    /** 拥有武将(微信专用)*/
    setSort(hero_info){
        //ShSdk.setSort(hero_info);
    }
    
    /**玩一玩收藏专用*/
    createShortCut(){}
	
    /**获取是否关注公众号（微信） */
	getAttentionStatus(model){
        /*ShSdk.subscribe(function (ret) {
          //说明【关注状态->subscribe，1：已关注，0：取消关注，关注|取消关注时间->subscribe_time】
          if (ret.subscribe == 1){
            model.isAttention = 1;
          }else{
            model.isAttention = 0;
          }
          console.log('公众号关注状态获取结果', ret);
        });*/
    }
  
    record(){
        var idfa = platform.uuid;
        var rParam = "cid="+platform.channel+"&idfa="+idfa+"&step=0";
        wx.request({
          url: platform.cpUrl+'action/user/deviceStep?'+rParam,          
          success (res) {
            console.log("请求打点成功!");
            console.log(res.data);
          }
        });
    }    

    playClickEffect(name){
        name = name.replace("_",".");
        var audioObj = platform.getAudioContextFromPool();
        var audio =  undefined;
        if(audioObj){
            audio = audioObj.audio;            
            audioObj.busy = true; 
            let t = setTimeout(()=>{
                clearTimeout(t);
                audioObj.busy = false;           
            },500);                       
        }else{
            audio = wx.createInnerAudioContext();
        }             
        var url = platform.resUrl + "resource/sounds/" + name;
        audio.src = url; // src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
        audio.play();                
    }

    getAudioContextFromPool(){
        if(!platform.audios || platform.audios.length == 0){
            platform.audios = [];
            for (var i = 0; i < 20; i++) {
                var audioObj = {};
                audioObj.id = i;
                audioObj.busy = false;
                audioObj.audio = wx.createInnerAudioContext();
                platform.audios.push(audioObj);
            }
        }
        for (var i = 0; i < platform.audios.length; i++) {
            var audioObj = platform.audios[i];
            if(!audioObj.busy){
                return audioObj;
            }
        }
        return undefined;
    }
    isIphoneX() {
        var res = false;        
        var os = platform.getSystemInfo();        
        if (os.indexOf("ios") === -1) {
            return res;
        }
        let sysinfo = wx.getSystemInfoSync();
        let winwidth = sysinfo.windowWidth;
        let winheight = sysinfo.windowHeight;
        let rate = winwidth / winheight;
        if (rate >= 0.5) {
            return res;
        }
        res = true;
        return res;
    }
  /**更新背景图*/
  updateLoadingBg() {
    var _self = this;
    var version = wx.getStorageSync('pt_ver')
    if (version == _self.version) {
      console.log("版本号没有变化");
      return;
    }
    let timer = setTimeout(() => {
      console.log("开始更新背景图");
      clearTimeout(timer);
      timer = null;
      var originalPath_bg = platform.resUrl + "resource/special/v1_jiazai_bj.png";
      var targetPath_bg = wx.env.USER_DATA_PATH + "/special/v1_jiazai_bj.png";
      _self.downLoadBg(originalPath_bg, targetPath_bg);
      var originalPath = platform.resUrl + "resource/special/v1_jiazai.png";
      var targetPath = wx.env.USER_DATA_PATH + "/special/v1_jiazai.png";
      _self.downLoadBg(originalPath, targetPath);
    }, 60000);
  }

  downLoadBg(originalPath, targetPath) {
    var fsm = wx.getFileSystemManager();
    var _self = this;
    wx.downloadFile({
      url: originalPath,
      success: (v) => {
        if (v.tempFilePath) {
          console.log(originalPath + "下载成功");
          fsm.copyFile({
            srcPath: v.tempFilePath,
            destPath: targetPath,
            success: function () {
              console.log(originalPath + "成功复制到" + targetPath);
              wx.setStorageSync('pt_ver', _self.version);
            }
          });
        } else {
          console.log(originalPath + "下载失败");
        }
      },
      fail: (e) => {
        console.error(e);
      }
    });
  }

  schedule(ratio, boo) {
    FirstLoading.instance.schedule(ratio, boo);
  }
    /**SDK配置相关*/
    channel_code = undefined;
    gameId = "P0006746";
    channel = "248";
    version = "838";
    name = 'wxgame';
    resUrl = "https://cdnquny.wip.vndeep.com/bmwsw/1.0.0/";
    cpUrl = "https://qunyaccountwam.wip.vndeep.com/";
    loginUrl = "sh921/login";
    serverGroupUrl = "action/user/getPartitionGameServer";
    createOrderUrl = "sh921/createOrder";
    noticeUrl = "getNotice";
    noticeId = "5d8ca555ef3b2011b0d79ddf";
    scene = undefined;
    wxUserInfo = undefined;
    sp = false;
    yd_show = false;   
    public_follow = false; 
    uuid = new Fingerprint().get() + "";    
    audios = undefined;
    openDataContext = new WxgameOpenDataContext();
}

class WxgameOpenDataContext {

    createDisplayObject(type, width, height) {
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        if (egret.Capabilities.renderMode == "webgl") {
            const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
            const context = renderContext.context;
            ////需要用到最新的微信版本
            ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
            ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
            if (!context.wxBindCanvasTexture) {
                egret.startTick((timeStarmp) => {
                    egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                    bitmapdata.webGLTexture = null;
                    return false;
                }, this);
            }
        }
        return bitmap;
    }


    postMessage(data) {
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }
}

window.ShSdk = ShSdk;
window.platform = new WxgamePlatform();