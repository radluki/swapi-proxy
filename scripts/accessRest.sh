#!/bin/bash
if [ "$DOCKER" == "1" ]; then
    URL="http://app:3000/api"
else
    URL="http://localhost:3000/api"
fi

curl -X GET -H "Content-Type: application/json" \
    $URL/people/33/ | jq &

curl -X GET -H "Content-Type: application/json" \
    $URL/films/opening-crawls/word-counts/ | jq &

curl -X GET -H "Content-Type: application/json" \
    $URL/films/opening-crawls/people/most-appearances/ | jq &
