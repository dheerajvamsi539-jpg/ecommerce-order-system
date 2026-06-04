#!/bin/bash

NAMES=("Alice" "Bob" "Charlie" "David" "Eve" "Frank" "Grace" "Heidi" "Ivan" "Judy")
STATUSES=("PENDING" "PROCESSING" "SHIPPED" "COMPLETED" "CANCELLED")

echo "Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "password"}' \
     http://localhost:8090/api/auth/login)

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to obtain JWT token. Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Login successful. Starting order creation..."

for i in {1..100}
do
    NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
    STATUS=${STATUSES[$RANDOM % ${#STATUSES[@]}]}
    AMOUNT=$(echo "scale=2; $RANDOM/100 + 10" | bc)
    
    echo "Creating order $i: $NAME, \$$AMOUNT, $STATUS"
    
    curl -s -X POST -H "Content-Type: application/json" \
         -H "Authorization: Bearer $TOKEN" \
         -d "{\"customerName\": \"$NAME\", \"totalAmount\": $AMOUNT, \"status\": \"$STATUS\"}" \
         http://localhost:8090/api/orders > /dev/null
done

echo "Finished creating 100 orders."
