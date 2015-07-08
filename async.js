'use strict';

const fs = require('fs');
const path = require('path');

const async = require('async');


const readFile = (filename, callback) => {
  fs.readFile(filename, {encoding: 'utf8'}, callback);
};


const main = () => {
  const dir = process.argv[2];
  readFile(path.join(dir, 'index.txt'), (err, data) => {
    if (err != null) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
    const filenames = data.match(/^.*(?=\n)/gm).map(s => path.join(dir, s));
    async.map(filenames, readFile, (err, results) => {
      if (err != null) {
        process.stderr.write(err.message + '\n');
        process.exit(1);
      } else {
        process.stdout.write(results.join(''));
        process.exit(0);
      }
    });
  });
};

if (process.argv[1] === __filename) main();
