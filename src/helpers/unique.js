import {inArray} from '.';

export default function unique(arr) {
  const newArr = [];
  arr.forEach((elem) => {
    if (! inArray(newArr, elem)) {
      newArr.push(elem);
    }
  });
  return newArr;
}
