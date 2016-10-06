import request from 'request';
import {log} from '.';

export default function urlToFileContent(url) {
  return new Promise((resolve, reject) => {
    request({url, method: 'GET'}, handleReq);

    function handleReq(err, res, body) {
      if ((! err) && (200 === res.statusCode)) {
        resolve(body);
      }
      else {
        log.error(`Error fetching ${url} ${err}`);
        reject(err);
      }
    }
  });
}
