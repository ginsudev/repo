#!/bin/bash

json_object=$(cat << EOF
{
    "contact": {
        "twitter": "your_twitter_handle",
        "discord": "your_discord_handle"
    },
    "information": {
        "source_code_link": "your_source_code_link"
    },
    "changelog": [
        {
            "date": "$(date +%Y-%m-%d)",
            "version_number": "1.0.0",
            "changes": "Initial release"
        }
    ]
}
EOF
)

echo $json_object

