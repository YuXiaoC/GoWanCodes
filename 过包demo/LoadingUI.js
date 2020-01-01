//分包加载器的界面
class LoaddingUI extends Laya.Scene {
  constructor() {
    super();
    LoaddingUI.instance = this;
    this.initUI();
  }
  initUI() {
    var label = new Laya.Label();
    label.text = "正在初始化引擎...";
    label.color = "#ffffff";
    label.fontSize = 40;
    this.addChild(label);
    this.label = label;
  }
  onProgressUpdate(res) {
    this.label.text = "分包加载进度：" + res.progress;
  }
  onSuccess() {
    Laya.stage.removeChild(this);
  }
}
Laya.init(640, 1136, Laya.WebGL); //初始化laya
Laya.stage.addChild(new LoaddingUI()); //添加加载界面
GameGlobal.LoaddingUI = LoaddingUI; //把加载界面放到全局