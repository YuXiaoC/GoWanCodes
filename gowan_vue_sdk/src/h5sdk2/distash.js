import store from '../store'

export function cutPath (ages) {
  FN.log(ages)
  store.dispatch('SET_GOWAN_COMPONENT_NAME', ages)
}
