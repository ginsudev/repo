#!/bin/bash

# Check if both arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input_path> <output_path>"
    echo "  input_path: Directory containing .deb files"
    echo "  output_path: Directory where Packages files will be created"
    exit 1
fi

INPUT_PATH="$1"
OUTPUT_PATH="$2"

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
