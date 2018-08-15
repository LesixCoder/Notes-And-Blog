var seneca = require('seneca')()
  .use('email')
  .use('sms')
  .use('post');

seneca.listen({ port: 1932, host: '127.0.0.1' });