# egg-tracer

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-tracer.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-tracer
[travis-image]: https://img.shields.io/travis/eggjs/egg-tracer.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-tracer
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-tracer.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-tracer?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-tracer.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-tracer
[snyk-image]: https://snyk.io/test/npm/egg-tracer/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-tracer
[download-image]: https://img.shields.io/npm/dm/egg-tracer.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-tracer

<!--
Description here.
-->

## Install

```bash
$ npm i egg-tracer --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.tracer = {
  enable: true,
  package: 'egg-tracer',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.tracer = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
