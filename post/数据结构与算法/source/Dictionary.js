/**
 * 字典
 */
class Dictionary {
  constructor() {
    this.dataStore = new Array();
  }
  add (key, value) {
    this.dataStore[key] = value;
  }
  find (key) {
    return this.dataStore[key];
  }
  remove (key) {
    delete this.dataStore[key];
  }
  showAll () {
    var datakeys = Object.keys(this.dataStore).sort();
    for (var keys in datakeys) {
      console.log(datakeys[keys] + "-->" + this.dataStore[datakeys[keys]]);
    }
  }
  count () {
    return Object.keys(this.dataStore).length;
  }
  clear () {
    var datakeys = Object.keys(this.dataStore);
    for (var keys in datakeys) {
      delete this.dataStore[datakeys[keys]];
    }
  }
}

var pbook = new Dictionary();
pbook.add('a', '111');
pbook.add('b', '222');
pbook.add('c', '333');
pbook.add('d', '444');
pbook.showAll();
