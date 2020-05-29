export default class Base {
  constructor() {
    // 抽象类判断
    if (new.target == Base) {
      throw new Error("AbstractClass not be new!");
    }
  }
  get className() {
    if (this && this.constructor && this.constructor.toString()) {
      if (this.constructor.name) {
        return this.constructor.name;
      }
      let str = this.constructor.toString();
      let arr;
      if (str.charAt(0) == "[") {
        arr = str.match(/\w+\s∗(\w+)/);
      } else {
        arr = str.match(/function\s*(\w+)/);
      }
      if (arr && arr.length == 2) {
        return arr[1];
      }
    }
    return undefined;
  }
  /**
   * 连接信号槽: 确定事件的处理回调, 可以多次调用执行多个回调函数
   * @param {String} signal 信号名称
   * @param {Function} slot 处理回调函数
   * @param {*} context 执行slot函数的上下文
   */
  connect(signal, slot, context) {
    if (!this.signals) {
      this.signals = {};
    }
    if (!this.signals[signal]) {
      this.signals[signal] = [];
    }
    this.signals[signal].push({ slot, context });
  }

  /**
   * 激活信号(事件),立刻执行已经connect的回调函数
   * @param {String} signal 信号名称
   * @param  {...any} args 信号(事件)参数
   */
  emit(signal, ...args) {
    if (
      !this.signals ||
      !this.signals[signal] ||
      !this.signals[signal].length
    ) {
      console.warn(`信号: ${signal} 未连接`);
      return;
    }
    for (const slot of this.signals[signal]) {
      slot.slot.apply(slot.context, args);
    }
  }

  /**
   * 接触信号(事件)与回调函数绑定关系,解除后激活信号(事件)将不在执行对应的slot回调函数
   * @param {String} signal 信号名称
   * @param {Function} slot 回调函数
   * @returns {Boolean} true: 解除成功, false: 解除失败
   */
  disconnect(signal, slot) {
    if (
      !this.signals ||
      !this.signals[signal] ||
      !this.signals[signal].length
    ) {
      return false;
    }
    const slotList = this.signals[signal];
    if (!slot) {
      delete this.signals[signal];
    } else {
      for (let i = 0; i < slotList.length; i++) {
        if (slot == slotList[i].slot) {
          slotList.splice(i, 1);
          i--;
        }
      }
    }
    return true;
  }
}
