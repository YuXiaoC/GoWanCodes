Api.define("xxx", {
  input: {
    ct: "xxx",
    ac: "xxx",
    p: "密文",
    ts: ""
  },
  mock: {
    code: 0,
    msg: "",
    data: {
      d: "{密文}",
      ts: "{时间戳}"
    }
  }
})
