/**
 * 集合
 */
class Set {
  constructor() {
    this.store = []
  }
  // 添加（不允许添加重复元素）
  add (data) {
    if (this.store.indexOf(data) === -1) {
      this.store.push(data)
    } else {
      return false
    }
  }
  remove (data) {
    let pos = this.store.indexOf(data)
    if (pos > -1) {
      this.store.splice(pos, 1)
    } else {
      return false
    }
  }
  contains (data) {
    if (this.store.indexOf(data) > -1) return true;
    else return false;
  }
  // 全集
  union (set) {
    let tempSet = new Set()
    for (let i = 0; i < this.store.length; i++) {
      tempSet.add(this.store[i])
    }
    for (let i = 0; i < set.store.length; i++) {
      tempSet.add(set.store[i])
    }
    return tempSet
  }
  // 交集
  intersect (set) {
    let tempSet = new Set()
    for (let i = 0; i < this.store.length; i++) {
      if (set.contains[this.store[i]]) {
        tempSet.add(this.store[i])
      }
    }
    return tempSet
  }
  // 补集
  difference (set) {
    let tempSet = new Set()
    for (let i = 0; i < this.store.length; i++) {
      if (!set.contains[this.store[i]]) {
        tempSet.add(this.store[i])
      }
    }
    return tempSet
  }
  // 是否是子集
  subset (set) {
    if (this.store.length < set.store.length) return false
    for (let i = 0; i < set.store.length; i++) {
      if (!this.contains[set.store[i]]) {
        return false
      }
    }
    return true
  }
}

let names = new Set();
names.add("小红");
names.add("小丽");
names.add("小张");
names.add("Tom");
names.add("Jack");
//console.log(names.show());
let cis = new Set();
cis.add('小张');
cis.add('Jack');
cis.add('Tom');
console.log(names.union(cis))
// var it = new Set();
// it = names.union(cis);
// console.log("并集+++++++"+it.show());
// it = names.intersect(cis);
// console.log("交集+++++++"+it.show());
// it = names.difference(cis);
// console.log("补集+++++++"+it.show());
// console.log(names.subset(cis));
