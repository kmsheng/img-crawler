import should from 'should';
import {urlToFileContent} from './../';

describe('urlToFileContent', () => {

  it('should download url content', (done) => {
    urlToFileContent('https://www.facebook.com/')
      .then((content) => {
        content.should.match(/facebook/);
        done();
      });
  });

});
