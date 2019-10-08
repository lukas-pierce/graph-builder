Array.prototype.findLastIndex = function (predicate) {
  let l = this.length;
  while (l--) {
    if (predicate(this[l], l, this)) {
      return l;
    }
  }
  return -1;
};
