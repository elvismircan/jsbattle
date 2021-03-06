require('babel-register')();
//import 'babel-polyfill';


const childProcess = require('child_process');
const through = require("through2");
const Mocha = require('mocha');

module.exports = function (gulp, config, plugins) {
  return function(done) {

    var mocha = new Mocha();
    return gulp.src(config.webpage.test)
      .pipe(through.obj(
        function(file, enc, cb) {
          mocha.addFile(file.path);
          cb(null, file);
        },
        function() {
          let scriptPath = config.dist + '/jsbattle.js';
          let scriptArgs = [
            "start",
            "-h", "localhost",
            "-p", "8070",
            "-d", config.tmp + "jsbattle-test-data"
          ];
          console.log("Starting server process");

          let serverProcess = childProcess.fork(scriptPath, scriptArgs, {silent: false});
          serverProcess.on('message', (msg) => {
            if(msg == 'ready') {

              mocha.run(function(failures){
                console.log("Killing server process");
                serverProcess.kill();
                if(failures) {
                  done("Tests failed");
                } else {
                  done();
                }
              });

            }
          })

        }
      ))
      .on('error', function(){
        process.emit('exit');
      })
  }
};
