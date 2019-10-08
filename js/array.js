Array.prototype.findLastIndex = function (predicate) {
  let l = this.length;
  while (l--) {
    if (predicate(this[l], l, this)) {
      return l;
    }
  }
  return -1;
};

Array.prototype.findIndexFrom = function (predicate, fromIndex) {
  return this.slice(fromIndex).findIndex(predicate);
};
