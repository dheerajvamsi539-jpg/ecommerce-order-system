#!/bin/bash

NAMES=("Alice" "Bob" "Charlie" "David" "Eve" "Frank" "Grace" "Heidi" "Ivan" "Judy")
STATUSES=("PENDING" "PROCESSING" "SHIPPED" "COMPLETED" "CANCELLED")

for i in {1..50}
do
    NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
    STATUS=${STATUSES[$RANDOM % ${#STATUSES[@]}]}
    AMOUNT=$(echo "scale=2; $RANDOM/100 + 10" | bc)
    EMAIL="${NAME,,}@example.com"
    
    # Generate random date within last 30 days
    DAYS_AGO=$((RANDOM % 30))
    CREATED_AT=$(date -d "$DAYS_AGO days ago" +"%Y-%m-%dT%H:%M:%S")

    echo "Creating order $i: $NAME ($EMAIL), \$$AMOUNT, $STATUS, $CREATED_AT"
    
    curl -s -X POST -H "Content-Type: application/json" \
         -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
         -d "{\"customerName\": \"$NAME\", \"customerEmail\": \"$EMAIL\", \"totalAmount\": $AMOUNT, \"status\": \"$STATUS\", \"createdAt\": \"$CREATED_AT\"}" \
         http://localhost:8090/api/orders > /dev/null
done

echo "Finished creating 50 orders."
