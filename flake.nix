{
  description = "MyProject";

  nixConfig = {
    # Pre-built Clash binaries, so Nix downloads them instead of compiling.
    extra-substituters = [ "https://clash-lang.cachix.org" ];
    extra-trusted-public-keys = [ "clash-lang.cachix.org-1:/2N1uka38B/heaOAC+Ztd/EWLmF0RLfizWgC5tamCBg=" ];
  };

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    mdbook-admonish-src = {
      url = "github:padamson/mdbook-admonish/feat/mdbook-0.5-compat";
      flake = false;
    };
    mdbook-chapter-zero-src = {
      url = "github:enathang/mdbook-chapter-zero/mdbook-0.5-compat";
      flake = false;
    };
    # mdbook-clash declares its own systems list as a relative path input, which
    # Nix can't lock when mdbook-clash is used as a dependency. Supply a locked
    # one instead.
    systems.url = "github:nix-systems/default";
    mdbook-clash = {
      url = "github:clash-lang/mdbook-clash";
      inputs.systems.follows = "systems";
    };
  };

  outputs = { self, nixpkgs, flake-utils, mdbook-admonish-src, mdbook-chapter-zero-src, mdbook-clash, systems }:
    flake-utils.lib.eachSystem [
      "aarch64-linux"
      "aarch64-darwin"
      "x86_64-linux"
    ] (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      mdbook-admonish = pkgs.rustPlatform.buildRustPackage {
        pname = "mdbook-admonish";
        version = "0.0.0.0";
        src = mdbook-admonish-src;
        cargoLock.lockFile = mdbook-admonish-src + "/Cargo.lock";
      };
      mdbook-chapter-zero = pkgs.rustPlatform.buildRustPackage {
        pname = "mdbook-chapter-zero";
        version = "0.0.0.0";
        src = mdbook-chapter-zero-src;
        cargoLock.lockFile = mdbook-chapter-zero-src + "/Cargo.lock";
      };
      mdbook-quiz = pkgs.rustPlatform.buildRustPackage rec {
        pname = "mdbook-quiz";
        version = "0.5.0";
        src = pkgs.fetchCrate {
          inherit pname version;
          hash = "sha256-kUFk3qcBzD7FJjaTp/IwS2/QUTHz+i8C8n+x418yheM=";
        };
        cargoHash = "sha256-4yvrEf4F7pJ8XFvVIIMT/zTZlciL5D+ixWTuCXMbcaQ=";
      };
    in {
      devShells.default = pkgs.mkShell {
        packages = [ pkgs.git pkgs.ripgrep pkgs.mdbook pkgs.mdbook-mermaid mdbook-quiz mdbook-admonish mdbook-chapter-zero mdbook-clash.packages.${system}.default];
        shellHook = ''
          export GHC_ENVIRONMENT=-
        '';
      };
    }
    );
}
