window.ENV = "test"
if (/test/.test(location.hostname)) ENV = "test"
if (/demo/.test(location.hostname)) ENV = "dev"
if (/3k\.com/.test(location.hostname)) ENV = "prod"
window.__postDomain = {
  local: "//" + location.host.slice(0, location.host.length - 5) + ":1223",
  dev: location.host,
  test: location.host,
  prod: location.host
}
window.__3kapiDomain = {
  local: "api.gowan8.com",
  dev: "api.gowan8.com",
  test: "api.gowan8.com",
  prod: "sdkapi.3k.com",
  get() {
    return `//${window.__3kapiDomain[window.ENV]}/`
  }
}

window.__h5apiDomain = {
  jsLoad: {
    local: "yisdkdemo.3kwan.com:82",
    dev: "yisdkdemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "yisdk.3k.com"
  },
  // paramsLoad: {
  //   local: "yisdkdemo.3kwan.com:82",
  //   dev: "yisdkdemo.3kwan.com:82",
  //   test: "yisdk-api.gowan8.com",
  //   prod: "sdkapi.3k.com"
  // },
  paramsLoad: {
    local: "yisdkdemo.3kwan.com:82",
    dev: "yisdkdemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "sdkapi.3k.com"
  },
  get(key) {
    return `//${window.__h5apiDomain[key][window.ENV]}/`
  }
}
window.__fuseDomain = {
  init: {
    local: "yisdkdemo.3kwan.com:82",
    dev: "yisdkdemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "yisdk.3k.com"
  },
  role: {
    local: "yisdkdemo.3kwan.com:82",
    dev: "yiroledemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "yirole.3k.com"
  },
  pay: {
    local: "yipaydemo.3kwan.com:82",
    dev: "yipaydemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "yipay.3k.com"
    // prod: "yipaytest.3kwan.com"
  },
  user: {
    local: "yiuserdemo.3kwan.com:82",
    dev: "yiuserdemo.3kwan.com:82",
    test: "yisdk-api.gowan8.com",
    prod: "yiuser.3k.com"
  },
  get(key) {
    return `//${window.__fuseDomain[key][window.ENV]}/`
  }
}
