import should from 'should';
import {unique} from './../';

describe('unique', () => {

  it('should make my array unique', () => {
    unique(['a', 'a', 'b', 'c']).should.deepEqual(['a', 'b', 'c']);
  });

  it('should not touch my array, if my array is already unique', () => {
    unique(['甲', '乙', '丙']).should.deepEqual(['甲', '乙', '丙']);
  });
});
