// Parser takes in input and returns either an empty array or a singleton array.
// Singleton array with a tuple of the parsed value and the rest of the input means it parsed successfully
// Empty array means it failed parsing
export type Parser<T> = (s: string) => Array<[T, string]>
export type char = string
// https://beau.collins.pub/2020/parser-and-getting-complicated-with-types/
type ParserType<T> = T extends Parser<infer U> ? U : never

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
    p(input).flatMap(([output, inputPrime]) => fn(output)(inputPrime))
}

// sat parses a single character and if it matches the predicate,
// it returns a result(), otherwise it returns a zero()
export function sat(pred: (c: char) => boolean): Parser<char> {
  return bind(item(), (ch) => (pred(ch) ? result(ch) : zero()))
}

// either returns the first successfull parser
// it uses `p` or `q` to parse the input
// deno-lint-ignore no-explicit-any
export function either<P extends Parser<any>[]>(
  ...ps: P
): Parser<ParserType<P[number]>> {
  return (input) => {
    for (const p of ps) {
      const out = p(input)
      if (out.length !== 0) {
        return out
      }
    }

    return []
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
  return either(
    bind(elements, (v) =>
      bind(many(bind(sep, (_) => bind(elements, (v) => result(v)))), (vs) =>
        result([v, ...vs])
      )
    ),
    result([])
  )
}

// whitespace eats whitespace
export function whitespace(): Parser<string[]> {
  return many(sat((v) => v.trim() === ""))
}

// digit parses a single digit
export function digit(): Parser<char> {
  return sat((d) => d >= "0" && d <= "9")
}

export function stringLiteral(): Parser<string[]> {
  return bind(charP('"'), (_) =>
    bind(many(sat((b) => b != '"')), (v) => bind(charP('"'), (_) => result(v)))
  )
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
