# The Unofficial Introduction to Clash Book

Clash is a cool language. It's also quite intimidating to new users. This book is meant to be a gentle on-ramp to the Clash language.

## Building the book
Until `mdbook-admonish` ships a version for `mdbook` `0.5`, we pin to old versions:
```
cargo install mdbook --version "0.4.52" --locked --force
cargo install mdbook-admonish
cargo install mdbook-quiz --locked --version 0.4.0
cargo install mdbook-mermaid --version 0.16.2 --locked
```
then 
`mdbook build`

## Book philosophy

The book attempts to introduce concepts in the approximate order a new user will encounter them. When presenting topics, the book will try to be correct (meaning all presented information is correct) but not complete (not all correct information is presented).

Each section should introduce the technical (but reduced in scope) topic. It should then explain the intuition behind it and common operations with/on it. It should then provide a number of examples in the repl, with enough variety in the examples that readers can extrapolate general rules for themselves.
It should then provide a few interactive synthesis examples so readers can build a mental mapping between the code they write and the hardware being created.

I've never written a book before, so this will be an experiment.