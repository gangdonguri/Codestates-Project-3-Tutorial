#!/bin/bash

for i in {1..10}
do
    curl -X POST https://j0n7hoylb4.execute-api.ap-northeast-2.amazonaws.com/produce --header 'Content-type: application/json' --data-raw "{ \"input\": ${i} }"
done
