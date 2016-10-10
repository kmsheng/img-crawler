import should from 'should';
import {lazyLoad} from './../';

describe('lazyLoad', () => {

  it('should load my function later', (done) => {

    const now = Date.now();

    lazyLoad(() => {
      (Date.now() - now).should.aboveOrEqual(1000);
      done();
    }, 1000)

  });
});
