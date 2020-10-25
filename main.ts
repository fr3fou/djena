import { jsonValue, stringify } from "./json.ts"

function main() {
  let obj = jsonValue()(`{     "foo": [1,2,3, {"bar": "hh"}] }`)
  // let arr = jsonValue()(`[1,2,3]`)
  console.log(stringify(obj[0][0]))
}

main()
