import { jsonArray } from "./json.ts"

function main() {
  console.log(JSON.stringify(jsonArray()('[1,["pesho"],3]')))
}

main()
