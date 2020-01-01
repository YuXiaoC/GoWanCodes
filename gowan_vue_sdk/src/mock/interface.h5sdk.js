// 2. H5SDK外部JS加载游戏参数接⼜
// 开发：https://yisdkdemo.3kwan.com/?ct=h5&ac=js_load
// 测试：https://yisdktest.3kwan.com/?ct=h5&ac=js_load
// 线上：https://yisdk.3k.com/?ct=h5&ac=js_load
import Api from 'api-mock-js'
let domain = {
  local: {
    game_url: 'http://' + location.host + '/h5.html', // H5游戏地址  npm run dev:h5
    channel_js: 'http://' + location.host + '/js/3ksdk.js'
  },
  dev: {
    game_url: 'http://h5gamedemo.3kwan.com:82/h5/h5.html',
    channel_js: 'http://h5gamedemo.3kwan.com:82/channel/3ksdk/3ksdk.js'
  },
  test: {
    game_url: 'http://' + location.host + '/h5.html', // H5游戏地址  npm run dev:h5
    channel_js: 'http://' + location.host + '/channel/3ksdk/3ksdk.js'
  },
  prod: {
    game_url: 'http://' + location.host + '/h5.html', // H5游戏地址  npm run dev:h5
    channel_js: 'http://' + location.host + '/channel/3ksdk/3ksdk.js'
  }
}

Api.define('jsLoad', {
  input: {
    ct: 'h5',
    ac: 'js_load',
    yisdk_param: '' // yes 游戏链接地址中获取到的yisdk_param
  },
  input: {
    ct: 'h5',
    ac: 'js_load',
    p:
      '428MiLCJjaGFubmVsIjoiM6IiIsImNoYW5uZWxfanOiIxOTYifQ%3D%3D1517303eyJnYW1lX2lkIjoiMz2siLCJnYW1lX3VybCIMiOiIiLCJhcHBfaWQi',
    ts: ''
  },
  mock: {
    code: 0,
    msg: '',
    data: {
      app_id: '196',
      game_id: '1', // 融合游戏ID
      channel: 'gowan', // 融合渠道标识  游戏接入平台渠道id 写死的表（找树华拿）
      channel_id: '0', // 渠道 id
      game_url: 'http://192.168.0.162:8081', // H5游戏地址  npm run dev:h5
      channel_js: 'http://192.168.132:8081/gowansdk.js', // 渠道JSDK下载地址
      pay_notify: 'http://baidu.com/' // 支付通知地址   渠道 notify_url 用到

    }
    // data: {.
    //   d: '{密文}',
    //   ts: '{时间戳}'
    // }
  }
})
