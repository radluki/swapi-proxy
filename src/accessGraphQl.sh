#!/bin/bash

URL="http://app:3000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(name: \"Skywalker\") { count next results { name starships } } }" }' \
    $URL | jq