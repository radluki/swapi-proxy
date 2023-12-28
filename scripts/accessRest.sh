#!/bin/bash

URL="http://${DOMAIN:-app}:${PORT:-3000}/api"

getJsonFromApi() {
    curl -X GET -H "Content-Type: application/json" \
        ${URL}$1 | jq &
}

getJsonFromApi /films/opening-crawls/word-counts/ | jq

getJsonFromApi /people/33/ | jq

getJsonFromApi /films/opening-crawls/people/most-appearances/ | jq &
