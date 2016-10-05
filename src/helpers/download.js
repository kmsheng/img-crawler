import request from 'request';
import sizeOf from 'image-size';
import fs from 'fs';
import {basename, join} from 'path';

export default function download({urls, dimensionLimit, savePath, size = 200, headers = {}, delay = 500}) {

  return new Promise((resolve, reject) => {

    let index = 0;

    (function recursiveDownload() {
      setTimeout(() => {

        const url = urls[index++];
        if (! url) {
          return resolve();
        }
        singleDownload({url, savePath, size, headers})
          .then(({dimensions, buffer}) => {

            const path = join(savePath, basename(url));
            const {width, height} = dimensions || {};

            if ((width >= dimensionLimit.width) && (height >= dimensionLimit.height)) {
              writeFile(path, buffer)
                .then(() => console.info('downloaded url %s', url))
                .catch((err) => console.error('write file error: %s', err));
            }
            else {
              console.error('dropped url %s due to dissatisfied dimensions %s', url, JSON.stringify(dimensions));
            }
            recursiveDownload();
          })
          .catch((err) => {
            console.error('download err: %s', err);
            recursiveDownload();
          });

      }, delay);
    })();

  });
}

function writeFile(path, buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      err ? reject(err) : resolve();
    });
  });
}

function singleDownload({url, size, headers}) {

  return new Promise((resolve, reject) => {

    let dimensions;
    let buffer = new Buffer([]);

    request({url, headers})
      .on('data', handleData)
      .on('error', handleError)
      .on('end', handleEnd);

    function handleData(chunk) {
      try {
        buffer = Buffer.concat([buffer, chunk]);
        dimensions = sizeOf(buffer);
      }
      catch (err) {
        console.error('error fetching %s dimensions: %s', url, err);
      }
    }

    function handleError(err) {
      reject(err);
    }

    function handleEnd() {
      resolve({dimensions, buffer});
    }
  });

}
