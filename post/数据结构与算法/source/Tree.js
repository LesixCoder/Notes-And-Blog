/**
 * 二叉树
 */
class Node {
  constructor(data, left, right) {
    this.data = data
    this.left = left
    this.right = right
  }
}

class BST {
  constructor() {
    this.root = null
  }
  insert (data) {
    let node = new Node(data, null, null)
    if (!this.root) this.root = node
    else {
      let current = this.root, parent
      while (true) {
        parent = current
        if (node.data < current.data) {
          current = current.left
          if (!current) {
            parent.left = node
            break
          }
        } else {
          current = current.right
          if (!current) {
            parent.right = node
            break
          }
        }
      }
    }
  }
  inOrder (node) {
    if (node) {
      this.inOrder(node.left)
      console.log(node.data)
      this.inOrder(node.right)
    }
  }
}

let nums = new BST();
nums.insert(23);
nums.insert(45);
nums.insert(26);
nums.insert(47);
nums.insert(37);
nums.insert(3);
nums.insert(101);
//console.log(nums.getMin())
// nums.remove(3);
nums.inOrder(nums.root);
