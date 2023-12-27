#!/bin/bash

URL="http://app:3000/api"

curl -X GET -H "Content-Type: application/json" \
    $URL/people/33/ | jq &

curl -X GET -H "Content-Type: application/json" \
    $URL/films/opening-crawls/word-counts/ | jq &

curl -X GET -H "Content-Type: application/json" \
    $URL/films/opening-crawls/people/most-appearances/ | jq &
