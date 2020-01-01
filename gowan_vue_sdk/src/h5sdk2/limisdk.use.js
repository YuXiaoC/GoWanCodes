import Api from 'api-mock-js'

Api.config({
  // useMock: true,
  dataType: 'jsonp',
  urlModel: 1
})
let start_game_time = new Date().getTime()
// 厘米秀内部通讯AJAX函数
const Limiajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    let newObj = { ...obj }

    // log(`${arg[0]}(input)`,arg[1])
    FN.log(`${arg[0]}(input)`, arg[1])
    // alert(newObj)
    return {
      ...obj
    }
  }
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        log('FN.ajax error:', e)
      })
  })
}

FN.log('limigamesdk.use.js init success!')
// 记录用户打开厘米秀用户记录

window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({token, data = {}, callback}) {
    var initTimer = setInterval(function () {
      if (GameStatusInfo !== undefined) {
        callback({
          statusCode: 0,
          status: '初始化成功',
          remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote),
          is_jump: FN.getSession('FUSE_CHANNEL_INFO').is_jump
        })
        console.log({
          statusCode: 0,
          status: '初始化成功',
          remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote),
          is_jump: FN.getSession('FUSE_CHANNEL_INFO').is_jump
        })
        clearInterval(initTimer)
      }
    }, 100)
  },
  login ({ token, data = {}, callback }) {
    console.log('融合登录')
    var loginTimer = setInterval(function () {
      if (GameStatusInfo !== undefined) {
        BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
          // console.log('获取openKey')
          // alert(JSON.stringify(data))
          // console.log(JSON.stringify(GameStatusInfo))
          FN.saveSession('qqData', data)
          if (errCode == 0) {
            let header = { openKey: data.openKey, openId: GameStatusInfo.openId}
            let ext_header = {}
            window.FUSESDK.login({
              ext: JSON.stringify(ext_header),
              data: JSON.stringify(header)
            }).then(res => {
              if (res.code === 0) {
                // 获取头像,获取昵称

                BK.MQQ.Account.getNick(GameStatusInfo.openId, function (openID, nick) {
                  FN.saveSession('nick', nick)
                })

                BK.MQQ.Account.getHead(GameStatusInfo.openId, function (openId, BuffInfo) {
                  FN.saveSession('avatar', BuffInfo)
                })

                let loginCallbackCp = res.data
                // 实现分享邀请人上线记录
                if (GameStatusInfo.gameParam !== undefined) {
                  loginCallbackCp.ext = {avatar: FN.getSession('avatar'), nick: FN.getSession('nick'), shareOne: JSON.parse(GameStatusInfo.gameParam).shareOne, bySharing: GameStatusInfo.openId}
                } else {
                  loginCallbackCp.ext = {avatar: FN.getSession('avatar'), nick: FN.getSession('nick')}
                }

                // console.log('loginCallbackCp', loginCallbackCp)
                FN.saveSession('FUSE_USER_INFO', loginCallbackCp)
                // alert(FN.getSession('avatar'))
                // if (FN.getSession('FUSE_CHANNEL_INFO').game_id == 51) {
                //   document.getElementById('game-link').style.display = 'block'
                // }
                callback({
                  statusCode: 0,
                  loginParams: loginCallbackCp
                })
              } else {
                callback({
                  statusCode: res.code,
                  status: res.msg
                })
              }
            })
          }
        })
        clearInterval(loginTimer)
      }
    }, 500)
    // 获取openKey

    // console.log('shareOne', JSON.parse(GameStatusInfo.gameParam).shareOne)
  },
  recharge ({ token, data = {}, callback }) {
    console.log('融合收到的服务器返回data:', data)
    // alert(JSON.stringify(data))
    var cpData = data
    var cpProductId = data.cpProductId
    var channel_product_id = data.channel_product_id

    /**
           * gameOrientation  //1（默认，竖屏）2.横屏（home键在左边）3.横屏 （home键在右边）
           * transparent 是否透明
           * itemList 道具列表
           * callback 形如 function(errCode,data)
           */
    var gameOrientation = FN.getSession('init').isLandscape ? FN.getSession('init').isLandscape : '2' // 1（默认，竖屏）2.横屏（home键在左边）3.横屏 （home键在右边）
    var itemList = [
      {
        'itemId': Number(data.channel_product_id), // 道具id，非负整数
        'itemNum': data.chargeMount ? Number(data.chargeMount) : 1 // 道具数目，非负整数
      }
    ]
    setTimeout(function () {
      BK.QQ.qPayPurchase(gameOrientation, true, itemList, function (errCode, data) {
        // errCode == 0代表成功.其他错误码请查阅本节最下
        // FN.showMsg(JSON.stringify())
        if (errCode === 0) {
          let payCallback = () => {
            let payData = {
              openid: GameStatusInfo.openId,
              openKey: FN.getSession('qqData').openKey,
              itemids: cpData.channel_product_id,
              itemnums: cpData.chargeMount,
              amount: cpData.amount,
              order_id: cpData.order_id,
              status: 1,
              game_id: FN.getSession('FUSE_CHANNEL_INFO').game_id
            }

            return Limiajax('fuse:logind', payData, {
              domain: 'http://yisdk-api.gowan8.com/notify_jsdk/limi.php'
            })
          }
          payCallback().then(res => {
            // alert(JSON.stringify(res))
            FN.log(res)
            FN.saveSession('limiorder', cpData.order_id)
          })

          // var itemList = data.itemList
          // FN.showMsg(itemList)
          // var gameId = data.gameId
        } else {
          // FN.showMsg(JSON.stringify(itemList))
          switch (errCode) {
            case 35308:
              FN.showMsg('道具没配置')
              break
            case 35311:
              FN.showMsg('道具已下架')
              break
            case 35312:
              FN.showMsg('绝版道具已过期')
              break
            case 35313:
              FN.showMsg('用户已经拥有该道具')
              break
            case 35315:
              FN.showMsg('所选的道具有多种货货类型')
              break
            case 35316:
              FN.showMsg('用户货币余额不足')
              break
            default:
              let error = () => {
                let errorData = {
                  ct: 'monitor',
                  ac: 'error',
                  is_jsdk: 1,
                  is_js: 1,
                  channel: FN.getSession('FUSE_CHANNEL_INFO').channel,
                  game_id: FN.getSession('FUSE_CHANNEL_INFO').game_id,
                  exception: JSON.stringify({errCode: errCode, orderId: cpData.order_id}),
                  user_id: GameStatusInfo.openId,
                  imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
                  mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
                  utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
                  os: FN.getSession('FUSE_CHANNEL_INFO').os,
                  game_name: FN.getSession('FUSE_CHANNEL_INFO').game_name,
                  from_id: FN.getSession('FUSE_CHANNEL_INFO').from_id,
                  screen: window.screen.width + 'x' + window.screen.height,

                  // os: setTimeout(function () { return FN.getSession('FUSE_CHANNEL_INFO').os }, 1), // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
                  os_version: '', // 系统版本号

                  simulator: '0', // 是否模拟器，0不是；1是
                  isroot: 0, // 是否root/越狱，0不是1是
                  serial_number: '', // 设备序列号
                  imsi: '', // 手机卡的编号
                  android_id: '', // 设备标识 ANDROID_iD

                  net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
                  operators: 4, // 运营商 1、移动；2、联通；3、电信；4、其他
                  location: '', // 地址位置

                  version: '1.2', // 必填	融合SDK版本号
                  game_version: '1.0', // 必填	游戏版本号
                  platform_version: '1.0', //	必填	渠道版本号
                  server_version: '1.2' // 服务端版本号
                }

                return FN.fuseSdkAjax('error:ajax', errorData, {
                  domain: 'http://yisdk-api.gowan8.com/'
                })
              }
              error().then((res) => {
                console.log('error', res)
              })
              let payCallback = () => {
                let payData = {
                  openid: GameStatusInfo.openId,
                  openKey: FN.getSession('qqData').openKey,
                  itemids: cpData.channel_product_id,
                  itemnums: cpData.chargeMount,
                  amount: cpData.amount,
                  order_id: cpData.order_id,
                  status: 1,
                  game_id: FN.getSession('FUSE_CHANNEL_INFO').game_id
                }

                return Limiajax('fuse:logind', payData, {
                  domain: 'http://yisdk-api.gowan8.com/notify_jsdk/limi.php'
                })
              }
              payCallback().then(res => {
                // alert(JSON.stringify(res))
                FN.log(res)
                FN.saveSession('limiorder', cpData.order_id)
              })
              break
          }
        }
      })
    }, 1000)
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: cpData.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  // 检测有没有关注QQ公众号
  checkPubAccount ({token, data, callback}) {
    var PUIN = '2878775916'
    BK.QQ.checkPubAccountState(PUIN, function (errCode, cmd, data) {
      if (data.is_follow === 1) {
        // 已关注
        callback({
          statusCode: '0',
          status: PUIN
        })
      } else {
        // 未关注
        callback({
          statusCode: '1',
          status: '没关注'
        })
      }
    })
  },
  // 上报数据
  reportedData ({token, data = {}, callback}) {
    var QQdata = {
      userData: [
        {
          openId: GameStatusInfo.openId,
          startMs: start_game_time.toString(), // 必填。 游戏开始时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
          endMs: ((new Date()).getTime()).toString(), // 必填。 游戏结束时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
          scoreInfo: data.scoreInfo
        }
      ],
      attr: data.attr
    }
    // gameMode: 游戏模式，如果没有模式区分，直接填 1
    // 必须配置好周期规则后，才能使用数据上报和排行榜功能
    BK.QQ.uploadScoreWithoutRoom(1, QQdata, function (errCode, cmd, data) {
      // 返回错误码信息
      if (errCode !== 0) {
        callback({
          statusCode: '1',
          status: errCode
        })
      } else {
        callback({
          statusCode: '0',
          status: '上报成功'
        })
      }
    })
  },
  // 拉取排行榜
  rankingList ({token, data = {}, callback}) {
    // 当前不支持一次同时拉取多个排行榜，需要拉取多次，而且必须等上一个拉取回来后才能拉取另外一个排行榜
    // 先拉 score 排行榜
    var attr = data.attr// 使用哪一种上报数据做排行，可传入score，a1，a2等
    var order = data.order // 排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
    var rankType = data.rankType // 要查询的排行榜类型，0: 好友排行榜，1: 群排行榜，2: 讨论组排行榜，3: C2C二人转 (手Q 7.6.0以上支持)
    // 必须配置好周期规则后，才能使用数据上报和排行榜功能
    // let data1 = {data:
    //   {ranking_list:
    //     [
    //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJddibz10vGTVAarFUEtaWySYwzZA1528ZZv29fXjDJeMzeiapibmssOt7DBX7Qbm0ia3RMMvpJRjDjMQ/132', nick: '昵称1', score: '200', selfFlag: false},
    //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/SCAXwsjHoMaMMefKSeiaOtuHonwFVnn2qYwbicDdOLSmgkERibjc3CbhqSaebQ1UfHClAG7dUaXGljpsZJlz6ibjFQ/132', nick: '昵称2', score: '300', selfFlag: false},
    //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqm4mr939uC23QHQ8FUkDENR9o9m9Ylf758fICfkKtLnhS5HkeGyVJXyjCwSkxw67DfjjQnrWmOqQ/132', nick: '昵称3', score: '100', selfFlag: false},
    //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJddibz10vGTVAarFUEtaWySYwzZA1528ZZv29fXjDJeMzeiapibmssOt7DBX7Qbm0ia3RMMvpJRjDjMQ/132', nick: '昵称4', score: '300', selfFlag: true}
    //     ]
    //   }
    // }
    // callback({
    //   statusCode: '0',
    //   status: data1
    // })
    // return false
    BK.QQ.getRankListWithoutRoom(attr, order, rankType, function (errCode, cmd, data) {
      // 返回错误码信息
      if (errCode !== 0) {
        callback({
          statusCode: '1',
          status: errCode
        })
        return
      }
      if (data) {
        // let data1 = {data:
        //   {ranking_list:
        //     [
        //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJddibz10vGTVAarFUEtaWySYwzZA1528ZZv29fXjDJeMzeiapibmssOt7DBX7Qbm0ia3RMMvpJRjDjMQ/132', nick: '昵称1', score: '200', selfFlag: false},
        //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/SCAXwsjHoMaMMefKSeiaOtuHonwFVnn2qYwbicDdOLSmgkERibjc3CbhqSaebQ1UfHClAG7dUaXGljpsZJlz6ibjFQ/132', nick: '昵称2', score: '300', selfFlag: false},
        //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqm4mr939uC23QHQ8FUkDENR9o9m9Ylf758fICfkKtLnhS5HkeGyVJXyjCwSkxw67DfjjQnrWmOqQ/132', nick: '昵称3', score: '100', selfFlag: false},
        //       {url: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJddibz10vGTVAarFUEtaWySYwzZA1528ZZv29fXjDJeMzeiapibmssOt7DBX7Qbm0ia3RMMvpJRjDjMQ/132', nick: '昵称4', score: '300', selfFlag: true}
        //     ]
        //   }
        // }
        callback({
          statusCode: '0',
          status: data
        })
      }
    })
  },
  // 存储私有数据
  saveData ({token, data = {}, callback}) {
    let saveDataList = data
    BK.QQ.saveGameData(saveDataList, function (errCode, cmd, data) {
      if (errCode !== 0) {
        callback({
          statusCode: 1,
          status: errCode
        })
        return
      }
      callback({
        statusCode: 0,
        status: data
      })
    })
  },
  // 获取存储的私有数据
  getData ({token, data = {}, callback}) {
    // 拉取游戏个人私有数据
    BK.QQ.loadGameData(function (errCode, cmd, data) {
      // 这里返回的 data，就是上面存储游戏个人私有数据时候传入的 data
      if (errCode !== 0) {
        callback({
          statusCode: 1,
          status: errCode
        })
        return
      }
      callback({
        statusCode: 0,
        status: data
      })
    })
  },
  // 分享到QQ聊天框
  shareToArk ({token, data = {}, callback}) {
    console.log(data)
    // console.log(data)
    let extendInfo = {'shareOne': GameStatusInfo.openId}
    BK.QQ.shareToArk(data.roomId, data.summary, data.picUrl, data.isSelectFriend, extendInfo, function (errCode, data1, data2) {
      console.log('errCode', errCode)
      console.log('data1', data1)
      console.log('data2', data2)

      if (data2.ret == 0) {
        // 分享成功
        callback({
          statusCode: 0,
          aioType: data2.aioType, // 1: 个人  4:群聊
          status: '分享成功'
        })
      } else {
        // 分享失败
        callback({
          statusCode: 1,
          status: '分享失败/用户取消分享'
        })
      }
    })

    // BK.QQ.share({summary: data.summary, picUrl: data.picUrl, extendInfo: data.extendInfo, localPicPath: data.localPicPath, gameName: data.gameName}, function (retCode, shareDest, isFirstShare) {
    //   console.log('isFirstShare', isFirstShare)
    //   if (isFirstShare.ret == 0 && isFirstShare.aioType == 4) { // 分享成功,分享到QQ群
    //     callback({
    //       statusCode: 0,
    //       shareTo: 0,
    //       status: '分享成功'
    //     })
    //   } else if (isFirstShare.ret == 0 && isFirstShare.shareTo == 2) { // 分享成功,分享到微信
    //     callback({
    //       statusCode: 0,
    //       shareTo: 2,
    //       status: '分享成功'
    //     })
    //   } else if (isFirstShare.ret == 0 && isFirstShare.shareTo == 1) { // 分享成功,分享到QQ空间
    //     callback({
    //       statusCode: 0,
    //       shareTo: 1,
    //       status: '分享成功'
    //     })
    //   } else if (isFirstShare.ret == 0 && isFirstShare.shareTo == 3) { // 分享成功,分享到微信朋友圈
    //     callback({
    //       statusCode: 0,
    //       shareTo: 3,
    //       status: '分享成功'
    //     })
    //   }
    // })

    // 厘米sdk更新
    /**
     * qqImgUrl 分享到QQ的图片网络链接
     * isToFriend 是否选择好友，若是则拉起好友列表选择好友分享，否则直接分享到聊天窗口（从聊天窗口拉起游戏的情况下）
     * summary 分享内容
     * extendInfo 拓展信息
     * success 成功回调
     * fail 失败回调
     * complete 不管成功还是失败都会回调
     */
    // BK.Share.share({
    //   qqImgUrl: data.qqImgUrl,
    //   isToFriend: data.isToFriend,
    //   summary: data.summary,
    //   extendInfo: data.extendInfo,
    //   success: function () {
    //     callback({
    //       statusCode: 0,
    //       status: '分享成功'
    //     })
    //   },
    //   fail: function () {
    //     callback({
    //       statusCode: 1,
    //       status: '分享失败'
    //     })
    //   } })
  },
  // 视频激励广告
  videoAd ({token, data = {}, callback}) {
    console.log('视频广告')
    // 1.拉取广告
    var videoType = 3 // 激励视频广告场景 0.游戏页面挂件广告 1.游戏结算页广告 2.游戏任务广告  3.游戏复活广告

    var vHandle = ''
    BK.Advertisement.fetchVideoAd(videoType, function (retCode, msg, handle) {
      // retCode 返回错误码
      // msg       返回信息
      // handle  广告句柄
      // 返回码0表示成功
      if (retCode == 0) {
        vHandle = handle
        // 2.监听事件
        vHandle.setEventCallack(
          function (code, msg) {
            // BK.Script.log(1, 1, 'closeGame') // 关闭游戏（不再使用不需要监听）
          },
          function (code, msg) {
            // BK.Script.log(1, 1, 'endVide code:' + code + ' msg:' + msg)// 达到看广告时长要求，可以下发奖励
            // alert(' 达到看广告时长要求，可以下发奖励' + code + msg)
            callback({
              statusCode: 0,
              status: '观看完成'
            })
          },
          function (code, msg) {
            // alert('关闭视频webview' + code + msg)
            callback({
              statusCode: 1,
              status: '关闭视频webview'
            })
          },
          function (code, msg) {
            // 开始观看视频
            // alert('开始观看视频' + code + msg)
            // callback({
            //   statusCode: 2,
            //   status: '开始观看视频'
            // })
          })
        // 3.跳转至播放界面
        vHandle.jump()
      } else {
        // BK.Script.log(1, 1, 'error:' + retCode + ' msg:' + msg) // 拉取视频广告失败
        callback({
          statusCode: -1,
          status: msg
        })
      }
    })
  },
  // Banner广告
  bannerAd ({token, data = {}, callback}) {
    var banner = BK.Advertisement.createBannerAd({
      viewId: 1003,
      style: {
        x: data.x ? data.x : '',
        y: data.y ? data.y : ''
      }
    })
    banner.onLoad(function () {
      // 广告加载成功
      callback({
        statusCode: 0,
        status: '广告加载成功'
      })
    })
    banner.onError(function (err) {
      // 加载失败
      var msg = err.msg
      var code = err.code
      if (code !== 0) {
        FN.showMsg('code:' + err.code + 'msg:' + err.msg)
      }
    })
    banner.show()
  },
  // 创建快捷方式
  createShortCut ({token, data = {}, callback}) {
    var extendInfo = ''// 扩展字段
    BK.QQ.createShortCut(extendInfo)
  },
  // 上报运营数据
  operationData ({token, data = {}, callback}) {
    var gameTime = (new Date()).getTime() - start_game_time
    var gameResultData = data
    BK.QQ.reportGameResult(gameResultData, function (errCode, cmd, data) {
      if (errCode !== 0) {
        // 上报运营结果失败
        callback({
          statusCode: 1,
          status: errCode
        })
      } else {
        // 上报运营结果成功
        callback({
          statusCode: 0,
          status: '上报成功'
        })
      }
    })
  },
  flymeChangeAccount ({ token, data = {}, callback }) {
    // 保存回调函数
    // 在外部点击切换帐号时会执行
    // window.SDKDATA.flymeChangeAccount = {}
    // window.SDKDATA.flymeChangeAccount.callback = (res = {}) => {
    //   if (typeof callback === 'function') {
    //     FN.log('toCp:flymeChangeAccount', res)
    //     callback(res)
    //   }
    // }
    callback()
  },
  getLimiOrderId ({token, data = {}, callback}) {
    let order_id = FN.getSession('limiorder')
    callback({
      statusCode: 0,
      status: {orderId: order_id}
    })
  },
  goto ({token, data = {}, callback}) {
    let jumpData = function () {
      let input = {
        ct: 'loadlog',
        ac: 'jump_game',
        channel: FN.getSession('FUSE_CHANNEL_INFO').channel,
        game_id: FN.getSession('FUSE_CHANNEL_INFO').game_id,
        from_id: FN.getSession('FUSE_CHANNEL_INFO').from_id, // fuse 默认为 0
        version: '1.2', // sdk版本号
        game_version: '1.0', // 游戏版本号
        platform_version: '1.0', // 渠道版本号
        ext: JSON.stringify({channel_game_id: GameStatusInfo.gameId, jump_game_id: data.gameId}),
        is_jsdk: 1,
        imei: FN.getSession('MicroParame').imei.replace(/-/g, ''), // 手机IMEI/IDFA
        mac: FN.getSession('MicroParame').mac.replace(/-/g, ''), // 手机mac网卡地址
        utma: FN.getSession('MicroParame').utma.replace(/-/g, ''), // 设备标识
        os: FN.getSession('FUSE_CHANNEL_INFO').os,
        user_id: FN.getSession('FUSE_USER_INFO').user_id
      }
      return FN.fuseSdkAjax('fuse:someData', input, {
        domain: 'http://yisdk-api.gowan8.com/'
      })
    }
    console.log('跳转gameId', data)
    jumpData().then((res) => {
      console.log(res)
      BK.QQ.skipGame(data.gameId, null)
    }
    )
  }
}

// QQ分享后回调
// setTimeout(function () {
//   var shareInfo = {
//     summary: typeof (FN.getSession('init').shareInfo) === 'undefined' ? '' : FN.getSession('init').shareInfo.summary, // QQ聊天消息标题
//     picUrl: typeof (FN.getSession('init').shareInfo) === 'undefined' ? '' : FN.getSession('init').shareInfo.picUrl, // QQ聊天消息图片
//     extendInfo: typeof (FN.getSession('init').shareInfo) === 'undefined' ? '' : FN.getSession('init').shareInfo.extendInfo, // QQ聊天消息扩展字段
//     localPicPath: typeof (FN.getSession('init').shareInfo) === 'undefined' ? '' : FN.getSession('init').shareInfo.localPicPath, // 分享至空间、微信、朋友圈时需要的图。（选填，若无该字段，系统使用游戏对应的二维码）
//     gameName: typeof (FN.getSession('init').shareInfo) === 'undefined' ? '' : FN.getSession('init').shareInfo.gameName // 游戏名，暂用与生成二维码
//   }
//   BK.QQ.share({summary: '海量趣味轻游戏合集，点击即玩~', gameName: '开心玩'}, function (retCode, shareDest, isFirstShare) {
//     console.log('retCode', retCode)
//     console.log('shareDest', shareDest)
//   })
// BK.QQ.share(shareInfo, function (retCode, shareDest, isFirstShare) {
//   if (retCode == 0) {
//     if (shareDest == 0 /* QQ */) {
//       // 聊天窗
//       BK.Script.log(1, 1, '成功分享至QQ')
//       console.log('成功分享至QQ')
//     } else if (shareDest == 1 /* QZone */) {
//       // 空间
//       BK.Script.log(1, 1, '成功分享至空间')
//       console.log('成功分享至空间')
//     } else if (shareDest == 2 /* WX */) {
//       // 微信
//       BK.Script.log(1, 1, '成功分享至微信')
//       console.log('成功分享至微信')
//     } else if (shareDest == 3 /* WXCircle */) {
//       // 朋友圈
//       BK.Script.log(1, 1, '成功分享至朋友圈')
//       console.log('成功分享至朋友圈')
//     }
//   } else if (retCode == 1) {
//     BK.Script.log(1, 1, '分享失败' + retCode)
//   } else if (retCode == 2) {
//     BK.Script.log(1, 1, '分享失败，用户取消分享：' + retCode)
//   }
// })
// }, 10000)

// // QQ分享回调
