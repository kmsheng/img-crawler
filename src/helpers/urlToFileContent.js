import request from 'request';

export default function urlToFileContent(url) {
  return new Promise((resolve, reject) => {
    request({url, method: 'GET'}, handleReq);

    function handleReq(err, res, body) {
      if ((! err) && (200 === res.statusCode)) {
        resolve(body);
      }
      else {
        console.error('Error fetching %s %s', url, err);
        reject(err);
      }
    }
  });
}
