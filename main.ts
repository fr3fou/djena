// Parser takes in input and returns either an empty array or a singleton array.
// Singleton array with a tuple of the parsed value and the rest of the input means it parsed successfully
// Empty array means it failed parsing
type Parser<T> = (s: string) => Array<[T, string]>;
type char = string;

// result unconditionally returns the value
function result<T>(v: T): Parser<T> {
  return (input) => [[v, input]];
}

// zero always fails
function zero<T>(): Parser<T> {
  return (_) => [];
}

// item parses one character and returns the rest
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

// bind combines 2 parsers
function bind<T, U>(p: Parser<T>, fn: (a: T) => Parser<U>): Parser<U> {
  return (input) =>
    p(input)
      .map(([output, inputPrime]) => fn(output)(inputPrime))
      .flat();
}

// sat parses characters, until the predicate returns false
function sat(pred: (c: char) => boolean): Parser<char> {
  return bind(item(), (ch) => (pred(ch) ? result(ch) : zero()));
}

// char parses a specific character
function char(c: char): Parser<char> {
  return sat((d) => d == c);
}

function main() {
  const bParser = char("b");
  let start = "bbbbbbbbbbbbb";
  while (true) {
    const out = bParser(start);
    if (out.length == 0) {
      return;
    }
    console.log(out[0]);
    start = out[0][1];
  }
}
main();
