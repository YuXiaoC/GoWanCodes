let ENV = 'local'
if (/gowanme/.test(location.hostname)) ENV = 'test'
if (/demo/.test(location.hostname)) ENV = 'dev'
if (/gowan8\.com/.test(location.hostname)) ENV = 'prod'
if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(location.hostname)) ENV = 'local'
const __postDomain = {
  local: '//' + location.host.slice(0, location.host.length - 5) + ':1223',
  dev: location.host,
  test: location.host,
  prod: location.host
}
const __gowanpayDomain = {
  local: 'pay.gowanme.com',
  dev: 'pay.gowanme.com',
  test: 'pay.gowanme.com',
  prod: 'pay.gowan8.com',
  get () {
    return `//${__gowanpayDomain[ENV]}/`
  }
}

const __gowanapiDomain = {
  local: 'api.gowanme.com',
  dev: 'api.gowanme.com',
  test: 'api.gowanme.com',
  prod: 'api.gowan8.com',
  get () {
    return `//${__gowanapiDomain[ENV]}/`
  }
}
const __h5apiDomain = {
  jsLoad: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yisdkdemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
  },
  // paramsLoad: {
  //   local: "yisdkdemo.3kwan.com:82",
  //   dev: "yisdkdemo.3kwan.com:82",
  //   test: "yisdk-api.gowanme.com",
  //   prod: "sdkapi.3k.com"
  // },
  paramsLoad: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yisdkdemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
  },
  get (key) {
    return `//${__h5apiDomain[key][ENV]}/`
  }
}
const __fuseDomain = {
  init: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yisdkdemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
  },
  role: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yiroledemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
  },
  pay: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yipaydemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
    // prod: "yipaytest.3kwan.com"
  },
  user: {
    local: 'yisdk-api.gowanme.com',
    dev: 'yiuserdemo.3kwan.com:82',
    test: 'yisdk-api.gowanme.com',
    prod: 'yisdk-api.gowan8.com'
  },
  get (key) {
    FN.log(key)
    return `//${__fuseDomain[key][ENV]}/`
  }
}
export default {
  __gowanapiDomain,
  __postDomain,
  __fuseDomain,
  __h5apiDomain,
  __gowanpayDomain
}
