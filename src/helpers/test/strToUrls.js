import should from 'should';
import {strToUrls} from './../';

describe('strToUrls', () => {

  it('should use provided regexp', () => {

    const regexpUrl = new RegExp(`(https?:)?//[^/\\s]+/\\S+\\.(jpeg|jpg|png|js)`, 'gi');
    const html = `<div>
      <img src="http://s2.imgs.cc/img/gYyyDxB.jpg" alt="image" />
      <img src="http://s2.imgs.cc/img/Bmx2JEb.jpg" alt="image" />
      <img src="http://s1.imgs.cc/img/waQetMc.jpg" alt="image" />
      <a href="http://imgs.cc/">貼圖空間</a>
    </div>`;
    const urls = strToUrls(regexpUrl, html);

    urls.should.deepEqual([
      'http://s2.imgs.cc/img/gYyyDxB.jpg',
      'http://s2.imgs.cc/img/Bmx2JEb.jpg',
      'http://s1.imgs.cc/img/waQetMc.jpg'
    ]);

  });

});
