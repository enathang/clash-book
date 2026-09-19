# Introduction to the book

```admonish warning
This book is still under construction. Some statements may be incomplete or incorrect, some examples may not compile, etc. I will attempt to separate chapters into "in-development" versus "complete" as I finish them. For now, everything is considered "in-development".
```

This book attempts to explain the Clash language in a simple and practical way to new users. _New users_ may mean new to Clash, new to Haskell, and/or new to HDLs. Therefore, this book simplifies most topics to what a new user of the language might run into and defers rigorous definitions to either later chapters or the official Clash documentation.

Other people may have different opinions on the order of topic presentation, the content or description of some part of the language, or the framing of some ideas. Where possible, I will try and correct factual inaccuracies in the book. But to paraphrase a famous quote "All explanations are wrong. Some are useful." I reserve the right to keep this book my way.

Each section is designed to introduce one or two new concepts in a bite-sized way. Each concept should include official documentation, commentary on the concept, and plenty of examples of Clash code and (where relevant) the corresponding synthesized hardware. The goal here is to get a new user started and to show them avenues where they might investigate more.

This book makes liberal use of the quality existing Clash documentation, both official and unofficial, to inform its content. I don't pretend much here is new, as I stand on the shoulders of giants, just that it's my way of cutting up the content.

I can also recommend a number of other resources:
* The official Clash [documentation](https://clash-lang.org/documentation/), including the official Clash [book](https://docs.clash-lang.org/tutorial/)
* The [Clash Prelude](https://hackage.haskell.org/package/clash-prelude) on Hackage
* Gergő Érdi's [Retrocomputing with Clash](https://unsafeperform.io/retroclash/) book
* [Learn You a Haskell for Great Good!](https://learnyouahaskell.github.io/) (teaches Haskell but not hardware)
* MIT's [Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/) course (teaches hardware but not Haskell)

The source code of this book, including both content and styling, is [available through GitHub](https://github.com/enathang/clash-book).

Finally, I'd like to acknowledge the following people who helped make this book possible: Liam Niehus-Staab, for providing feedback; the entire team at QBayLogic, for graciously answering my many (and often ill-formed) questions.