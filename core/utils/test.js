const p1 = Symbol("1");

class Base {
  constructor(){
    this[p1] = "hello";
    this._p1 = p1;
  }
}

class Child extends Base {
  test(){
    console.log(this[this._p1]);
  }
}

const test = new Child();
console.log(test._p1);