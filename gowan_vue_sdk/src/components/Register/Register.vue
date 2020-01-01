<template>
  <div class="popbox show" style="display:block">
    <div class="popbox-overlay overlay" @click.stop="disappear">
    <!-- <div class="popbox-overlay overlay" @click="closeRegister()"> -->
      <div class="register popbox-container"  @click.stop>
        <div class="gowan-head">
          <div class="left">
            <img src="../../assets/img/icon-logo.png" class="logo" v-show="isTestServe()">
          </div>
        </div>
        <div class="register-menu">
          <div class="item" v-for="(item,index) in tabs" v-bind:key="index" :class="{active:index == num}" @click="tab(index)">{{item}}</div>
        </div>
        <div class="register-container">
          <div class="register-from" v-show="num==0">
            <div class="item">
              <span>账 号 :</span>
              <input type="text" placeholder="请输入账号" v-model="Accountregister.account">
            </div>
            <div class="item">
              <span>密 码 :</span>
              <input type="text" placeholder="请输入密码" v-model="Accountregister.password">
            </div>
          </div>
          <div class="register-from" v-show="num==1">
            <div class="item phone-item">
              <span>手机号 :</span>
              <input type="number" placeholder="请输入手机号码" v-model="Phoneregister.account">
              <div class="other">
                <div class="get-code" @click="sendAuthCode()" v-show="countDown">获取验证码</div>
                <div v-show="!countDown" class="get-code count">等待{{count}}s</div>
              </div>
            </div>
            <div class="item">
              <span>验证码 :</span>
              <input type="text" placeholder="请输入验证码"  v-model="Phoneregister.code">
            </div>
          </div>
          <div class="gowan-help">
            <div class="left">
              <i class="icon icon-help"></i>
              <a class="text" href="javascript:FN.showMsg(FN.getSession('SDK_INIT_INFO').help_url);">帮助</a>
            </div>
            <div class="right">
              <i class="icon icon-true" v-show="agreementVal" @click="agreement()"></i>
              <i class="icon icon-false" v-show="!agreementVal"  @click="agreement()"></i>
              <span class="text">千禧游戏<a :href="xieyiurl">服务协议</a>和<a :href="yinsiurl">隐私政策</a></span>
              <!-- <span class="text" style="text-decoration:none"></span> -->
            </div>
          </div>
          <div class="btns">
            <div class="btn active" @click="Register()">一键注册</div>
            <div class="btn" @click="cutComponent()">我有账号</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FN from '../../utility/fn.js'
import global from '../../common/global'
export default {
  data () {
    return {
      Accountregister: {
        account: FN.getRandomChar(1, 'string') + FN.getRandomChar(10), // 必填账号: 快速注册为账号,手机注册为手机号
        password: FN.getRandomChar(12), // 登陆密码，快速注册必填
        mode: 0
      },
      Phoneregister: {
        account: '', // 必填账号: 快速注册为账号,手机注册为手机号
        code: '', // 手机验证码，手机注册必填
        code_sign: '', // 手机验证码签名信息，发送验证码时返回
        code_timeout: '', // 手机验证码过期时间
        mode: 1
      },
      tabs: ['账号注册', '手机注册'],
      mode: 0, // 必填注册模式：0:快速注册/1:手机注册
      num: 0,
      flag: true,
      countDown: true,
      count: '',
      agreementVal: true,
      xieyiurl: FN.getSession('SDK_INIT_INFO').xieyi_url,
      yinsiurl: FN.getSession('SDK_INIT_INFO').privacy_url,
      isChangeAccount: this.$store.state.GowanComponent.isChangeAccount
    }
  },
  methods: {
    tab (index) {
      console.log('index', index)

      this.num = index
      this.mode = index
      console.log('mode', this.mode)
    },
    cutComponent () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'AccountLogin')
    },
    sendAuthCode () {
      this.flag = true
      let data = {
        user_id: FN.getSession('USER_INFO').user_id,
        phone: this.Phoneregister.account
      }
      this.verify('account', data.phone)
      if (this.flag) {
        window.zjgwSDK.sendAuthCode(data).then(res => {
          if (res.code === 0) {
            this.Phoneregister.code_sign = res.data.code_sign
            this.Phoneregister.code_timeout = res.data.timeout
            const TIME_COUNT = 60
            if (!this.timer) {
              this.count = TIME_COUNT
              this.countDown = false
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--
                } else {
                  this.countDown = true
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)
            }
          }
        })
      }
    },
    agreement () {
      this.agreementVal = !this.agreementVal
    },
    Register () {
      // 验证
      this.flag = true
      if (this.mode) {
        this.verify('phone', this.Phoneregister.account)
        this.verify('code', this.Phoneregister.code)
      } else {
        this.verify('account', this.Accountregister.account)
        this.verify('password', this.Accountregister.password)
      }
      this.verify('agreement', this.agreementVal)
      let data = this.mode ? this.Phoneregister : this.Accountregister
      if (this.flag && this.agreementVal) {
        // gowan渠道注册
        window.zjgwSDK.register(data).then(res => {
          console.log('this.mode', this.Phoneregister)
          if (res.code === 0) {
            // 注册成功,隐藏注册框
            this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
            // 登录注册的账号和密码
            // ----------------154到169行代码原来是170行登录代码里面提取出来了，现注册成功后已不需要再次执行登录代码
            // 存储登录用户信息
            FN.saveSession('USER_INFO', res.data)
            // 判断是否是切换账号的时候点击注册
            if (this.isChangeAccount === true) {
              window.location.reload(true)
              return false
            }
            // 登录成功,执行融合登录
            global.fuseLogin(res, data)

            // 保存账号密码信息
            global.saveAccount(res)
            FN.showMsg('注册成功')
            // 强制实名弹框弹出
            global.realName(res)
            // window.zjgwSDK.login(data).then(res => {
            // })
          }
        })
      }
    },
    verify (type, value) {
      if (type === 'account') {
        if (value === '') {
          FN.showMsg('账号不能为空')
          this.flag = false
        }
      } else if (type === 'code') {
        if (value === '') {
          FN.showMsg('验证码不能为空，请获取验证码后输入')
          this.flag = false
        }
      } else if (type === 'agreement') {
        if (value === false) {
          FN.showMsg('请同意千禧网络协议')
        }
      } else if (type === 'phone') {
        if (value === '') {
          FN.showMsg('手机号不能为空，请输入正确的手机号码')
          this.flag = false
        } else if (!FN.isPhoneNum(value)) {
          FN.showMsg('手机号码格式错误，请输入正确的手机号码')
          this.flag = false
        }
      }
    },
    closeRegister () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
    },
    disappear () {
      if (this.isChangeAccount === true) {
        this.$store.dispatch('SET_IS_CHANGE_ACCOUNNT', false) // 重置store里面的isChangeAccount值为false
        // 在点击切换账号的时候修改了isChangeAccount值为true，并且在点击切换账号的弹出的登录框中的点击登录事件将该值充值回false，
        // 此处重置isChangeAccount值为false，是针对用户在侧边栏中点击切换账号弹出登录框后，用户未点击登录而是直接点击空白处隐藏了登录框，
        // 不重置isChangeAccount值为false的话，会导致用户登录的状态下刷新网页，登录框会再次弹出。。。
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
        this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
      }
    },
    // 判断是否为正式服务器
    isTestServe () {
      if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
        let testServeList = FN.getSession('testServerArray')
        for (let i in testServeList) {
          // FN.log(testServeList[i])
          // FN.log(testServeList[i])

          if (FN.getSession('FUSE_CHANNEL_INFO').game_id === testServeList[i]) {
            return false
          } else {
            return true
          }
        }
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.get-code{
      font-size: 0.24rem;
    color: rgb(193, 191, 188);
    height: 0.35rem;
    line-height: 0.35rem;
    width: 100%;
    border: 1px solid rgb(193, 191, 188);
    position: absolute;
    top: 28%;
    border-radius: 0.08rem;
    text-align: center;
    right: 0.2rem;
    cursor: pointer;
}
.gowan-head {
  height: .51rem;
  overflow: hidden;
  .logo {
    width: 1.541rem;
    height: .51rem;
  }
}
.register-menu {
  width: 100%;
  margin-top: 0.15rem;
  display: -webkit-box;
  display: -moz-box;
  -webkit-box-align: center;
  -moz-box-align: center;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  text-align: center;

  .item {
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    transition: 0.3s ease;
    width: 50%;
    height: 0.66rem;
    border: 1px solid #504e4e;
    font-size: 0.28rem;
    color: #a8a8a8;
    margin-bottom: 0.25rem;
    &.active {
      color: #fff;
      background: #ff9725;
      border-color: #ff9725;
    }
  }
}
.register-container {
  .register-from {
    width: 100%;
    border-radius: 0.08rem;
    margin-left: auto;
    margin-right: auto;
    font-size: 0;
    margin-bottom: 0.2rem;
    .item {
      height: 0.75rem;
      line-height: 0.75rem;
      background: #484848;
      margin-bottom: 0.2rem;
      border-radius: 5px;
      span {
        position: absolute;
        width: 1rem;
        height: 100%;
        font-size: 0.26rem;
        text-align: right;
        line-height: 0.78rem;
      }
      input {
        height: 0.78rem;
        line-height: 0.78rem;
        vertical-align: middle;
        width: 3.6rem;
        font-size: 0.22rem;
        background: none;
        padding-left: 1.4rem;
        border-radius: 0;
        border-left: 0.05rem solid transparent;
        color: #fff;
        border: 0;
        outline: none;
      }
      &.phone-item {
        position: relative;
        .other {
          position: absolute;
          width: 1.5rem;
          height: 100%;
          right: 0;
          top: 0;
          font-size: 0;
          display: -webkit-box;
          display: -moz-box;
          -webkit-box-align: center;
          -moz-box-align: center;
          .get-code {
            width: 1.24rem;
            height: 0.4rem;
            line-height: 0.4rem;
            text-align: center;
            border: 1px solid #ff9725;
            border-radius: 0.08rem;
            font-size: 0.2rem;
            color: #ff9725;
            &.count{
              border-color: #8a8988;
              color: #8a8988;
            }
          }
        }
      }
    }

  }
.btns{
  .btn{
    width:100%;
    position: relative;
    display: block;
    border-radius: 0.08rem;
    font-size: 0.28rem;
    background: #e5e5e5;
    color: #757575;
    height: 0.64rem;
    line-height: 0.64rem;
    text-align: center;
    margin-bottom:.2rem;
    &.active{
      background:#ff9725;
      color:#fff;
    }
  }
}
}

.gowan-help{
margin-top: .2rem;
margin-bottom:.4rem;
a{
  text-decoration: none;
}
&:after{
  content:'';
  display: block;
  overflow: hidden;
  visibility: hidden;
  clear: both;
}

.left{
  .icon-help{
    width:.24rem;
    height: .24rem;
    background-image:url(../../assets/img/icon-help.png);
    background-size:.24rem .24rem;
  }
  .text{
    font-size: 0.24rem;
    margin-left: 0.08rem;
    vertical-align: middle;
    color:#fff;
  }
}
.right{
  .text{
    font-size: 0.24rem;
    vertical-align: middle;
    color:#fff;
    a{
    // display: inline-block;
    color:#fff;
    text-decoration:underline;
    }
  }
  .icon-false{
    display: inline-block;
    border: 1px solid #313131;
    border-radius: 50%;
    width: 0.24rem;
    height: 0.24rem;
  }
  .icon-true{
    display: inline-block;
    border: 1px solid #313131;
    border-radius: 50%;
    width: 0.24rem;
    height: 0.24rem;
    background:url(../../assets/img/icon-true.png);
    background-size:.24rem .24rem;
  }
}

}
</style>
