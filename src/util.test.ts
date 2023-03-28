import { calculateColumns } from './util';

describe('util', () => {
  test('can calculate amount of columns to use in full screen', () => {
    expect(calculateColumns(1)).toEqual(2);
    expect(calculateColumns(2)).toEqual(2);
    expect(calculateColumns(3)).toEqual(2);
    expect(calculateColumns(4)).toEqual(2);
    expect(calculateColumns(5)).toEqual(3);
    expect(calculateColumns(6)).toEqual(3);
    expect(calculateColumns(7)).toEqual(4);
    expect(calculateColumns(8)).toEqual(4);
  });
});
