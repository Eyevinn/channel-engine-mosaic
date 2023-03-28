export function calculateColumns(size: number) {
  let columns = 2;
  if (size > 4) {
    columns = Math.ceil(size / 2);
  }
  return columns;
}
