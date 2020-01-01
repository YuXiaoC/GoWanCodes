import store from '../store'
import FN from '../utility/fn'
import global from '../common/global.js'
import '../fuse/fuse.sdk'
import PS from 'pubsub-js'
function getRoleBaseMsg (arg) {
  return {
    server_id: arg.serverId,
    server_name: arg.serverName,
    role_id: arg.roleId,
    role_name: arg.roleName,
    role_level: arg.roleLevel,
    balance: arg.userMoney || 0,
    vip_level: arg.vipLevel,
    power: arg.power || ''
  }
}

// 用于转化响应给cp的融合登录参数
const transform = data => {
  let { statusCode, loginParams } = data
  if (!loginParams) return data

  // return data
  let FUSE_USER_INFO = FN.getSession('FUSE_USER_INFO')
  let cpRes = {
    statusCode,
    loginParams: {
      statusCode,
      userId: FUSE_USER_INFO.user_id,
      platformChanleId: Number(FN.getSession('FUSE_CHANNEL_INFO').channel_id),
      userName: loginParams.userName || '',
      timestamp: String(FUSE_USER_INFO.timestamp),
      sign: FUSE_USER_INFO.new_sign,
      guid: FUSE_USER_INFO.guid, // TODO
      cp_ext: FUSE_USER_INFO.cp_ext || '',
      ext: FUSE_USER_INFO.ext || '',
      isReward: false,
      hasCheck: false,
      isChangeUser: window.FUSESDKAPI.__isChangeUser__ === true
    }
  }

  return cpRes
}

let JSSDK = {
  // async init (token, args) {
  //   // 存在本地init配置
  //   FN.saveSession('init', args)
  //   // 当session中存在SDK_INIT_INFO将跳过sdk的init请求
  //   // sdk的逻辑应该在use.sdk处理
  //   if (JSON.stringify(FN.getSession('FUSE_INIT_INFO')) == '{}') {
  //     let sdkRes = await window.FUSESDKAPI.init({ // 融合sdk.use.js
  //       token,
  //       data: args,
  //       callback: (data = {}) => {
  //         FN.post({
  //           type: 'CC',
  //           token,
  //           payload: data
  //         })
  //       }
  //     })
  //   } else {
  //     FN.post({
  //       type: 'CC',
  //       token,
  //       payload: {statusCode: 0, status: ''}
  //     })
  //   }

  //   // 如果融合初始化为空的时候,就需要请求FUSESDK.init()
  //   if (JSON.stringify(FN.getSession('FUSE_INIT_INFO')) === '{}') {
  //     // 请求融合文件
  //     let fuseRes = await window.FUSESDK.init()
  //     if (fuseRes.code === 0) {
  //       FN.saveSession('FUSE_INIT_INFO', fuseRes.data || {})
  //       setTimeout(() => {
  //         if (sessionStorage.getItem('FUSE_INIT_INFO') !== '{}' && JSON.parse(sessionStorage.getItem('FUSE_INIT_INFO')).init_notice !== undefined) {
  //           store.dispatch('SET_GOWAN_COMPONENT_NOTICE', 'InitNotice')
  //         }
  //       })
  //     }
  //   } else if (JSON.parse(sessionStorage.getItem('FUSE_INIT_INFO')).init_notice !== undefined) {
  //     console.log('从本地的初始化中取数据')
  //     // 从本地的初始化中取数据
  //     store.dispatch('SET_GOWAN_COMPONENT_NOTICE', 'InitNotice')
  //   }
  // },
  async init (token, args) {
    // 存在本地init配置
    FN.saveSession('init', args)
    // 当session中存在SDK_INIT_INFO将跳过sdk的init请求
    // sdk的逻辑应该在use.sdk处理
    let sdkRes = await window.FUSESDKAPI.init({ // 融合sdk.use.js
      token,
      data: args,
      callback: (data = {}) => {
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
      }
    })

    // 如果融合初始化为空的时候,就需要请求FUSESDK.init()
    // 请求融合文件
    let fuseRes = await window.FUSESDK.init()
    if (fuseRes.code === 0) {
      FN.saveSession('FUSE_INIT_INFO', fuseRes.data || {})
      setTimeout(() => {
        if (sessionStorage.getItem('FUSE_INIT_INFO') !== '{}' && JSON.parse(sessionStorage.getItem('FUSE_INIT_INFO')).init_notice !== undefined) {
          store.dispatch('SET_GOWAN_COMPONENT_NOTICE', 'InitNotice')
        }
      })
    }
  },
  login (token, args) {
    FN.log('EVENT:login', args)
    // document.getElementsByClassName('popbox')[0].style.display = 'block'
    if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'gowan' || FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
      store.dispatch('SET_GOWAN_COMPONENT_NAME', 'AccountLogin')
    }
    // 为客户端相应的事件保存token
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.login', data)
    })

    window.FUSESDKAPI.login({
      token,
      data: {
        loginWay: 'default'
      },
      callback: (data = {}) => {
        data = transform(data)
        FN.log('toCp:login', data)
        PS.publish(token, data)
      }
    })
  },
  changeAccount (token, args) {
    FN.log('EVENT:changeAccount')
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: FN.wrap(data)
      })
      PS.publish('H5.changeAccount', FN.wrap(data))
    })
    window.FUSESDKAPI.changeAccount({
      token,
      callback: (data = {}) => {
        PS.publish(token, data)
      }
    })
    if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'gowan' || FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
      store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', '')
    }
  },
  flymeChangeAccount (token, args) {
    FN.log('EVENT:flymeChangeAccount', { token, args })
    if (!window.FUSESDKAPI.flymeChangeAccount) {
      console.log('没有flymeChangeAccount方法')
      return false
    } else {
      console.log('有flymeChangeAccount方法')
      window.FUSESDKAPI.flymeChangeAccount({
        token,
        data: {
          // TODO
          loginWay: ''
        },
        callback: (data = {}) => {
          PS.publish(token, data)
        }
      })

      PS.subscribeOnce(token, async (msg, data) => {
        FN.post({
          type: 'CC',
          token,
          payload: data
        })
        PS.publish('H5.flymeChangeAccount', data)
      })
    }
  },
  recharge (token, args) {
    FN.log('EVENT:recharge', { token, args })

    // 获取渠道充值参数
    let ext = window.FUSESDKAPI.getEXT ? window.FUSESDKAPI.getEXT(args) : {}
    // 获取融合下单,cp传过来的参数
    let fuseParams = {
      user_id: FN.getSession('FUSE_USER_INFO').user_id,
      ...getRoleBaseMsg(args),
      amount: args.amount, // 必填充值金额 单位：分
      notify_url: args.callbackURL, // 必填 CP通知URL
      callback_info: args.callbackInfo || '', // cP回调参数
      cp_product_id: args.cpProductId,
      charge_mount: args.chargeMount || 0, // 金钱数量/道具数量
      ext: JSON.stringify(ext),
      cp_order_id: args.cpOrderId || '',
      product_name: args.productName || ''
    }
    FN.log('fuse:recharge(input)', fuseParams)
    // 融合下单
    window.FUSESDK.makeOrder({
      ...fuseParams
    }).then(res => {
      if (res.code === 0) {
        if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'gowan' || FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
          // document.getElementsByClassName('popbox')[0].style.display = 'block'
          FN.log('进入下单gowan/融合gowan')
          // 混合GO玩渠道  苹果的GO玩渠道
          if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
            FN.log(res.data)
            if (res.data.cut_pay) {
              // 切支付(gowan渠道支付)
              FN.log('苹果渠道切支付')
              store.dispatch('SET_GOWAN_COMPONENT_NAME', 'Recharge')
            } else {
              FN.log('没有切支付')
              // 因为这个 store.dispatch('SET_GOWAN_COMPONENT_NAME', '') 作用是避免,取消支付,组件没有清除,不起苹果支付
              store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
              setTimeout(function () {
                store.dispatch('SET_GOWAN_COMPONENT_NAME', 'AppleRecharge')
              }, 10)
            }
          } else {
            store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
            setTimeout(function () {
              store.dispatch('SET_GOWAN_COMPONENT_NAME', 'Recharge')
            }, 10)
          }

          store.dispatch('GET_GOWAN_RECHARGE_AGES',
            {
              ...args,
              ...res.data,
              fuseParams
            })
        }
        window.FUSESDKAPI.recharge({
          token,
          data: {
            ...args,
            ...res.data,
            fuseParams
          },
          callback: (data = {}) => {
            FN.post({
              type: 'CC',
              token,
              payload: data
            })
            PS.publish('H5.recharge', data)
          }
        })
      } else {
        FN.post({
          type: 'CC',
          token,
          // TODO 提示语
          payload: FN.wrap(res)
        })
        PS.publish('H5.recharge', FN.wrap(res))
      }
    })
  },
  createRole (token, args) {
    FN.log('EVENT:createRole', { token, args })
    let params = {
      user_id: FN.getSession('FUSE_USER_INFO').user_id,
      ...getRoleBaseMsg(args)
    }
    window.FUSESDK.roleAdd(params).then(data => {
      FN.post({
        type: 'CC',
        token,
        payload: FN.wrap(data)
      })

      PS.publish('H5.createRole', FN.wrap(data))
    })

    if (typeof window.FUSESDKAPI.createRole === 'function') {
      window.FUSESDKAPI.createRole({
        token,
        data: params,
        callback: () => {}
      })
    }
  },
  changeRole (token, args) {
    FN.log('EVENT:changeRole', { token, args })

    let params = {
      user_id: FN.getSession('FUSE_USER_INFO').user_id,
      ...getRoleBaseMsg(args)
    }

    window.FUSESDK.roleLogin(params).then(data => {
      FN.post({
        type: 'CC',
        token,
        payload: FN.wrap(data)
      })
      PS.publish('H5.changeRole', FN.wrap(data))
    })

    if (typeof window.FUSESDKAPI.changeRole === 'function') {
      window.FUSESDKAPI.changeRole({
        token,
        data: params,
        callback: () => {}
      })
    }
  },
  upgradeRole (token, args) {
    FN.log('EVENT:upgradeRole', { token, args })

    let params = {
      user_id: FN.getSession('FUSE_USER_INFO').user_id,
      ...getRoleBaseMsg(args)
    }
    window.FUSESDK.roleLevel(params).then(data => {
      FN.post({
        type: 'CC',
        token,
        payload: FN.wrap(data)
      })
      PS.publish('H5.upgradeRole', FN.wrap(data))
    })
    if (typeof window.FUSESDKAPI.upgradeRole === 'function') {
      window.FUSESDKAPI.upgradeRole({
        token,
        data: params,
        callback: () => {}
      })
    }
  },
  getUserID (token, args) {
    FN.log('EVENT:game emit getUserID', { token, args })
    let data = {
      uid: FN.getSession('FUSE_USER_INFO').user_id
    }
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
    PS.publish('H5.getUserID', data)
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
    PS.publish('H5.getPTID', data)
  },
  getFromID (token, args) {
    FN.log('EVENT:getFromID', { token, args })
    let data = {
      fromId: window.FUSESDKAPI.getFromID()
    }
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
    PS.publish('H5.getFromID', data)
  },
  getPlatform (token, args) {
    FN.log('EVENT:getFromID', { token, args })
    let data = {
      os: FN.getSession('FUSE_CHANNEL_INFO').os
    }
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
    PS.publish('H5.getFromID', data)
  },
  goToGM (token, args) {
    FN.log('EVENT:goToGM', { token, args })
    let sdkInitInfo = FN.getSession('SDK_INIT_INFO')
    FN.showMsg(sdkInitInfo.help_url, false)
  },
  checkRealNameAuth (token, args) {
    FN.log('EVENT:checkRealNameAuth', { token, args })
    let data = {
      age: FN.getSession('USER_INFO').age || 0
    }
    FN.post({
      type: 'CC',
      token,
      payload: data
    })
    PS.publish('H5.checkRealNameAuth', data)
  },
  checkBindPhone (token, args) {
    FN.log('EVENT:checkBindPhone', { token, args })
    window.FUSESDK.checkBindPhone({
      guid: FN.getSession('FUSE_USER_INFO').guid
    }).then(data => {
      let payload = {
        statusCode: data.data.status,
        status: data.msg
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.checkBindPhone', payload)
    })
  },
  goToBindPhone (token, args) {
    FN.log('EVENT:goToBindPhone', { token, args })
    let src = window.FUSESDK.bindPhone()
    window.location.href = src + (src.indexOf('?') != -1 ? '&' : '?') + 'h5sdk_url=' + encodeURIComponent(window.location.href)
  },
  exitGame (token, args) {
    FN.log('EVENT:exitGame', { token, args })
    if (!window.FUSESDKAPI.exitGame) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.exitGame', payload)
      return
    }

    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.exitGame', data)
    })
    window.FUSESDKAPI.exitGame({
      token,
      callback: (data = {}) => {
        PS.publish(token, data)
      }
    })
  },
  checkPubAccount (token, args) {
    FN.log('EVENT:checkPubAccount', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.checkPubAccount', data)
    })
    if (!window.FUSESDKAPI.checkPubAccount) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.checkPubAccount', payload)
      return
    }

    window.FUSESDKAPI.checkPubAccount({
      token,
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  // 针对闪电玩渠道新增的一个活动接口
  activity (token, args) {
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      // PS.publish('H5.activity', data)
    })
    if (!window.FUSESDKAPI.activity) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish(token, payload)
      return
    }
    let params = {
      target: args.target || '',
      ...getRoleBaseMsg((args.options || {}))
    }
    window.FUSESDKAPI.activity({
      token,
      data: params,
      callback: (data = {}) => {
        PS.publish(token, data)
      }
    })
  },
  // reportedData、rankingList、saveData、getData这几个方法是给厘米秀SDK文档中使用的
  reportedData (token, data, args) {
    FN.log('EVENT:reportedData', {token, args, data})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.reportedData', data)
    })
    if (!window.FUSESDKAPI.reportedData) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.reportedData', payload)
      return
    }

    window.FUSESDKAPI.reportedData({
      token,
      data: {
        ...data
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  rankingList (token, data, args) {
    FN.log('EVENT:rankingList', {token, args, data})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.rankingList', data)
    })
    if (!window.FUSESDKAPI.rankingList) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.rankingList', payload)
      return
    }

    window.FUSESDKAPI.rankingList({
      token,
      data: {
        ...data
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  saveData (token, data, args) {
    FN.log('EVENT:saveData', {token, args, data})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.saveData', data)
    })
    if (!window.FUSESDKAPI.saveData) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.saveData', payload)
      return
    }

    window.FUSESDKAPI.saveData({
      token,
      data: {
        ...data
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  getData (token, data, args) {
    FN.log('EVENT:getData', {token, args, data})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.getData', data)
    })
    if (!window.FUSESDKAPI.getData) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.getData', payload)
      return
    }

    window.FUSESDKAPI.getData({
      token,
      data: {
        ...data
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  shareToArk (token, args) {
    FN.log('EVENT:shareToArk', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.shareToArk', data)
    })
    if (!window.FUSESDKAPI.shareToArk) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.shareToArk', payload)
      return
    }

    window.FUSESDKAPI.shareToArk({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  videoAd (token, args) {
    FN.log('EVENT:videoAd', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.videoAd', data)
    })
    if (!window.FUSESDKAPI.videoAd) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.videoAd', payload)
      return
    }

    window.FUSESDKAPI.videoAd({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  operationData (token, args) {
    FN.log('EVENT:operationData', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.operationData', data)
    })
    if (!window.FUSESDKAPI.operationData) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.operationData', payload)
      return
    }

    window.FUSESDKAPI.operationData({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  slectServe (token, args) {
    FN.log('EVENT:slectServe', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.slectServe', data)
    })
    if (!window.FUSESDKAPI.slectServe) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.slectServe', payload)
      return
    }

    window.FUSESDKAPI.slectServe({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  task (token, args) {
    FN.log('EVENT:task', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.task', data)
    })
    if (!window.FUSESDKAPI.task) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.task', payload)
      return
    }

    window.FUSESDKAPI.task({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  honor (token, args) {
    FN.log('EVENT:honor', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.honor', data)
    })
    if (!window.FUSESDKAPI.honor) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.honor', payload)
      return
    }

    window.FUSESDKAPI.honor({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  getLimiOrderId (token, args) {
    FN.log('EVENT:getLimiOrderId', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.getLimiOrderId', data)
    })
    if (!window.FUSESDKAPI.getLimiOrderId) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.getLimiOrderId', payload)
      return
    }

    window.FUSESDKAPI.getLimiOrderId({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  goto (token, args) {
    FN.log('EVENT:goto', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.goto', data)
    })
    if (!window.FUSESDKAPI.goto) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.goto', payload)
      return
    }

    window.FUSESDKAPI.goto({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  bannerAd (token, args) {
    FN.log('EVENT:bannerAd', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.bannerAd', data)
    })
    if (!window.FUSESDKAPI.bannerAd) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.bannerAd', payload)
      return
    }

    window.FUSESDKAPI.bannerAd({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  },
  createShortCut (token, args) {
    FN.log('EVENT:createShortCut', {token, args})
    PS.subscribeOnce(token, async (msg, data) => {
      FN.post({
        type: 'CC',
        token,
        payload: data
      })
      PS.publish('H5.createShortCut', data)
    })
    if (!window.FUSESDKAPI.createShortCut) {
      let payload = {
        statusCode: 2,
        status: '待开放'
      }
      FN.post({
        type: 'CC',
        token,
        payload
      })
      PS.publish('H5.createShortCut', payload)
      return
    }

    window.FUSESDKAPI.createShortCut({
      token,
      data: {
        ...args
      },
      callback: (data = {}) => {
        data = transform(data)
        PS.publish(token, data)
      }
    })
  }
}
export {
  JSSDK
}
