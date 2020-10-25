import { jsonValue } from "./json.ts"

function main() {
  console.log(JSON.stringify(jsonValue()('{"foo":1}')))
}

main()
