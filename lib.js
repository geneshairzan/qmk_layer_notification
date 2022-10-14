export function order(a, b) {
  return a.usagePage < b.usagePage && a.usage < b.usage ? 1 : -1;
}
