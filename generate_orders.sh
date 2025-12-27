#!/bin/bash

NAMES=("Alice" "Bob" "Charlie" "David" "Eve" "Frank" "Grace" "Heidi" "Ivan" "Judy")
STATUSES=("PENDING" "PROCESSING" "SHIPPED" "COMPLETED" "CANCELLED")

for i in {1..100}
do
    NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
    STATUS=${STATUSES[$RANDOM % ${#STATUSES[@]}]}
    AMOUNT=$(echo "scale=2; $RANDOM/100 + 10" | bc)
    
    echo "Creating order $i: $NAME, \$$AMOUNT, $STATUS"
    
    curl -s -X POST -H "Content-Type: application/json" \
         -d "{\"customerName\": \"$NAME\", \"totalAmount\": $AMOUNT, \"status\": \"$STATUS\"}" \
         http://localhost:8090/api/orders > /dev/null
done

echo "Finished creating 100 orders."
