# Crash course in Cabal and Hackage

Cabal is Haskell's build system. Build systems have the unenvyable role of being largely ignored when everything works and the target of great frustration when something breaks. We provide some basic information about Cabal to help reduce (but not eliminate) these breakages.

Hackage is Haskell's default package repository. A package repository is a (typically) web-connected database that allows users to upload and download public packages. When a package dependency is specified in Cabal that it cannot find locally, Cabal will automatically search Hackage. Hackage also contains the documentation of each package, which allows Hackage to double as a documentation repository. You will see links to Hackage documentation throughout this book.

Much like the previous section on Haskell syntax, one should not try to memorize this section before moving on. The best way to learn this content is to look at real-world projects and refer back to this guide for reference.

## Cabal project structure
Cabal is simply an executable that runs on a folder. If any file in the folder could contain the information cabal needs, cabal would have to search and fuzzy match against every file. However, if every file Cabal needs is in a pre-determined location, that doesn't give much flexibility in how we setup the project. Therefore, Cabal (like many other build systems) takes the middle ground: a file (or set of files) exist at a specific location that Cabal always checks. These files contain customizable information to tell Cabal where to look for other parts of the project.

This design has the added benefit of making it easy for users to be able to quickly parse a Cabal project.

**The Cabal-expected files**

Most Cabal projects have the following folder structure

```
myFolder
├──cabal.project
├──<packageName>.cabal
├──src/
├──tests/
```

**The Cabal hierarchy**

Cabal's hierarchy is defined as such
```
Project
└──Package
   └──Component (target)
```

**Projects**

A project (including which packages are inside) is defined by a `cabal.project` file. If no `cabal.project` file is found, Cabal will look for all files that match `*.cabal` and will try to read the package name from the `name` field inside.

Except for very large projects, it's common to forego the `cabal.project` file and just specify a `<packageName>.cabal` file. This is because packages are the standard unit of distribution in Haskell.

**Packages**

For each package, Cabal will look for a `<packageName>.cabal` file. This `.cabal` file (pronounced as dot-cabal file) specifies the package settings and list of `Components (targets)` inside the package. 

This `<packageName>.cabal` file is build file you will interact with by far the most. It contains the package information (so Hackage can index it), build dependencies and versions (other packages), the list of Haskell language extensions, any compiler flags, etc.

```
-- Cabal header
cabal-version:       2.4
name:                <packageName>
version:             0.1
license:             BSD-2-Clause
author:              Jane Smith <jane@example.com>
maintainer:          Jane Smith <jane@example.com>

-- List of Cabal build targets

<target1>

<target2>

...

```

**Components/Targets**

Each target specifies a name, a type, and various type-specific settings telling Cabal how to compile the target. This often includes the directory name for the source code, the Haskell module name that holds the entrypoint (in the case of executable or test-suite), the build dependencies, etc.

General structure
```
<targetType> <optionalTargetName>
    <targetProperty1>: <targetValue>
    <targetProperty2>:
        <targetValue1>,
        <targetValue2>
    ...
```

Here is a [link]() to the full syntax.

We provide a list of common component types and fields below. For a full list, see the [official Cabal documentation](https://cabal.readthedocs.io/en/latest/cabal-syntax-quicklinks.html#cap-package.cabal%20fields).

<!-- tabs: Library | Executable | Test suite | Common -->
<div>

Libraries are compiled Haskell modules that other components can link against.

The main fields are
- `hs-source-dirs`: where to find the source code
- `exposed-modules`: which modules are public in the library
- `other-modules`: which modules are private, but should still be included in the source code because they're required to build one or more of the public modules

Example
```
library
  import: common-options
  hs-source-dirs: src
  exposed-modules:
    Example.Project
    Example.Project.SubModule
  default-language: Haskell2010
```

One library target can optionally not specify a name. Cabal assumes this target's name is `<packageName>`.

**One common gotcha with other-modules**

Cabal will try to build every module in `exposed-modules`, and will recursively build all dependency modules. This mean Cabal may not build some source files in the source code.

</div><div>

Compiles the Haskell code into a standalone executable program.

```
executable clash
  main-is: bin/Clash.hs
  default-language: Haskell2010
  -- Use the RTS options that upstream clash uses for better performance:
  -- https://github.com/clash-lang/clash-compiler/blob/daef4893dee4910ab4eced0c141a39d40d88996a/changelog/2026-05-06T15_20_00%2B02_00_ghc_style_rts_defaults
  ghc-options: "-with-rtsopts=-K512M -H -I5 -T"
  Build-Depends: base, clash-ghc, simple-nix
```

</div><div>

<code>Test suite (test-suite)</code>

Compiles the Haskell code into an executable program.
    
<bold>Fields:</bold>

- type: Choose between `exitcode-stdio-1.0` (recommended) and `detailed-0.9`

```
test-suite test-library
  import: common-options
  default-language: Haskell2010
  hs-source-dirs: tests
  type: exitcode-stdio-1.0
  ghc-options: -threaded
  main-is: unittests.hs
  other-modules:
    Tests.Example.Project
  build-depends:
    simple-nix,
    QuickCheck,
    clash-prelude-hedgehog,
    hedgehog,
    tasty >= 1.2 && < 1.6,
    tasty-hedgehog,
    tasty-th,
    tasty-hunit
```

</div><div>

Common (<code>common</code>)

```
common common-options
  default-extensions:
    BangPatterns
    BinaryLiterals
    ConstraintKinds
    DataKinds
    DefaultSignatures
    DeriveAnyClass
    DeriveDataTypeable
    DeriveFoldable
    DeriveFunctor
    DeriveGeneric
    DeriveLift
    DeriveTraversable
    DerivingStrategies
    FlexibleContexts
    InstanceSigs
    KindSignatures
    LambdaCase
    NamedFieldPuns
    NoStarIsType
    PolyKinds
    RankNTypes
    RecordWildCards
    ScopedTypeVariables
    StandaloneDeriving
    TupleSections
    TypeApplications
    TypeFamilies
    TypeOperators
    ViewPatterns

    -- TemplateHaskell is used to support convenience functions such as
    -- 'listToVecTH' and 'bLit'.
    TemplateHaskell
    QuasiQuotes

    -- Prelude isn't imported by default as Clash offers Clash.Prelude
    NoImplicitPrelude
  ghc-options:
    -Wall -Wcompat
    -haddock

    -- Plugins to support type-level constraint solving on naturals
    -fplugin GHC.TypeLits.Extra.Solver
    -fplugin GHC.TypeLits.Normalise
    -fplugin GHC.TypeLits.KnownNat.Solver

    -- Clash needs access to the source code in compiled modules
    -fexpose-all-unfoldings

    -- Worker wrappers introduce unstable names for functions that might have
    -- blackboxes attached for them. You can disable this, but be sure to add
    -- a no-specialize pragma to every function with a blackbox.
    -fno-worker-wrapper

    -- Strict annotations - while sometimes preventing space leaks - trigger
    -- optimizations Clash can't deal with. See:
    --
    --    https://github.com/clash-lang/clash-compiler/issues/2361
    --
    -- These flags disables these optimizations. Note that the fields will
    -- remain strict.
    -fno-unbox-small-strict-fields
    -fno-unbox-strict-fields
  build-depends:
    base,
    Cabal,

    -- clash-prelude will set suitable version bounds for the plugins
    clash-prelude >= 1.10.0 && < 1.12,
    ghc-typelits-natnormalise,
    ghc-typelits-extra,
    ghc-typelits-knownnat

```
</div>

See also: general build parameters https://cabal.readthedocs.io/en/latest/cabal-package-description-file.html#build-information

**Running cabal**

Cabal can setup a new project skeleton for us
```
cabal --version 
mkdir myproject && cd myproject
cabal init
```

```
cabal run <optionalTargetName>
```

**\<packageName\>.cabal file(s)**

<!-- tabs: Cabal file template | Cabal file example -->
```
-- Cabal header
cabal-version:       2.4
name:                <packageName>
version:             0.1
license:             BSD-2-Clause
author:              Jane Smith <jane@example.com>
maintainer:          Jane Smith <jane@example.com>

-- List of Cabal build targets

common common-options
  default-extensions:
    <listOfHaskellExtensions>
  ghc-options:
    <listOfGhcFlags>
  build-depends:
    <listOfVersionedDependencies>

library
  import: common-options
  hs-source-dirs: <sourceDir>
  exposed-modules:
    <listOfModules>
  default-language: Haskell2010

test-suite test-library
  import: common-options
  default-language: Haskell2010
  hs-source-dirs: <testDir>
  type: exitcode-stdio-1.0
  ghc-options: -threaded
  main-is: unittests.hs
  other-modules:
    Tests.Example.Project
  build-depends:
    <listOfVersionedDependencies>,

```

```
cabal-version:       2.4
name:                simple-nix
version:             0.1
license:             BSD-2-Clause
author:              John Smith <john@example.com>
maintainer:          John Smith <john@example.com>

common common-options
  default-extensions:
    BangPatterns
    BinaryLiterals
    ConstraintKinds
    DataKinds
    DefaultSignatures
    DeriveAnyClass
    DeriveDataTypeable
    DeriveFoldable
    DeriveFunctor
    DeriveGeneric
    DeriveLift
    DeriveTraversable
    DerivingStrategies
    FlexibleContexts
    InstanceSigs
    KindSignatures
    LambdaCase
    NamedFieldPuns
    NoStarIsType
    PolyKinds
    RankNTypes
    RecordWildCards
    ScopedTypeVariables
    StandaloneDeriving
    TupleSections
    TypeApplications
    TypeFamilies
    TypeOperators
    ViewPatterns

    -- TemplateHaskell is used to support convenience functions such as
    -- 'listToVecTH' and 'bLit'.
    TemplateHaskell
    QuasiQuotes

    -- Prelude isn't imported by default as Clash offers Clash.Prelude
    NoImplicitPrelude
  ghc-options:
    -Wall -Wcompat
    -haddock

    -- Plugins to support type-level constraint solving on naturals
    -fplugin GHC.TypeLits.Extra.Solver
    -fplugin GHC.TypeLits.Normalise
    -fplugin GHC.TypeLits.KnownNat.Solver

    -- Clash needs access to the source code in compiled modules
    -fexpose-all-unfoldings

    -- Worker wrappers introduce unstable names for functions that might have
    -- blackboxes attached for them. You can disable this, but be sure to add
    -- a no-specialize pragma to every function with a blackbox.
    -fno-worker-wrapper

    -- Strict annotations - while sometimes preventing space leaks - trigger
    -- optimizations Clash can't deal with. See:
    --
    --    https://github.com/clash-lang/clash-compiler/issues/2361
    --
    -- These flags disables these optimizations. Note that the fields will
    -- remain strict.
    -fno-unbox-small-strict-fields
    -fno-unbox-strict-fields
  build-depends:
    base,
    Cabal,

    -- clash-prelude will set suitable version bounds for the plugins
    clash-prelude >= 1.10.0 && < 1.12,
    ghc-typelits-natnormalise,
    ghc-typelits-extra,
    ghc-typelits-knownnat


library
  import: common-options
  hs-source-dirs: src
  exposed-modules:
    Example.Project2
    Example.Project
  default-language: Haskell2010

-- Builds the executable 'clash', with simple-nix project in scope
executable clash
  main-is: bin/Clash.hs
  default-language: Haskell2010
  -- Use the RTS options that upstream clash uses for better performance:
  -- https://github.com/clash-lang/clash-compiler/blob/daef4893dee4910ab4eced0c141a39d40d88996a/changelog/2026-05-06T15_20_00%2B02_00_ghc_style_rts_defaults
  ghc-options: "-with-rtsopts=-K512M -H -I5 -T"
  Build-Depends: base, clash-ghc, simple-nix

-- Builds the executable 'clashi', with simple-nix project in scope
executable clashi
  main-is: bin/Clashi.hs
  default-language: Haskell2010
  ghc-options: "-with-rtsopts=-K512M -H -I5 -T"
  build-depends: base, clash-ghc, simple-nix

test-suite doctests
  type:             exitcode-stdio-1.0
  default-language: Haskell2010
  main-is:          doctests.hs
  ghc-options:      -Wall -Wcompat -threaded
  hs-source-dirs:   tests
  build-depends:
    base,
    simple-nix,
    doctest-parallel >= 0.2 && < 0.5,

test-suite test-library
  import: common-options
  default-language: Haskell2010
  hs-source-dirs: tests
  type: exitcode-stdio-1.0
  ghc-options: -threaded
  main-is: unittests.hs
  other-modules:
    Tests.Example.Project
  build-depends:
    simple-nix,
    QuickCheck,
    clash-prelude-hedgehog,
    hedgehog,
    tasty >= 1.2 && < 1.6,
    tasty-hedgehog,
    tasty-th,
    tasty-hunit
```

