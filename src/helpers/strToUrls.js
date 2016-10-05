export default function strToUrls(regexp, str = '') {
  const urls = [];
  let matches;
  while (matches = regexp.exec(str)) {
    urls.push(matches[0]);
  }
  return urls;
}
