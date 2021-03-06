import {
  bind,
  charP,
  digit,
  either,
  many,
  Parser,
  result,
  sepBy,
  stringLiteral,
  stringP,
  whitespace,
  zero,
} from "./parse.ts"

export class JsonBool {
  constructor(readonly value: boolean) {}
}

export class JsonString {
  constructor(readonly value: string) {}
}

export class JsonNumber {
  constructor(readonly value: number) {}
}

export class JsonObject {
  constructor(readonly pairs: Array<[string, JsonValue]>) {}
}

export class JsonArray {
  constructor(readonly value: Array<JsonValue>) {}
}

export class JsonNull {}

export type JsonValue =
  | JsonNull
  | JsonBool
  | JsonNumber
  | JsonString
  | JsonArray
  | JsonObject

export function jsonNull(): Parser<JsonNull> {
  return bind(stringP("null"), (_) => result(new JsonNull()))
}

export function jsonBool(): Parser<JsonBool> {
  return bind(either(stringP("true"), stringP("false")), (v) =>
    result(new JsonBool(v === "true"))
  )
}

export function jsonNumber(): Parser<JsonNumber> {
  return bind(
    either(
      bind(charP("-"), (m) => bind(many(digit()), (d) => result([m, ...d]))),
      many(digit())
    ),
    (v) => (v.length == 0 ? zero() : result(new JsonNumber(Number(v.join("")))))
  )
}

export function jsonString(): Parser<JsonString> {
  return bind(stringLiteral(), (v) => result(new JsonString(v.join(""))))
}

export function jsonArray(): Parser<JsonArray> {
  return bind(charP("["), (_) =>
    bind(whitespace(), (_) =>
      bind(
        sepBy(
          bind(whitespace(), (_) => bind(charP(","), (_) => whitespace())),
          jsonValue()
        ),
        (v) =>
          bind(whitespace(), (_) =>
            bind(charP("]"), (_) => result(new JsonArray(v)))
          )
      )
    )
  )
}
export function jsonObject(): Parser<JsonObject> {
  return bind(charP("{"), (_) =>
    bind(whitespace(), (_) =>
      bind(
        sepBy(
          bind(whitespace(), (_) => bind(charP(","), (_) => whitespace())),
          bind(stringLiteral(), (k) =>
            bind(whitespace(), (_) =>
              bind(charP(":"), (_) =>
                bind(whitespace(), (_) =>
                  bind(jsonValue(), (v) => result({ k: k.join(""), v }))
                )
              )
            )
          )
        ),
        (kvs) =>
          bind(whitespace(), (_) =>
            bind(charP("}"), (_) =>
              result(new JsonObject(kvs.map((kv) => [kv.k, kv.v])))
            )
          )
      )
    )
  )
}

export function jsonValue(): Parser<JsonValue> {
  return either(
    jsonNull(),
    jsonNumber(),
    jsonBool(),
    jsonString(),
    jsonArray(),
    jsonObject()
  )
}

export function stringify(v: JsonValue, names?: boolean): string {
  if (v instanceof JsonArray) {
    return `[${names && "JsonArray: "}${v.value
      .map((v) => stringify(v, names))
      .join(",")}]`
  }

  if (v instanceof JsonNumber) {
    return `${names && "JsonNumber: "}${v.value.toString()}`
  }

  if (v instanceof JsonString) {
    return `"${names && "JsonString: "}${v.value}"`
  }

  if (v instanceof JsonNull) {
    return `${names && "JsonNull: "}null`
  }

  if (v instanceof JsonBool) {
    return `${names && "JsonBool: "}${v.value ? "true" : "false"}`
  }

  if (v instanceof JsonObject) {
    return `{${v.pairs.map(
      (pair) => `"${pair[0]}":${stringify(pair[1], names)}`
    )}}`
  }

  return ""
}
