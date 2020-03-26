/**
 * 散列表
 */
class Hash {
  constructor(ele) {
    this.table = new Array(137)
  }

  // 线性探测法
  buildChians () {
    for (let i = 0; i < this.table.length; i++) {
      this.table[i] = new Array();
    }
  }

  //除留余数法
  simpleHash (data) {
    let total = 0
    for (let i = 0; i < data.length; i++) {
      total += data.charCodeAt(i)
    }
    return total % this.table.length
  }

  betterHash (data) {
    const H = 31
    let total = 0
    for (let i = 0; i < data.length; i++) {
      total += H * total + data.charCodeAt(i)
    }
    if (total > 0) total += this.table.length - 1;
    return total % this.table.length
  }
  put (data) {
    let pos = this.simpleHash(data)
    if (this.table[pos] == undefined) {
      this.table[pos] = data;
    } else {
      while (this.table[pos] != undefined) {
        pos++
      }
      this.table[pos] = data
    }
  }
  get (key) {
    let hash = this.simpleHash(key);
    console.info(hash);
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i] == key) {
        return i;
      }
    }
    return undefined;
  }
  showDistro () {
    let n = 0;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i] != undefined) {
        console.log("键值是-》" + i + "值是【" + this.table[i] + "】");
      }
    }
  }
  remove (data) {
    this.table[this.simpleHash[data]] = undefined;
  }
}


var hTable = new Hash();
hTable.put("china");
hTable.put("japan");
hTable.put("america");
hTable.put("nicha");
console.log(hTable.get('nicha'));
hTable.showDistro();
