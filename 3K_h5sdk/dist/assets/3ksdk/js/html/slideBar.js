export default userInfo => {
  return `
        <div class="slide-bar-content">
        <div class="slide-bar-content-wrap">
            <div class="header-info">
                <div class="img-info">
                    <i class="icon-head-image"></i>
                </div>
                <div class="text-info">
                    <div class="account">
                        <span class="name">go玩帐号:</span>
                        <span class="text">${userInfo.name || ""}</span>
                    </div>
                    <div class="bind-id">
                        <span class="name">ID:</span>
                        <span class="text">${userInfo.old_id || ""}</span>
                    </div>
                </div>
            </div>

            <ul class="options">
                <li class="option-item">
                    <div class="option-title">
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
                                <input type="text" class="input-content" value="${userInfo.user_id ||
                                  ""}" readonly disabled>

                            </div>
                            <div class="input-item">
                                <div class="title">旧的密码:</div>
                                <input type="text" name="old_password" value="${userInfo.password ||
                                  ""}" class="input-content"  readonly disabled>

                            </div>
                            <div class="input-item">
                                <div class="title">新的密码:</div>
                                <input type="text" name="new_password" class="input-content">
                            </div>
                            <div class="submit-area">
                                <div class="submit-btn" onclick="window.GLOBAL_API.submit('modify-password-old',this)">
                                    <span>确认提交</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                ${
                  userInfo.phone
                    ? `
                <li class="option-item">
                    <div class="option-title">
                        <div class="icon">
                            <i class="icon-phone"></i>
                            <i class="icon-phone-active"></i>
                        </div>
                        <div class="name"><span>解绑手机</span></div>
                        <i class="icon-arrow-right"></i>
                    </div>
                    <div class="option-content">
                        <div class="form padding3">
                            <div class="form-tip">解绑手机可能会降低账户安全等级<br/>请谨慎操作
                            </div>

                            <div class="input-item">
                                <div class="title">手机号:</div>
                                <input type="number" name="phone" value="${
                                  userInfo.phone
                                }" class="input-content" disabled readonly>
                                <div class="other">
                                    <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">
                                        获取验证码
                                    </div>
                                </div>
                            </div>
                            <div class="input-item">
                                <div class="title">验证码:</div>
                                <input type="text" name="verify_code" placeholder="请输入验证码" class="input-content">
                            </div>
                            <div class="submit-area">
                                <div class="submit-btn" onclick="window.GLOBAL_API.submit('un-bind-phone',this)">
                                    <span>确认提交</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `
                    : `
                <li class="option-item">
                    <div class="option-title">
                        <div class="icon">
                            <i class="icon-phone"></i>
                            <i class="icon-phone-active"></i>
                        </div>
                        <div class="name"><span>绑定手机</span></div>
                        <i class="icon-arrow-right"></i>
                    </div>
                    <div class="option-content">
                        <div class="form padding3">
                            <div class="form-tip">绑定手机可提高账户安全等级<br/>请输入手机号码完成绑定
                            </div>

                            <div class="input-item">
                                <div class="title">手机号:</div>
                                <input type="number" name="phone" placeholder="请填写手机号码" class="input-content">
                                <div class="other">
                                    <div class="get-code" onclick="window.GLOBAL_API.submit('get-verify-code',this)">
                                        获取验证码
                                    </div>
                                </div>
                            </div>
                            <div class="input-item">
                                <div class="title">验证码:</div>
                                <input type="text" name="verify_code" placeholder="请输入验证码" class="input-content">
                            </div>
                            <div class="submit-area">
                                <div class="submit-btn" onclick="window.GLOBAL_API.submit('bind-phone',this)">
                                    <span>确认提交</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `
                }

               
                <li class="option-item">
                    <a  href="${
                      userInfo.real_name_url
                        ? userInfo.real_name_url +
                          (userInfo.real_name_url.indexOf("?") != -1 ? "&" : "?") +
                          "h5sdk_url=" +
                          encodeURIComponent(window.location.href)
                        : "javascript:;"
                    }" 
                        class="option-title-empty">
                        <div class="icon">
                            <i class="icon-verify"></i>
                            <i class="icon-verify-active"></i>
                        </div>
                        <div class="name"><span>实名认证</span></div>
                        <i class="icon-arrow-right"></i>
                    </a>
                    
                </li>

            </ul>
            </div>
            <div class="change-account-wrap">
                <!-- <div class="change-account" onclick="window.GLOBAL_API.showPopbox({type:'form',id:'1',clean:true,close: true,changeAccountBySdk: true})"> -->
                <div class="change-account" onclick="window.GLOBAL_API.changeAccountBySdk()">
                    <i class="icon-switch"></i>
                    <span>切换帐号</span>
                </div>
            </div>
    </div>

    <div class="slide-bar-close">
        <i class="icon-arrow-left popbox-close"></i>
    </div>
        `
}
