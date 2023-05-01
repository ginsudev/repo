#!/bin/bash

PACKAGE_INFO_DIR=$REPO/repo/api/packageinfo
CONTROL_FILE_NAME=control
DISPLAY_FILE_NAME=display
SCREENSHOT_DIR_NAME=screenshots

mkdir -p "$PACKAGE_INFO_DIR"
mkdir -p temp_dir

packageIDs=()

# Loop over each deb file in the packages directory.
for deb_file in $(ls $REPO/repo/debs/*.deb | sort -r); do
    # Extract the deb
    extract_dir_name="$(basename "${deb_file%.*}")"
    dpkg-deb --extract $deb_file temp_dir/$extract_dir_name
    dpkg-deb --control $deb_file temp_dir/$extract_dir_name/DEBIAN

    unpacked_deb_dir=temp_dir/$extract_dir_name
    controlFile=$unpacked_deb_dir/DEBIAN/control

    # Add missing fields to the control file.
    $REPO/repo/bin/append-to-control.sh "$controlFile"

    # Collect deb info
    PACKAGE_IDENTIFIER=$(grep -i "^Package:" $controlFile | cut -d " " -f 2)
    PACKAGE_ARCHITECTURE=$(grep -i "^Architecture:" $controlFile | cut -d " " -f 2)
    PACKAGE_VERSION=$(grep -i "^Version:" $controlFile | cut -d " " -f 2)
    PACKAGE_NAME=$(grep -i "^Name:" $controlFile | cut -d " " -f 2)
    PACKAGE_DESC="$PACKAGE_NAME ($PACKAGE_VERSION)"

    PACKAGE_DIR=$PACKAGE_INFO_DIR/$PACKAGE_IDENTIFIER

    # Check if the package version is newer than the existing package version, skip if not.
    if [ -d "$PACKAGE_DIR" ]; then
        version=$(jq -r '.Version' $PACKAGE_DIR/control.json)
        if [[ "$PACKAGE_VERSION" < "$version" ]]; then
            echo -e "\033[33m⚠ Skipping $PACKAGE_DESC because there is a later version ($version).\033[0m"
            continue
        fi
    fi

    # Check if Architecture is iphoneos-arm64, skip if it is.
    if [ "$PACKAGE_ARCHITECTURE" = "iphoneos-arm64" ]; then
        echo -e "\033[33m⚠ Skipping $PACKAGE_DESC because architecture is iphoneos-arm64\033[0m"
        find $unpacked_deb_dir -name '.DS_Store' -type f -delete
        dpkg-deb -b "$unpacked_deb_dir" "$deb_file" >/dev/null
        continue
    fi

    if [[ ! " ${packageIDs[*]} " =~ " ${PACKAGE_IDENTIFIER} " ]]; then
        packageIDs+=("$PACKAGE_IDENTIFIER")
    fi

    mkdir -p $PACKAGE_DIR
    if [ -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json" ]; then
        rm -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    fi

    # Convert control file to json format.
    $REPO/repo/bin/control-to-json.sh "$controlFile" > "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    
    # Screenshots
    mkdir -p "$PACKAGE_DIR/$SCREENSHOT_DIR_NAME"
    screenshots=()
    for image_file in $PACKAGE_DIR/$SCREENSHOT_DIR_NAME/*; do
        screenshots+=("$(basename "$image_file")")
    done

    json_screenshots=$(jq -n --argjson arr "$(printf '%s\n' "${screenshots[@]}" | jq -R . | jq -s .)" '{screenshots: $arr}')
    if [ -f "$PACKAGE_DIR/screenshots.json" ]; then
        rm -f "$PACKAGE_DIR/screenshots.json"
    fi
    echo "$json_screenshots" > "$PACKAGE_DIR/screenshots.json"
    
    # Display
    if [ ! -f "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json" ]; then
        $REPO/repo/bin/generate-display.sh > "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json"
    fi

    # Rebuild deb
    find $unpacked_deb_dir -name '.DS_Store' -type f -delete
    dpkg-deb -b "$unpacked_deb_dir" "$deb_file" >/dev/null
    echo -e "\033[32m✔ Success: $PACKAGE_DESC processed\033[0m"
done

# Use jq to create a JSON object from the array and save it to a file
json_array=$(jq -n --argjson arr "$(printf '%s\n' "${packageIDs[@]}" | jq -R . | jq -s .)" '{package_ids: $arr}')
if [ -f "$REPO/repo/api/packages.json" ]; then
    rm -f "$REPO/repo/api/packages.json"
fi

echo "$json_array" > "$REPO/repo/api/packages.json"

rm -rf temp_dir
echo -e "\033[32m✔ Done! [${#packageIDs[@]} packages processed]\033[0m"
