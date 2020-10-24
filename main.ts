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

function bind<T, U>(p: Parser<T>, fn: (a: T) => Parser<U>): Parser<U> {
  return (input) => {
    const [output, inputPrime] = p(input)[0];
    return fn(output)(inputPrime);
  };
}
