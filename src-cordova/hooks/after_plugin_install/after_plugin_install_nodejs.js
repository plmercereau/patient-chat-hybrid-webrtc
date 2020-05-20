#!/usr/bin/env node
module.exports = function(context) {
  console.log('here');
  const fs = require('fs');
  const path = require('path');
  console.log(context);
  const filePath = path.join(
    context.opts.projectRoot,
    'platforms',
    'android',
    'build-extras.gradle'
  );
  console.log(filePath);
  return fs.promises
    .writeFile(filePath, 'ext.cdvMinSdkVersion = 21\n', 'utf-8')
    .then(() => 'done')
}
