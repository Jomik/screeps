with import <nixpkgs> {};

let
  inherit (pkgs) mkShell;
in mkShell {
  buildInputs = with pkgs; [
    nodejs-10_x
  ];
}
