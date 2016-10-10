import should from 'should';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

import {download} from './../';

describe('download', () => {

  beforeEach((done) => {
    mkdirp('tmp', (err) => {
      if (err) {
        throw err;
      }
      done();
    })
  });

  it('should download my image', (done) => {
    download({
      urls: ['http://s2.imgs.cc/img/gYyyDxB.jpg'],
      savePath: './tmp',
      dimensionLimit: {
        width: 1,
        height: 1
      },
      delay: 500
    })
    .then(() => done());
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
