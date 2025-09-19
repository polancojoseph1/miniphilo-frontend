#!/bin/bash

# Script to open Info.plist in VSCode
# Save this as open-infoplist.sh and run with: bash open-infoplist.sh

# Navigate to your project directory (adjust path as needed)
cd ~/Desktop/Projects/miniphilo/frontend

# Check if the Info.plist file exists
if [ -f "ios/MiniPhilo/Info.plist" ]; then
    echo "Opening Info.plist in VSCode..."
    code ios/MiniPhilo/Info.plist
else
    echo "Info.plist not found. Checking possible locations..."
    
    # Check alternative locations
    if [ -f "ios/frontend/Info.plist" ]; then
        echo "Found Info.plist in ios/frontend/ - opening..."
        code ios/frontend/Info.plist
    else
        echo "Info.plist file not found in expected locations."
        echo "Looking for all Info.plist files in ios directory..."
        find ios -name "Info.plist" -type f
        echo ""
        echo "If files were found above, you can open them manually with:"
        echo "code ios/[ProjectName]/Info.plist"
    fi
fi