const { app, crashReporter } = require('electron');

function init() {
  crashDumpsDir = app.getPath('crashDumps');
  console.log('————————crashDumpsDir:', crashDumpsDir);
  crashReporter.start({
    submitURL: 'http://127.0.0.1:33855/crash',
    ignoreSystemCrashHandler: false,
    compress: false,
    uploadToServer: true,
  })
}

module.exports = {
  init
}