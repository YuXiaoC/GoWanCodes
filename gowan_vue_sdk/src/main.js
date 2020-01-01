// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'babel-polyfill'
// import Es6Promise from 'es6-promise'
Vue.config.productionTip = false
// require('es6-promise').polyfill()
// Es6Promise.polyfill()

/* eslint-disable no-new */
/* global Vue */
new Vue({
  el: '#app',
  router,
  store,
  global,
  components: { App },
  template: '<App/>'
})
