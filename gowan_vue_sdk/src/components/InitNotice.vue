<template>
  <div class="init-notice">
    <!--文字公告-->
    <div class="font-notice" v-if="noticeInfo.content !==''">
      <div class="text-content">
        <div class="pub-title" v-text="noticeInfo.title"></div>
        <div class="tip" v-text="noticeInfo.content" :style="{'text-align':noticeInfo.align}"></div>
        <div class="btns">
          <a href="javascript:;" v-if="noticeInfo.url === ''" @click="closeNotice">我知道了</a>
          <a :href="noticeInfo.url" v-else>查看详情</a>
        </div>
      </div>
    </div>
    <!--图片公告-->
    <div class="img-notice" v-else>
      <a v-if="noticeInfo.url" :href="noticeInfo.url" class="img">
        <img :src="noticeInfo.image" alt="">
      </a>
      <a v-else href="javascript:;" class="img">
        <img :src="noticeInfo.image" alt="">
      </a>
      <div v-if="noticeInfo.type_id === 4" class="close" @click="closeNotice"></div>
    </div>
  </div>
</template>
<script>
import FN from '../utility/fn.js'
export default {
  data () {
    return {
      noticeInfo: ''
    }
  },
  mounted () {
    this.getInitNoticeInfo()
  },
  methods: {
    getInitNoticeInfo () {
      this.noticeInfo = FN.getSession('FUSE_INIT_INFO').init_notice
    },
    closeNotice () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_NOTICE', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.init-notice{
  width:100%;
  height:100%;
  position: fixed;
  z-index:601;
  background:rgba(245, 245, 245, 0.5);
  .font-notice{
    width:100%;
    height:100%;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
  }
}
.text-content{
  width: 5rem;
  padding:.2rem 0rem;
  background:#000;
  color:#fff;
  text-align: center;
  border-radius: .05rem;
  .pub-title{
    height: .8rem;
    line-height: .8rem;
  }
  .tip{
    height: 2.5rem;
    padding: 0 .2rem .2rem .2rem;
    overflow-y: scroll;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -webkit-overflow-scrolling: touch;
    margin-bottom: .2rem;
  }
  .btns{
    height:.8rem;
    line-height: .8rem;
    border-top: 1px solid #fff;
  }
  a{
    color:orange;
    text-align: center;
    text-decoration: none;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    display: block;
    margin-top: .1rem;
  }
}
.img-notice{
  position: relative;
    .close{
    width:.54rem;
    height: .54rem;
    background:url(../assets/img/icon-close.png);
    background-size:.54rem .54rem;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
