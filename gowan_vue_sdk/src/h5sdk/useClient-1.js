import FN from '../utility/fn'
import Client from '../client/client.sdk'
import generateData from '../client/jsCallClient.data'
let GD = generateData()
FN.log('I am useClient')
const INDEX = {
  init: 1,
  login: 2,
  changeAccount: 3,
  recharge: 4,
  createRole: 5,
  changeRole: 6,
  upgradeRole: 7,
  getUserID: 8,
  getPTID: 9,
  getFromID: 10,
  goToGM: 11,
  checkRealNameAuth: 12,
  checkBindPhone: 13,
  goToBindPhone: 14,
  goToUserCenter: 15,
  flymeChangeAccount: 16,
  getGameID: 17
}
window.CLIENTSDK = {}
// let client_js = ["login", "changeAccount", "recharge", "flymeChangeAccount"]
let client_js = ['login', 'changeAccount', 'recharge']
let client_main = [
  'init',
  'getUserID',
  'getPTID',
  'getFromID',
  'checkRealNameAuth',
  'checkBindPhone',
  'getGameID'
]
let client_game = ['createRole', 'changeRole', 'upgradeRole']
let client_action = ['goToGM', 'goToBindPhone', 'goToUserCenter']

let arr = [...client_js, ...client_main, ...client_game, ...client_action]

arr.forEach(e => {
  window.CLIENTSDK[e] = (token, args) => {
    Client.emit(e, {
      type: INDEX[e],
      data: {
        ...GD['type-' + INDEX[e]],
        ...args[0]
      }
    })
      .then(res => {
        FN.post({
          type: 'CC',
          token,
          payload: res.data
        })
      })
      .catch(e => {
        FN.warn('Client.emit:', e)
      })
  }
})

window.CLIENTSDK.listen = (token, args) => {
  let { event } = args[0]
  FN.log('listen', token, args, event)
  PS.subscribeOnce(`client.${event}`, (msg, res) => {
    FN.log('listen call', msg, res)
    FN.post({
      type: 'CC',
      token,
      payload: res.data
    })
  })
}

window.CLIENTSDK.flymeChangeAccount = (token, args) => {
  PS.subscribeOnce('client.flymeChangeAccount', (msg, res) => {
    FN.post({
      type: 'CC',
      token,
      payload: res.data
    })
  })
}
