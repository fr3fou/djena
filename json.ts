import { Parser, stringP } from "./parse.ts"

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
  return (input) => {
    let out = stringP("null")(input)
    if (out.length === 0) {
      return []
    }

    return [[new JsonNull(), out[1].toString()]]
  }
}