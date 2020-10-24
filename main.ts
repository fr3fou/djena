type Parser<T> = (s: string) => Array<[T, string]>;
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
  return (input) =>
    p(input)
      .map(([output, inputPrime]) => fn(output)(inputPrime))
      .flat();
}

// function fst<T, U>(tuple: [T, U]): T {
//   return tuple[0];
// }

// function snd<T, U>(tuple: [T, U]): U {
//   return tuple[1];
// }

// function head<T>(x: string | T[]) {
//   return x[0];
// }

// function tail<T>([, ...xs]: string | T[]) {
//   return xs;
// }
