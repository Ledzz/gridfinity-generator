export const range = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i);

export const mapReduce2D = <T>(
  width: number,
  height: number,
  callback: (x: number, y: number) => T,
) => {
  const result: T[] = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      result.push(callback(x, y));
    }
  }

  return result;
};

export const mapReduceWithLink = <T>(
  start: T,
  width: number,
  callback: (i: T, x: number) => T,
) => {
  let value = start;
  for (let x = 0; x < width; x++) {
    value = callback(value, x);
  }
  return value;
};

export const mapReduce2DWithLink = <T>(
  start: T,
  width: number,
  height: number,
  callback: (i: T, x: number, y: number) => T,
) => {
  let value = start;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      value = callback(value, x, y);
    }
  }
  return value;
};
