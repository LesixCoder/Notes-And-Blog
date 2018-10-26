'use strict';

const assert = require('power-assert');

module.exports = app => {
  const index = app.config.coreMiddleware.indexOf('session');
  assert.ok(index >= 0, 'x require [egg-session] plugins.');

  app.config.coreMiddleware.splice(index, 0, 'flash');
};
