import program from 'commander';
import {log, download, mkdirp, unique, lazyLoad, getTitleFromStr,
  urlToFileContent, inArray, strToUrls} from './helpers';
import {basename} from 'path';
import URL from 'url';

program.version('0.0.1')
  .option('-m, --max-depth [maxDepth]', 'Max depth of url to crawl', 0)
  .option('-e, --ext [extensions]', 'Specify image types to crawl', 'jpg,jpeg,png,gif')
  .option('-d, --delay [delay]', 'Duration between each request', 300)
  .option('-w, --width [imageWidth]', 'Duration between each request', 300)
  .option('-h, --height [imageHeight]', 'Duration between each request', 300);

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ node index.js http://ck101.com/thread-3655237-1-1.html');
  console.log('');
});

program.parse(process.argv);

const {delay, maxDepth, ext, width, height} = program;

const imageTypes = ext.split(',').map((type) => type.trim());
const regexpUrl = new RegExp(`(https?:)*//[^/\\s]+/\\S+\\.(${imageTypes.join('|')}|js)`, 'gi');
const regexpImage = new RegExp(`\\.(${imageTypes.join('|')})$`, 'i');
const downloadUrl = program.args[program.args.length -1];

const usedUrls = [];
const isImage = (url) => regexpImage.test(url);

if (! downloadUrl) {
  throw 'Please specify download URL. For example: npm start http://ck101.com/thread-3655237-1-1.html\?ref=idx_hot';
}

log.debug('image types', imageTypes);

async function digImageUrls(str = '', lastUrls = [], depth = 0) {

  const newUrls = strToUrls(regexpUrl, str);
  const newImageUrls = newUrls.filter((url) => isImage(url));

  log.trace('new image urls: %s', newImageUrls.length);

  const urls = unique(lastUrls.concat(newUrls));
  const embeddedUrls = urls.filter((url) => ! isImage(url) && (! inArray(usedUrls, url)));
  const imageUrls = urls.filter((url) => isImage(url));

  log.trace('image urls after merged: %s\n', imageUrls.length);

  async function recursiveDig() {

    const embeddedUrl = embeddedUrls.shift();

    if (! embeddedUrl) {
      return urls;
    }

    usedUrls.push(embeddedUrl);

    log.debug('fetching embedded url: %s', embeddedUrl);
    log.debug('current depth: %s', depth);

    let fileContent = '';

    try {
      fileContent = await urlToFileContent(embeddedUrl);
    }
    catch (err) {
      log.error('ulToFileContent error: %s', err);
      return await recursiveDig();
    }

    if (fileContent) {
      log.debug('sleep for %s', delay);
      return await lazyLoad(() => digImageUrls(fileContent, urls, depth + 1), delay);
    }
  }

  if (depth < maxDepth) {
    return await recursiveDig();
  }
  return urls.filter((url) => isImage(url));
}

async function main() {
  try {
    const body = await urlToFileContent(downloadUrl);
    const title = getTitleFromStr(body);
    const urls = await digImageUrls(body);
    const urlParts = URL.parse(downloadUrl);
    const savePath = `download/${urlParts.hostname}/${title}`;
    await mkdirp(savePath);
    await download({
      urls,
      savePath,
      headers: {},
      dimensionLimit: {
        width,
        height
      },
      delay
    });
  }
  catch (err) {
    log.error('error: %s', err);
  }
}

main();
