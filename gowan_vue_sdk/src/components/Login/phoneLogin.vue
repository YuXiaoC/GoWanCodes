<template>
  <div class="popbox show" style="display:block">
    <div class="popbox-overlay overlay" @click="disappear">
    <!-- <div class="popbox-overlay overlay" @click="closePhoneLogin()"> -->
      <div class="gowan-logo popbox-container" @click.stop>
        <div class="gowan-logo-head">
          <div class="left">
            <img src="../../assets/img/icon-logo.png" class="logo" v-show="isTestServe()">
          </div>
          <div class="right">
            <i class="icon icon-register"></i>
            <span class="text" @click="cutRegister()">注册账号</span>
          </div>
        </div>
        <div class="gowan-logo-from">
          <div class="input-item">
            <div class="input-title">手机号:</div>
              <input type="text" name="phone-account" class="input-content" v-model="loginForm.account" placeholder="请输入手机号码">
              <div class="other">
                  <span @click="sendAuthCode()" v-show="countDown">获取验证码</span>
                  <div v-show="!countDown" class="get-code count">等待{{count}}s</div>
              </div>
          </div>
          <div class="input-item">
            <div class="input-title">验证码:</div>
            <input type="text" name="verify_code" class="input-content" v-model="loginForm.code" placeholder="请输入验证码">
          </div>
        </div>
        <div class="gowan-help">
          <div class="left">
            <i class="icon icon-help"></i>
            <a class="text" href="javascript:FN.showMsg(FN.getSession('SDK_INIT_INFO').help_url);">帮助</a>
          </div>
          <div class="right">
            <a class="text" href="javascript:FN.showMsg(FN.getSession('SDK_INIT_INFO').forget_url);">忘记账号/密码?</a>
          </div>
        </div>
        <!-- 第三方登录 -->
        <div class="other_login" style="display:none">
          <a href="qqUrl" @click="QQ_login()" class="qq"  >
              <img src="../../assets/img/QQlogo.png" alt="图片加载失败">
          </a>
          <a href="wxUrl" @click="WX_login()" class="wx">
              <img src="../../assets/img/wechat.png" alt="图片加载失败">
          </a>
        </div>
        <div class="gowan-btns">
          <div class="left">
            <div class="btn" @click="cutRegister()">一键注册</div>

          </div>
          <div class="right">
             <div class="btn active" @click="handleLogin()">立即登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FN from '../../utility/fn.js'
import global from '../../common/global.js'
import configUrl from '../../common/config.js'
export default {
  data () {
    return {
      loginForm: {
        mode: 1, // 必填 登陆模式：0:账号密码登陆/1:手机验证码登陆
        account: '', // 登陆账号:账号登陆为账号，手机登陆为手机
        code: '', // 手机验证码，手机登陆必填
        code_sign: '', // 手机验证码签名信息，发送验证码时返回
        code_timeout: ''
      },
      flag: true,
      countDown: true,
      count: '',
      qqUrl: 'javascript:;',
      wxUrl: 'javascript:;',
      isChangeAccount: this.$store.state.GowanComponent.isChangeAccount
    }
  },
  methods: {
    QQ_login () {
      this.qqUrl = `${configUrl.__gowanpayDomain.get()}/?ct=login&ac=h5qq&callback=${encodeURIComponent(window.location.href)}`
    },
    WX_login () {
      this.wxUrl = `${configUrl.__gowanpayDomain.get()}/?ct=login&ac=h5wx&callback=${encodeURIComponent(window.location.href)}`
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
    cutRegister () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'Register')
    },
    sendAuthCode () {
      this.flag = true
      let data = {
        user_id: FN.getSession('USER_INFO').user_id,
        phone: this.loginForm.account
      }
      this.verify('account', data.phone)
      if (this.flag) {
        window.zjgwSDK.sendAuthCode(data).then(res => {
          if (res.code === 0) {
            this.loginForm.code_sign = res.data.code_sign
            this.loginForm.code_timeout = res.data.timeout
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
    handleLogin () {
      let data = this.loginForm
      this.flag = true
      this.verify('account', data.account)
      this.verify('code', data.code)
      this.verify('code', data.code_sign)
      if (this.flag) {
        window.zjgwSDK.login(data).then(res => {
          if (res.code === 0) {
            FN.log(res)
            FN.saveSession('USER_INFO', res.data)
            // 登录成功,执行融合登录
            global.fuseLogin(res, data)
            // 判断是否需要重载。(主要针对玩家登陆后，点击切换账号弹出的登录框做的一个处理)。
            if (FN.getLocal('isChangeAccount') === true) {
              FN.removeLocal('isChangeAccount')
              window.location.reload(true)
            }
            // 弹出登录成功
            FN.showMsg('登录成功')
            // 保存账号密码信息
            global.saveAccount(res)
            if (res.data.login_real_name_cfg) {
              // 登陆实名检测模式 0不提示/1强制完善/2不强制
              // 强制实名弹框弹出
              global.realName(res)
            } else {
              FN.hide()
              // 登录框隐藏
              this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
              // 浮标出现
              // 浮标出现
              if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
                let testServeList = FN.getSession('testServerArray')
                for (let i in testServeList) {
                  if (FN.getSession('FUSE_CHANNEL_INFO').game_id === testServeList[i]) {
                    return false
                  } else {
                    this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
                  }
                }
              } else {
                this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
              }
            }
          }
        })
      }
    },
    verify (type, value) {
      if (type === 'account') {
        if (value === '') {
          FN.showMsg('手机号不能为空，请输入正确的手机号码')
          this.flag = false
        } else if (!FN.isPhoneNum(value)) {
          FN.showMsg('手机号码格式错误，请输入正确的手机号码')
          this.flag = false
        }
      } else if (type === 'code') {
        if (value === '') {
          FN.showMsg('验证码不能为空，请获取验证码后输入')
          this.flag = false
        }
      }
    },
    saveAccount (res) {
      // ！！！ 保存登录记录
      let loginRecord = Array.isArray(FN.getLocal('LOGIN_RECORD'))
        ? FN.getLocal('LOGIN_RECORD')
        : []

      let newRecord = {
        account: this.loginForm.account, // 用于展示的帐号名， 帐号登录时 account == name， 手机登录时 account == phone
        name: res.data.name, // 实际登录时都是使用 name 和 password
        password: res.data.password
      }
      FN.log(this.account)
      // 如有重复数据就删除，重新添加到队首
      loginRecord.forEach((item, index) => {
        if (item.name === newRecord.name) {
          // 使用name判断才能确保唯一性
          loginRecord.splice(index, 1)
        }
      })

      loginRecord.unshift(newRecord)
      // 最多保存5条数据
      loginRecord = loginRecord.slice(0, 5)
      FN.saveLocal('LOGIN_RECORD', loginRecord)
    },
    fuseLogin (res, input) {
      window.FUSESDK.login({
        user_id: res.data.old_id, // 从客户端获取的用户id,方便排查问题。比如步步高
        phone: res.data.phone, // 用户电话号码
        is_bind_phone: res.data.phone ? 1 : 0, // 是否绑定手机号码  1 是  0 不是
        is_realname: res.data.real_name_status, // 是否实名    1 是  0 不是
        data: JSON.stringify({
          uid: res.data.old_id,
          time: res.data.timestamp,
          sign: res.data.sign
        }),
        ext: JSON.stringify(window.__ext__ || {})
      })
        .then(res2 => {
          if (res2.code === 0) {
            // 保存融合登录用户信息
            FN.saveSession('FUSE_USER_INFO', res2.data)
          }
          if (window.SDKDATA.loginWay) {
            window.SDKDATA.login.callback(res)
          } else {
            window.SDKDATA.flymeChangeAccount.callback(res)
          }
        })
        .catch(e => {
          FN.log('loginError:', e)
        })
    },
    realName (res) {
      // 登陆实名检测模式 0不提示/1强制完善/2不强制
      if (res.data.login_real_name_cfg === 1) {
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'RealName')
      }
    },
    closePhoneLogin () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
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
  @import '../../assets/css/login.scss';
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
</style>
