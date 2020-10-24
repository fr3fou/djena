import {
  bind,
  charP,
  digit,
  either,
  many,
  Parser,
  result,
  sat,
  stringP,
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
  constructor(readonly value: Array<[string, JsonValue]>) {}
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
    v.length === 0 ? zero() : result(new JsonBool(v === "true"))
  )
}

export function jsonNumber(): Parser<JsonValue> {
  return bind(many(digit()), (d) =>
    d.length === 0 ? zero() : result(new JsonNumber(Number(d.join(""))))
  )
}

export function jsonString(): Parser<JsonValue> {
  return bind(
    bind(charP('"'), (_) =>
      bind(many(sat((b) => b != '"')), (v) =>
        bind(charP('"'), (_) => result(v))
      )
    ),
    (v) => (v.length === 0 ? zero() : result(new JsonString(v.join(""))))
  )
}

// export function jsonArray(): Parser<JsonValue> {}

// export function jsonObject(): Parser<JsonValue> {}

export function jsonValue(): Parser<JsonValue> {
  return either(
    jsonNull(),
    either(
      jsonNumber(),
      either(
        jsonBool(),
        jsonString()
        // either(jsonString(), either(jsonArray(), jsonObject()))
      )
    )
  )
}
