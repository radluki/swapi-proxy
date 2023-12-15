#!/bin/bash

URL="http://app:3000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(name: \"k\", page: \"3\") { name height eye_color starships url } }" }' \
    $URL | jq