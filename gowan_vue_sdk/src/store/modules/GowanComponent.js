const GowanComponent = {
  state: {
    gowanComponentName: '',
    floatBall: '',
    notice: '',
    rechargeAges: '',
    slideBar: '',
    isChangeAccount: false
  },
  mutations: {
    SET_COMPONENT_NAME: (state, gowanComponentName) => {
      state.gowanComponentName = gowanComponentName
    },
    SET_COMPONENT_FLOAT: (state, gowanFloatBall) => {
      state.floatBall = gowanFloatBall
    },
    SET_COMPONENT_NOTICE: (state, gowanNotice) => {
      state.notice = gowanNotice
    },
    GET_RECHARGE_AGES: (state, rechargeAges) => {
      state.rechargeAges = rechargeAges
    },
    SET_COMPONENT_SLIDEBAR: (state, slideBar) => {
      state.slideBar = slideBar
    },
    SET_IS_CHANGE_ACCOUNNT: (state, isChangeAccount) => {
      state.isChangeAccount = isChangeAccount
    }
  },
  actions: {
    SET_GOWAN_COMPONENT_NAME ({commit}, gowanComponentName) {
      commit('SET_COMPONENT_NAME', gowanComponentName)
    },
    SET_GOWAN_COMPONENT_FLOATBALL ({commit}, gowanFloatBall) {
      commit('SET_COMPONENT_FLOAT', gowanFloatBall)
    },
    SET_GOWAN_COMPONENT_NOTICE ({commit}, gowanNotice) {
      commit('SET_COMPONENT_NOTICE', gowanNotice)
    },
    GET_GOWAN_RECHARGE_AGES ({commit}, rechargeAges) {
      commit('GET_RECHARGE_AGES', rechargeAges)
    },
    SET_GOWAN_COMPONENT_SLIDEBAR ({commit}, slideBar) {
      commit('SET_COMPONENT_SLIDEBAR', slideBar)
    },
    SET_IS_CHANGE_ACCOUNNT ({commit}, isChangeAccount) {
      commit('SET_IS_CHANGE_ACCOUNNT', isChangeAccount)
    }
  }
}
export default GowanComponent
