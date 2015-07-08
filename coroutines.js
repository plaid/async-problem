'use strict';

const fs = require('fs');
const path = require('path');

const co = require('co');
const R = require('ramda');


// readFile :: String -> String -> Promise String
const readFile = R.curry((encoding, filename) =>
  new Promise((res, rej) => {
    fs.readFile(filename, {encoding: encoding}, (err, data) => {
      if (err != null) {
        rej(err);
      } else {
        res(data);
      }
    });
  })
);

// readFiles :: String -> [String] -> Promise [String]
const readFiles = R.curry((encoding, filenames) =>
  Promise.all(R.map(readFile(encoding), filenames))
);

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  const pathTo = (filename) => path.join(process.argv[2], filename);
  co(function*() {
    const index = yield readFile('utf8', pathTo('index.txt'));
    const filenames = index.match(/^.*(?=\n)/gm).map(pathTo);
    const results = yield readFiles('utf8', filenames);
    return results.join('');
  }).catch(write(process.error)).then(write(process.stdout));
};

if (process.argv[1] === __filename) main();
