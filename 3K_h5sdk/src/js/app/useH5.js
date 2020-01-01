// 以下书写 JSSDK 调用代码
// let params = window.FN.getURLparams()

function getRoleBaseMsg(arg) {
    return {
        server_id: arg.serverId,   //服务器ip   
        server_name: arg.serverName,    //服务器名
        role_id: arg.roleId,        //角色id
        role_name: arg.roleName,    //角色名
        role_level: arg.roleLevel,  //角色等级
        balance: arg.userMoney,
        vip_level: arg.vipLevel,
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
            isChangeUser: window.SDKAPI.__isChangeUser__ === true ? true : false
        }
    }

    return cpRes
}

window.JSSDK = {
    listen(token, args) {
      let { event } = args[0]
      window.PS.subscribeOnce(`H5.${event}`, (msg, data) => {
        FN.post({
          type: "CC",
          token,
          payload: data
        })
      })
    },
    async init(token, args) {
        // FN.log('EVENT:init',{ token, args })
			console.log('EVENT:init',{ token, args })
        // 当session中存在SDK_INIT_INFO将跳过sdk的init请求
        // sdk的逻辑应该在use.sdk处理
        if (JSON.stringify(FN.getSession('SDK_INIT_INFO')) == '{}') {
            //SDKAPI 是写在use.sdk中的方法
            let sdkRes = await window.SDKAPI.init({
                token,
                data: args[0],
                callback: (data = {}) => {
                    // 传递信息给游戏方(cp) data是gowansdkuse.js中callback中传入的值
                    FN.post({
                        type: 'CC',
                        token,
                        payload: data
                    })
                }
            })
        } else {
            FN.post({
                type: 'CC',
                token,
                payload: {}
            })
        }
        //触发融合init
        if (JSON.stringify(FN.getSession('FUSE_INIT_INFO')) == '{}') {
            let fuseRes = await window.FUSESDK.init()
            if (fuseRes.code == 0) {
                FN.saveSession('FUSE_INIT_INFO', fuseRes.data || {})
            }
        }
    },
    login(token, args) {
        // FN.log('EVENT:login', args)
          console.log('EVENT:login', args)
        // 为客户端相应的事件保存token
        window.PS.subscribeOnce(token, async (msg, data) => {
            FN.post({
                type: 'CC',
                token,
                payload: data
            })
            window.PS.publish('H5.login', data)
        })

        //登录sdk的流程,callback返回给cp调用
        window.SDKAPI.login({
            token,
            data: {
                loginWay: 'default'
            },
            callback: (data = {}) => {
                data = transform(data)
                // FN.log('toCp:login', data)
					console.log('toCp:login', data)
                window.PS.publish(token, data)
            }
        })
    },
    //切换登录
    changeAccount(token, args) {
        // FN.log('EVENT:changeAccount')
			console.log('EVENT:changeAccount')
        window.PS.subscribeOnce(token, async (msg, data) => {
            FN.post({
                type: 'CC',
                token,
                payload: FN.wrap(data)
            })
            window.PS.publish('H5.changeAccount', FN.wrap(data))
        })
        window.SDKAPI.changeAccount({
            token,
            callback: (data = {}) => {
                window.PS.publish(token, data)
            }
        })
    },
    recharge(token, args) {
        // FN.log('EVENT:recharge', { token, args })
			console.log('EVENT:recharge', { token, args })
        // 获取渠道充值参数
        let ext = window.SDKAPI.getEXT ? window.SDKAPI.getEXT(args[0]) : {}
        let fuseParams = {
            user_id: FN.getSession('FUSE_USER_INFO').user_id,
            ...getRoleBaseMsg(args[0]),   // 传递过来的参数和角色基本信息组合
            amount: args[0].amount, //	必填	充值金额，单位：分
            notify_url: args[0].callbackURL, //	必填	CP通知URL
            callback_info: args[0].callbackInfo, //	CP回调参数
            cp_product_id: args[0].cpProductId,
            ext: JSON.stringify(ext)
        }
        // FN.log('fuse:recharge(input)', fuseParams)
            console.log('fuse:recharge(input)', fuseParams)
            //融合下单
        window.FUSESDK.makeOrder({
            ...fuseParams
        }).then(res => {
            if (res.code === 0) {
                window.SDKAPI.recharge({
                    token,
                    data: {
                        ...args[0],
                        ...res.data,
                        fuseParams
                    },
                    callback: (data = {}) => {
                        FN.post({
                            type: 'CC',
                            token,
                            payload: data
                        })
                        window.PS.publish('H5.recharge', data)
                    }
                })
            } else {
                FN.post({
                    type: 'CC',
                    token,
                    // TODO 提示语
                    payload: FN.wrap(res)
                })
                window.PS.publish('H5.recharge', FN.wrap(res))
            }
        })
    },
    createRole(token, args) {
        // FN.log('EVENT:createRole', { token, args })
			console.log('EVENT:createRole', { token, args })
        let params = {
            user_id: FN.getSession('FUSE_USER_INFO').user_id,
            ...getRoleBaseMsg(args[0]),
        }
        window.FUSESDK.roleAdd(params).then(data => {
            FN.post({
                type: 'CC',
                token,
                payload: FN.wrap(data)
            })

            window.PS.publish('H5.createRole', FN.wrap(data))
        })

        if(typeof window.SDKAPI.createRole == 'function') {
            window.SDKAPI.createRole({
                token,
                data: params,
                callback: () => {}
            })
        }
    },
    changeRole(token, args) {
        // FN.log('EVENT:changeRole', { token, args })
			console.log('EVENT:changeRole', { token, args })
        let params = {
            user_id: FN.getSession('FUSE_USER_INFO').user_id,
            ...getRoleBaseMsg(args[0]),
        }

        window.FUSESDK.roleLogin(params).then(data => {
            FN.post({
                type: 'CC',
                token,
                payload: FN.wrap(data)
            })
            window.PS.publish('H5.changeRole', FN.wrap(data))
        })

        if(typeof window.SDKAPI.changeRole == 'function') {
            window.SDKAPI.changeRole({
                token,
                data: args[0],
                callback: () => {}
            })
        }
    },
    upgradeRole(token, args) {
        // FN.log('EVENT:upgradeRole', { token, args })
			console.log('EVENT:upgradeRole', { token, args })
        //融合参数部分
        let params = {
            user_id: FN.getSession('FUSE_USER_INFO').user_id,
            ...getRoleBaseMsg(args[0])
        }
        window.FUSESDK.roleLevel(params).then(data => {
            FN.post({
                type: 'CC',
                token,
                payload: FN.wrap(data)
            })
            window.PS.publish('H5.upgradeRole', FN.wrap(data))
        })

        if(typeof window.SDKAPI.upgradeRole == 'function') {
            window.SDKAPI.upgradeRole({
                token,
                data: params,
                callback: () => {}
            })
        }
    },
    getUserID(token, args) {
        // FN.log('EVENT:game emit getUserID', { token, args })
			console.log('EVENT:game emit getUserID', { token, args })
        let data = {
          uid: FN.getSession('FUSE_USER_INFO').user_id
        }
        FN.post({
            type: 'CC',
            token,
            payload: data
        })
        window.PS.publish('H5.getUserID', data)
    },
    getPTID(token, args) {
        // FN.log('EVENT:game emit getPTID', { token, args })
			console.log('EVENT:game emit getPTID', { token, args })
        let data = {
          channelId: FN.getSession('FUSE_CHANNEL_INFO').channel_id
        }
        FN.post({
            type: 'CC',
            token,
            payload: data
        })
        window.PS.publish('H5.getPTID', data)
    },
    getFromID(token, args) {
        // FN.log('EVENT:getFromID', { token, args })
			console.log('EVENT:getFromID', { token, args })
        let data = {
          fromId: window.SDKAPI.getFromID()
        }
        FN.post({
            type: 'CC',
            token,
            payload: data
        })
        window.PS.publish('H5.getFromID', data)
    },
    getGameID(token, args) {
        // FN.log('EVENT:getGameID', { token, args })
			console.log('EVENT:getGameID', { token, args })
        let data = {
          gameId: Number(FN.getSession('FUSE_CHANNEL_INFO').game_id)
        }
        FN.post({
            type: 'CC',
            token,
            payload: data
        })
        window.PS.publish('H5.getGameID', data)
    },
    async goToGM(token, args) {
        // FN.log('EVENT:goToGM', { token, args })
        // let res = await window.FUSESDK.goToGM()
        window.FUSESDK.goToGM()
        // FN.log('goToGM',res)
        // if (res.code === 0) {
        //   let { url } = res.data
        //   window.location.href = url
        // }
        // FN.post({
        //     type: 'CC',
        //     token,
        //     payload: {}
        // })
        // window.PS.publish('H5.goToGM', {})


        // FN.showTip(sdkInitInfo.help_url);
        // // TODO fuse
        // window.location.href = FN.getSession('USER_INFO').gm_url
    },
    checkRealNameAuth(token, args) {
        // FN.log('EVENT:checkRealNameAuth', { token, args })
			console.log('EVENT:checkRealNameAuth', { token, args })
        let data = {
          age: FN.getSession('USER_INFO').age || 0
        }
        FN.post({
            type: 'CC',
            token,
            payload: data
        })
        window.PS.publish('H5.checkRealNameAuth', data)
    },
    checkBindPhone(token, args) {
        // FN.log('EVENT:checkBindPhone', { token, args })
			console.log('EVENT:checkBindPhone', { token, args })
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
            window.PS.publish('H5.checkBindPhone', payload)
        })
    },
    goToBindPhone(token, args) {
        // FN.log('EVENT:goToBindPhone', { token, args })
			console.log('EVENT:goToBindPhone', { token, args })
        let src = window.FUSESDK.bindPhone()

        window.location.href = src + (src.indexOf('?') != -1 ? '&' : '?') + 'h5sdk_url=' + encodeURIComponent(window.location.href)
    },
    goToUserCenter(token, args) {
        // FN.log('EVENT:goToUserCenter', { token, args })
			console.log('EVENT:goToUserCenter', { token, args })
        if (!window.SDKAPI.goToUserCenter) {
            let payload = {
              statusCode: 2,
              status: '待开放'
            }
            FN.post({
                type: 'CC',
                token,
                payload
            })
            window.PS.publish('H5.goToUserCenter', payload)
            return
        }

        window.PS.subscribeOnce(token, async (msg, data) => {
            FN.post({
                type: 'CC',
                token,
                payload: data
            })
            window.PS.publish('H5.goToUserCenter', data)
        })
        window.SDKAPI.goToUserCenter({
            token,
            callback: (data = {}) => {
                window.PS.publish(token, data)
            }
        })
    },
    flymeChangeAccount(token, args) {
        // FN.log('EVENT:flymeChangeAccount', { token, args })
			console.log('EVENT:flymeChangeAccount', { token, args })
        if (!window.SDKAPI.flymeChangeAccount) return

        window.SDKAPI.flymeChangeAccount({
            token,
            data: {
                // TODO
                loginWay: ''
            },
            callback: (data = {}) => {
                window.PS.publish(token, data)
            }
        })

        window.PS.subscribeOnce(token, async (msg, data) => {
            FN.post({
                type: 'CC',
                token,
                payload: data
            })
            window.PS.publish('H5.flymeChangeAccount', data)
        })
    },
    exitGame(token, args) {
        // FN.log('EVENT:exitGame', { token, args })
			console.log('EVENT:exitGame', { token, args })

    }
}
