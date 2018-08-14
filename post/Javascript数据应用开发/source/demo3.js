class Node {
  constructor(name) {
    this.name = name
    this.parent = null
    this.children = []
  }
  
  addChild(node) {
    node.parent = this
    this.children.push(node)

    return this
  }

  siblings() {
    const self = this
  
    if (this.parent) {
      return this.parent.children.filter(function(node) {
        return node !== self
      })
    } else {
      return []
    }
  }

  get degree() {
    return this.children.length
  }

  getDepthByRoot(root) {
    let depth = 0
    let currNode = this

    while (currNode.parent !== root) {
      depth++
      currNode = currNode.parent
    }

    return depth + 1
  }

  get depth() {
    return this.getDepthByRoot(null)
  }

  get height() {
    const queue = [ this ]
    let deepestNode = this

    while (queue.length > 0) {
      const len = queue.length

      for (let i = 0; i < len; ++i) {
        const currNode = queue.shift()

        deepestNode = currNode

        if (currNode.children.length > 0) {
          queue.push(...currNode.children)
        }
      }
    }

    return deepestNode.getDepthByRoot(this)
  }

  toString(join = true) {
    let parts = [ this.name ]

    if (this.children.length > 0) {
      parts = parts.concat(this.children
        .map(function(node) {
          return node.toString(false)
        })
        .reduce(function(left, right) {
          return left.concat(right)
        })
        .map(function(line) {
          return '  ' + line
        })
      )
    }

    if (join) {
      return parts.join('\n')
    } else {
      return parts
    }
  }
}

const root = new Node('root')
const node1 = new Node('node 1')
const node2 = new Node('node 2')
const node3 = new Node('node 3')

root.addChild(node1).addChild(node2)
node1.addChild(node3)
console.log(node1.siblings())
console.log(root.degree)