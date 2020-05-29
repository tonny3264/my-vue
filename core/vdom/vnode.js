export default class VNode {
  constructor(tag, el, children, text, parent, data){
    this.tag = tag;
    this.el = el;
    this.children = children;
    this.text = text;
    this.parent = parent;
    this.data = data;
    this.env = {};
    this.template = [];
    this.isTemplateNode = el.nodeType == 3 && /{{.+}}/g.test(text);
  }
}