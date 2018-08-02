// Karma configuration
// Generated on Tue Jul 31 2018 22:17:53 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'util-test/index.js',
    ],


    // list of files / patterns to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'util-test/index.js': 'webpack'
    },

    webpack: {
      module: {
        loaders: [
          // instrument only testing sources with Istanbul
          {
            test: /\.js$/,
            loader: 'istanbul-instrumenter-loader',
            // 这里一定要加上 path.resolve, 否则无法生成覆盖率报告
            include: [
              path.resolve('./js/lib/util'),
              path.resolve('./js/module'),
            ]
          }
        ]
      },
      resolve: {
        moduleDirectories: ['.'],
        alias: {
          jQuery: "js/lib/jQuery-1.11.3.min.js",
        }
      },
      plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.ProvidePlugin({
          $: "jQuery",
        })
      ]
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      fixWebpackSourcePaths: true,
      dir: 'coverage'
    },

    // add
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}