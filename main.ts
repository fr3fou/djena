import { jsonValue } from "./json.ts"

function main() {
  console.log(JSON.stringify(jsonValue()("[1,2,3]")))
}

main()
