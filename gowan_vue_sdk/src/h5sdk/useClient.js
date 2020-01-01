import PS from 'pubsub-js'
import FN from '../utility/fn'

const INDEX = {
  login: '1', // 登录
  updateData: '2', // 创角
  recharge: '3', // 支付
  changeAccount: '4', // 登出
  discuz: '5', // 论坛
  checkRealNameAuth: '6',
  exitGame: '7' // 退出游戏
}

function sendToOc (code, args, token, callbackCode) {
  return new Promise((resolve, reject) => {
    window.webkit.messageHandlers.IOS_SmallClient.postMessage({'code': code, 'data': args, 'token': token, 'callback': callbackCode})
    resolve()
  })
}
function sendToAndroid (code, args, token) {
  return new Promise((resolve, reject) => {
    gowanWebview.commonNativeMethod(code, JSON.stringify(args), token)
    resolve()
  })
}
let CLIENTSDK = {
  init (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let data = {statusCode: 0, status: ''}
    console.log('gowan初始化开始')
    console.log(token)
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
  },
  // 登录
  login (token, args) {
    FN.log('EVENT:login', args)
    FN.saveSession('token', token)
    if (FN.OS.isIOS) {
      // window.webkit.messageHandlers.IOS_SmallClient.postMessage({'code': INDEX.login, 'data': args, 'token': token, 'callback': INDEX.login})
      sendToOc(INDEX.login, args, token, INDEX.login).then((res) => {
        console.log('发送给IOS成功')
      })
    } else {
      // gowanWebview.commonNativeMethod(code, JSON.stringify(args), token)
      sendToAndroid(INDEX.login, args, token).then((res) => {
        console.log('发送给安卓成功')
      })
    }
  },
  // 登出
  changeAccount (token, args) {
    FN.log('EVENT:changeAccount', args)
    let data = {statusCode: 0, status: ''}
    FN.post({
      type: 'CC',
      token: token,
      payload: data
    })
  },
  // SDK切换账号
  flymeChangeAccount (token, args) {
    FN.log('EVENT:flymeChangeAccount')
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)

    if (FN.OS.isIOS) {
      sendToOc(INDEX.changeAccount, args, token, INDEX.changeAccount).then((res) => {
        console.log('发送IOS成功')
      })
    } else {
      sendToAndroid(INDEX.changeAccount, args, token).then((res) => {
        console.log('发送安卓成功')
      })
    }
    if (!window.FUSESDKAPI.flymeChangeAccount) return
    window.FUSESDKAPI.flymeChangeAccount({
      token,
      data: {
        // TODO
        loginWay: ''
      },
      callback: (data = {}) => {
        FN.post({
          type: 'CC',
          token: token,
          payload: data
        })
      }
    })
  },
  // 支付
  recharge (token, args) {
    FN.log('EVENT:recharge', args)
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    if (FN.OS.isIOS) {
      sendToOc(INDEX.recharge, args, token, INDEX.recharge).then((res) => {
        let data = {statusCode: 0, status: '调用支付成功'}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.recharge, args, token).then((res) => {
        console.log('发送给安卓成功')
      })
    }
  },
  // 角色创建
  createRole (token, args) {
    FN.log('EVENT:createRole', args)
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 2
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token, INDEX.updateData).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 切换角色登录
  changeRole (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 3
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 角色升级
  upgradeRole (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 4
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 选择服务器上报数据
  slectServe (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 1
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 结束任务上报数据
  task (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 6
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 获得荣耀上报数据
  honor (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let dataType = 7
    let updateData = {
      ...args,
      dataType
    }
    if (FN.OS.isIOS) {
      sendToOc(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      })
    } else {
      sendToAndroid(INDEX.updateData, updateData, token).then((res) => {
        let data = {statusCode: 0, status: ''}
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        console.log('发送给安卓成功')
      })
    }
  },
  // 获取当前用户ID
  getUserID (token, args) {
    let UserId = FN.getSession('CLIENT_FUSE_USER_INFO').user_id
    let data = {statusCode: 0, status: UserId}
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
  },
  // 获取渠道分发id
  getFromID (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let FromID = FN.getSession('FUSE_CHANNEL_INFO').from_id
    let data = {statusCode: 0, status: FromID}
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
  },
  getPTID (token, args) {
    FN.log('EVENT:game emit getPTID', { token, args })
    let data = {
      channelId: FN.getSession('FUSE_CHANNEL_INFO').channel_id
    }
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
  },
  // 获取手机系统
  getPlatform (token, args) {
    // 为客户端相应的事件保存token
    FN.saveSession('token', token)
    let OS = FN.getSession('FUSE_CHANNEL_INFO').os
    let data = {os: OS}
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
  },
  // 实名认证查询
  checkRealNameAuth (token, args) {
    if (FN.OS.isIOS) {
      sendToOc(INDEX.checkRealNameAuth, args, token, INDEX.login).then((res) => {
        console.log('发送给IOS成功')
      })
    } else {
      sendToAndroid(INDEX.checkRealNameAuth, args, token, INDEX.login).then((res) => {
        console.log('发送给安卓成功')
      })
    }
  },
  // 获取手机系统
  exitGame (token, args) {
    // 为客户端相应的事件保存token
    if (FN.OS.isIOS) {
      sendToOc(INDEX.exitGame, args, token, INDEX.exitGame).then((res) => {
        console.log('发送给IOS成功')
      })
    } else {
      sendToAndroid(INDEX.exitGame, args, token, INDEX.exitGame).then((res) => {
        console.log('发送给安卓成功')
      })
    }
  }
}

export {
  CLIENTSDK
}
