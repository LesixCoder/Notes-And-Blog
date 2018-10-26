'use strict';

/**
 * egg-msg-flash default config
 * @member Config#msgFlash
 * @property {String} SOME_KEY - some description
 */
exports.flash = {
  key: 'flash',
};

exports.validator = {
  open: 'zh-CN',
  languages: {
    'zh-CN': {
      required: '必须填 %s 字段',
    },
  },
  async formatter(ctx, error) {
    console.info('[egg-y-validator] -> %s', JSON.stringify(error, ' '));
    throw new Error(error[0].message);
  },
};
