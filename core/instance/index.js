import Proxy from "./proxy.js"
import Mount from "./mount.js"
import Render from "./render.js"

export default class Vue {
  constructor(option){
    this._isVue = true;
    this._data = option.data;
    // 初始化数据
    this._dataInit(option);
    // 挂载虚拟dom
    this._mountInit(option);
    // 模板节点映射
    this._mapping();
  }

  _dataInit(){
    if(this._data == null) return;
    this._proxy = new Proxy(this);
  }

  _mountInit(option){
    const m = new Mount(this, option.el);
    if(option.el){
      this._vnode = m.mount(option.el);
    }
  }

  _mapping(){
    if(this._vnode){
      this._render = new Render(this, this._vnode);
      //连接信号槽,监听代理数据变化,重新渲染
      this._proxy.connect("render", this._render.render, this._render);
      // this._template2vnodes = this._render.template2vnodes;
      // this._vnode2templates = this._render.vnode2templates;
    }
  }
}