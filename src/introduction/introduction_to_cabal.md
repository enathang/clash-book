# Crash course in Cabal

Cabal is Haskell's build system. Build systems have the unenvyable role of being ignored when everything works and the target of great frustration when something breaks. We provide some basic information about Cabal to help reduce (but not eliminate) these breakages.

Much like the previous section on Haskell syntax, one should not try to memorize this section before moving on. The best way to learn this content is to look at real-world projects and refer back to this guide for reference.

## Cabal project structure
Most cabal projects have the following folder structure

```
myFolder
├──cabal.project
├──myName.cabal
├──src/
├──tests/
```

Cabal's hierarchy is defined as such
```
Project
└──Package
   └──Component (target)
      └──Module
```

```
cabal --version 
mkdir myproject && cd myproject
cabal init
cabal run
```