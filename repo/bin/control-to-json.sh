#!/bin/bash

# Read the input control file
input_file=$1

# Check if the input file exists
if [ ! -f $input_file ]; then
  echo "Input file does not exist!"
  exit 1
fi

# Parse the fields from the control file
package=$(grep -i "^Package:" $input_file | cut -d " " -f 2)
name=$(grep -i "^Name:" $input_file | cut -d " " -f 2-)
version=$(grep -i "^Version:" $input_file | cut -d " " -f 2)
architecture=$(grep -i "^Architecture:" $input_file | cut -d " " -f 2)
description=$(grep -i "^Description:" $input_file | cut -d " " -f 2-)
maintainer=$(grep -i "^Maintainer:" $input_file | cut -d " " -f 2-)
author=$(grep -i "^Author:" $input_file | cut -d " " -f 2-)
section=$(grep -i "^Section:" $input_file | cut -d " " -f 2-)
depends=$(grep -i "^Depends:" $input_file | cut -d " " -f 2-)

# Create a JSON object from the parsed fields
json_object=$(cat <<EOF
{
  "Package": "$package",
  "Name": "$name",
  "Version": "$version",
  "Architecture": "$architecture",
  "Description": "$description",
  "Maintainer": "$maintainer",
  "Author": "$author",
  "Section": "$section",
  "Depends": "$depends"
}
EOF
)

# Print the JSON object to the console
echo $json_object
