#!/bin/bash

# Check if a control file is specified as an argument
if [ $# -eq 0 ]
  then
    echo "Please specify a control file as an argument"
    exit
fi

# Modify the control file
control_file="$1"

PACKAGE_IDENTIFIER=$(grep -i "^Package:" $control_file | cut -d " " -f 2)

DEPICTION_URL="https://ginsu.dev/repo/depictions/index.html?packageId=$PACKAGE_IDENTIFIER"
ICON_URL="https://ginsu.dev/repo/api/packageinfo/$PACKAGE_IDENTIFIER/icon.png"
SILEO_DEPICTION_URL="https://ginsu.dev/repo/depictions/native/$PACKAGE_IDENTIFIER.json"

awk -v depiction="$DEPICTION_URL" -v icon="$ICON_URL" -v sileoDepiction="$SILEO_DEPICTION_URL" '
    /^Depiction:/ { sub(/.*/, "Depiction: " depiction); found_depiction = 1 }
    /^Icon:/ { sub(/.*/, "Icon: " icon); found_icon = 1 }
    /^SileoDepiction:/ { sub(/.*/, "SileoDepiction: " sileoDepiction); found_sileoDepiction = 1 }
    { print }
    END { 
      if (!found_depiction) print "Depiction: " depiction 
      if (!found_icon) print "Icon: " icon 
      if (!found_sileoDepiction) print "SileoDepiction: " sileoDepiction 
    }
' "$control_file" > "$control_file.new"
mv "$control_file.new" "$control_file"