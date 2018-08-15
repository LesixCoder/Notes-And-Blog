var seneca = require( 'seneca' )()
    
seneca.add({role: 'math', cmd: 'sum'}, function (msg, respond) {
  var sum = msg.left + msg.right
  respond(null, {answer: sum})
});

seneca.add({role: 'math', cmd: 'sum', integer: true}, function (msg, respond) {
  this.act({
    role: 'math', 
    cmd: 'sum', 
    left: Math.floor(msg.left), 
    right: Math.floor(msg.right)}, 
    respond
  );
});

seneca.act({role: 'math', cmd: 'sum', left: 1.5, right: 2.5}, console.log)

seneca.act({role: 'math', cmd: 'sum', left: 1.5, right: 2.5, integer: true}, console.log)