export function range(from, to, step) {
  const range = [];
  let x = from;
  while (x <= to) {
    range.push(x);
    x += step;
  }
  return range
}
