#!/bin/bash

# Create JSON for each package
./repo/bin/generate-packageinfo.sh

# Create native depictions
./repo/bin/generate-native-depictions.sh

# Package
cd repo
./bin/packages.sh
cd ../