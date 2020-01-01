<template>
    <div>
      <Parma></Parma>
        <component :is="this.$store.state.GowanComponent.gowanComponentName"> </component>
      <keep-alive>
        <component :is="this.$store.state.GowanComponent.floatBall"> </component>
      </keep-alive>
      <!--渠道公告-->
      <!-- <keep-alive> -->
        <component :is="this.$store.state.GowanComponent.notice"> </component>
      <!-- </keep-alive> -->
      <!--渠道公告-->
      <!-- <keep-alive> -->
        <component :is="this.$store.state.GowanComponent.slideBar"> </component>
      <!-- </keep-alive> -->
    </div>
</template>
<script>
// import FN from '../utility/fn'
import { JSSDK } from '../h5sdk/useSdk.js'
import {CLIENTSDK} from '../h5sdk/useClient.js'
import { mapGetters } from 'vuex'
import AccountLogin from '../components/Login/AccountLogin'
import PhoneLogin from '../components/Login/PhoneLogin'
// import InitNotice from '../components/InitNotice'
import RealName from '../components/RealName'
import Register from '../components/Register/Register'
import Recharge from '../components/Recharge'
// import FloatBall from '../components/FloatBall'
// import FN from '../utility/fn.js'
import AppleRecharge from '../components/AppleRecharge'
// 扫码支付页
import ScanCodePay from '../components/ScanCodePay'
import FloatBall from '../components/FloatBall'
import InitNotice from '../components/InitNotice'
import SlideBar from '../components/SlideBar'
import Parma from '../components/Parma'
export default {
  data () {
    return {
      currentView: 'Loading'
    }
  },
  components: {
    AccountLogin,
    PhoneLogin,
    // InitNotice,
    RealName,
    Register,
    Recharge,
    AppleRecharge,
    ScanCodePay,
    FloatBall,
    InitNotice,
    SlideBar,
    Parma
  },
  computed: {
    ...mapGetters(['gowanComponentName'])
  },
  methods: {
    getComponentName: function (componentValue) {
      console.log('Index.vue----->componentValue', componentValue)
      // 就是子组件传过来的值,就是要动态切换哪个组件的组件名
      // this.currentView = componentValue
      this.currentView = sessionStorage.getItem('gowanComponentName')
      // 修改vuex的值
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', componentValue)
    }
  },
  created () {
    let params = FN.getURLparams() // 获取链接参数
    if (params.isApp === 'true') {
      window.addEventListener(
        'message',
        event => {
          let data = event.data
          if (data.type === 'CC') {
          // FN.log(data)
          // let hald = data.fn[0]

          // 网页端]
            // FN.log(data.fn[0])
            // JSSDK[data.fn[0]](data.token, data.params[0])
            FN.log(data)
            CLIENTSDK[data.fn[0]](data.token, data.params[0])
          }
        },
        false
      )
    } else {
    // 接收信息,useH5.JS callback回调过来的信息，给游戏方
      window.addEventListener(
        'message',
        event => {
          let data = event.data
          if (data.type === 'CC') {
            FN.log('网页端:cp调用' + data.fn[0] + '方法传过来的数据---->', data)
            // let hald = data.fn[0]
            // 网页端
            JSSDK[data.fn[0]](data.token, data.params[0])
          }
        },
        false
      )
    }
  }
}
</script>
<style lang="scss">
@import "../assets/css/common.scss";
</style>
