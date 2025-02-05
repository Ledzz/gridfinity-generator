export type RecursiveArray<T> = T | Array<RecursiveArray<T> | T>;

export const flatten = <T>(array: RecursiveArray<T>): T[] => {
  if (!Array.isArray(array)) {
    return [array];
  }
  return array.flat() as T[];
};
