// 词频统计

_.reduceByKey = function(tuples, reduceCallback) {
  const grouped = _.groupBy(tuples, function(tuple) {
    return tuple[0]
  })
  
  return _.toPairs(_.mapValues(grouped, function(tuples) {
    return _.chain(tuples)
      .map(function(tuple) {
        return tuple[1]
      })
      .reduce(reduceCallback)
      .value()
  }))
}

const originalText = `
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`
const words = originalText.toLowerCase().match(/\w+/g)

const tuples = words.map(function(word) {
  return [ word, 1 ]
})

const wordCountResult = _.reduceByKey(tuples, function(left, right) {
  return left + right
})

console.log(wordCountResult)

