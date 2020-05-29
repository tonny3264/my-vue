export default class Render{
  constructor(vm, vnode){
    this.vm = vm;
    this.vnode = vnode;
    this._template2vnodes = new Map();
    this._vnode2templates = new Map();
    this._prepareRender(vnode);
    this._renderNode(vnode);
  }

  /**
   * 渲染
   * @param {String} template 模板变量
   */
  render(template){
    console.log("重新渲染", template);
    if(!template) return;
    const vnodeList = this._template2vnodes.get(template);
    if(vnodeList){
      for(const vnode of vnodeList){
        this._renderNode(vnode);
      }
    }
  }

  /**
   * 节点渲染
   * @param {*} vnode 虚拟节点
   */
  _renderNode(vnode){
    if(vnode == null) return;
    if(vnode.isTemplateNode){
      let text = vnode.text;
      for(const content of this._vnode2templates.get(vnode)){
        const reg = RegExp(`{{\\s*${content}\\s*}}`, "g");
        const value = this._findValue([this.vm._data, this.env], content);
        text = text.replace(reg, value);
      }
      vnode.el.nodeValue = text;
    }else{
      for(const child of vnode.children){
        this._renderNode(child);
      }
    }
  }

  /**
   * 查询变量值
   * @param {Array} dataList 查询的数据数组
   * @param {*} content 需要查询的变量
   * @return {String} null: 未查到
   */
  _findValue(dataList, content){
    const varList = content.split('.');
    for(const data of dataList){
      let temp = data;
      for(const val of varList){
        temp = temp[val];
      }
      return temp;
    }
    throw new Error(`模板变量: ${content} 未定义`);
  }

  /**
   * 预备渲染:建立模板变量与节点的互相映射
   */
  _prepareRender(vnode){
    if(vnode.el.nodeType == 3){
      const templateList = vnode.text.match(/{{[a-zA-Z0-9-_ .]+}}/g);
      if(templateList == null) return;
      for(let i = 0; i < templateList.length; i++){
        // 格式化的模板变量
        let sprintTemplate = templateList[i].replace(/({{)|(}})|(\s)/g, "");
        this._template2vnode(sprintTemplate, vnode);
        this._vnode2template(sprintTemplate, vnode);
      }
    }else{
      for(let child of vnode.children){
        this._prepareRender(child);
      }
    }
  }

  /**
   * 模板→虚拟节点映射
   */
  _template2vnode(template, vnode){
    const vnodeList = this._template2vnodes.get(template);
    if(vnodeList){
      vnodeList.push(vnode);
    }else{
      this._template2vnodes.set(template, [vnode]);
    }
  }

  /**
   * 虚拟节点→模板映射
   */
  _vnode2template(template, vnode){
    const templateList = this._vnode2templates.get(vnode);
    if(templateList){
      templateList.push(template);
    }else{
      this._vnode2templates.set(vnode, [template]);
    }
  }
}