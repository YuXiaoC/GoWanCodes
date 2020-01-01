// FN.log('3ksdk.use.js init success!')
	console.log('3ksdk.use.js init success!')

window.SDKDATA = {}



window.SDKAPI = {
    init({ token, data = {}, callback }) {
        // 保存回调函数
        window.SDKDATA.init = {}
        window.SDKDATA.init.callback = res => {
            // res为实际请求的响应结果
            if (typeof callback == 'function') {
                // 可在此处对res进行处理回调给useH5
                callback(FN.wrap(res))
            }

            if (res.code == 0) {
                if (res.data.login_notice.title) {
                    window.GLOBAL_DATA.ajaxInfo.login_notice = {
                        title: res.data.login_notice.title,
                        content: res.data.login_notice.content
                    }
                }

                if (res.data.init_notice.title) {
                    window.GLOBAL_API.showPopbox({
                        type: 'notice',
                        id: 1
                    })
                } else if (res.data.init_notice.image) {
                    window.GLOBAL_API.showPopbox({
                        type: 'notice',
                        id: 2
                    })
                }
            }
        }
        window.gw8SDK.init().then(res => {
            if (res.code == 0) {
                res.data.setting = data
                FN.saveSession('SDK_INIT_INFO', res.data)
            }
            window.SDKDATA.init.callback(res)
        })
    },
    login({ token, data = {}, callback }) {

        window.SDKDATA.loginWay = data.loginWay
        // 保存回调函数
        window.SDKDATA.login = {}
        window.SDKDATA.login.callback = (res = {}) => {
            if (typeof callback == 'function') {
                // 可在此处对res进行处理回调给useH5
                // res 为3ksdk响应参数
                let { code: statusCode, data, msg: status } = res
                let cpRes = {
                    statusCode,
                    // status,
                    loginParams:{
                        ...data,
                        userName: data.name,
                        statusCode
                    }
                }
                callback(cpRes)
            }
        }

        // 去除自动登录，但是会保留登录过的用户信息
        window.GLOBAL_API.showPopbox({
            type: 'form',
            id: 1,
            // close: data.loginWay == 'changeAccountByCp'
        })
        // if (FN.getSession('USER_INFO').user_id && data.loginWay == 'default') {
        //     window.GLOBAL_API.showFloatBall()
        //     // 初始化侧边栏
        //     window.GLOBAL_API.initSlideBar()

        //     window.SDKDATA.login.callback({
        //         code: 0,
        //         msg: '自动登录成功',
        //         data: FN.getSession('USER_INFO')
        //     })
        // } else {
        //     window.GLOBAL_API.showPopbox({
        //         type: 'form',
        //         id: 1,
        //         // close: data.loginWay == 'changeAccountByCp'
        //     })
        // }
    },
    __isChangeUser__: false,
    changeAccount({ token, callback }) {
        // 切换帐号必定注销用户信息
        FN.removeSession('USER_INFO')
        FN.removeSession('FUSE_USER_INFO')

        // 隐藏浮标
        window.GLOBAL_API.hideFloatBall()
        window.GLOBAL_API.hideSlideBar()

        window.SDKAPI.__isChangeUser__ = true
        // 直接响应成功，cp会主动使用one方法调用login
        window.PS.publish(token, {
            statusCode: 0,
            status: '调用切换帐号成功'
        })

        // 原先代码
        // 自动模拟触发一次cp登录请求
        window.JSSDK.login({
            token,
            args: [],
            // data: {
            //     loginWay: 'changeAccountByCp'
            // },
            // callback: (data = {}) => {
            //     window.SDKAPI.__isChangeUser__ = true
            //     window.PS.publish(token, data)
            // }
        })
    },
    getFromID() {
        return FN.getSession('gw8').from_id
    },
    recharge({ token, data = {}, callback }) {
        let { amount, roleId, roleName, serverId, serverName, order_id } = data
        let { name, old_id } = FN.getSession('USER_INFO')
        function wxpay(config) {
            // FN.log('wxpay:', config)
				console.log('wxpay:', config)
            let { appId, timeStamp, nonceStr, signType, paySign, redirectUrl } = config
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId, //公众号名称，由商户传入
                    timeStamp, //时间戳，自1970年以来的秒数
                    nonceStr, //随机串
                    package: config.package,
                    signType, //微信签名方式：
                    paySign //微信签名
                },
                function(res) {
                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        // FN.log('执行微信支付成功', res)
							console.log('执行微信支付成功', res)
                    }
                }
            )
        }

        window.gw8SDK
            .rechargeList({
                cookie_uuid: FN.getLocal('gw8').cookie_uuid,
                uid: old_id,
                user_name: name, //	string	必填	用户名
                fee: amount, //	int	必填	充值金额，单位分
                server_id: serverId, //	int	必填	分服编号
                server_name: serverName, //	string		分服名称
                role_id: roleId, //	string	必填	角色id
                callback_info: order_id, //	string	必填	回调信息
                notify_url: FN.getSession('FUSE_CHANNEL_INFO').pay_notify, //	string	必填	通知地址
                app_name: 'app_name',
                h5sdk_url: window.location.href
            })
            .then(res => {
                if (res.code !== 0) return

                if (FN.OS.isWX) {
                    wxpay(res.data)
                    return
                }

                let { h5alipay, h5wechatpay } = res.data.pay_list
                let div = window.GLOBAL_API.getRechargeBox({
                    amount: res.data.fee,
                    alipay: window.__3kapi_cz.get() + h5alipay,
                    wxpay: window.__3kapi_cz.get() + h5wechatpay
                })
                document.body.appendChild(div)
                document.getElementById('recharge-close').onclick = function() {
                    document.body.removeChild(div)
                }
            })
    },
    goToUserCenter({ token, data = {}, callback }) {
        // 保存回调函数
        window.GLOBAL_API.showSlideBar()
        if (typeof callback == 'function') {
            callback({
                statusCode: 0,
                status: '成功'
            })
        }
    },
    flymeChangeAccount({ token, data = {}, callback }) {
        // 保存回调函数
        // 在外部点击切换帐号时会执行
        window.SDKDATA.flymeChangeAccount = {}
        window.SDKDATA.flymeChangeAccount.callback = (res = {}) => {
            if (typeof callback == 'function') {
                // FN.log('toCp:flymeChangeAccount', res)
					console.log('toCp:flymeChangeAccount', res)
                // console.log(callback)
                // console.log(token)
                callback(res)
            }
        }
    }
}
