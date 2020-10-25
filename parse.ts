// Parser takes in input and returns either an empty array or a singleton array.
// Singleton array with a tuple of the parsed value and the rest of the input means it parsed successfully
// Empty array means it failed parsing
export type Parser<T> = (s: string) => Array<[T, string]>
export type char = string

// result unconditionally returns the value
export function result<T>(v: T): Parser<T> {
  return (input) => [[v, input]]
}

// zero always fails
export function zero<T>(): Parser<T> {
  return (_) => []
}

// item parses one character and returns the rest
export function item(): Parser<char> {
  return (input) => {
    switch (input) {
      case "":
        return []
      default:
        return [[input[0], input.slice(1)]]
    }
  }
}

// bind binds 2 parsers
// It's equivalent to haskell's monad >>= operator
export function bind<T, U>(p: Parser<T>, fn: (a: T) => Parser<U>): Parser<U> {
  return (input) =>
    p(input)
      .map(([output, inputPrime]) => fn(output)(inputPrime))
      .flat()
}

// sat parses a single character and if it matches the predicate,
// it returns a result(), otherwise it returns a zero()
export function sat(pred: (c: char) => boolean): Parser<char> {
  return bind(item(), (ch) => (pred(ch) ? result(ch) : zero()))
}

// digit parses a single digit
export function digit(): Parser<char> {
  return sat((d) => d >= "0" && d <= "9")
}

// lowercase parses a lowercase character
export function lowercase(): Parser<char> {
  return sat((d) => d > "a" && d < "z")
}

// uppercase parses an uppercase character
export function uppercase(): Parser<char> {
  return sat((d) => d > "A" && d < "Z")
}

// letter parses [a-z, A-Z]
export function letter(): Parser<char> {
  return either(lowercase(), uppercase())
}

// alphanum parses [a-z, A-Z, 0-9]
export function alphanum(): Parser<char> {
  return either(letter(), digit())
}

// either acts like an "or" / "either" operator
// it uses `p` or `q` to parse the input
export function either<T>(p: Parser<T>, q: Parser<T>): Parser<T> {
  return (input) => {
    const first = p(input)
    if (first.length === 0) {
      return q(input)
    }
    return first
  }
}

// many parses with p, until it can't take anymore
export function many<T>(p: Parser<T>): Parser<T[]> {
  return either(
    bind(p, (x) => bind(many(p), (y) => result([x, ...y]))),
    result([])
  )
}

// sepBy parses elements separated by sep
export function sepBy<T, U>(sep: Parser<T>, elements: Parser<U>): Parser<U[]> {
  return bind(elements, (v) =>
    bind(many(bind(sep, (_) => bind(elements, (v) => result(v)))), (vs) =>
      result([v, ...vs])
    )
  )
}

// whitespace eats whitespace
export function whitespace(): Parser<string[]> {
  return many(sat((v) => v.trim() === ""))
}

// stringP parses a specific string
export function stringP(str: string): Parser<string> {
  if (str === "") {
    return result("")
  }

  return bind(charP(str[0]), (ch) =>
    bind(stringP(str.slice(1)), (str) => result(ch + str))
  )
}

// char parses a specific character
export function charP(c: char): Parser<char> {
  return sat((d) => d == c)
}
