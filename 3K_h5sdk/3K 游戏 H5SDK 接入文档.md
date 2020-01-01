# 3K 游戏 H5SDK 接入文档

[TOC]

| SDK 版本 | 修改日期       | 作者   | 修改内容                                   |
| ------ | ---------- | ---- | -------------------------------------- |
| V1.0.0 | 2018.03.09 | 郑子俊  |                                        |
| v1.0.1 | 2018.03.20 | 郑子俊  | 新增接口说明，修改平台运营接口参数                      |
| v1.0.2 | 2018.03.26 | 郑子俊  | 更新 二、13 描述                             |
| v1.0.3 | 2018.03.27 | 郑子俊  | 更新 二、9 备注                              |
| v1.0.4 | 2018.03.29 | 郑子俊  | 更新 二、9, 10, 11 描述；统一 loginParams 参数为对象 |
| v1.0.5 | 2018.03.30 | 郑子俊  | 新增 二、14. 获取游戏 id                       |
| v1.0.6 | 2018.04.08 | 郑子俊  | 更新 二、切换账号 返回参数                         |

## 一、接入准备

### 1. 对接人员

游戏平台和游戏方技术人员

### 2. 注意事项

* 接口参数大小写敏感
* 页面编码格式为 utf-8

### 3. 接入描述

游戏接入 h5sdk，请严格遵循接入文档说明来调用接口。用户访问游戏时，3k 会采用 iframe 的形式访问游戏链接，游戏加载的时候，需要引入 `h5sdk.js` 并在成功加载后，调用挂载在`window`对象上的`kkkSDK`属性的`init` 接口 。

游戏页面引入 h5sdk：

```html
<script src="http://h5game.3k.com/h5sdk/h5sdk.js"></script>
```

### 4. 特别注意

活动类接口为：

二、10.查询实名认证 (必接)

二、11.手机号码验证 (防沉迷系统) 与检测接口 (必接)



## 二、接口详情

### 1. 初始化 (必接)

初始化SDK所需要的资源信息，所有sdk接口之前调用该接口

> kkkSDK.init()

* 参数

| 属性            | 描述                                       | 必选   | 类型      |
| ------------- | ---------------------------------------- | ---- | ------- |
| isLandscape   | 是否横版登陆                                   | N    | Boolean |
| floatLocation | 浮动图标位置 ( 0: 左上 1: 左中 2: 左下 3: 右上 4: 右中 5: 右下) | N    | Number  |
| rate          | 人民币与游戏币的汇率                               | N    | Number  |
| productName   | 游戏币名(元宝/金币/钻石)                           | N    | String  |
| dubug         | 是否打开测试环境（**不加该参数可能看不到错误日志**）             | N    | Boolean |

* 返回

Promise\<Object>

| 属性         | 描述                        | 必选   | 类型     |
| ---------- | ------------------------- | ---- | ------ |
| statusCode | 初始化状态（0 成功，1 自动登录成功，其他失败） | Y    | Number |
| status     | 状态描述                      | Y    | String |

> **温馨提示：**初始化后有可能收到用户自动登录信息，返回值为“1”时，sdk 初始化成功，同时用户已经登录成功，请不要再次调用登录接口。

使用示例：

```javascript
kkkSDK.init().then(function(res) {
  console.log('初始化成功：', res)
})
```

### 2. 登录 (必接)

调用SDK登陆页面

> kkkSDK.login()

* 参数

无

* 返回

Promise\<Object>

| 属性          | 描述                                       | 必选   | 类型     |
| ----------- | ---------------------------------------- | ---- | ------ |
| statusCode  | 登陆状态：0 登陆成功 2 表示登陆窗返回（如果有），-2 表示 SDK 客户端没有安装或者版本太低，其他登陆失败 | Y    | Number |
| loginParams | 返回参数                                     | Y    | Object |

`loginParams` 参数说明：

| 属性               | 描述                                 | 必选   | 类型      |
| ---------------- | ---------------------------------- | ---- | ------- |
| statusCode       | 登陆状态 同上                            | Y    | Number  |
| userId           | 用户 id                              | Y    | String  |
| platformChanleId | 接入平台渠道 id                          | Y    | Number  |
| userName         | 用户名                                | N    | String  |
| timestamp        | 时间戳                                | Y    | String  |
| sign             | 登录验证参数                             | Y    | String  |
| guid             | 需显示在游戏内                            | Y    | String  |
| cp_ext           | 扩展参数                               | N    | String  |
| ext              | 渠道扩展参数                             | N    | String  |
| isReward         | 是否发放奖励，用户在小米游戏中心启动游戏 isReward=true | N    | Boolean |
| hasCheck         | 是否需要登录验证                           | Y    | Boolean |
| isChangeUser     | 是否是切换账号登录                          | Y    | Boolean |

> **注意：**角色关联推荐是 uid + “\_”+ platformChanleId 双重关联，避免多渠道渠道 uid 重复，游戏方也可以自定义相应 uid 格式。

使用示例：

```javascript
kkkSDK.login().then(function(res) {
  console.log('登录成功：', res)
})
```

### 3. 切换账号 (必接)

用户在游戏中，退到登陆页面，重新打开登陆页面，选择账号登入游戏（游戏方可在游戏中加入切换账号按钮）

> kkkSDK.changeAccount()

* 参数

无

* 返回

Promise\<Object>

| 属性          | 描述                 | 必选   | 类型     |
| ----------- | ------------------ | ---- | ------ |
| statusCode  | 初始化状态（0 成功，1 其他失败） | Y    | Number |
| status      | 状态描述               | Y    | String |
| loginParams | 返回参数               | Y    | Object |

> **温馨提示:** 如果游戏中需要注销或者切换账号，请调用该接口，不要调用注销再登录接口，或者直接调用登录接口，因为不是所有渠道都有注销接口，直接调用登录接口游戏渠道或自动登录，达不到切换的目的。
>
> loginParams 参照 **登录**接口

使用示例：

```javascript
kkkSDK.changeAccount().then(function(res) {
  console.log('切换账号成功：', res)
})
```

### 4. 充值 (必接)

调用sdk充值页面

> kkkSDK.recharge()

* 参数

| 属性           | 描述                        | 必选   | 类型     |
| ------------ | ------------------------- | ---- | ------ |
| amount       | 充值金额 **传 100 的倍数，单位为分**   | Y    | Number |
| cpProductId  | 商品 ID                     | Y    | String |
| productName  | 游戏货币名（如元宝，金币）             | Y    | String |
| callbackURL  | 充值回调地址（通过此地址回调游戏方充值是否成功）  | Y    | String |
| callbackInfo | 应用私有字段（原样返回）              | N    | String |
| chargeDesc   | 支付描述信息                    | N    | String |
| chargeMount  | 充值游戏币数量                   | N    | Number |
| serverId     | 用户角色所在服 id                | Y    | String |
| serverName   | 用户角色所在服务器名                | Y    | String |
| roleName     | 角色名字                      | Y    | String |
| roleId       | 角色 id                     | Y    | String |
| rate         | 人民币与游戏币比例（比如 1 人民=100 元宝） | Y    | Number |
| roleLevel    | 角色等级                      | Y    | String |
| sociaty      | 公会/帮派名                    | Y    | String |
| lastMoney    | 用户余额                      | Y    | String |
| vipLevel     | Vip 等级                    | Y    | String |

> 温馨提示:充值所有参数必传的参数不能为为空，如果改参数暂时没有可以传字符串“”，其中 vip 等级，角色等级如果取不到，暂时默认传“0”。

* 返回

Promise\<Object>

| 属性         | 描述                      | 必选   | 类型     |
| ---------- | ----------------------- | ---- | ------ |
| status     | 支付状态说明                  | Y    | Number |
| statusCode | 支付状态（0 支付流程成功，其他 支付未完成） | Y    | Number |

使用示例：

```javascript
kkkSDK.recharge().then(function(res) {
  console.log('充值：', res)
})
```

### 5. SDK 平台运营数据 (必接)

渠道 SDK 要求游戏在运行过程中提交一些用于运营需要的扩展数这些数据通过扩展数据提交方法进行提交，用户角色信息变化时调用，3 个接口参数一致

平台运营接口参数如下：

| 属性            | 描述     | 必选   | 类型                    |
| ------------- | ------ | ---- | --------------------- |
| roleId        | String | Y    | 角色 id                 |
| roleName      | String | Y    | 角色名                   |
| roleLevel     | String | Y    | 角色等级                  |
| serverId      | String | Y    | 角色所在服 id              |
| serverName    | String | Y    | 角色所在服名                |
| vipLevel      | String | Y    | 角色 vip 等级             |
| userMoney     | String | Y    | 角色用户余额                |
| roleCTime     | String | Y    | 角色创建时间（10 位 unix 时间戳） |
| gender        | String | Y    | 性别（若无传“”，有传男、女）       |
| professionId  | Number | Y    | 当前登录玩家的职业 ID（若无传 0）   |
| profession    | String | Y    | 当前登录玩家的职业名称（若无传“”）    |
| power         | String | Y    | 战力值 （若无传""）           |
| partyid       | String | Y    | 当前玩家的所属帮派帮派 ID（若无传“”） |
| partyname     | String | Y    | 当前玩家的所属帮派帮派名称（若无传“”）  |
| partyroleid   | Number | Y    | 帮派称号 ID（若无传 0）        |
| partyrolename | String | Y    | 帮派称号名称（若无传“”）         |
| friendList    | Object | Y    | 朋友关系（若无不传）            |

`friendList`朋友关系参数：

| 属性        | 描述     | 必选   | 类型                                       |
| --------- | ------ | ---- | ---------------------------------------- |
| roleid    | Number | Y    | 好友角色关系 id                                |
| intimacy  | Number | Y    | 亲密度，无传 0                                 |
| nexusId   | Number | Y    | 关系 id，（0：无，1：夫妻，2：结拜，3：情侣,4：师徒，5：仇人，自定义从 6 推后） |
| nexusName | String | Y    | 关系名，对应关系 id（如：夫妻）                        |

#### 5.1. 角色创建

> kkkSDK.createRole()

* 参数

参见平台运营接口参数

* 返回

Promise\<Object>

| 属性         | 描述                 | 必选   | 类型     |
| ---------- | ------------------ | ---- | ------ |
| statusCode | 初始化状态（0 成功，1 其他失败） | Y    | Number |
| status     | 状态描述               | Y    | String |

使用示例：

```javascript
kkkSDK.createRole().then(function(res) {
  console.log('角色创建：', res)
})
```

#### 5.2. 角色登录/切换角色登录

> kkkSDK.changeRole()

* 参数

参见平台运营接口参数

* 返回

Promise\<Object>

| 属性         | 描述                 | 必选   | 类型     |
| ---------- | ------------------ | ---- | ------ |
| statusCode | 初始化状态（0 成功，1 其他失败） | Y    | Number |
| status     | 状态描述               | Y    | String |

使用示例：

```javascript
kkkSDK.changeRole().then(function(res) {
  console.log('切换角色登录：', res)
})
```

#### 5.3. 角色升级

> kkkSDK.upgradeRole()

* 参数

参见平台运营接口参数

* 返回

Promise\<Object>

| 属性         | 描述                 | 必选   | 类型     |
| ---------- | ------------------ | ---- | ------ |
| statusCode | 初始化状态（0 成功，1 其他失败） | Y    | Number |
| status     | 状态描述               | Y    | String |

> 温馨提示:此接口参数请传入实际用户参数，避免游戏审核不通过。

使用示例：

```javascript
kkkSDK.upgradeRole().then(function(res) {
  console.log('角色升级：', res)
})
```

### 6. 获取当前用户 id (选接)

如果SDK返回登录成功，但是当前用户id为NULL、或者不存在有效ID时，可以调用改接口进行确认，如果还是无效ID，可以重新让用户进行登录

> kkkSDK.getUserID()

* 参数

无

* 返回

Promise\<Object>

| 属性   | 描述    | 必选   | 类型     |
| ---- | ----- | ---- | ------ |
| uid  | 用户 id | Y    | String |

使用示例：

```javascript
kkkSDK.getUserID().then(function(res) {
  console.log('获取当前用户 id：', res)
})
```

### 7. 获取游戏接入平台 id (必接)

H5链接可能会分发微端包，游戏方通过该方法获取当前微端包是哪个一个平台

> kkkSDK.getPTID()

* 参数

无

* 返回

Promise\<Object>

| 属性        | 描述    | 必选   | 类型     |
| --------- | ----- | ---- | ------ |
| channelId | 平台 id | Y    | String |

使用示例：

```javascript
kkkSDK.getPTID().then(function(res) {
  console.log('获取游戏接入平台 id：', res)
})
```

### 8. 获取渠道分发 id (必接)

平台渠道可能会对上架的微端包做分发处理，游戏需要对同一平台，不同的分发包做不同的数据处理。游戏方可以通过下面方法获取当前渠道的分发包id，方法默认返回字符串“0”

> kkkSDK.getFromID()

* 参数

无

* 返回

Promise\<Object>

| 属性     | 描述    | 必选   | 类型    |
| ------ | ----- | ---- | ----- |
| fromId | 分发 id | Y    | Sting |

使用示例：

```javascript
kkkSDK.getFromID().then(function(res) {
  console.log('获取渠道分发 id ：', res)
})
```

### 9. 跳转客服页面 (选接)

使用说明：游戏接入该功能，为所有渠道的游戏玩家提供游戏问题咨询提单入口，玩家发布的工单由3k游戏客服统一进行处理

此接口文档url地址，请看【gm对接文档】目录下的文档

调用此接口可跳转至3K客服页面(优化处理后的), 游戏方需传入对应游戏客服页面url, 同时需要在清单文件中做相应页面的配置

> kkkSDK.goToGM()
>
> 此功能目前仅适用于 3k 游戏渠道

* 参数

无

* 返回

无

使用示例：

```javascript
kkkSDK.goToGM()
```

### 10. 查询实名认证 (选接)

> kkkSDK.checkRealNameAuth()
> 此功能目前仅适用于 3k 游戏渠道

使用场景：

1、文案内容可编辑（具体文案主要引导玩家点击“去实名”，然后弹出3k实名界面，已响应国家规定检查）

2、未实名用户：下面按钮分别为 去实名（亮置）、未领取（暗置）

3、用户点击去实名后调用接口跳转到3k实名的界面进行实名。实名成功后按钮分别为：已实名（暗置）、领取（亮置）

4、点击领取则可以领取实名后的活动奖励。



备注：

1、此活动下次开启后已经实名的玩家不能再领取奖励，未实名的玩家进行实名后仍然可以领取奖励

2、活动可以随时开启及关闭，可以按照专区、渠道区分开关，主要会在3k专区开这个活动，联运渠道不给开

3、活动界面可根据游戏内其他活动布局排版设计，只需要满足上述需求逻辑，通过实名认证后获得游戏内奖励的形式引导用户实名

* 参数

无

* 返回

Promise\<Object>

| 属性   |  描述  | 必选   | 类型     |
| ---- | :--: | ---- | ------ |
| age  | 实名年龄 | Y    | Number |

使用示例：

```javascript
kkkSDK.checkRealNameAuth().then(function(res) {
  console.log('查询实名认证 ：', res)
})
```

### 11. 手机号码验证 (防沉迷系统) 与检测接口 (选接)

使用场景：

1. 以**活动形式**做一个界面，点击进入界面，检测玩家是否有执行过手机绑定


2. 如未绑定，【绑定】按钮高亮显示，引导玩家绑定


3. 如已绑定，【已绑定】按钮灰置，【领取】按钮高亮，玩家点击【领取】活动奖励

#### 11.1. 检查用户是否绑定手机

> kkkSDK.checkBindPhone()

* 参数

无

* 返回

Promise\<Object>

| 属性         | 描述                | 必选   | 类型     |
| ---------- | ----------------- | ---- | ------ |
| statusCode | 绑定状态（0 未绑定，1 已绑定） | Y    | Number |
| status     | 状态描述              | Y    | String |

使用示例：

```javascript
kkkSDK.checkBindPhone().then(function(res) {
  console.log('检查用户是否绑定手机 ：', res)
})
```

#### 11.2. 跳转到绑定手机页面

> kkkSDK.goToBindPhone()

* 参数

无

* 返回

无

使用示例：

```javascript
kkkSDK.goToBindPhone()
```

### 12. 打开浮标个人/账号中心 (选接)

使用场景：根据业务需求主动调用，跳转到个人/账号中心页面

> kkkSDK.goToUserCenter()

* 参数

无

* 返回

Promise\<Object>

| 属性         | 描述                    | 必选   | 类型     |
| ---------- | --------------------- | ---- | ------ |
| statusCode | 初始化状态（0 成功，1 成功，其他失败） | Y    | Number |
| status     | 状态描述                  | Y    | String |

使用示例：

```javascript
kkkSDK.goToUserCenter().then(function(res) {
  console.log('跳转到浮标个人/账号中心', res)
})
```

### 13. 浮标个人/账号中心切换账号 (选接)

当用户在SDK社区点击“切换账号 、注销”或者“修改密码” ，游戏方可根据回调参数回到登录页面，让用户重新登录，初始化回调函数处理

> kkkSDK.on()

* 参数

| 属性       | 描述                       | 必选   | 类型       |
| -------- | ------------------------ | ---- | -------- |
| name     | 目前约定为 flymeChangeAccount | Y    | String   |
| callback | flymeChangeAccount 事件回调  | Y    | Function |

* 返回

| 属性          | 描述                                       | 必选   | 类型     |
| ----------- | ---------------------------------------- | ---- | ------ |
| status      | 状态说明                                     | Y    | String |
| statusCode  | 状态值 0 表示用户切换成功 1 表示登录失败（用户已注销） 3 表示用户修改密码成功 4 登录成功，登录回调接口返回用户信息。 | Y    | Number |
| loginParams | 返回参数                                     | Y    | Object |

> loginParams 参照 **登录**接口

使用示例：

```javascript
kkkSDK.on('flymeChangeAccount', function(res) {
  console.log('浮标个人/账号中心切换账号', res)
})
```

### 14. 获取游戏 id (选接)


> kkkSDK.getGameID()

* 参数

无

* 返回

Promise\<Object>

| 属性     | 描述    | 必选   | 类型     |
| ------ | ----- | ---- | ------ |
| gameId | 游戏 id | Y    | Number |

使用示例：

```javascript
kkkSDK.getGameID().then(function(res) {
  console.log('获取游戏 id：', res)
})
```

## 三、工具方法

### 1. 检测宿主环境是否微端

> kkkSDK.isApp()

* 参数

无

* 返回

Promise\<Object>

| 属性         | 描述             | 必选   | 类型     |
| ---------- | -------------- | ---- | ------ |
| statusCode | 初始化状态（0 是，1 否） | Y    | Number |
| status     | 状态描述           | Y    | String |

使用示例：

```javascript
kkkSDK.isApp().then(function(res) {
  console.log(res)
})
```

### 2. 检测宿主环境是否浏览器

> kkkSDK.isWeb()

* 参数

无

* 返回

Promise\<Object>

| 属性         | 描述             | 必选   | 类型     |
| ---------- | -------------- | ---- | ------ |
| statusCode | 初始化状态（0 是，1 否） | Y    | Number |
| status     | 状态描述           | Y    | String |

使用示例：

```javascript
kkkSDK.isWeb().then(function(res) {
  console.log(res)
})
```
