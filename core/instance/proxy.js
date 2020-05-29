import Base from "../utils/base.js"

export default class Proxy extends Base {
  constructor(vm) {
    super();
    this.vm = vm;
    vm._data = this.proxy(vm._data, "");
  }

  proxy(data, namespace) {
    let proxyObj = {};
    if (data instanceof Array) {
      proxyObj = this._arrayProxy(data, namespace);
    } else if (data instanceof Object) {
      proxyObj = this._objectProxy(data, namespace);
    } else {
      throw new Error("数据类型错误!");
    }
    // if(data == this.vm._data.obj) proxyObj.x = 100;
    return proxyObj;
  }

  _objectProxy(data, namespace) {
    let proxyObj = {};
    for (let key in data) {
      this._definePropertyObject(data, proxyObj, key, this._getNameSpace(namespace, key));
      // 使得vm也能直接访问到data数据
      // 判断: 如果数据处在传入data的根
      if (data == this.vm._data) {
        this._definePropertyObject(data, this.vm, key,this._getNameSpace(namespace, key));
      }
      if (data[key] instanceof Object) {
        proxyObj[key] = this.proxy(data[key], this._getNameSpace(namespace, key));
      }
    }
    return proxyObj;
  }

  _definePropertyObject(data, target, key, namespace) {
    const that = this;
    Object.defineProperty(target, key, {
      set(value) {
        data[key] = value;
        that.render(namespace);
      },
      get() {
        return data[key];
      },
    });
  }

  _arrayProxy(arr, namespace) {
    const obj = {
      push(){},
      pop(){},
      shift(){},
      unshift(){},
      splice(){}
    }
    for(let key in obj){
      const that = this;
      Object.defineProperty(that.vm[namespace], key, {
        enumerable: true,
        value(...args){
          const res = Array.prototype[key].apply(arr, args);
          that.render();
          return res;
        }
      })
    }
    // arr.__proto__ = obj;
    return arr;
  }

  _getNameSpace(now, concat) {
    if (!now) {
      return concat;
    }
    if (!concat) {
      return now;
    }
    return `${now}.${concat}`;
  }

  render(prop) {
    this.emit("render", prop);
  }
}
