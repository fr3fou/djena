type Parser<T> = (s: string) => [[T, string]];

// wip
const parseInteger: Parser<number> = (s: string) => {
  return [[5, s]];
};
