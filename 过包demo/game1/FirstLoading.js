class FirstLoading extends egret.DisplayObjectContainer {
  identify = false;
  identify_bg = false;
  txt = undefined;
  bgWidth = undefined;
  scrBg = undefined;
  scr = undefined;
  timer2 = undefined;
  constructor() {
    super();
    this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    FirstLoading.instance = this;
  }

  onAddToStage() {
    this.scrollbar();
    var path = wx.env.USER_DATA_PATH + "/special";
    this.isDirectory(path, this.loadingBg, this);
  }

  scrollbar() {
    var _self = this;
    let scrollBg = new egret.ImageLoader();
    scrollBg.crossOrigin = "anonymous";
    scrollBg.once(egret.Event.COMPLETE, _self.doScrollBg, _self);
    scrollBg.load("game1/image/v1_b1_jiazaidi.png");
  }

  schedule(ratio, boo) {
    console.log("schedule",ratio);
    let _self = this;
    let tarWidth = _self.bgWidth * ratio;
    let timer = setInterval(function() {
      // console.log('_self.scr', _self)
      // console.log('schedule', schedule)
      // console.log('new egret.Bitmap()', new egret.Bitmap())
      _self.scr.width += 10;
      if (_self.scr.width >= tarWidth) {
        clearInterval(timer);
      }
      if (boo) {
        _self.scr.width = _self.bgWidth;
        clearInterval(timer);
        clearInterval(_self.timer2);
        _self.removeChild(_self.txt);
        _self.removeChild(_self.scr);
        _self.removeChild(_self.scrBg);
      }
    }, 30);
  }

  doScroll(evt) {
    let _self = this;
    let loader = evt.currentTarget;
    let stageH = _self.stage.stageHeight;
    let stageW = _self.stage.stageWidth;
    let bgTexture = new egret.Texture();
    bgTexture.bitmapData = loader.data;
    _self.bgWidth = stageW * .9 - 6;

    
    _self.scr = new egret.Bitmap();
    _self.scr.width = 0;
    _self.scr.height = 17;
    _self.scr.x = (stageW - _self.bgWidth) / 2;
    _self.scr.x = 35;
    _self.scr.y = stageH * .85 + 4;
    _self.scr.texture = bgTexture;
    _self.addChildAt(_self.scr, 3);

    _self.schedule(0.3);

    let content = "载入中。。。";
    _self.txt = new egret.TextField();
    _self.addChildAt(_self.txt, 4);
    _self.txt.text = content;
    _self.txt.size = 19;
    _self.txt.bold = true;
    _self.txt.x = (stageW - _self.txt.width) / 2;
    _self.txt.y = stageH * .85 + 3;
    _self.txt.textColor = 0xFFFFFF;

    let index = 0;
    _self.timer2 = setInterval(function () {
      _self.txt.text = content.substring(0,4+index);
      index++;
      if (index >= 3) {
        index = 0;
      }
    },500);
  }

  doScrollBg(evt) {
    let _self = this;
    let loader = evt.currentTarget;
    let stageH = this.stage.stageHeight;
    let stageW = this.stage.stageWidth;
    let bgTexture = new egret.Texture();
    bgTexture.bitmapData = loader.data;
    _self.scrBg = new egret.Bitmap();
    _self.scrBg.width = stageW * .9;
    _self.scrBg.height = 26;
    _self.scrBg.x = (stageW - _self.scrBg.width) / 2;
    _self.scrBg.y = stageH * .85;
    _self.scrBg.texture = bgTexture;
    this.addChildAt(_self.scrBg, 2);

    let scroll = new egret.ImageLoader();
    scroll.crossOrigin = "anonymous";
    scroll.once(egret.Event.COMPLETE, _self.doScroll, _self);
    scroll.load("game1/image/v1_bar_red_jiazai.png");
  }

  isDirectory(path, callback, callbackTarget) {
    var fsm = wx.getFileSystemManager();
    fsm.access({
      path: path,
      success: function(res) {
        console.log("目录已经存在", res);
        callback.call(callbackTarget);
      },
      fail: function(res) {
        console.log("目录不存在", res);
        fsm.mkdir({
          dirPath: path,
          success: function(res) {
            console.log("创建目录成功", res);
            callback.call(callbackTarget);
            wx.setStorageSync('pt_ver', platform.version);
          },
          fail: function(res) {
            console.log("创建目录失败", res);
          }
        });
      }
    });
  }

  loadingBg() {
    var originalPath_bg = platform.resUrl + "resource/special/v1_jiazai_bj.png";
    var targetPath_bg = wx.env.USER_DATA_PATH + "/special/v1_jiazai_bj.png";
    this.isFile(originalPath_bg, targetPath_bg, "bg");
    var originalPath = platform.resUrl + "resource/special/v1_jiazai.png";
    var targetPath = wx.env.USER_DATA_PATH + "/special/v1_jiazai.png";
    this.isFile(originalPath, targetPath, "");
  }

  isFile(originalPath, targetPath, type) {
    var fsm = wx.getFileSystemManager();
    var _self = this;
    fsm.access({
      path: targetPath,
      success: function(res) {
        console.log("已缓存背景图片", res);
        _self.loadBgImg(targetPath, type);
      },
      fail: function(res) {
        console.log("没缓存背景图片", res);
        _self.downLoadBg(originalPath, targetPath, type);
        wx.setStorageSync('pt_ver', platform.version);
      }
    });
  }

  downLoadBg(originalPath, targetPath, type) {
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
            success: function() {
              _self.loadBgImg(targetPath, type);
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

  loadBgImg(path, type) {
    var _self = this;
    if (type == "bg") {
      // 加载背景图资源
      let bgLoader = new egret.ImageLoader();
      bgLoader.crossOrigin = "anonymous";
      bgLoader.once(egret.Event.COMPLETE, _self.loadBgComplete, _self);
      bgLoader.load(path);
      _self.identify_bg = true;
    } else {
      let bgLoader2 = new egret.ImageLoader();
      bgLoader2.crossOrigin = "anonymous";
      bgLoader2.once(egret.Event.COMPLETE, _self.loadBgComplete2, _self);
      bgLoader2.load(path);
      _self.identify = true;
    }
    _self.onSuccess();
  }

  loadBgComplete(evt) {
    let _self = this;
    let loader = evt.currentTarget;
    let bgTexture = new egret.Texture();
    bgTexture.bitmapData = loader.data;
    let bg = new egret.Bitmap();
    bg.width = _self.stage.stageWidth;
    bg.height = _self.stage.stageHeight;
    bg.texture = bgTexture;
    _self.addChildAt(bg, 0);
  }

  loadBgComplete2(evt) {
    let _self = this;
    let loader = evt.currentTarget;
    let bgTexture = new egret.Texture();
    bgTexture.bitmapData = loader.data;
    let bg = new egret.Bitmap();
    let stageH = _self.stage.stageHeight;
    let stageW = _self.stage.stageWidth;
    bg.height = stageH > 1280 ? 1280 : stageH;
    bg.width = stageW > 720 ? 720 : stageW;
    bg.x = (stageW - bg.width) / 2;
    bg.y = (stageH - bg.height) / 2;
    bg.texture = bgTexture;
    _self.addChildAt(bg, 1);
  }

  onSuccess() {
    if (this.identify && this.identify_bg) {
      const stage = this.stage;
      // 创建文档类，开发者需要根据自身项目更改
      const main = new Main();
      // 先加入Main界面，然后在延时去掉loading界面，避免中间出现闪屏
      stage.addChild(main);
    }
  }
}

window.FirstLoading = FirstLoading;