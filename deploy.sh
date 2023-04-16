#!/bin/bash

# Create JSON for each package
./repo/bin/generate-packageinfo.sh

# Package
cd repo
./bin/packages.sh
cd ../