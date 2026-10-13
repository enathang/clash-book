# Chapter 1: Writing basic circuits

It is recommended you download the [Clash starter project](https://github.com/clash-lang/clash-starters), build it, and follow along with this chapter. If you're unsure how to work with a Clash project, check out the [How to run Clash](../introduction/how_to_run_clash.md) section.

**Chapter topics**

In this chapter, we try to build the following intuitions:
- What it looks like to read and write Clash code
- When code you write can and cannot be synthesized into hardware by Clash
- How functions you write map to the physical circuits created by Clash (and how to check this for yourself)
- A working knowledge of the most common Clash datatypes and functions, which can be used in any scenario
- Enough knowledge that you can close the learning feedback loop by yourself and write, test, synthesize, and understand circuits so you can continue to built your intuition and test assumptions

This chapter will **not** cover:
- Sequential logic (see Chapter 3)
