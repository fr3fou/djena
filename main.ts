import { word } from "./parse.ts"

function main() {
  // const helloParser = bind(char("h"), (ch) =>
  //   bind(char("i"), (ch2) => result(ch + ch2))
  // )
  console.log(word()("hii"))
}
main()
