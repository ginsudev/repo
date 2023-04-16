#!/bin/bash

# Check if a deb file is specified as an argument
if [ $# -eq 0 ]
  then
    echo "Please specify a .deb file as an argument"
    exit
fi

# Unpack the deb file
dpkg-deb -x "$1" deb_contents
dpkg-deb --control "$1" deb_contents/DEBIAN

# Modify the control file
control_file="deb_contents/DEBIAN/control"

PACKAGE_IDENTIFIER=$(grep -i "^Package:" $control_file | cut -d " " -f 2)

awk -v url="https://repo.ginsu.dev/depictions/index.html?packageId=$PACKAGE_IDENTIFIER" '
    /^Depiction:/ { sub(/.*/, "Depiction: " url); found = 1 }
    { print }
    END { if (!found) print "Depiction: " url }
' "$control_file" > "$control_file.new"

awk -v url="https://repo.ginsu.dev/api/packageinfo/$PACKAGE_IDENTIFIER/icon.png" '
    /^Icon:/ { sub(/.*/, "Icon: " url); found = 1 }
    { print }
    END { if (!found) print "Icon: " url }
' "$control_file" > "$control_file.new"

mv "$control_file.new" "$control_file"

# Repack the deb file
dpkg-deb -b deb_contents "$1"

# Clean up
rm -rf deb_contents
