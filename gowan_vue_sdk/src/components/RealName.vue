<template>
  <div class="popbox show" style="display:block">
    <div class="popbox-overlay overlay" @click="closeRealName()">
      <div class="real-name popbox-container" id="real-name" @click.stop>
            <div class="real-name-head">
            <p> 根据国家相关法律法规，需对账号完成实名认证</p>
            </div>
            <div class="gowan-logo-from">
              <div class="input-item">
                <div class="input-title real-name">姓名:</div>
                  <input type="text" name="account" class="input-content real-input" v-model="idCard.real_mame" placeholder="请输入真实姓名">
              </div>
              <div class="input-item">
                <div class="input-title real-number">身份证号码:</div>
                <input type="text" name="idcode" class="input-content real-input" v-model="idCard.number_id" placeholder="请输入身份证号码">
              </div>
            </div>
            <div class="btn" @click="hadleRealName()">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
import FN from '../utility/fn.js'
export default {
  data () {
    return {
      idCard: {
        real_mame: '',
        number_id: ''
      },
      loading: false,
      flag: true
    }
  },
  methods: {
    hadleRealName () {
      let data = this.idCard
      this.flag = true
      // 验证表单合法性
      this.verify('name', data.real_mame)
      this.verify('number', data.number_id)
      if (this.flag) {
        window.zjgwSDK.realNameAuth(data).then(res => {
          if (res.code === 0) {
            FN.showMsg('实名认证成功')
            // 隐藏遮罩层
            FN.hide()
            this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
          } else {
            FN.showMsg(res.msg)
          }
        })
      }
    },
    verify (type, value) {
      if (type === 'name') {
        let regName = /^[\u4e00-\u9fa5]{2,4}$/
        if (!regName.test(value)) {
          FN.showMsg('姓名格式错误')
          this.flag = false
        }
      } else if (type === 'number') {
        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!regIdNo.test(value)) {
          FN.showMsg('身份证号填写有误')
          this.flag = false
        }
      }
    },
    closeRealName () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NAME', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.real-name-head{
  width:100%;
  height: .35rem;
  text-align: center;
  margin-bottom:.2rem;
}
.real-number{
  width:1.5rem;
}
.real-input{
  padding-left:1.7rem;
}

.btn{
  width:100%;
  position: relative;
  display: block;
  border-radius: 0.08rem;
  font-size: 0.28rem;
  background:#ff9725;
  color:#fff;
  height: 0.64rem;
  line-height: 0.64rem;
  text-align: center;
}
</style>
