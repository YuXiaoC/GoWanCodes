import PS from "pubsub-js"

const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}
const SET = {}

window.addEventListener(
  "message",
  event => {
    let data = event.data
    if (data.type === "CC" && SET[data.token]) {
      PS.publish(data.token, data.payload)
      delete SET[data.token]
    }
  },
  false
)

// TODO
function callParent(data) {
  SET[data.token] = data
  window.parent.postMessage(data, "*")
}

function CC(...fns) {
  return (...arg) => {
    let token = uuid()
    callParent({
      token,
      type: "CC",
      fn: fns,
      params: [...arg]
    })
    return new Promise((resolve, reject) => {
      PS.subscribeOnce(token, (msg, data) => resolve(data))
    })
  }
}

export default CC

/*
CC('ajax', 'require')('count', {
  ct: 'index',
  ac: 'count'
}).then(res => {
  console.log(res)
})

CC('test')(1, 2).then(res => {
  console.log('>>>>>',res)
})
*/
