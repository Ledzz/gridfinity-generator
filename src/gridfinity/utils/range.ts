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
