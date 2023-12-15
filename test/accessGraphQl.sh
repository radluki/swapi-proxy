#!/bin/bash

URL="http://app:3000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(page: 1) { count next results { name starships } } }" }' \
    $URL | jq


curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ person(id: 2) { name starships } }" }' \
    $URL | jq