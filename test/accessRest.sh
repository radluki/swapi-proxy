#!/bin/bash

URL="http://app:3000/api"

curl -X GET -H "Content-Type: application/json" \
    $URL/people/33/ | jq &

curl -X GET -H "Content-Type: application/json" \
    $URL/people/34/ | jq &
