const express = require('express')
const app = express()

app.use(function (req, res, next) {
  console.log('1')
  next(new Error('liusixin'))
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

//错误处理
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, function(){
  console.log('server is starting at port:3000')
});