#!/bin/bash

URL="http://${DOMAIN:-app}:${PORT:-3000}/graphql"

getJsonFromApi() {
    curl -X POST -H "Content-Type: application/json" \
        --data \
            "$1" \
        $URL
}

getJsonFromApi '{ "query": "{ swapi { people(page: 3) { count next results { name starships } } } }" }' | jq

getJsonFromApi '{ "query": "{ swapi { person(id: 21) { name films } } }" }' | jq
