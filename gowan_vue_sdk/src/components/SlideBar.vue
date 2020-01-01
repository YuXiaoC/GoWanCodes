<template>
  <div id="slide-bar" class="slide-bar popbox" :class="{show:showSlide}" @click="closeSlideBar()">
    <div class="slide-bar-overlay overlay">
      <div class="slide-bar-container popbox-container">
        <div class="slide-bar-content">
          <div class="slide-bar-content-wrap" @click.stop>
                <div class="header-info">
                    <div class="img-info">
                        <i class="icon-head-image"></i>
                    </div>
                    <div class="text-info">
                        <div class="account">
                            <span class="name">帐号:</span>
                            <span class="text" v-text="userInfo.name"></span>
                        </div>
                        <div class="bind-id">
                            <span class="name">ID:</span>
                            <span class="text" v-text="userInfo.old_id"></span>
                        </div>
                    </div>
                </div>
                <ul class="options">
                    <li class="option-item" :class="{ active: showChangePassword }" >
                        <div class="option-title" @click="showChangePasswordMeth()">
                            <div class="icon">
                                <i class="icon-password"></i>
                                <i class="icon-password-active"></i>
                            </div>
                            <div class="name"><span>修改密码</span></div>
                            <i class="icon-arrow-right"></i>
                        </div>
                        <div class="option-content">
                            <div class="form">
                                <div class="form-tip">密码为6-20位的数字或英文字母</div>

                                <div class="input-item">
                                    <div class="title">您的帐号:</div>
                                    <input type="text" class="input-content" v-model="userInfo.name" readonly disabled>

                                </div>
                                <div class="input-item">
                                    <div class="title">旧的密码:</div>
                                    <input type="text" name="old_password" v-model="userInfo.password"  class="input-content"  readonly disabled>

                                </div>
                                <div class="input-item">
                                    <div class="title">新的密码:</div>
                                    <input type="text" name="new_password" class="input-content" v-model="changePasswordForm.new_password">
                                </div>
                                <div class="submit-area">
                                    <div class="submit-btn" @click="changePassword()">
                                        <span>确认提交</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="option-item" :class="{ active: showUnbindPhone }" @click="showUnbindPhoneMeth()">
                        <div class="option-title">
                            <div class="icon">
                                <i class="icon-phone"></i>
                                <i class="icon-phone-active"></i>
                            </div>
                            <div class="name" v-if="userInfo.phone"><span>解绑手机</span></div>
                            <div class="name" v-else><span>绑定手机</span></div>
                            <i class="icon-arrow-right"></i>
                        </div>
                        <div class="option-content" @click.stop>
                            <div class="form padding3">
                                <div class="form-tip" v-if="userInfo.phone">解绑手机可能会降低账户安全等级<br/>请谨慎操作</div>
                                <div class="form-tip" v-else>绑定手机可提高账户安全等级<br/>请输入手机号码完成绑定</div>

                                <div class="input-item">
                                    <div class="title">手机号:</div>
                                    <input type="number" name="phone" v-model="userInfo.phone" class="input-content"  disabled readonly v-if="userInfo.phone">
                                    <input type="number" name="phone" v-else value="" class="input-content" v-model="PhoneForm.phone" placeholder="请输入手机号码">
                                    <div class="other">
                                        <div class="get-code" @click="sendAuthCode()" v-show="countDown">
                                            获取验证码
                                        </div>
                                        <div v-show="!countDown" class="get-code count">等待{{count}}s</div>
                                    </div>
                                </div>
                                <div class="input-item">
                                    <div class="title">验证码:</div>
                                    <input type="text" name="verify_code" placeholder="请输入验证码" class="input-content" v-model="PhoneForm.code">
                                </div>
                                <div class="submit-area">
                                    <div class="submit-btn" v-if="userInfo.phone" @click="unBindPhone()">
                                        <span>确认提交</span>
                                    </div>
                                    <div class="submit-btn" v-else @click="bindPhone()">
                                        <span>确认提交</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
              </div>
            <div class="change-account-wrap">
                <div class="change-account" @click="changeAccountBySdk()">
                    <i class="icon-switch"></i>
                    <span>切换帐号</span>
                </div>
            </div>
        </div>
        <div class="slide-bar-close">
          <i class="icon-arrow-left popbox-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FN from '../utility/fn.js'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      showSlide: '', // 控制侧边栏是否显示
      showChangePassword: false, // 控制展示修改密码
      showUnbindPhone: false, // 控制解绑手机
      userInfo: FN.getSession('USER_INFO'), // 获取用户信息
      flag: true, // 表单验证标志
      countDown: true, // 控制获取验证码按钮是否可以点击
      count: '', // 显示秒数
      changePasswordForm: {
        mode: 0, // 必填 模式：0:旧密码/1:手机验证码/2:邮箱
        user_id: FN.getSession('USER_INFO').user_id, // 必填 千禧用户uid
        new_password: '', // 必填新密码
        old_password: '', // 旧密码，通过旧密码修改时填写
        code: '', // 手机验证码，通过手机验证码找回时填写
        code_sign: '' // 手机验证码签名信息，发送验证码时返回
      },
      PhoneForm: {
        user_id: FN.getSession('USER_INFO').user_id, // 必填 千禧用户uid
        phone: FN.getSession('USER_INFO').phone
          ? FN.getSession('USER_INFO').phone
          : '', // string 必填手机号
        code: '', // string 必填手机验证码
        code_sign: '', // string 必填手机验证码签名信息，发送验证码时返回
        code_timeout: '' // int 必填手机验证码过期时间，发送验证码时返回
      }
    }
  },
  mounted () {
    this.scrollSlide()
    this.showSlideBar()
  },
  methods: {
    // 展示修改密码
    showChangePasswordMeth () {
      this.showChangePassword = !this.showChangePassword
      this.showUnbindPhone = false
    },
    // 展示解绑手机
    showUnbindPhoneMeth () {
      this.showChangePassword = false
      this.showUnbindPhone = !this.showUnbindPhone
    },
    // 发送验证码
    sendAuthCode () {
      this.flag = true
      if (FN.getSession('USER_INFO').phone) {
        this.verify('account', FN.getSession('USER_INFO').phone)
      } else {
        this.verify('account', this.PhoneForm.phone)
      }
      if (this.flag) {
        let data = {
          user_id: FN.getSession('USER_INFO').user_id,
          phone: FN.getSession('USER_INFO').phone
            ? FN.getSession('USER_INFO').phone
            : this.PhoneForm.phone
        }
        window.zjgwSDK.sendAuthCode(data).then(res => {
          if (res.code === 0) {
            this.PhoneForm.code_sign = res.data.code_sign
            this.PhoneForm.code_timeout = res.data.timeout
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
    // 验证表单
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
    // 关闭侧边栏
    closeSlideBar () {
      this.showSlide = false
      setTimeout(() => {
        this.$store.dispatch('SET_GOWAN_COMPONENT_SLIDEBAR', '')
      }, 300)
    },
    // 展示侧边栏
    showSlideBar () {
      setTimeout(() => {
        this.showSlide = true
      }, 1)
    },
    // 点击修改密码的函数
    changePassword () {
      this.changePasswordForm.old_password = this.userInfo.password
      let data = this.changePasswordForm
      window.zjgwSDK.updatePassword(data).then(res => {
        if (res.code === 0) {
          FN.showMsg('修改密码成功')
          // 修改密码成功后更新cookie里面的密码 不然刷新的时候，自动登录会拿取cookie里面的旧密码登录会登录不了，导致账号封锁
          let newRecord = FN.getCookieAccount() // 获取cookie中的账户信息
          newRecord.password = this.changePasswordForm.new_password
          console.log('修改密码后保存新的登录记录', newRecord)

          var KEY = String(new Date().getTime()).substr(0, 10)

          let domain = window.location.host.replace(/^[^.]+\./, '')
          var cookieValue = FN.requestEncrypt(JSON.stringify(newRecord), KEY).e

          FN.cookie('zjwl_acc', cookieValue, {expires: 7, domain: domain})
          FN.cookie('zjwl_key', KEY, {expires: 7, domain: domain})

          let USER_INFO = FN.getSession('USER_INFO')
          USER_INFO.password = res.data.password
          FN.saveSession('USER_INFO', USER_INFO)
          this.closeSlideBar()
        }
      })
    },
    // 点击绑定手机号码的函数
    bindPhone () {
      let data = this.PhoneForm
      FN.log(this.PhoneForm)
      window.zjgwSDK.bindPhone(data).then(res => {
        if (res.code === 0) {
          FN.showMsg('绑定手机成功')

          // 更新侧边栏信息
          let userInfo = FN.getSession('USER_INFO')
          userInfo.phone = data.phone
          this.PhoneForm.phone = data.phone
          FN.saveSession('USER_INFO', userInfo)
          this.closeSlideBar()
        }
      })
    },
    // 点击解绑手机号码的函数
    unBindPhone () {
      let data = this.PhoneForm
      window.zjgwSDK.unBindPhone(data).then(res => {
        if (res.code === 0) {
          FN.showMsg('解绑手机成功')
          // 更新侧边栏信息
          let userInfo = FN.getSession('USER_INFO')
          userInfo.phone = ''
          FN.saveSession('USER_INFO', userInfo)
          this.closeSlideBar()
        }
      })
    },
    // SDK内部切换账号
    changeAccountBySdk () {
      FN.log('SDK内部切换账号-->window.SDKDATA', window.SDKDATA)

      if (window.SDKDATA.flymeChangeAccount && window.SDKDATA.flymeChangeAccount.callback) {
        window.SDKDATA.flymeChangeAccount.callback({
          statusCode: 0,
          status: '外部执行切换帐号'
        })
      } else {
        // 如果cp没有接入切换账号方法，则我们千禧自己调起登录框
        // FN.saveLocal('isChangeAccount', true)
        this.$store.dispatch('SET_IS_CHANGE_ACCOUNNT', true)
        this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', 'AccountLogin')
      }
      this.closeSlideBar()
      // 浮标隐藏
      this.$store.dispatch('SET_GOWAN_COMPONENT_FLOATBALL', '')
    },
    // sdk侧边栏scroll
    scrollSlide () {
      // let slideBar = document.getElementById('slide-bar')
      // 侧边栏滚动
      const options = {
        scrollY: true, // 因为scrollY默认为true，其实可以省略
        click: true
      }

      let scroll = new BScroll(document.querySelector('.slide-bar-content'), options)
    }
  }
}
</script>
<style lang="scss" scoped>
li {
  list-style: none;
}
#slide-bar {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s ease;
  z-index: 10;

  &.show {
    opacity: 1;
    visibility: visible;
    .slide-bar-content {
      transform: translateX(0);
    }
    .slide-bar-close {
      transform: translateX(0);
    }
  }
  .slide-bar-overlay {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }
  .slide-bar-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    background: rgba(0, 0, 0, 0);
  }
  .slide-bar-content {
    width: 6rem;
    height: 100%;
    background: #000;
    border-radius: 0 5px 5px 0;
    transition: 0.3s cubic-bezier(0, 0.6, 0, 0.95);
    transform: translateX(-6rem);
    position: relative;
  }
  .slide-bar-content-wrap {
    height: 13.34rem;
    background: #000;
    position: relative;
  }
  .slide-bar-close {
    position: absolute;
    top: 50%;
    margin-top: -0.325rem;
    left: 6.2rem;
    font-size: 0;
    transition: 0.3s ease;
    transform: translateX(7.5rem);
  }
  .header-info {
    height: 2.5rem; // padding-top: 0.63rem;
    border-bottom: 0.05rem solid #2a2a2a;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    .img-info {
      width: 1.73rem;
      text-align: right;
      img {
        width: 1.22rem;
        height: 1.22rem;
        border-radius: 50%;
        border: 0.05rem solid #333;
      }
    }
    .text-info {
      padding-left: 0.28rem;
      .username {
        font-size: 0.28rem;
      }
      .account,
      .bind-id {
        max-width: 3.8rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        color: #a4a4a4;
        font-size: 0.24rem;
        margin-top: 0.15rem;
      }
    }
  }
  .options {
    .option-item {
      position: relative;
      border-bottom: 1px dashed #303643;

      .icon-password-active,
      .icon-phone-active,
      .icon-verify-active {
        display: none;
      }

      &.active {
        .option-title {
          .name {
            color: #d87b22;
          }
          .icon-arrow-right {
            width: 0.12rem;
            height: 0.22rem;
            background-image: url(../assets/img/icon-arrow-right-active.png);
            transform: rotate(90deg);
          }
        }
        &:nth-child(1) {
          .icon-password {
            display: none;
          }
          .icon-password-active {
            display: inline-block;
          }
          .option-content {
            height: 5.64rem;
          }
        }
        &:nth-child(2) {
          .icon-phone {
            display: none;
          }
          .icon-phone-active {
            display: inline-block;
          }
          .option-content {
            height: 4.52rem;
          }
        }
        &:nth-child(3) {
          .icon-verify {
            display: none;
          }
          .icon-verify-active {
            display: inline-block;
          }
          .option-content {
            height: 4.52rem;

            &.is-verify {
              height: 3.42rem;
            }
          }
        }
      }
      .option-title,
      .option-title-empty {
        display: block;
        height: 1.05rem;
        line-height: 1.05rem;
        font-size: 0;
        .icon {
          width: 1.3rem;
          text-align: right;
        }
        .name {
          display: inline-block;
          width: 4rem;
          padding-left: 0.3rem;
          vertical-align: middle;
          font-size: 0.28rem;
          position: relative;
          span {
            position: absolute;
            line-height: normal;
            // left: 0;
            top: 10%;
            transform: translateY(-50%);
          }
        }
        .icon-arrow-right {
          transition: 0.3s ease;
          width: 0.12rem;
          height: 0.22rem;
          background-image: url(../assets/img/icon-arrow-right.png);
        }
      }
      .option-content {
        background: #1a1a1a;
        height: 0;
        overflow: hidden;
        transition: 0.3s cubic-bezier(0, 0.6, 0, 0.95);
      }
    }
  }
  .change-account-wrap {
    position: absolute;
    bottom: 0;
    background: #000;
    height: 1.5rem;
    width: 100%;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
  }
  .change-account {
    // position: absolute;
    // // bottom: 0.52rem;
    // left: 50%;
    // top: 12.12rem;
    width: 2.4rem;
    height: 0.6rem;
    // margin-left: -1.2rem;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    color: orange;
    border: 1px solid orange;
    border-radius: 0.08rem;
    font-size: 0;
    span {
      font-size: 0.28rem;
      vertical-align: middle;
      margin-left: 0.12rem;
    }
  }
}
.icon-head-image {
  background-image: url(../assets/img/icon-head-image.png);
  width: 1.22rem;
  height: 1.22rem;
  border-radius: 50%;
  border: 0.05rem solid #333;
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;
}
.icon-password {
  background-image: url(../assets/img/icon-password.png);
  width: 0.36rem;
  height: 0.36rem;
}
.icon-arrow-left {
  background-image: url(../assets/img/icon-arrow-left.png);
  width: 0.4rem;
  height: 0.65rem;
}
.icon-password-active {
  background-image: url(../assets/img/icon-password-active.png);
  width: 0.36rem;
  height: 0.36rem;
}

.icon-phone {
  background-image: url(../assets/img/icon-phone.png);
  width: 0.36rem;
  height: 0.36rem;
}

.icon-phone-active {
  background-image: url(../assets/img/icon-phone-active.png);
  width: 0.36rem;
  height: 0.36rem;
}
.form-tip {
  height: 1.15rem;
  text-align: center;
  color: #ccc;
  line-height: 1.3;
  font-size: 0.2rem;
  display: -webkit-box;
  display: -moz-box;
  -webkit-box-align: center;
  -moz-box-align: center;
  -webkit-box-pack: center;
  -moz-box-pack: center;
}
.input-item {
  width: 5.25rem;
  height: 0.78rem;
  border-radius: 0.08rem;
  background: #484848;
  position: relative; // line-height: 0.78rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 0;
  & + .input-item {
    margin-top: 0.32rem;
  }
  &:after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
  .title {
    position: absolute;
    width: 1.3rem;
    height: 100%;
    left: 0;
    top: 0;
    font-size: 0.26rem; // .box();
    // .box-align(center);
    // .box-pack(end);
    text-align: right;
    line-height: 0.78rem;

    // > span {
    //     .xyCenter();
    //     line-height: 1;
    //     width: 100%;
    // }
  }
  .input-content {
    // padding-top: 0.02rem;
    height: 0.37rem;
    line-height: 0.37rem;
    vertical-align: middle;
    width: 3.6rem;
    font-size: 0.22rem;
    background: none;
    padding-left: 1.4rem;
    border-radius: 0;
    border-left: 0.05rem solid transparent;
    &:focus {
      // border-color: @orange;
    }
    &:-webkit-input-placeholder {
      color: #7f7f7f;
    }
  }
  .other {
    position: absolute;
    width: 1.5rem;
    height: 100%;
    right: 0;
    top: 0;
    font-size: 0;
    > * {
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
    }
    .get-code {
      // .box-center();
      // box-sizing: content-box;
      width: 1.34rem;
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      border-radius: 0.08rem;
      font-size: 0.2rem;
      border: 1px solid #ff9725;
      border-radius: 0.08rem;
      font-size: 0.2rem;
      color: #ff9725;

      &.disabled {
        border-color: #8a8988;
        color: #8a8988;
      }
    }
  }
}
.submit-area {
  margin: 0.4rem 0;
  text-align: center;
  .submit-btn {
    // display: inline-block;
    margin: auto;
    width: 2.4rem;
    height: 0.7rem;
    border-radius: 0.08rem;
    color: #fff;
    position: relative;
    line-height: 0.7rem;
    background: #ff9725;

    span {
      // .xyCenter();
    }
  }
}
</style>
