<template>
  <div class="popbox show" style="display:block">
    <!-- <div class="popbox-overlay overlay" @click="closeAccountLogin()"> -->
    <div class="popbox-overlay overlay" @click="disappear">
      <div class="gowan-logo popbox-container" id="accountLogin" @click.stop>
        <div class="gowan-logo-head">
          <div class="left">
            <img src="../../assets/img/icon-logo.png" class="logo" v-show="isTestServe()">
          </div>
          <div class="right" @click="cutphoneLogin">
            <i class="icon icon-phone-login"></i>
            <span class="text">手机登录</span>
          </div>
        </div>
        <div class="gowan-logo-from">
          <div class="input-item">
            <div class="input-title">帐号:</div>
              <input type="text" name="account" class="input-content" v-model="loginForm.account" placeholder="请输入千禧账号">
              <div class="other">
                  <div class="show-down" @click="showAccount()" :class="{active:isShowAccountList}"> <i class="icon-arrow-down show-record"></i></div>
              </div>
              <div class="login-record-list" v-bind:class="{ show: isShowAccountList }">
                <ul>
                  <li v-for="(item,index) in this.accountList" v-bind:key="index">
                      <div class="left" @click="getSaveAccount(item.account)">
                          <span>{{item.account}}</span>
                      </div>
                      <div class="right" @click="deleteAccount(item.account)">
                          <i class="icon-delete" data-account="15975492315"></i>
                      </div>
                  </li>
                </ul>
            </div>
          </div>
          <div class="input-item">
            <div class="input-title">密码:</div>
            <input type="password" name="password" class="input-content" v-model="loginForm.password" placeholder="请输入密码">
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
        <!-- 第三方登录 （暂时不做了，因此给了一个style="display:none"样式隐藏了）-->
        <div class="other_login" style="display:none">
          <a :href="qqUrl" @click="QQ_login()" class="qq">
              <img src="../../assets/img/QQlogo.png" alt="图片加载失败">
          </a>
          <a :href="wxUrl" @click="WX_login()" class="wx">
              <img src="../../assets/img/wechat.png" alt="图片加载失败">
          </a>
        </div>
        <div class="gowan-btns">
          <div class="left">
            <div class="btn" @click="cutRegister()">一键注册</div>

          </div>
          <div class="right">
             <div class="btn active" @click="handleLogin(1)">立即登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FN from '../../utility/fn'
import global from '../../common/global.js'
import configUrl from '../../common/config.js'
window.FN = FN
export default {
  data () {
    return {
      loginForm: {
        mode: 0, // 0表示账号登录、1手机、其他第三方
        account: JSON.stringify(FN.getLocal('LOGIN_RECORD')) !== '{}' ? FN.getLocal('LOGIN_RECORD')[0].account : '',
        password: JSON.stringify(FN.getLocal('LOGIN_RECORD')) !== '{}' ? FN.getLocal('LOGIN_RECORD')[0].password : ''
      },
      accountList: '',
      isShowAccountList: false,
      flag: true,
      close: true,
      qqUrl: 'javascript:;',
      wxUrl: 'javascript:;',
      isChangeAccount: this.$store.state.GowanComponent.isChangeAccount
    }
  },
  mounted () {
    // 生命周期mounted()里面的代码是优化新增代码，针对用户已经登录的状态下，刷新直接进行登录，无需再次弹出登录框，改善用户体验
    // console.log('this.loginForm', this.loginForm)
    let isChangeAccount = this.isChangeAccount
    let cookieAccount = FN.getCookieAccount()
    if (cookieAccount !== false && (cookieAccount.password || cookieAccount.unionid) && isChangeAccount !== true) {
      FN.log('存在用户信息，走自动登录')
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
      let loginData = {
        account: cookieAccount.account,
        password: cookieAccount.password,
        mode: cookieAccount.mode ? cookieAccount.mode : this.loginForm.mode,
        ext: cookieAccount.ext ? cookieAccount.ext : '{}',
        unionid: cookieAccount.unionid
      }
      FN.log('自动登录时的loginData------->', loginData)
      this.handleLogin(2, loginData)
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
        // 在SlideBar点击切换账号的时候修改了isChangeAccount值为true，并且在点击切换账号的弹出的登录框中的点击登录事件将该值充值回false，
        // 此处重置isChangeAccount值为false，是针对用户在侧边栏中点击切换账号弹出登录框后，用户未点击登录而是直接点击空白处隐藏了登录框，
        // 不重置isChangeAccount值为false的话，会导致用户登录的状态下刷新网页，登录框会再次弹出。。。
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
        this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
      }
    },
    cutphoneLogin () {
      // 修改vuex的值
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'PhoneLogin')
    },
    handleLogin (secne, account) {
      let data
      if (arguments.length > 1) {
        data = account
      } else {
        data = this.loginForm
      }
      this.flag = true
      // 表单验证

      this.verify('account', data.account)

      if (!data.unionid || data.unionid === '') {
        this.verify('password', data.password)
      }

      // zjgwsdk的登录逻辑操作
      if (this.flag) {
        window.zjgwSDK.login(data).then(res => {
          if (res.code === 0) {
            FN.saveSession('USER_INFO', res.data)
            // 登录成功,执行融合登录
            global.fuseLogin(res, data)
            // 判断是否需要重载。(主要针对玩家登陆后，点击切换账号弹出的登录框做的一个处理)。

            if (this.isChangeAccount === true) {
              this.$store.dispatch('SET_IS_CHANGE_ACCOUNNT', false)
              window.location.reload(true)
            }
            if (secne === 1) { // 根据secne值来判断用户是第一次登陆（secne为1）还是刷新的时候自动登录（secne为2）
              // 当玩家第一次登录成功时弹出登录成功，第二次登录会从本地缓存中直接取用户信息进行登录，不需要再次弹出登录成功
              FN.showMsg('登录成功')
            }
            // 保存账号密码信息
            global.saveAccount(res, data.mode)
            if (res.data.login_real_name_cfg) {
              // 登陆实名检测模式 0不提示/1强制完善/2不强制
              // 强制实名弹框弹出
              global.realName(res)
            } else {
              FN.hide()
              // 登录框隐藏
              this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')

              // 浮标出现
              if (!res.data.unionid) {
                if (FN.getSession('FUSE_CHANNEL_INFO').channel === 'applegw') {
                  let testServeList = FN.getSession('testServerArray')
                  for (let i in testServeList) {
                    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === testServeList[i]) {
                      return false
                    }
                  }
                }
                this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', 'FloatBall')
              }
            }
          } else {
            this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'AccountLogin')
          }
        })
      }
    },
    verify (type, value) {
      if (type === 'account') {
        if (value === '') {
          FN.showMsg('账号不能为空，请填写正确的账号')
          this.flag = false
        }
      } else if (type === 'password') {
        if (value === '') {
          FN.showMsg('密码不能为空，请输入正确的密码')
          this.flag = false
        } else if (value.length < 6 || value.length > 20) {
          FN.showMsg('密码长度为6-20位字母或数字，请输入正确的密码')
          this.flag = false
        }
      }
    },
    showAccount () {
      if (JSON.stringify(FN.getLocal('LOGIN_RECORD')) !== '{}') {
        this.isShowAccountList = !this.isShowAccountList
        // 获取存储的账号和密码
        this.accountList = FN.getLocal('LOGIN_RECORD')
      }
    },
    getSaveAccount (account) {
      let loginRecord = Array.isArray(FN.getLocal('LOGIN_RECORD'))
        ? FN.getLocal('LOGIN_RECORD')
        : []
      for (let i = 0; i < loginRecord.length; i++) {
        if (loginRecord[i].account === account) {
          this.loginForm.account = loginRecord[i].account
          this.loginForm.password = loginRecord[i].password
          this.isShowAccountList = false
        }
      }
    },
    deleteAccount (account) {
      let loginRecord = Array.isArray(FN.getLocal('LOGIN_RECORD'))
        ? FN.getLocal('LOGIN_RECORD')
        : []

      for (let i = 0; i < loginRecord.length; i++) {
        if (loginRecord[i].account === account) {
          loginRecord.splice(i, 1)
          FN.saveLocal('LOGIN_RECORD', loginRecord)
          this.accountList = loginRecord
        }
      }
    },
    cutRegister () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'Register')
    },
    closeAccountLogin () {
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
@import "../../assets/css/login.scss";
.popbox {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 600;
  color: #fff;
  opacity: 1;
  visibility: hidden;
  transition: 0.3s ease;
  display:block;
  &.show{
      opacity: 1;
      visibility: visible;
  }
  .popbox-overlay {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-align: center;
      -moz-box-align: center;
      -webkit-box-pack: center;
      -moz-box-pack: center;
  }

  .popbox-container {
      width: 5.86rem;
      padding: 0.4rem 0.3rem;
      background: rgba(0, 0, 0, 0.85);
      border-radius: 0.08rem;
  }
}
.login-record-list {
  position: absolute;
  top: 0.78rem;
  left: 0;

  width: 100%;
  z-index: 10;

  opacity: 0;
  visibility: hidden;
  transition: 0.3s ease;

  &.show {
    visibility: visible;
    opacity: 1;
  }

  ul {
    border: 1px solid #888;
    border-radius: 5px;
    font-size: 0.24rem;
    padding: 0.02rem 0.2rem;
    background: #333;

    li {
      list-style: none;
      height: 0.6rem;
      line-height: 0.6rem;

      & + li {
        border-top: 1px solid #888;
      }

      .left {
        width: 80%;
        position: relative;
        padding-left: 0.4rem;
        span {
          // display: block;
          // position: absolute;
          // top: 50%;
          // border: 1px solid red;
          // transform: translateY(-50%);
        }
      }

      .right {
        width: 6%;
        padding-left: 0.32rem;
        position: relative;
        i.icon-delete {
          background: url(../../assets/img/icon-delete.png);
          width: 0.16rem;
          height: 0.16rem;
          box-sizing: border-box;
          background-size: 0.16rem 0.16rem;
        }
      }
    }
  }
  &.show {
    visibility: inherit;
    opacity: 1;
  }
}
</style>
