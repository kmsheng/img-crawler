export default function getTitleFromStr(str) {
  return (/<title>(.*?)<\/title>/.exec(str) || [])[1] || '';
}
