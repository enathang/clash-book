# The Unofficial Introduction to Clash Book

The built version can be found here: https://enathang.github.io/clash-book/introduction/introduction.html

Clash is a cool language. It's also quite intimidating to new users. This book is meant to be a gentle on-ramp to the Clash language.

## Building the book
The book requires `mdbook` plus a number of mdbook preprocessors to build. Since mdbook `0.5` broke a number of preprocessors, we use forks of some preprocessors that have been designed to work with mdbook `0.5`.

You can build the book two ways:
1. If you have Nix installed, you can simply run `nix develop` then `mdbook build`
2. If you do not have Nix installed, you can manually install `mdbook` plus the preprocessors and ensure they exist in your shell's local `PATH` before running `mdbook build`.

## Book philosophy

The book attempts to introduce concepts in the approximate order a new user will encounter them. When presenting topics, the book will try to be correct (meaning all presented information is correct) but not complete (not all correct information is presented).

Each section should introduce the technical (but reduced in scope) topic. It should then explain the intuition behind it and common operations with/on it. It should then provide a number of examples in the repl, with enough variety in the examples that readers can extrapolate general rules for themselves.
It should then provide a few interactive synthesis examples so readers can build a mental mapping between the code they write and the hardware being created.

I've never written a book before, so this will be an experiment.
