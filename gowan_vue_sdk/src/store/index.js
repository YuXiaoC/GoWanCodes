import Vue from 'vue'
import Vuex from 'vuex'
import GowanComponent from './modules/GowanComponent' // modules/user.js中包含了:state/mutation/action 这三大特性
import getters from './getters'

Vue.use(Vuex)

// 实例化 store
const store = new Vuex.Store({
  // strict: true,
  modules: {
    GowanComponent
  },
  getters
})

export default store
