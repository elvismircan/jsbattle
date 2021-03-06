const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack-stream');
const through = require('through2');
const fs = require('fs');


module.exports = function (gulp, config, plugins) {
    return function () {
      var webpackPlugins = [];
      if(!config.devMode) {
        webpackPlugins.push(new UglifyJSPlugin({
          sourceMap: true
        }));
      }
      return gulp.src(config.webpage.sources.concat(config.webpage.lib))
        .pipe(webpack({
          entry: {
            app: config.webpage.entry
          },
          devtool: (!config.devMode) ? "source-map" : null,
          output: {
            filename: 'webpage.min.js',
            library: 'webpage',
            libraryTarget: 'var'
          },
          node: {
          	fs: 'empty'
          },
          plugins: webpackPlugins,
          module: {
            loaders: [
              {
                test: /\.jsx?$/,
                exclude: /(nodes_modules)/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react", "stage-2"],
                    plugins: ["transform-object-rest-spread", "transform-es2015-destructuring"]
                }
              },
            ]
          }
        }))
        .pipe(plugins.injectVersion())
        .pipe(through.obj(
          function(file, enc, cb) {

            var filename = __dirname + '/../../build_number.json';
            var buildInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));

            var contents = String(file.contents);
            contents = contents.replace(/%%GULP_INJECT_BUILD%%/g, buildInfo.build);

            file.contents = new Buffer(contents)

            cb(null, file);
          }
        ))
        .pipe(gulp.dest(config.dist + "public/js/"))
    };
};
