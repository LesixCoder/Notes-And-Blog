/**
 * 阶乘（尾递归优化）
 */
function factorial (n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function factorial1 (n, total = 1) {
  if (n <= 1) return total
  return factorial1(n - 1, total * n)
}

console.log(factorial(5), factorial1(5))
