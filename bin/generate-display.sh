#!/bin/bash

json_object=$(cat << EOF
{
    "contact": {
        "twitter": "GinsuDev",
        "discord": "https://discord.gg/BhdUyCbgkZ"
    },
    "information": {
        "description": "your_description"
        "source_code_link": ""
    },
    "changelog": [
    {
        "date": "$(date +%Y-%m-%d)",
        "version_number": "1.0.0",
        "changes": "- Initial release"
    }
    ]
}
EOF
)

echo $json_object

