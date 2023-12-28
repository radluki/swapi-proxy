#!/bin/bash

URL="http://${DOMAIN:-app}:${PORT:-3000}/graphql"

getJsonFromApi() {
    curl -X POST -H "Content-Type: application/json" \
        --data \
            "$1" \
        $URL
}

getJsonFromApi '{ "query": "{ people(page: 3) { count next results { name starships } } }" }' | jq

getJsonFromApi '{ "query": "{ person(id: 21) { name starships } }" }' | jq

getJsonFromApi '{"query":"{ resource(type: \"people\", id: 3) { ... on Person { name films } } }"}' | jq
