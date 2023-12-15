#!/bin/bash

URL="http://app:3000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(name: \"Luke\") { name height eye_color films starships url } }" }' \
    $URL | jq