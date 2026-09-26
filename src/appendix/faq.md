# Clash FAQs

**Clash General FAQs**

<details>

<summary><strong>Question:</strong> Why should I care about Clash?</summary>

**Answer:**
I wouldn't say that you should necessarily care about Clash. I DO think you should care about the new HDLs coming out. Options include:
- Chisel
- Spade

From a theoretical perspective, they offer a lot of interesting features from a language design persepctive.

From an engineering perspective, they offer better layers of abstraction and nicer ergonomics to work with.

Clash is simply one of the options. Personally, I think Clash has some nice features that make it enjoyable to work with. Whether you agree with me or not is totally up to you. If you take nothing else away from this book, you should take away that these languages are interesting and you should explore at least ONE of them.
</details>
<details><summary><strong>Question:</strong> Why Haskell?</summary>

**Answer:**
It doesn't have to be Haskell. I would say you want the following properties in an HDL:
- strong typing: so that mismatches of data types are caught at compile time rather than silently inserted
- some mechanisms for abstraction: to be able to write circuits using higher layers of abstraction. Popular options include generic types and higher-order functions, but they can be anything.
- first class support with a popular language: this makes writing tests for your HDL and debugging much easier
- be simple(ish): All things being equal, simplicity is good.
- Language constructs users are already familiar with.

Haskell fits this bill. It is also a suprisingly old language (~30 years), so the language features have stood the test of time. Of course, other options exist. Chisel is based in Scala and Spare is inspired by Rust. But we think Haskell turns out to be a pretty natural fit as an HDL.

You have the rest of the book to decide if you agree.

</details>

<details>
<summary><strong>Question:</strong> What is the relationship between Clash and Haskell?</summary>

**Answer:** To fill in later.

</details>

<details>
<summary><strong>Question:</strong> What is the relationship between Clash and Bluespec/Lava?</summary>

**Answer:** To fill in later.

</details>

**Clash Language FAQs**

<details>
<summary><strong>Question:</strong> Is Clash a language or a DSL (domain specific language)?</summary>

**Short answer:** A language (but both terms are probably acceptable).

**Long answer:** A DSL is a language that is restricted to a specific problem domain. The definition of _specific problem domain_, however, is open to interpretation. Clash is restricted to the specific problem domain of circuit description. So by that definition, it is a DSL. But Verilog and VHDL are too (or perhaps they are restricted to "circuit description and simulation"). So by definition all HDLs are DSLs.

But the term DSL is generally used to refer to smaller languages like BNF and AWK. So by that definition, Clash is much more expressive than a DSL. 

Perhaps it's best to describe Clash relative to other languages: whatever you think languages like Verilog and VHDL are, as well as other languages such as MatLab and R, Clash is too.
</details><details>
<summary><strong>Question:</strong> Is Clash an embedded language/eDSL?</summary>

**Short answer:** No.

**Long answer:** This is a common misconception, and it's easy to see why: we just described Clash as a subset of Haskell. But a language that is a subset of another language is notably different in kind to an embedded language.

An _embedded language_ is a language whose grammatical constructs are instantiated by running the host language.

This difference can be seen when comparing Clash with an actual embedded HDL: Chisel.

```admonish warning
Examples still under construction
```

```
-- Clash
if x == 3
  then -- Do something
  else -- Do something else
```

```
// Scala
if (x == 3) {
  // Do something
} else {
  // Do something else
}
```

```
// Chisel
when (x === 3.U) {
  // Do something
} .otherwise {
  // Do something else
}
```


Isn't that just an embedded language?

The root of this misconception lies in a misconception of what defines an embedded language.

A language is a language whose grammatical constructs are defined by the syntax.



```
if (x==3) {
    // Do something
} else {
    // Do something else
}
```

In a language, the 


Another way to describe Clash is through the Clash compiler, which is essentially a transpiler. In Haskell, your source code defines an execution graph. The Clash compiler takes this execution graph and translates it into Verilog/VHDL.

This is different (not necessarily better or worse) than most other languages, which run the source code to build up an output execution graph.

</details>
<details>
<summary><strong>Question:</strong> Is the Clash compiler a compiler or a transpiler?</summary>

**Short answer:** a compiler.

**Long answer:** Both a compiler and transpiler take in code in one language and output code in a different language. The distinction between the two is whether the output language is a level of abstraction lower than the input language.

- Example of a compiler: Java -> JVM bytecode
- Example of a transpiler: Java -> Python

So the question is: is the output of the Clash compiler less abstract than the input?

The input Clash code can be polymorphic and contain a number of other abstractions. The output Verilog/VHDL is monomorphic. Therefore, the Clash compiler is a compiler.

**Follow up question:** But doesn't Verilog and VHDL have some support for generics etc.?

Yes. But they work differently than Clash's generics, and Clash does not output Verilog/VHDL generics. Therefore, technically the Clash compiler is a compiler that compiles Clash code to a _subset_ of Verilog/VHDL code. If Clash did support translating source code to Verilog/VHDL's generics, then it would be better described as a transpiler.

</details>

<details>
<summary><strong>Question:</strong> Does Clash do HLS (high-level synthesis)?</summary>

**Short answer:** no.

**Long answer:** To fill in later, but still no.

</details>
