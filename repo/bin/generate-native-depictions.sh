#!/bin/bash

NATIVE_DEPICTIONS_DIR="$REPO/repo/depictions/native"
PACKAGES_DIR="$REPO/repo/api/packageinfo/"

# Loop through each package's directory
for package_path in $PACKAGES_DIR*/; do

    echo "$package_path"
    package_name=$(basename "$package_path")
    display="$package_path"display.json
    control="$package_path"control.json
    screenshots="$package_path"screenshots.json

    json=$(./repo/bin/sileodepiction "$display" "$control" "$screenshots")
  
    # Save the JSON object to a file
    echo "$json" > "$NATIVE_DEPICTIONS_DIR/$package_name.json"
done
