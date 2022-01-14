export const arrayPrepend = (value: any, array: any[]) => {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
};
