#!/bin/bash

URL="http://${DOMAIN:-app}:${PORT:-3000}/graphql"

getJsonFromApi() {
    curl -X POST -H "Content-Type: application/json" \
        --data \
            "$1" \
        $URL
}

getJsonFromApi '{ "query": "{ swapi(peoplePage: 3) { people { count next results { name starships } } } }" }' | jq

getJsonFromApi '{ "query": "{ swapi(personId: 21) { person { name films } } }" }' | jq
