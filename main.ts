type Parser<T> = (s: string) => [[T, string]?];
type char = string;

function result<T>(v: T): Parser<T> {
  return (input) => [[v, input]];
}

function zero<T>(): Parser<T> {
  return (_) => [];
}

function item(): Parser<char> {
  return (input) => {
    switch (input) {
      case "":
        return [];
      default:
        return [[input[0], input.slice(1)]];
    }
  };
}
