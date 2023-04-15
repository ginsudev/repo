#!/bin/bash

directory="$(pwd)"
zshrc_file="$HOME/.zshrc"
line="export REPO=$directory"

if ! grep -qxF "$line" "$zshrc_file"; then
  echo "$line" >> "$zshrc_file"
fi

source ~/.zshrc