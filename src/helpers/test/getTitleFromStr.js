import should from 'should';
import {getTitleFromStr} from './../';

describe('getTitleFromStr', () => {

  it('should get title from string', () => {
    getTitleFromStr('<title>faith</title>').should.equal('faith');
  });

  it('should get empty title from problematic string', () => {
    getTitleFromStr('this has no title tag').should.equal('');
  });
});
