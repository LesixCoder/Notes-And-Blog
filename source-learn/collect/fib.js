/**
 * 斐波那契数列
 * 斐波那契数列从第三项开始，每一项都等于前两项之和。
 * 指的是这样一个数列：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 …
 */

//  递归 O(2^n)
function fib (n) {
  if (n === 1 || n === 2) return n - 1
  return fib(n - 1) + fib(n - 2)
}

// 循环 O(n)
function fib1 (n) {
  let a = 0;
  let b = 1;
  let c = a + b;
  let index = 3
  while (index < n) {
    a = b;
    b = c;
    c = a + b;
    index++
  }
  return c;
}

console.log(fib(10), fib1(10))
