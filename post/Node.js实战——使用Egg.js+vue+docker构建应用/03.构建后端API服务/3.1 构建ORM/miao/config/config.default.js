'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539755316355_4681';

  // add your config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql',
    database: 'miao',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
  }

  return config;
};
