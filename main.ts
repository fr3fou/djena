// Parser takes in input and returns either an empty array or a singleton array.
// Singleton array with a tuple of the parsed value and the rest of the input means it parsed successfully
// Empty array means it failed parsing
type Parser<T> = (s: string) => Array<[T, string]>
type char = string

// result unconditionally returns the value
function result<T>(v: T): Parser<T> {
  return (input) => [[v, input]]
}

// zero always fails
function zero<T>(): Parser<T> {
  return (_) => []
}

// item parses one character and returns the rest
function item(): Parser<char> {
  return (input) => {
    switch (input) {
      case "":
        return []
      default:
        return [[input[0], input.slice(1)]]
    }
  }
}

// bind combines 2 parsers
function bind<T, U>(p: Parser<T>, fn: (a: T) => Parser<U>): Parser<U> {
  return (input) =>
    p(input)
      .map(([output, inputPrime]) => fn(output)(inputPrime))
      .flat()
}

// sat parses a single character and if it matches the predicate,
// it returns a result(), otherwise it returns a zero()
function sat(pred: (c: char) => boolean): Parser<char> {
  return bind(item(), (ch) => (pred(ch) ? result(ch) : zero()))
}

// char parses a specific character
function char(c: char): Parser<char> {
  return sat((d) => d == c)
}

// digit parses a single digit
function digit(): Parser<char> {
  return sat((d) => d >= "0" && d <= "9")
}

// lowercase parses a lowercase character
function lowercase(): Parser<char> {
  return sat((d) => d.toLowerCase() == d)
}

// uppercase parses an uppercase character
function uppercase(): Parser<char> {
  return sat((d) => d.toUpperCase() == d)
}

function main() {
  let examples = ["HEllo", "PEsho", "GOsho", "AAzzz"]

  const helloParser = bind(uppercase(), (ch1) =>
    bind(uppercase(), (ch2) =>
      bind(lowercase(), (ch3) =>
        bind(lowercase(), (ch4) =>
          bind(lowercase(), (ch5) => result([ch1, ch2, ch3, ch4, ch5]))
        )
      )
    )
  )

  console.log(
    examples.map((element) => {
      return helloParser(element)
    })
  )
}
main()
