'use strict';

const mock = require('egg-mock');

describe('test/msg-flash.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/msg-flash-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app
      .httpRequest()
      .get('/')
      .expect('hi, flash')
      .expect(200);
  });

  it('should GET /session1', () => {
    app
      .httpRequest()
      .get('/session1')
      .expect(302);
    app
      .httpRequest()
      .get('/session2')
      .expect(
        JSON.stringify({
          type: 'error',
          message: {
            ss: 'some error',
          },
        })
      );
  });

  it('should GET /session3', () => {
    app
      .httpRequest()
      .get('/session3')
      .expect(302);
    app
      .httpRequest()
      .get('/session4')
      .expect(
        JSON.stringify({
          type: 'warning',
          message: {
            field: {
              name: 'required',
            },
          },
        })
      );
  });
});
