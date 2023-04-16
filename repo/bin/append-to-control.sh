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

DEPICTION_URL="https://xiaocoder.dev/repo/depictions/index.html?packageId=$PACKAGE_IDENTIFIER"
ICON_URL="https://xiaocoder.dev/repo/api/packageinfo/$PACKAGE_IDENTIFIER/icon.png"

awk -v depiction="$DEPICTION_URL" -v icon="$ICON_URL" '
    /^Depiction:/ { sub(/.*/, "Depiction: " depiction); found_depiction = 1 }
    /^Icon:/ { sub(/.*/, "Icon: " icon); found_icon = 1 }
    { print }
    END { 
      if (!found_depiction) print "Depiction: " depiction 
      if (!found_icon) print "Icon: " icon 
    }
' "$control_file" > "$control_file.new"
mv "$control_file.new" "$control_file"

# Repack the deb file
dpkg-deb -b deb_contents "$1"

# Clean up
rm -rf deb_contents
