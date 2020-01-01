import FN from "../common/fn"

let getContent = ({ sdkInitInfo, userInfo, noticeInfo, noticeType, loginRecordHtml }) => ({
  form: [
    `
        <!-- 1. 登录 -->
        <div class="popbox-form-login popbox-content">
            <div class="logo">
                <div class="left">
                    <i class="icon-logo"></i>
                </div>
                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'5'})">
                    <i class="icon icon-phone-s"></i>
                    <span class="text">手机验证登录</span>
                </div>
            </div>

            <div class="form padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" ${
                      userInfo.name ? `value=${userInfo.name}` : `placeholder="请输入go玩游戏账号"`
                    } >
                    <div class="other">
                        <i class="icon-arrow-down show-record"></i>
                    </div>
                    <div class="login-record-list">${loginRecordHtml}</div>
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="password" name="password" class="input-content" ${
                      userInfo.password
                        ? `value=${userInfo.password}`
                        : `placeholder="请输入您的密码"`
                    }>
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <a href="javascript:FN.showTip('${sdkInitInfo.forget_url}');" target="_blank" target="_blank" class="text">忘记密码/账号？</a>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small"  onclick="window.GLOBAL_API.showPopbox({type:'form',id:'11'})"><span>快速注册</span></div>
                <div class="btn btn-small btn-active btn-submit" onclick="window.GLOBAL_API.submit('login-account',this)"><span>立即登录</span></div>
            </div>
        </div>
        `,
    `
        <!-- 2. 登录（无logo） -->
        <div class="popbox-form-login-nologo popbox-content">
            <div class="form padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" placeholder="请输入go玩游戏账号">
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="password" name="password" class="input-content" placeholder="请输入您的密码">
                    <div class="other">
                        <a href="${sdkInitInfo.forget_url ||
                          "javascript"}" target="_blank" class="text">忘记密码</a>
                    </div>
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                      <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'6'})">
                    <i class="icon icon-phone-s"></i>
                    <span class="text">手机验证登录</span>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'10'})"><span>快速注册</span></div>
                <div class="btn btn-small btn-active" onclick="window.GLOBAL_API.submit('login-account',this)"><span>立即登录</span></div>
            </div>
        </div>
        `,

    `
        <!-- 3. 实名认证 -->
        <div class="popbox-form-verify popbox-content">
            <div class="pub-title">
                <i class="icon-square"></i>
                <span class="text">实名认证</span>
                <i class="icon-square"></i>
            </div>

            <div class="form">
                <div class="input-item">
                    <div class="title">真实姓名:</div>
                    <input type="text" name="real_name" class="input-content" placeholder="请输入真实姓名">
                </div>
                <div class="input-item">
                    <div class="title">身份证号:</div>
                    <input type="text" name="sf_id" class="input-content" placeholder="请输入真实身份证号码">
                    <div class="other">
                        <span class="text">忘记密码</span>
                    </div>
                </div>
            </div>

            <div class="tip">根据相关法律请完成实名认证</div>

            <div class="btns">
                <div class="btn btn-big btn-active"  onclick="window.GLOBAL_API.submit('verify-identity',this)"><span>保存</span></div>
            </div>

            <div class="bottom-logo">
                <i class="icon-logo"></i>
            </div>
        </div>
        `,

    `
        <!-- 4. 实名认证（无logo） -->
        <div class="popbox-form-verify popbox-content">
            <div class="pub-title">
                <i class="icon-square"></i>
                <span class="text">实名认证</span>
                <i class="icon-square"></i>
            </div>

            <div class="form">
                <div class="input-item">
                    <div class="title">真实姓名:</div>
                    <input type="text" name="real_name" class="input-content" placeholder="请输入真实姓名">
                </div>
                <div class="input-item">
                    <div class="title">身份证号:</div>
                    <input type="text" name="sf_id" class="input-content" placeholder="请输入真实身份证号码">
                    <div class="other">
                        <span class="text">忘记密码</span>
                    </div>
                </div>
            </div>

            <div class="tip">根据相关法律请完成实名认证</div>

            <div class="btns">
                <div class="btn btn-big btn-active"  onclick="window.GLOBAL_API.submit('verify-identity',this)"><span>保存</span></div>
            </div>
        </div>
        `,

    `
        <!-- 5. 手机登录 -->
        <div class="popbox-form-login-phone popbox-content">
            <div class="logo">
                <div class="left">
                    <i class="icon-logo"></i>
                </div>
                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'11'})">
                    <i class="icon icon-register"></i>
                    <span class="text">帐号注册</span>
                </div>
            </div>


            <div class="form padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <a href="javascript:FN.showTip('${sdkInitInfo.forget_url}');" target="_blank" target="_blank" class="text">忘记密码/账号？</a>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'1'})"><span>帐号登录</span></div>
                <div class="btn btn-small btn-active"   onclick="window.GLOBAL_API.submit('login-phone',this)"><span>立即登录</span></div>
            </div>
        </div>

        `,
    `
        <!-- 6. 手机登录（无logo） -->
        <div class="popbox-form-login-phone-nologo popbox-content">
            <div class="form padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'10'})">
                    <i class="icon icon-register"></i>
                    <span class="text">帐号注册</span>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'2'})"><span>帐号登录</span></div>
                <div class="btn btn-small btn-active" onclick="window.GLOBAL_API.submit('login-phone',this)"><span>立即登录</span></div>
            </div>
        </div>
        `,
    `
        <!-- 7. 手机注册 -->
        <div class="popbox-form-register-onlyphone popbox-content ">
            <div class="logo">
                <div class="left">
                    <i class="icon-logo"></i>
                </div>
                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'9'})">
                    <i class="icon icon-phone-s"></i>
                    <span class="text">帐号注册</span>
                </div>
            </div>

            <div class="form  padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>
            

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <span class="read-protocol active">
                        <i class="icon icon-true"></i>
                        <i class="icon icon-false"></i>
                    </span>
                    <a href="${sdkInitInfo.xieyi_url ||
                      "javascript"}" target="_blank" class="text">>go玩网络服务协议</a>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small"  onclick="window.GLOBAL_API.showPopbox({type:'form',id:'1'})"><span>我有帐号</span></div>
                <div class="btn btn-small btn-active" onclick="window.GLOBAL_API.submit('register-phone',this)"><span>立即注册</span></div>
            </div>
        </div>
        `,
    `
        <!-- 8. 手机注册（无logo） -->
        <div class="popbox-form-register-onlyphone-nologo popbox-content ">

            <div class="form  padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <span class="read-protocol active">
                        <i class="icon icon-true"></i>
                        <i class="icon icon-false"></i>
                    </span>
                    <a href="${sdkInitInfo.xieyi_url ||
                      "javascript"}" target="_blank" class="text">go玩网络服务协议</a>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'2'})"><span>我有帐号</span></div>
                <div class="btn btn-small btn-active" onclick="window.GLOBAL_API.submit('register-phone',this)"><span>立即注册</span></div>

            </div>
        </div>
        `,
    `
        <!-- 9. 帐号注册（包含手机） -->
        <div class="popbox-form-register popbox-content">
            <div class="logo">
                <div class="left">
                    <i class="icon-logo"></i>
                </div>
                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'7'})">
                    <i class="icon icon-phone-s"></i>
                    <span class="text">手机注册</span>
                </div>
            </div>

            <div class="form  padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" placeholder="5-20位的字母和数字">
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="text" name="password" class="input-content" placeholder="6-20位的字母和数字">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <span class="read-protocol active">
                        <i class="icon icon-true"></i>
                        <i class="icon icon-false"></i>
                    </span>
                    <a href="${sdkInitInfo.xieyi_url ||
                      "javascript"}" target="_blank" class="text">go玩网络服务协议</a>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-small" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'1'})"><span>我有帐号</span></div>
                <div class="btn btn-small btn-active" onclick="window.GLOBAL_API.submit('register-account',this)"><span>一键注册</span></div>
            </div>
        </div>

        `,
    `
        <!-- 10. 帐号注册（包含手机无logo） -->
        <div class="popbox-form-register-nologo popbox-content">
            <div class="form  padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" placeholder="5-20位的字母和数字">
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="text" name="password" class="input-content" placeholder="6-20位的字母和数字">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'8'})">
                    <i class="icon icon-phone-s"></i>
                    <span class="text">手机注册</span>
                </div>
            </div>

            <div class="btns">
                <div class="btn btn-big btn-active" onclick="window.GLOBAL_API.submit('register-account',this)"><span>一键注册</span></div>
            </div>

            <div class="btns" style="margin-top: 0.2rem"  onclick="window.GLOBAL_API.showPopbox({type:'form',id:'2'})">
                <div class="btn btn-big"><span>我有帐号</span></div>
            </div>
        </div>
        `,
    `
        <!-- 11. 帐号注册（一键注册） -->
        <div class="popbox-form-register-merge popbox-content show use-account">
            <div class="logo">
                <div class="left">
                    <i class="icon-logo"></i>
                </div>
            </div>

            <div class="tabs">
                <div class="tab">帐号注册</div>
                <div class="tab">手机号注册</div>
            </div>


            <div class="form form-account padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" placeholder="5-20位的字母和数字">
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="text" name="password" class="input-content" placeholder="6-20位的字母和数字">
                </div>
            </div>

            <div class="form form-phone padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

                <div class="right">
                    <span class="read-protocol active">
                        <i class="icon icon-true"></i>
                        <i class="icon icon-false"></i>
                    </span>
                    <a href="${sdkInitInfo.xieyi_url ||
                      "javascript"}" target="_blank" class="text">go玩网络服务协议</a>
                </div>
            </div>

            <div class="btns btns-account">
                <div class="btn btn-big btn-active"  onclick="window.GLOBAL_API.submit('register-account',this)"><span>一键注册</span></div>
            </div>
            <div class="btns btns-phone">
                <div class="btn btn-big btn-active" onclick="window.GLOBAL_API.submit('register-phone',this)"><span>一键注册</span></div>
            </div>

            <div class="btns" style="margin-top: 0.2rem;display: block;"  onclick="window.GLOBAL_API.showPopbox({type:'form',id:'1'})">
                <div class="btn btn-big"><span>我有帐号</span></div>
            </div>
        </div>

        `,
    `
        <!-- 12. 帐号注册（一键注册无logo） -->
        <div class="popbox-form-register-merge-nologo popbox-content use-account">
            <div class="tabs">
                <div class="tab">帐号注册</div>
                <div class="tab">手机号注册</div>
            </div>

            <div class="form form-account padding2">
                <div class="input-item">
                    <div class="title">帐号:</div>
                    <input type="text" name="account" class="input-content" placeholder="5-20位的字母和数字">
                </div>
                <div class="input-item">
                    <div class="title">密码:</div>
                    <input type="text" name="password" class="input-content" placeholder="6-20位的字母和数字">
                </div>
            </div>

            <div class="form form-phone padding3">
                <div class="input-item">
                    <div class="title">手机号:</div>
                    <input type="text" name="phone" class="input-content" placeholder="请填写手机号">
                    <div class="other">
                        <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">获取验证码</div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="title">验证码:</div>
                    <input type="text" name="verify_code" name="verify_code" class="input-content" placeholder="请输入验证码">
                </div>
            </div>

            <div class="help">
                <div class="left">
                    <i class="icon icon-help"></i>
                    <a href="javascript:FN.showTip('${sdkInitInfo.help_url}');" target="_blank" class="text">帮助</a>
                </div>

            </div>

            <div class="btns btns-account">
                <div class="btn btn-big btn-active" onclick="window.GLOBAL_API.submit('register-account',this)"><span>一键注册</span></div>
            </div>
            <div class="btns btns-phone">
                <div class="btn btn-big btn-active" onclick="window.GLOBAL_API.submit('register-phone',this)"><span>一键注册</span></div>
            </div>

            <div class="btns" style="margin-top: 0.2rem"  onclick="window.GLOBAL_API.showPopbox({type:'form',id:'2'})">
                <div class="btn btn-big"><span>我有帐号</span></div>
            </div>
        </div>
        `
  ],

  verify: [
    `
        <!-- 1. 实名认证1  -->
        <div class="popbox-verify1 popbox-content show">
            <div class="tip">
                根据国家相关法律法规，需对账号<br> 完成实名认证，请点击下方按钮
                <br> 立刻完成实名
            </div>

            <div class="btns">
                <div class="btn btn-small popbox-close"><span class="popbox-close">暂不实名</span></div>
                <a   href="${
                  userInfo.real_name_url
                    ? userInfo.real_name_url +
                      (userInfo.real_name_url.indexOf("?") != -1 ? "&" : "?") +
                      "h5sdk_url=" +
                      encodeURIComponent(window.location.href)
                    : "javascript:;"
                }" 
                    class="btn btn-small active"><span>立刻实名</span></a>
            </div>
        </div>
        `,
    `
        <!-- 2. 实名认证2  -->
        <div class="popbox-verify2 popbox-content">
            <div class="tip">
                根据国家相关法律法规，需对账号<br> 完成实名认证，请点击下方按钮
                <br> 立刻完成实名
            </div>

            <div class="btns">
            <a   href="${
              userInfo.real_name_url
                ? userInfo.real_name_url +
                  (userInfo.real_name_url.indexOf("?") != -1 ? "&" : "?") +
                  "h5sdk_url=" +
                  encodeURIComponent(window.location.href)
                : "javascript:;"
            }" 
                         class="btn btn-big active"><span>立刻实名认证</span></a>
            </div>
        </div>
        `
  ],

  notice: [
    `
        <!-- 1.  文字公告 -->
        <div class="popbox-notice-text popbox-content">
            <div class="text-content">
                <div class="pub-title">${noticeInfo.title || ""}</div>
                <div class="tip">
                    ${noticeInfo.content || ""}
                </div>

                <div class="btns">
                    ${
                      noticeType == "detail"
                        ? `     
                    <a href="${
                      noticeInfo.url
                    }" class="btn btn-big popbox-close active btn-view-detail">
                        <span class="popbox-close">查看详情</span>
                    </a>                   
                    `
                        : `        
                    <a href="javascript:;" class="btn btn-big popbox-close btn-i-know active">
                        <span class="popbox-close">我知道了</span>
                    </a>
                    `
                    }
                </div>
            </div>

            ${
              noticeType == "detail"
                ? `     
                <div class="popbox-close-wrap">
                    <i class="icon-close popbox-close"></i>
                </div>
            `
                : ``
            }
        </div>
        `,

    `
        <!-- 2. 图片公告 -->
        <div class="popbox-notice-img popbox-content">
            <div class="text-img">
                <a href="${noticeInfo.url ||
                  "javascript:;"}" style="background-image: url(${noticeInfo.image || ""})">
                   
                </a>
            </div>

            <div class="">
                <i class="icon-close popbox-close"></i>
            </div>
        </div>
        `
  ]
})

export default ({ type, id }) => {
  let sdkInitInfo = FN.getSession("SDK_INIT_INFO")
  let userInfo = FN.getSession("USER_INFO")
  // let gw8 = FN.getLocal('gw8')

  let isLogin = typeof FN.getSession("USER_INFO").old_id != "undefined"

  let noticeInfo = isLogin ? sdkInitInfo.login_notice : sdkInitInfo.init_notice

  // 图片 || 查看详情 || 我知道了
  let noticeType = noticeInfo.image ? "image" : noticeInfo.url ? "detail" : "iknow"

  let loginRecordHtml = ""
  if (type == "form" && (id == "1" || id == "2")) {
    let loginRecord = FN.getLocal("LOGIN_RECORD")
    if (loginRecord.length > 0) {
      loginRecordHtml += "<ul>"
      loginRecord.forEach(item => {
        loginRecordHtml += `
                <li>
                    <div class="left" onclick="window.GLOBAL_API.loginByRecord('${
                      item.account
                    }')">   
                        <span>${item.account}</span>
                    </div>
                    <div class="right" onclick="window.GLOBAL_API.deleteRecord('${item.account}')"> 
                        <i class="icon-delete" data-account="${item.account}"></i>
                    </div>
                </li>
            `
      })
      loginRecordHtml += "</ul>"
    }
  }

  return getContent({ sdkInitInfo, userInfo, noticeInfo, noticeType, loginRecordHtml })[type][
    id - 1
  ]
}
