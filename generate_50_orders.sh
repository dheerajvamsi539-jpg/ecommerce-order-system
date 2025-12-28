#!/bin/bash

NAMES=("Alice" "Bob" "Charlie" "David" "Eve" "Frank" "Grace" "Heidi" "Ivan" "Judy")
STATUSES=("PENDING" "PROCESSING" "SHIPPED" "COMPLETED" "CANCELLED")

for i in {1..50}
do
    NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
    STATUS=${STATUSES[$RANDOM % ${#STATUSES[@]}]}
    AMOUNT=$(echo "scale=2; $RANDOM/100 + 10" | bc)
    EMAIL="${NAME,,}@example.com"
    
    echo "Creating order $i: $NAME ($EMAIL), \$$AMOUNT, $STATUS"
    
    curl -s -X POST -H "Content-Type: application/json" \
         -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
         -d "{\"customerName\": \"$NAME\", \"customerEmail\": \"$EMAIL\", \"totalAmount\": $AMOUNT, \"status\": \"$STATUS\"}" \
         http://localhost:8090/api/orders > /dev/null
done

echo "Finished creating 50 orders."
