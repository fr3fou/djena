import { bind, either, Parser, result, stringP } from "./parse.ts"

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
    result(new JsonBool(v === "true"))
  )
}
