#!/bin/bash

PACKAGE_INFO_DIR=packageinfo
CONTROL_FILE_NAME=control
DISPLAY_FILE_NAME=display
SCREENSHOT_DIR_NAME=screenshots

mkdir -p "$PACKAGE_INFO_DIR"
mkdir -p temp_dir

# Loop over each deb file in the packages directory
for deb_file in packages/*.deb; do
    # Extract the control file from the deb
    controlFile=temp_dir/control
    dpkg -e $deb_file temp_dir/

    PACKAGE_IDENTIFIER=$(grep -i "^Package:" $controlFile | cut -d " " -f 2)
    PACKAGE_ARCHITECTURE=$(grep -i "^Architecture:" $controlFile | cut -d " " -f 2)

    # Check if Architecture is iphoneos-arm64
    if [ "$PACKAGE_ARCHITECTURE" = "iphoneos-arm64" ]; then
        echo "Skipping $deb_file: Architecture is iphoneos-arm64"
        rm -f temp_dir/control
        continue
    fi
    
    PACKAGE_DIR=$PACKAGE_INFO_DIR/$PACKAGE_IDENTIFIER
    mkdir -p $PACKAGE_DIR
    
    if [ -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json" ]; then
        rm -f "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    fi

    # Convert the control file to json and output to packageinfo directory
    ./bin/control-to-json.sh temp_dir/control > "$PACKAGE_DIR/$CONTROL_FILE_NAME.json"
    # Populate needed contents
    mkdir -p "$PACKAGE_DIR/$SCREENSHOT_DIR_NAME"
    
    if [ ! -f "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json" ]; then
        ./bin/generate-display.sh > "$PACKAGE_DIR/$DISPLAY_FILE_NAME.json"
    fi

    # Clean up the extracted control file
    rm -f temp_dir/control
done

rm -rf temp_dir
