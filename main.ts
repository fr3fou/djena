import { jsonValue } from "./json.ts"

function main() {
  const j = jsonValue()
  const examples = ["123", '"owo"', '"foo123"', "true", "false", "null"]
  examples.forEach((element) => {
    console.log(j(element))
  })
}

main()
