/**
 * 单向链表
 */
class Node {
  constructor(ele) {
    this.ele = ele
    this.next = null
    this.prev = null
  }
}

class LinkList {
  constructor() {
    this.head = new Node('head')
  }
  // 查找
  find (ele) {
    let curNode = this.head
    while (curNode.ele !== ele) {
      curNode = curNode.next
    }
    return curNode
  }
  insert (newEle, ele) {
    let curNode = this.find(ele)
    let newNode = new Node(newEle)
    newNode.next = curNode.next
    curNode.next = newNode
  }
  remove (ele) {
    let prevNode = this.findPrev(ele)
    let curNode = this.find(ele)
    if (prevNode.next !== null) {
      prevNode.next = curNode.next
      curNode.next = null
    }
  }
  findPrev (ele) {
    let curNode = this.head
    while (curNode.next !== null && curNode.next.ele !== ele) {
      curNode = curNode.next
    }
    return curNode
  }
  loop () {
    let curNode = this.head
    while (curNode.next !== null) {
      curNode = curNode.next
      console.log(curNode.ele)
    }
  }
}
// let cities = new LinkList();
// cities.insert('first', 'head');
// cities.insert('second', 'first');
// cities.insert('third', 'second');
// cities.loop();
// console.log(cities.find('second'));
// console.log("=====================");
// cities.remove('second');
// cities.loop();

class DoubleLinkList {
  constructor() {
    this.head = new Node('head')
  }
  // 查找
  find (ele) {
    let curNode = this.head
    while (curNode.ele !== ele) {
      curNode = curNode.next
    }
    return curNode
  }
  findLast () {
    var currNode = this.head;
    while (currNode.next !== null) {
      currNode = currNode.next;
    }
    return currNode;
  }
  insert (newEle, ele) {
    let curNode = this.find(ele)
    let newNode = new Node(newEle)
    newNode.next = curNode.next
    newNode.prev = curNode
    curNode.next = newNode
    if (newNode.next !== null) {
      newNode.next.prev = newNode
    }
  }
  remove (ele) {
    let curNode = this.find(ele)
    if (curNode.next !== null) {
      curNode.prev.next = curNode.next
      curNode.next.prev = curNode.prev
      curNode.next = null
      curNode.prev = null
    } else {
      curNode.prev.next = null
      curNode.prev = null
    }
  }
  loop () {
    let curNode = this.head
    while (curNode.next !== null) {
      curNode = curNode.next
      console.log(curNode.ele)
    }
  }
  loopReverse () {
    let curNode = this.findLast()
    while (curNode.prev !== null) {
      console.log(curNode.ele)
      curNode = curNode.prev
    }
  }
}

let cities = new DoubleLinkList();
cities.insert('first', 'head');
cities.insert('second', 'first');
cities.insert('third', 'second');
cities.remove('second');
cities.loop();
console.log('========')
cities.loopReverse();
