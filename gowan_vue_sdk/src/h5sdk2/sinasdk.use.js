// 新浪游戏测试地址http://sng.sina.com.cn/api/redirect/nh5pass_game/appkey/3865966657
// 接口文档https://gitee.com/sinagamesdk/sinagamesdk-h5/blob/master/%E6%96%B0%E6%B5%AA%E6%B8%B8%E6%88%8FH5%E6%8E%A5%E5%85%A5%E6%96%87%E6%A1%A3.md#13%E7%94%A8%E6%88%B7%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%E6%8E%A5%E5%8F%A3%E6%9C%8D%E5%8A%A1%E7%AB%AF
function addShortcut () {
  window.sngH5Game.addShortcut('callbackFunction')
}

// 保存桌面快捷方式回调
function callbackFunction (codeRes) {
  if (codeRes == 0) {
    // 保存到桌面成功
    showInfos('保存到桌面成功')
  } else if (codeRes == -1) {
    // 保存到桌面失败
    showInfos('保存到桌面失败')
  }
}

// 界面不在游戏中回调处理：
function sngH5GameOnPause () {
  showInfos('游戏暂停')
};

// 切回到游戏界面回调处理：
function sngH5GameOnResume () {
  showInfos('游戏恢复')
};

// 关闭游戏回调处理：
function sngH5GameOnDestory () {
  showInfos('游戏关闭')
};
// console.log('sinasdk.use.js333333333333333', FN.getSession('FUSE_CHANNEL_INFO'))
FN.log('FN.getURLparams()', FN.getSession('FUSE_CHANNEL_INFO'))
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
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    // suid   deviceid     token
    let params = FN.getURLparams() // 获取链接参数
    let uid = params.uid
    let deviceid = 'H5'
    let sina_token = params.access_token

    let header = {uid, deviceid, token: sina_token} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    // console.log('header-header-header', header)
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
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
  shareToArk ({ token, data = {}, callback }) {
    share_game.share_weibo({
      page_id: '231307ebfe824835cc17344af70278a978ad0d', // 上线时，运营人员会给新的pageid，替换一下即可
      content: '分享内容', // 填写分享的内容，可为空
      app_key: FN.getSession('FUSE_USER_INFO').ext.appkey, // 填写app_key,pc端分享时候用到
      token: FN.getSession('FUSE_USER_INFO').ext.token, // 填写token
      fullscreen: FN.getURLparams().fullscreen ? FN.getURLparams().fullscreen : 0, // 从url上面获取fullscreen的值，填写到这里。
      uid: FN.getURLparams().uid, // 填写uid
      success: function () {
      // 成功回调-必写
        FN.log('进入成功回调')
        let cbData = {
          statusCode: 0,
          aioType: 4, // 1: 个人  4:群聊
          status: '分享成功'
        }
        callback(cbData)
      }

    })
  }
}
