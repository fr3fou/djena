# djena

JSON parser in <https://deno.land> / TypeScript

![](./example.png)

## TODO

- [x] Basic building parser blocks
  - [x] `result`
  - [x] `zero`
  - [x] `item`
  - [x] `bind`
  - [x] `sat`
  - [x] `either`
  - [x] `sepBy`
  - [x] `many`
  - [ ] `EOF`
  - [ ] `oneOf`
  - [ ] `seq`
- [x] JSON
  - [x] Booleans
  - [x] String literals
    - [ ] Escape support
  - [x] Numbers
    - [ ] Floats
    - [ ] Negatives
  - [x] Arrays
  - [x] Objects
  - [x] null

## References

- <http://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf>
- <https://www.youtube.com/watch?v=N9RUqGYuGfw>
