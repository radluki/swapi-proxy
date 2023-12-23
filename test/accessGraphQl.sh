#!/bin/bash

URL="http://app:3000/graphql"

curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ people(page: 3) { count next results { name starships } } }" }' \
    $URL | jq &


curl -X POST -H "Content-Type: application/json" \
    --data \
        '{ "query": "{ person(id: 21) { name starships } }" }' \
    $URL | jq &

curl $URL -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"{\n  resource(type: \"people\", id: 3) {\n    ... on Person {\n      name\n      films\n    }\n  }\n}\n"}' --compressed | jq &