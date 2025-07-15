#!/bin/bash

REPO_PATH="dist/repo"

if [ ! -d "$REPO_PATH" ]; then
    echo "Error: Repository path '$REPO_PATH' does not exist or is not a directory"
    exit 1
fi

(
    cd "$REPO_PATH" || exit 1
    
    INPUT_PATH=debs/
    OUTPUT_PATH=.
    
    # Check if input path exists
    if [ ! -d "$INPUT_PATH" ]; then
        echo "Error: Input path '$INPUT_PATH' does not exist or is not a directory"
        exit 1
    fi
    
    # Create output directory if it doesn't exist
    mkdir -p "$OUTPUT_PATH"
    
    # Generate package files
    dpkg-scanpackages -m "$INPUT_PATH" /dev/null > "$OUTPUT_PATH/Packages"
    gzip -cf "$OUTPUT_PATH/Packages" > "$OUTPUT_PATH/Packages.gz"
    xz -9fkev "$OUTPUT_PATH/Packages" > "$OUTPUT_PATH/Packages.xz"
    bzip2 -cf "$OUTPUT_PATH/Packages" > "$OUTPUT_PATH/Packages.bz2"
    zstd -c19 "$OUTPUT_PATH/Packages" > "$OUTPUT_PATH/Packages.zst"
    
    echo "Package files generated successfully in: $OUTPUT_PATH"
)