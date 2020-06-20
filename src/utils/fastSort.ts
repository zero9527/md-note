/**
 * 快速排序
 * 取一个参考值，然后将剩下的分为两份，一份大于参考值的 `left: []`，一份小于参考值 `right: []`
 * 然后分别递归 `left/right`, 返回一个 `left+mid+right` 组成的数组
 * @param {*} arr 排序的数组
 * @param {*} key 一级 key
 */
export default function FastSort<T extends object>(arr: T[], key: string): T[] {
  const getType = (o: any) => Object.prototype.toString.call(o);
  if (getType(arr) !== '[object Array]') return arr;
  if (arr.length <= 1) return arr;

  if (key && !arr[0].hasOwnProperty(key)) {
    console.warn(arr, '[item] 不存在key: ' + key);
    return [];
  }
  if (!key && getType(arr[0]) === '[object Object]') {
    console.warn('传一个 key 作为排序字段');
    return [];
  }

  var mid: T = arr.shift()!;
  var left: T[] = [];
  var right: T[] = [];

  arr.forEach((item: T) => {
    var arrItem = key ? (item.hasOwnProperty(key) ? item[key] : item) : item;

    var midItem = key ? (item.hasOwnProperty(key) ? mid[key] : mid) : mid;

    arrItem <= midItem ? left.push(item) : right.push(item);
  });

  return FastSort(left, key)
    .concat(mid)
    .concat(FastSort(right, key));
}
