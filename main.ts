type Parser<T> = (s: string) => [[T, string]];

function result<T>(v: T): Parser<T> {
  return (input) => [[v, input]];
}

// // wip
// const parseInteger: Parser<number> = (s: string) => {
//   return [[5, s]];
// };
