// 为了减少构建后vendor文件过大，已经在index.html中通过CDN引入方式把vue引入
// import Vue from 'vue'
// import Router from 'vue-router'
// import Index from '@/pages/Index'
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      // component: Index
      component: (resolve) => require(['@/pages/Index'], resolve)
    }
  ]
})
