#!/bin/bash

PACKAGE_INFO_DIR=$REPO/repo/api/packageinfo
CONTROL_FILE_NAME=control
DISPLAY_FILE_NAME=display
SCREENSHOT_DIR_NAME=screenshots

mkdir -p "$PACKAGE_INFO_DIR"
mkdir -p temp_dir

packageIDs=()

# Loop over each deb file in the packages directory
for deb_file in $REPO/repo/debs/*.deb; do
    $REPO/repo/bin/append-to-control.sh "$deb_file"

    # Extract the control file from the deb
    controlFile=temp_dir/control
    dpkg -e $deb_file temp_dir/

    PACKAGE_IDENTIFIER=$(grep -i "^Package:" $controlFile | cut -d " " -f 2)
    PACKAGE_ARCHITECTURE=$(grep -i "^Architecture:" $controlFile | cut -d " " -f 2)
    PACKAGE_VERSION=$(grep -i "^Version:" $controlFile | cut -d " " -f 2)

    # Check if Architecture is iphoneos-arm64
    if [ "$PACKAGE_ARCHITECTURE" = "iphoneos-arm64" ]; then
        echo "Skipping $deb_file: Architecture is iphoneos-arm64"
        rm -f temp_dir/control
        continue
    fi
    
    PACKAGE_DIR=$PACKAGE_INFO_DIR/$PACKAGE_IDENTIFIER

    # Check if the package version is newer than the existing package version, skip if not.
    if [ -d "$PACKAGE_DIR" ]; then
        version=$(jq -r '.Version' $PACKAGE_DIR/control.json)
        if [[ "$PACKAGE_VERSION" < "$version" ]]; then
            echo "Skipping $deb_file: Version is not the latest, will use the later version."
            continue
        fi
    fi

    packageIDs+=("$PACKAGE_IDENTIFIER")
    mkdir -p $PACKAGE_DIR
    
    if [ -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json" ]; then
        rm -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    fi

    # Convert the control file to json and output to packageinfo directory
    $REPO/repo/bin/control-to-json.sh "$controlFile" > "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    # Populate needed contents
    mkdir -p "$PACKAGE_DIR/$SCREENSHOT_DIR_NAME"
    
    if [ ! -f "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json" ]; then
        $REPO/repo/bin/generate-display.sh > "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json"
    fi

    # Clean up the extracted control file
    rm -f "$controlFile"
done

# Use jq to create a JSON object from the array and save it to a file
json_array=$(jq -n --argjson arr "$(printf '%s\n' "${packageIDs[@]}" | jq -R . | jq -s .)" '{package_ids: $arr}')
if [ -f "$REPO/repo/api/packages.json" ]; then
    rm -f "$REPO/repo/api/packages.json"
fi

echo "$json_array" > "$REPO/repo/api/packages.json"

rm -rf temp_dir
