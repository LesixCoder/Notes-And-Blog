var a = 20
function init () {
  var a = 30
  var s = new Function('console.log(a)')
  s()
  s = new Function(console.log(a))
  s()
}
init()
