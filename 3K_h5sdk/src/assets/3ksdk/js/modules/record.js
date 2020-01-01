import FN from '../common/fn.js'
let GD = window.GLOBAL_DATA


window.GLOBAL_API.loginByRecord = account => {
    let loginRecord = Array.isArray(FN.getLocal("LOGIN_RECORD")) ? FN.getLocal("LOGIN_RECORD") : []
  
    for (let i = 0; i < loginRecord.length; i++) {
      if (loginRecord[i].account == account) {
        GD.popboxInfo.account = loginRecord[i].name
        GD.popboxInfo.password = loginRecord[i].password
        window.GLOBAL_API.submit("login-account")
        break
      }
    }
  }
  
  window.GLOBAL_API.deleteRecord = account => {
    let loginRecord = Array.isArray(FN.getLocal("LOGIN_RECORD")) ? FN.getLocal("LOGIN_RECORD") : []
  
    for (let i = 0; i < loginRecord.length; i++) {
      if (loginRecord[i].account == account) {
        loginRecord.splice(i, 1)
        let loginRecordList = document.querySelector(".login-record-list")
  
        FN.saveLocal("LOGIN_RECORD", loginRecord)
        let loginRecordHtml = ""
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
                          <div class="right" onclick="window.GLOBAL_API.deleteRecord('${
                            item.account
                          }')">
                              <i class="icon-delete" data-account="${item.account}"></i>
                          </div>
                      </li>
                  `
          })
          loginRecordHtml += "</ul>"
        }
        loginRecordList.innerHTML = loginRecordHtml
  
        break
      }
    }
  }
  