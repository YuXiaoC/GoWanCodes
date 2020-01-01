<template>
  <div id="appleRecharge"></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['rechargeAges'])
  },
  mounted () {
    this.applePay(this.rechargeAges)
  },
  methods: {
    applePay (data) {
      // cp点击购买,触发请求得到支付的链接
      // let _this = this
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

      // 不切支付,使用苹果内购,需要传参数给ios客户端进行拉起内购
      let user_id = JSON.parse(sessionStorage.getItem('USER_INFO')).user_id // 用户id
      let os = JSON.parse(sessionStorage.getItem('FUSE_CHANNEL_INFO')).os // 系统,由后台指定
      let channel = JSON.parse(sessionStorage.getItem('FUSE_CHANNEL_INFO')).channel // 渠道
      let game_name = JSON.parse(sessionStorage.getItem('FUSE_CHANNEL_INFO')).game_name // 游戏名称
      let game_id = JSON.parse(sessionStorage.getItem('FUSE_CHANNEL_INFO')).game_id // 游戏ID
      let from_id = JSON.parse(sessionStorage.getItem('zjgw')).from_id // 游戏包ID
      let version = '1.0'
      let platform_version = '1.0'
      // alert('product_id: ' + product_id)
      // 判断是否存在product_id 苹果内购id
      if (product_id) {
        // 如果存在,则拉起内购
        let isoOrderInfo = `{"product_id":"${product_id}","order_id":"${order_id}","version": "1.2","user_id":"${user_id}","os":"${os}","channel":"${channel}","game_id":"${game_id}","game_name":"${game_name}","from_id":"${from_id}","version":"${version}","platform_version":"${platform_version}"}`
        // 发送信息给ios客户端
        // alert('发送信息给IOS客户端,拉起内购')
        // alert(isoOrderInfo)
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
        window.webkit.messageHandlers.wb_ios.postMessage(isoOrderInfo)
      }
    }
  }
}

</script>
<style lang="scss" scoped>

</style>
