import FN from "../common/fn.js"
let GD = window.GLOBAL_DATA

let showMsg = window.GLOBAL_API.showMsg

// 各类事件是否可以正常触发，用来劫持短时间点击时重复提交
let actionStatus = {
  "login-account": true,
  "login-phone": true,
  "register-account": true,
  "register-phone": true,
  "get-verify-code": true,
  "modify-password-old": true,
  "bind-phone": true,
  "un-bind-phone": true
}
// FN.log(">>>>", FN.getSession("FUSE_USER_INFO"))
function loginSuccessCallback(res, input) {
  // TODO bind res
  window.GLOBAL_API.hidePopbox()

  if (FN.getSession("SDK_INIT_INFO").login_notice.title) {
    window.GLOBAL_API.showPopbox({ type: "notice", id: 1 })
  } else {
    // 没有公告时才提示这句， 避免广告和提示信息重叠
    showMsg("登录成功")
  }
  window.FUSESDK.login({
    // TODO 没有传 0
    user_id: res.data.old_id, //从客户端获取的用户id,方便排查问题。比如步步高
    phone: res.data.phone, //用户电话号码
    is_bind_phone: res.data.phone ? 1 : 0, //是否绑定手机号码  1 是  0 不是
    is_realname: res.data.real_name_status, //是否实名    1 是  0 不是
    data: JSON.stringify({
      uid: res.data.old_id,
      time: res.data.timestamp,
      sign: res.data.sign
    }),
    ext: JSON.stringify(window.__ext__ || {})
  })
    .then(res2 => {
      if (res2.code == 0) {
        // 保存用户信息

        FN.saveSession("FUSE_USER_INFO", res2.data)
       }

        if (window.SDKDATA.loginWay) {
            window.SDKDATA.login.callback(res)
        } else {
            window.SDKDATA.flymeChangeAccount.callback(res)
        }
    })
    .catch(e => {
      // FN.log("loginError:", e)
		console.log("loginError:", e)
    })

  // 强制实名
  if (res.data.login_real_name_cfg == 1) {
    window.GLOBAL_API.showPopbox({ type: "verify", id: 2 })
  } else if (res.data.login_real_name_cfg == 2) {
    window.GLOBAL_API.showPopbox({ type: "verify", id: 1 })
  }
  // 展示侧边栏信息
  window.GLOBAL_API.showFloatBall()
  // 初始化侧边栏
  window.GLOBAL_API.initSlideBar()

  // ！！！ 保存登录记录
  let loginRecord = Array.isArray(FN.getLocal("LOGIN_RECORD")) ? FN.getLocal("LOGIN_RECORD") : []

  let newRecord = {
    account: input.account, // 用于展示的帐号名， 帐号登录时 account == name， 手机登录时 account == phone
    name: res.data.name, // 实际登录时都是使用 name 和 password
    password: res.data.password
  }
  // 如有重复数据就删除，重新添加到队首
  loginRecord.forEach((item, index) => {
    if (item.name == newRecord.name) {
      // 使用name判断才能确保唯一性
      loginRecord.splice(index, 1)
    }
  })

  loginRecord.unshift(newRecord)
  // 最多保存5条数据
  loginRecord = loginRecord.slice(0, 5)
  FN.saveLocal("LOGIN_RECORD", loginRecord)
}


window.GLOBAL_API.submit = (action, target) => {
  // 提交参数
  let data = {}

  // 拦截未勾选3K网络协议的
  let readProtocol = document.querySelector(".popbox-form .read-protocol")
  if (readProtocol && !readProtocol.classList.contains("active")) {
    showMsg("请同意go玩网络服务协议")
    return
  }
  if (action) {
    if (!actionStatus[action]) {
      return
    }
    switch (action) {
      // 帐号登录
      case "login-account":
        data = {
          mode: 0,
          account: GD.popboxInfo.account,
          password: GD.popboxInfo.password
        }
        if (data.account == "") {
          showMsg("账号不能为空，请填写正确的账号")
          break
        } else if (data.password == "") {
          showMsg("密码不能为空，请输入正确的密码")
          break
        } else if (data.password.length < 6 || data.password.length > 20) {
          showMsg("密码长度为6-20位字母或数字，请输入正确的密码")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.login(data).then(res => {
          if (res.code == 0) {
            FN.saveSession("USER_INFO", res.data)
            loginSuccessCallback(res, data)
          }

          actionStatus[action] = true
        })
        break
      // 手机登录
      case "login-phone":
        data = {
          mode: 1,
          account: GD.popboxInfo.phone,
          code: GD.popboxInfo.verify_code,
          code_sign: GD.popboxInfo.verify_sign,
          code_timeout: GD.popboxInfo.verify_timeout
        }

        if (data.account == "") {
          showMsg("手机号不能为空，请输入正确的手机号码")
          break
        } else if (!FN.isPhoneNum(data.account)) {
          showMsg("手机号码格式错误，请输入正确的手机号码")
          break
        } else if (data.code == "") {
          showMsg("验证码不能为空，请获取验证码后输入")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.login(data).then(res => {
          if (res.code == 0) {
            FN.saveSession("USER_INFO", res.data)
            loginSuccessCallback(res, data)
          }

          actionStatus[action] = true
        })
        break

      // 帐号注册
      case "register-account":
        data = {
          mode: 0,
          account: GD.popboxInfo.account,
          password: GD.popboxInfo.password
        }
        if (data.account == "") {
          showMsg("账号不能为空，请输入5-20位字母或数字")
          break
        } else if (data.account.length < 5 || data.account.length > 20) {
          showMsg("账号长度错误，请输入5-20位字母或数字")
          break
        } else if (data.password == "") {
          showMsg("密码不能为空，请输入6-20位字母或数字")
          break
        } else if (data.password.length < 6 || data.password.length > 20) {
          showMsg("密码长度错误，请输入6-20位字母或数字")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.register(data).then(res => {
          if (res.code == 0) {
            showMsg("注册成功")
            // window.GLOBAL_API.showPopbox({
            //     type: "form",
            //     id: 1
            // });

            setTimeout(() => {
              window.GLOBAL_API.submit("login-account")
            }, 1000)
          }

          actionStatus[action] = true
        })
        break

      // 手机注册
      case "register-phone":
        data = {
          mode: 1,
          account: GD.popboxInfo.phone,
          code: GD.popboxInfo.verify_code,
          code_sign: GD.popboxInfo.verify_sign,
          code_timeout: GD.popboxInfo.verify_timeout
        }
        if (data.account == "") {
          showMsg("手机号不能为空，请输入正确的手机号码")
          break
        } else if (!FN.isPhoneNum(data.account)) {
          showMsg("手机号码格式错误，请输入正确的手机号码")
          break
        } else if (data.code == "") {
          showMsg("验证码不能为空，请获取验证码后输入")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.register(data).then(res => {
          if (res.code == 0) {
            showMsg("注册成功")

            setTimeout(() => {
              window.GLOBAL_API.submit("login-phone")
            }, 1000)
          }

          actionStatus[action] = true
        })
        break

      // 获取验证码
      case "get-verify-code":
        data = {
          user_id: FN.getSession("USER_INFO").user_id,
          // 如果是侧栏会默认填写手机
          phone: GD.status.showType == "slideBar"?(FN.getSession("USER_INFO").phone || GD.slideBarInfo.phone) : GD.popboxInfo.phone
        }

        if (data.phone == "") {
          showMsg("手机号不能为空，请输入正确的手机号码")
          break
        } else if (!FN.isPhoneNum(data.phone)) {
          showMsg("手机号码格式错误，请输入正确的手机号码")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.sendAuthCode(data).then(res => {
          if (res.code == 0) {
            // 保存签名
            if (GD.status.showType == "slideBar") {
              GD.slideBarInfo.verify_sign = res.data.code_sign
              GD.slideBarInfo.verify_timeout = res.data.timeout
            } else {
              GD.popboxInfo.verify_sign = res.data.code_sign
              GD.popboxInfo.verify_timeout = res.data.timeout
            }

            let temp = target.innerHTML
            let count = 60
            target.classList.add("disabled")
            // 移除发送短信事件
            let clickEvent = target.getAttribute("onclick")
            target.removeAttribute("onclick")

            let intervalId = setInterval(() => {
              target.innerHTML = `等待${count}s`
              count--
              if (count < 0) {
                target.innerHTML = temp
                target.classList.remove("disabled")
                target.setAttribute("onclick", clickEvent)
                clearInterval(intervalId)
              }
            }, 1000)
          }
          actionStatus[action] = true
        })
        break

      // 修改密码（旧密码）
      case "modify-password-old":
        data = {
          mode: 0,
          user_id: FN.getSession("USER_INFO").user_id,
          old_password: FN.getSession("USER_INFO").password,
          new_password: GD.slideBarInfo.new_password
        }

        if (data.new_password == "") {
          showMsg("密码不能为空，请输入6-20位字母或数字")
          break
        } else if (data.new_password.length < 6 || data.new_password.length > 20) {
          showMsg("密码长度错误，请输入6-20位字母或数字")
          break
        }

        actionStatus[action] = false
        window.gw8SDK.updatePassword(data).then(res => {
          if (res.code == 0) {
            showMsg("修改密码成功")
            let USER_INFO = FN.getSession("USER_INFO")
            USER_INFO.password = GD.slideBarInfo.new_password
            FN.saveSession("USER_INFO", USER_INFO)
            window.GLOBAL_API.hideSlideBar()
            window.GLOBAL_API.initSlideBar()
          }
          actionStatus[action] = true
        })
        break

      // 修改密码（手机验证码, 暂时保留）
      // case 'modify-password-phone':
      //     window.gw8SDK.updatePassword({
      //         modify_type: 1,
      //         user_id: GD.userInfo.user_id,
      //         verify_code: GD.slideBarInfo.verify_code,
      //         verify_sign: GD.slideBarInfo.verify_sign,
      //     }).then(res => {
      //         PublishCb('register')
      //     })
      //     break
      case "bind-phone":
        data = {
          user_id: FN.getSession("USER_INFO").user_id,
          phone: GD.status.showType == "slideBar" ? GD.slideBarInfo.phone : GD.popboxInfo.phone,
          code:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_code
              : GD.popboxInfo.verify_code,
          code_sign:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_sign
              : GD.popboxInfo.verify_sign,
          code_timeout:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_timeout
              : GD.popboxInfo.verify_timeout
        }
        if (data.phone == "") {
          showMsg("手机号不能为空，请输入正确的手机号码")
          break
        } else if (!FN.isPhoneNum(data.phone)) {
          showMsg("手机号码格式错误，请输入正确的手机号码")
          break
        } else if (data.code == "") {
          showMsg("验证码不能为空，请获取验证码后输入")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.bindPhone(data).then(res => {
          if (res.code == 0) {
            showMsg("绑定手机成功")
            // PublishCb('bindPhone', res)

            // 更新侧边栏信息
            let userInfo = FN.getSession("USER_INFO")
            userInfo.phone = data.phone
            FN.saveSession("USER_INFO", userInfo)
            window.GLOBAL_API.hideSlideBar()
            window.GLOBAL_API.initSlideBar()
          }
          actionStatus[action] = true
        })
        break

      case "un-bind-phone":
        data = {
          user_id: FN.getSession("USER_INFO").user_id,
          phone: FN.getSession("USER_INFO").phone || "",
          code:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_code
              : GD.popboxInfo.verify_code,
          code_sign:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_sign
              : GD.popboxInfo.verify_sign,
          code_timeout:
            GD.status.showType == "slideBar"
              ? GD.slideBarInfo.verify_timeout
              : GD.popboxInfo.verify_timeout
        }
        if (data.code == "") {
          showMsg("验证码不能为空，请获取验证码后输入")
          break
        }
        actionStatus[action] = false
        window.gw8SDK.unBindPhone(data).then(res => {
          if (res.code == 0) {
            showMsg("解绑手机成功")

            // 更新侧边栏信息
            let userInfo = FN.getSession("USER_INFO")
            userInfo.phone = ""
            FN.saveSession("USER_INFO", userInfo)
            window.GLOBAL_API.hideSlideBar()
            window.GLOBAL_API.initSlideBar()
          }
          actionStatus[action] = true
        })
        break
    }
  }
}
