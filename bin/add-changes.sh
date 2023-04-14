#!/bin/bash

# Show list of package IDs to choose from
package_ids=($(ls packageinfo))
echo "Choose a package ID:"
select package_id in "${package_ids[@]}"; do
  if [[ -n $package_id ]]; then
    break
  fi
done

# Check if the packageinfo directory exists
if [ ! -d "packageinfo" ]; then
  echo "Error: packageinfo directory not found"
  exit 1
fi

# Loop over the directories in packageinfo that match the package ID
found_package=false
for dir in packageinfo/*; do
  if [ -d "$dir" ]; then
    dir_name=$(basename "$dir")
    if [ "$dir_name" = "$package_id" ]; then
      found_package=true
      display_file="$dir/display.json"
      break
    fi
  fi
done

if [ "$found_package" = false ]; then
  echo "Error: package $package_id not found"
  exit 1
fi

# Ask the user for the version number and changes
echo "Please enter a version number:"
read version_number

if jq -e ".changelog[] | select(.version_number == \"$version_number\")" "$display_file" > /dev/null; then
  echo "Error: Version $version_number already exists in $package_id."
  exit 1
fi


echo "Please enter the changes:"
read changes

# Set the current date in the desired format
current_date=$(date +%Y-%m-%d)

# Create a new entry as a JSON object
new_entry=$(cat << EOF
{
  "version_number": "$version_number",
  "changes": "$changes",
  "date": "$current_date"
}
EOF
)

echo "JSON data: "
echo "$new_entry"

# Append the new entry to the changelog array in the display.json file
jq --argjson new_entry "$new_entry" '.changelog += [$new_entry]' "$display_file" > temp.json && mv temp.json "$display_file"

echo "Changelog updated successfully"
