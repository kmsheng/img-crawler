import mkdirp from 'mkdirp';

export default function(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      err ? reject(err) : resolve();
    });
  });
}
