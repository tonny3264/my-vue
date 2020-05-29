import VNode from "../vdom/vnode.js"

export default class Mount {
  constructor(vm, el){
    this.el = el;
    this.vm = vm;
  }

  mount(el){
    return this._createNode(document.getElementById(el), null);
  }

  _createNode(dom, parent){
    let childs = dom.childNodes;
    let tag = dom.nodeName;
    let children = [];
    let text = this._getNodeText(dom);
    const vnode = new VNode(tag, dom, children, text, parent);
    for (let i = 0; i < childs.length; i++) {
      children.push(this._createNode(childs[i], vnode));
    }
    return vnode;
  }

  /**
   * 获得文本节点的文本
   */
  _getNodeText(dom){
    if(dom.nodeType == 3){
      return dom.nodeValue;
    }
    return "";
  }
}