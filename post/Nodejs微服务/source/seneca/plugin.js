module.exports = function(options) {
  this.add({role: 'employee', cmd: 'add'}, function(msg, respond){
    this.make('employee').data$(msg.data).save$(respond);
  });

  this.find({role: 'employee', cmd: 'get'}, function(msg, respond){
    this.make('employee').load$(msg.id, respond);
  });
}

var seneca = require('seneca')().use('employees-storage')
var employee = {
  name: "David",
  surname: "Gonzalez",
  position: "Software Developer"
}

function add_employee() {
  seneca.act({role: 'employee', cmd: 'add', data: employee},
    function (err, msg) {
      console.log(msg);
    }
  );
}
add_employee();