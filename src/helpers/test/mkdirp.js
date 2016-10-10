import should from 'should';
import rimraf from 'rimraf';
import fs from 'fs';
import {mkdirp} from './../';

const isDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(err);
      }
      return stats.isDirectory() ? resolve() : reject();
    });
  });
};

describe('mkdirp', () => {

  it('should create my nested folder', (done) => {

    (async function() {

      await mkdirp('tmp/a/b/c');
      await Promise.all([
        isDirectory('tmp/a'),
        isDirectory('tmp/a/b'),
        isDirectory('tmp/a/b/c')
      ])

      done();
    })();
  });

  afterEach((done) => {
    rimraf('tmp', (err) => {
      if (err) {
        throw err;
      }
      done();
    });
  });

});
