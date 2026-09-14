# How to set up and run Clash

We provide a number of examples of Clash code and the synthesized output in this book. However, nothing beats the feedback loop of the reader modifying some of the examples (or coming up with entirely new ones) and seeing the change in type-checking/compilation/synthesis themselves. A worker should never be afraid of their tools - they're there to help.

## Setting up Clash

That being said, Haskell (and by extension Clash) has a number of setup configuration options that may confuse new users. To work around this, the Clash team offers a [getting started](https://github.com/clash-lang/clash-starters) repository with sensible defaults.

## Running Clash

Clash expects one function to define the "entrypoint" of the hardware design to be synthesized. In software, we typically call this the "main" function. In hardware, we call it "topLevelEntity".