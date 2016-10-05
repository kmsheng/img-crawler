export default function lazyLoad(cb, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(cb()), delay);
  });
}
