/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
// window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
// loadLib("libs/laya.core.js")
// loadLib("libs/laya.ui.js")
// loadLib("libs/laya.physics.js")
//-----libs-end-------


const loadSubpackage = function(name) {
  let task = wx.loadSubpackage({
    // 开发者根据自身需求更改
    name: name,
    success: function() {//分包加载成功
      console.log('分包加载成功')
      // GameGlobal.LoaddingUI.instance.onSuccess();
    }
  });

  task.onProgressUpdate(res => {//分包的加载进度
    // GameGlobal.LoaddingUI.instance.onProgressUpdate(res);
  })
}
//根据版本号向服务器查询显示套壳游戏还是正式游戏
const getGame = function() {
  //这里显示http请求代码
  var showMiniGame = false; //假设请求结果是显示的是套壳游戏（如果改成false就是显示正式游戏）
  if (showMiniGame) {
    loadSubpackage("game2"); //显示套壳游戏
  } else {
    loadSubpackage("game1"); //显示正式游戏
  }
}
// require("LoadingUI.js");//显示分包加载界面
getGame();//向服务器请求游戏