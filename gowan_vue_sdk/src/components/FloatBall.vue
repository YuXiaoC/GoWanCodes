<template>
  <div id="float-ball" @click="showSlideBar()">
    <i class="icon-float-ball"></i>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  activated () {
    FN.log('startDrag1')
    this.startDrag1(document.getElementById('float-ball'), document.getElementById('float-ball')) // 开始拖动效果
  },
  methods: {
    startDrag1 (source, target) {
      const getCss = function (o, key) {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key]
      }
      const floatBallAutoAdjust = target => {
        let nowLeft = parseFloat(getCss(target, 'left'))
        let targetW = parseFloat(getCss(target, 'width'))

        target.classList = 'show'
        clearTimeout(window.floatBallTimeoutId)
        window.floatBallTimeoutId = setTimeout(() => {
          target.classList.add('transtion')
          if (nowLeft + targetW / 2 > window.innerWidth / 2) {
            target.style.left = window.innerWidth - targetW + 'px'
            target.classList.add('reverse')
          } else {
            target.style.left = 0
          }

          window.floatBallTimeoutId = setTimeout(() => {
            target.classList.add('fade')

            window.floatBallTimeoutId = setTimeout(() => {
              target.classList.add('sleep')
            }, 3000)
          }, 2000)
        }, 2000)
      }
      const startDrag = (source, target) => {
        // source触发拖拽节点， target移动节点
        source.addEventListener('touchstart', e => {
          FN.log('touchstart')
          startDrag.params.offsetX =
      (e.clientX || e.touches[0].clientX) - parseFloat(getCss(target, 'left'))
          startDrag.params.offsetY =
      (e.clientY || e.touches[0].clientY) - parseFloat(getCss(target, 'top'))
          startDrag.params.targetW = parseFloat(getCss(target, 'width'))
          startDrag.params.targetH = parseFloat(getCss(target, 'height'))
          startDrag.params.flag = true

          target.className = 'show'
          clearTimeout(window.floatBallTimeoutId)
        })
        source.addEventListener('click', e => {
          startDrag.params.flag = false
          floatBallAutoAdjust(target)
        })
        if (!startDrag.params.hasBindDocument) {
          startDrag.params.hasBindDocument = true
          document.body.addEventListener('touchend', e => {
            if (!startDrag.params.hasMove) return
            let nowLeft = parseFloat(target.style.left)
            let nowTop = parseFloat(target.style.top)
            if (nowLeft + startDrag.params.targetW > window.innerWidth) {
              target.style.left = window.innerWidth - startDrag.params.targetW + 'px'
            } else if (nowLeft < 0) target.style.left = 0
            if (nowTop + startDrag.params.targetH > window.innerHeight) {
              target.style.top = window.innerHeight - startDrag.params.targetW + 'px'
            } else if (nowTop < 0) {
              target.style.top = 0
            }
            setTimeout(() => {
              // alert(111)
              startDrag.params.flag = false
              startDrag.params.hasMove = false
            }, 100)

            floatBallAutoAdjust(target)
          })
          document.body.addEventListener('touchmove', e => {
            if (startDrag.params.flag) {
              clearTimeout(window.floatBallTimeoutId)
              target.className = 'show'

              startDrag.params.hasMove = true
              let nowX = e.clientX || e.touches[0].clientX
              let nowY = e.clientY || e.touches[0].clientY
              target.style.left = nowX - startDrag.params.offsetX + 'px'
              target.style.top = nowY - startDrag.params.offsetY + 'px'
            }
          })
        }
      }

      startDrag.params = {
        offsetX: 0, // 点击处与目标left偏差
        offsetY: 0,
        flag: false,
        hasMove: false,
        hasBindDocument: false
      }
      startDrag(source, target)
      document.getElementById('float-ball').addEventListener('click', () => {
        if (!startDrag.params.hasMove) {
          FN.log('111111111')
        }
      })
    },
    showSlideBar () {
      this.$store.dispatch('SET_GOWAN_COMPONENT_SLIDEBAR', 'SlideBar')
    }
  }
}
</script>
<style lang="scss" scoped>
#float-ball {
    position: absolute;
    width: .81rem;
    height: .81rem;
    top: 3rem;
    right: 0;
    &.sleep {
        .icon-float-ball {
            background-image: url(../assets/img/icon-float-ball-sleep.png);
        }
        &.reverse {
            .icon-float-ball {
                background-position: right;
                background-image: url(../assets/img/icon-float-ball-sleep-r.png);
            }
        }
    }
    &.transtion {
        transition: 0.5s ease;
    }
    &.fade {
      // opacity: 0.5 !important;
      /*因后来美术给到浮标设计图本身是半透明的，
      因此在此把透明样式去掉，后面根据需要重新加上即可*/

    }
}

.icon-float-ball {
    background-image: url(../assets/img/icon-float-ball.png);
    width: 0.8rem;
    height: 0.8rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left;

}
</style>
