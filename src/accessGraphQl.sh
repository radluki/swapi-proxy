#!/bin/bash

URL="http://localhost:4000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(name: \"Luke\") { name height eye_color vehicles } }" }' \
    $URL | jq