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

export function jsonNull(): Parser<JsonValue> {
  return bind(stringP("null"), (_) => result(new JsonNull()))
}

export function jsonBool(): Parser<JsonValue> {
  return bind(either(stringP("true"), stringP("false")), (v) =>
    result(new JsonBool(v === "true"))
  )
}

export function jsonNumber(): Parser<JsonValue> {
  return bind(many(digit()), (d) =>
    d.length === 0 ? zero() : result(new JsonNumber(Number(d.join(""))))
  )
}

export function jsonString(): Parser<JsonValue> {
  return bind(stringLiteral(), (v) => result(new JsonString(v.join(""))))
}

export function jsonArray(): Parser<JsonValue> {
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

export function jsonObject(): Parser<JsonValue> {
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
    either(
      jsonNumber(),
      either(
        jsonBool(),
        either(jsonString(), either(jsonArray(), jsonObject()))
      )
    )
  )
}
