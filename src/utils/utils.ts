export function getCounterObj(array: string[]): { [key: string]: number } {
  const countObj: { [key: string]: number } = {};
  for (const element of array) {
    if (countObj.hasOwnProperty(element)) {
      countObj[element]++;
    } else {
      countObj[element] = 1;
    }
  }
  return countObj;
}
