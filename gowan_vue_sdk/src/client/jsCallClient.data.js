function generateData () {
  // JsonArray	Y	朋友关系（若无不传）
  let friendList = [
    {
      roleid: 1 + new Date().getTime(), // int	Y	好友角色关系id
      intimacy: 0, // intimacy: 0,// int	Y	亲密度，无传0
      nexusId: 0, // int	Y	关系id，（0：无，1：夫妻，2：结拜，3：情侣,4：师徒，5：仇人，自定义从6推后）
      nexusName: '' // string	Y	关系名，对应关系id（如：夫妻）
    },
    {
      roleid: 2 + new Date().getTime(), // int	Y	好友角色关系id
      intimacy: 0, // intimacy: 0,// int	Y	亲密度，无传0
      nexusId: 0, // int	Y	关系id，（0：无，1：夫妻，2：结拜，3：情侣,4：师徒，5：仇人，自定义从6推后）
      nexusName: '' // string	Y	关系名，对应关系id（如：夫妻）
    },
    {
      roleid: 3 + new Date().getTime(), // int	Y	好友角色关系id
      intimacy: 0, // intimacy: 0,// int	Y	亲密度，无传0
      nexusId: 0, // int	Y	关系id，（0：无，1：夫妻，2：结拜，3：情侣,4：师徒，5：仇人，自定义从6推后）
      nexusName: '' // string	Y	关系名，对应关系id（如：夫妻）
    }
  ]
  let roleMsg = {
    roleId: new Date().getTime(), // string	Y	角色id
    roleName: '梵蒂冈', // string	Y	角色名
    roleLevel: '80', // string	Y	角色等级
    serverId: '5566', // string	Y	角色所在服id
    serverName: '啦啦啦', // string	Y	角色所在服名
    vipLevel: '90' // string	Y	角色vip等级
  }
  let roleData = {
    ...roleMsg,
    userMoney: '9000', // string	Y	角色用户余额
    roleCTime: new Date().getTime(), // string	Y	角色创建时间（10位unix时间戳）
    gender: '', // string	Y	性别（若无传“”，有传男、女）
    professionId: 0, // int	Y	当前登录玩家的职业ID（若无传0）
    profession: '僵尸', // string	Y	当前登录玩家的职业名称（若无传“”）
    power: 0, // int	Y	战力值 （若无传0）
    partyid: '4444', // string	Y	当前玩家的所属帮派帮派ID（若无传“”）
    partyname: 'okok', // string	Y	当前玩家的所属帮派帮派名称（若无传“”）
    partyroleid: 0, // int	Y	帮派称号ID（若无传0）
    partyrolename: 'tTTt', // string	Y	帮派称号名称（若无传“”）
    friendList: friendList
  }

  let globalData = {
    'type-1': {
      isLandscape: false, //	是否横版登陆	Boolean
      floatLocation: 0, // 	浮动图标位置: 0,// int
      rate: 100, //	人民币与游戏币的汇率 比如1元=10元宝: 0,// int
      productName: '金币', //	游戏币名(元宝/金币/钻石): '',// string
      debug: true //	是否打开测试环境（不加该参数可能看不到错误日志）	Boolean
    },
    'type-2': {},
    'type-3': {},
    'type-4': {
      amount: 600, //	充值金额 传100的倍数，单位为分	Y: 0,// int
      cpProductId: 'ccc11', // ..	商品ID	Y: '',// string
      productName: '60个水晶', //	游戏货币名（如元宝，金币）
      callbackURL: location.href, //	充值回调地址（通过此地址回调游戏方充值是否成功）	Y: '',// string
      callbackInfo: '888', //	应用私有字段（原样返回）	N: '',// string
      chargeDesc: '......', //	支付描述信息	N: '',// string
      chargeMount: 0, // t	充值游戏币数量	N: '',// string
      rate: 300, //	人民币与游戏币比例（比如1人民=100元宝）	Y: '',// string
      lastMoney: '900', //	用户余额	Y: '',// string
      ...roleMsg,
      sociaty: '适当' //	公会/帮派名	Y: '',// string
    },
    'type-5': {
      ...roleData
    },
    'type-6': {
      ...roleData
    },
    'type-7': {
      ...roleData
    },
    'type-8': {},
    'type-9': {},
    'type-10': {},
    'type-11': {
      url: 'http://3k.com' // 游戏客服页面url Y: '',// string
    },
    'type-12': {},
    'type-13': {},
    'type-14': {},
    'type-15': {},
    'type-16': {},
    'type-17': {}
  }
  return globalData
}

export default generateData
