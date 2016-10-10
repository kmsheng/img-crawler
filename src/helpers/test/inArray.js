import should from 'should';
import {inArray} from './../';

describe('inArray', () => {

  it('should return true if an element was in an array', () => {

    const res = inArray(['apple', 'orange', 'banana'], 'orange');
    res.should.equal(true);
  });

  it('should return true if an element was NOT in an array', () => {

    const res = inArray(['apple', 'orange', 'banana'], 'cranberry');
    res.should.equal(false);
  });
});
