#!/bin/bash

PACKAGE_INFO_DIR="packageinfo"

if [ -d "$PACKAGE_INFO_DIR" ]; then
    rm -rf $PACKAGE_INFO_DIR
fi

mkdir -p $PACKAGE_INFO_DIR
mkdir -p temp_dir

# Loop over each deb file in the packages directory
for deb_file in packages/*.deb; do
    # Extract the control file from the deb
    controlFile=temp_dir/control
    dpkg -e $deb_file temp_dir/

    package=$(grep -i "^Package:" $controlFile | cut -d " " -f 2)
    architecture=$(grep -i "^Architecture:" $controlFile | cut -d " " -f 2)

    # Check if Architecture is iphoneos-arm64
    if [ "$architecture" = "iphoneos-arm64" ]; then
        echo "Skipping $deb_file: Architecture is iphoneos-arm64"
        rm -f temp_dir/control
        continue
    fi

    # Convert the control file to json and output to packageinfo directory
    ./control-to-json.sh temp_dir/control > packageinfo/"$package".json

    # Clean up the extracted control file
    rm -f temp_dir/control
done

rm -rf temp_dir
