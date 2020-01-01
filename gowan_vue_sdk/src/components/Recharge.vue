<template>
      <div id="recharge-box" v-show="recharge">
        <div id="recharge-box-gowan">
          <a href="javascript:;" class="close" id="recharge-close" @click="closeRecharge()"></a>
          <!-- 支付方式：方式一：way1弹出的界面是支付宝与微信支付。方式二：way2是弹出二维码支付 -->
            <div id="way1" v-if="wxpay_mode === 0 ? true : false">
                <h3>确认支付方式</h3>
                <p class="name">金额</p>
                <p class="num">￥<span>{{rechargeAges.amount/100}}</span></p>
                <div class="list">
                  <a v-for="item in pay_list" @click="App_pay(item.url, item.icon, item.mode)" :key="item.name">
                    <img :src="require(`../assets/img/${item.icon}.png`)"/>
                    <p>{{item.name}}</p>
                  </a>
                </div>
            </div>
            <div id="way2" v-else>
              <div class="QR_Code">
                <img :src="qrcode_url" alt="">
              </div>
              <h3 style="color:red" v-if="type == 'wx'">请使用微信扫码支付</h3>
              <h3 style="color:red" v-else>请使用支付宝扫码支付</h3>
              <p>温馨提示：支付成功后请关闭二维码，</p>
              <p>游戏将自动发货，如有疑问请联系客服！</p>
            </div>
        </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import configUrl from '../common/config.js'
import FN from '../utility/fn.js'
// import '../utility/http.js'
export default {
  data () {
    return {
      type: 'wx',
      // wxpay: 0,
      mode: 0, // 默认是0，其他则弹出二维码支付
      pay_list: '',
      qrcode_url: '',
      recharge: FN.OS.isWX ? 0 : 1
    }
  },
  computed: {
    wxpay_mode () {
      return this.mode
    },
    ...mapGetters(['rechargeAges'])
  },
  mounted () {
    this.rechargeList(this.rechargeAges)
  },
  methods: {
    App_pay (url, icon, mode) {
      this.type = icon
      console.log('支付类型', icon)
      console.log('支付mode', mode)
      var _this = this
      if (mode !== 2) {
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
      }
      setTimeout(function () {
        if (typeof gowanWebview === 'object') {
          console.log('千禧渠道安卓内打开')
          // 如果在千禧渠道安卓内打开
          switch (icon) {
            case 'wx':
              gowanWebview.clickWx('http:' + configUrl.__gowanpayDomain.get() + url)
              break
            case 'zhifubao':
              gowanWebview.clickZfb('http:' + configUrl.__gowanpayDomain.get() + url)
              break
          }
        } else if (FN.OS.isIOS) {
          console.log('千禧渠道ios系统内打开')
          // ios系统下支付
          try {
            // 如果在千禧渠道IOS内打开
            // 因为ios的PostMessage长度限制,所以就分两节
            let isoUrl = 'http:' + configUrl.__gowanpayDomain.get() + url
            let url1 = isoUrl.substr(0, 800)
            let url2 = isoUrl.substr(800)
            window.webkit.messageHandlers.webViewApp.postMessage(url1) // ios壳子支付
            window.webkit.messageHandlers.webViewApp2.postMessage(url2) // ios壳子支付
          } catch (err) {
            window.location.href = 'http:' + configUrl.__gowanpayDomain.get() + url //  web跳转支付
          }
        } else {
          console.log('既不是在千禧渠道ios系统也不是千禧渠道安卓内打开mode', mode)
          switch (mode) {
            case 0:
              window.location.href = 'http:' + configUrl.__gowanpayDomain.get() + url //  web跳转支付
              break
            case 1:
              console.log('mode为1的情况')
              let newWin = window.open('about:blank')
              newWin.location.href = 'http:' + configUrl.__gowanpayDomain.get() + url //  web跳转支付
              break
            case 2:
              console.log('icon------------->', icon)
              console.log('进入扫码分支')
              _this.mode = mode
              let qrcode = FN.generalAjax('Request:QR_Code_Url', {}, {
                domain: window.location.protocol + configUrl.__gowanpayDomain.get() + url,
                decode: true
              }).then((res) => {
                console.log('res------>qrcode', res)
                if (res.code === 0) {
                  _this.qrcode_url = res.data.code_url
                }
              })
              break
          }
        }
      }, 500)
    },
    rechargeList (data) {
      // cp点击购买,触发请求得到支付的链接
      let _this = this
      let { amount, roleId, roleName, serverId, serverName, order_id, product_id, cut_pay } = data
      let { name, old_id } = FN.getSession('USER_INFO')

      // 微信内部支付
      function wxpay (config) {
        FN.log('wxpay:', config)
        let {
          appId,
          timeStamp,
          nonceStr,
          signType,
          paySign,
          redirectUrl
        } = config
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId, // 公众号名称，由商户传入
            timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr, // 随机串
            package: config.package,
            signType, // 微信签名方式：
            paySign // 微信签名
          },
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              FN.log('执行微信支付成功', res)
            }
          }
        )
      }
      // 如果切支付,使用GO玩（千禧）渠道充值方式拉起充值弹框
      window.zjgwSDK
        .rechargeList({
          cookie_uuid: FN.getLocal('zjgw').cookie_uuid,
          uid: old_id,
          user_name: name, // string必填用户名
          fee: amount, // int必填充值金额单位分
          server_id: serverId, // int 必填 分服编号
          server_name: serverName, // string 分服名称
          role_id: roleId, // string 必填 角色id
          callback_info: order_id, // string 必填 回调信息
          notify_url: FN.getSession('FUSE_CHANNEL_INFO').pay_notify, // string 必通知地址
          app_name: FN.getSession('FUSE_CHANNEL_INFO').game_name,
          h5sdk_url: window.location.href
        })
        .then(res => {
          FN.log('支付的时候的结果--》', res)
          if (res.code !== 0) return
          if (FN.OS.isWX) {
            wxpay(res.data)
            return
          }
          _this.pay_list = res.data.pay_list
          // _this.mode = res.data.pay_list[0].mode
        })
    },
    closeRecharge () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
    }
  }
}
</script>
<style lang="scss" scoped>
#recharge-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
}
#recharge-box-gowan {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  min-height: 5.3rem; // 因为付弹框内的支付宝与微信支付循环渲染出来，添加默认高度减少渲染时高度突然变大的视觉跳动的程度。
  // transform: translate(-50%, -50%);
  width: 6.4rem;
  background: #fff;
  border-radius: 0.25rem;
      margin-left: -3.2rem;
    margin-top: -2.5rem;
}
#recharge-box-gowan h3 {
  text-align: center;
  font-size: 0.3rem;
  line-height: 1.1rem;
  font-weight: normal;
  color: #000;
}
#recharge-box-gowan #way1 .name {
  font-size: 0.4rem;
  color: #666;
  line-height: 1rem;
  text-align: center;
  background: #f5f5f5;
}
#recharge-box-gowan #way1 .num {
  line-height: 0.8rem;
  font-size: 0.32rem;
  color: #000;
  text-align: center;
  background: #f5f5f5;
  font-weight: bold;
}
#recharge-box-gowan #way1 .num span {
  font-size: 0.3rem;
  color: #000;
}
#recharge-box-gowan #way1 .list {
}
#recharge-box-gowan #way1 .list a {
  display: block;
  height: 1.2rem;
  padding-left: 0.5rem;
}
#recharge-box-gowan #way1 .list img {
  float: left;
  height: 0.75rem;
  width: 0.75rem;
  margin-top: 0.25rem;
}
#recharge-box-gowan #way1 .list p {
  float: left;
  margin-left: 0.25rem;
  font-size: 0.3rem;
  color: #666;
  line-height: 1.2rem;
}
#recharge-box-gowan .close {
  z-index: 33;
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  top: 0.15rem;
  right: 0rem;
  background-image: url(../assets/img/close.png);
  background-size: 0.54rem 0.54rem;
  background-repeat: no-repeat;
  background-position: center center;
}
#recharge-box-gowan #way2 .QR_Code {
  position: relative;
  height: 4rem;
  width: 100%;
}
#recharge-box-gowan #way2 p {
  text-align: center;
  font-size: 0.2rem;
  height: .4rem;
  line-height: .4rem;
  font-weight: normal;
  color: #000;
}
#recharge-box-gowan #way2 p:nth-of-type(2) {
  margin-bottom: .2rem;
}
#recharge-box-gowan #way2 .QR_Code img {
  position: absolute;
  left: 50%;
  top: 20%;
  height: 3.3rem;
  width: 3.3rem;
  transform: translateX(-50%)
}
</style>
