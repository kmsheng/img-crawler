import ProgressBar from 'progress';
import request from 'request';
import sizeOf from 'image-size';
import fs from 'fs';
import {basename, join} from 'path';
import {log} from '.';

export default function download({urls, dimensionLimit, savePath, headers = {}, delay = 500}) {

  return new Promise((resolve, reject) => {

    let index = 0;

    const bar = new ProgressBar('\n\nprogress :percent [:bar]\n', {total: urls.length});

    (function recursiveDownload() {
      const timer = setTimeout(() => {

        bar.tick();

        if (bar.complete) {
          clearTimeout(timer);
        }

        const url = urls[index++];
        if (! url) {
          return resolve();
        }
        singleDownload({url, savePath, headers})
          .then(({dimensions, buffer}) => {

            const path = join(savePath, basename(url));
            const {width, height} = dimensions || {};

            if ((width >= dimensionLimit.width) && (height >= dimensionLimit.height)) {
              writeFile(path, buffer)
                .then(() => log.info(`downloaded url ${url}`))
                .catch((err) => log.error(`write file error: ${err}`));
            }
            else if (! dimensions) {
              log.warn(`found an image without dimensions ${url}`);
            }
            else {
              log.info(`dropped url ${url} due to dissatisfied dimensions ${JSON.stringify(dimensions)}`);
            }
            recursiveDownload();
          })
          .catch((err) => {
            log.error(`download err: ${err}`);
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

function singleDownload({url, headers}) {

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
        log.error(`error fetching ${url} dimensions: ${err}`);
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
