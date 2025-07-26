#!/bin/bash

BASE_URL="http://localhost:3000/products"
PRODUCT_JSON=$(cat product.json)
ID="29d62163-d313-42ca-b96a-b9cc1e79c0ab"
INTERNAL_ID="29d62163-d313-42ca-b96a-b9cc1e79c0ab"

echo "=== GET all products ==="
curl -s "$BASE_URL" | jq

echo "=== POST new product ==="
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d "$PRODUCT_JSON" | jq

echo "=== GET product by ID ==="
curl -s "$BASE_URL/$ID" | jq

echo "=== GET product by internal ID ==="
curl -s "$BASE_URL/internal/$INTERNAL_ID" | jq

echo "=== GET featured products ==="
curl -s "$BASE_URL/featured" | jq

echo "=== GET latest products ==="
curl -s "$BASE_URL/latest" | jq

echo "=== GET by category ==="
curl -s "$BASE_URL/category/Accessories%20(Bags,%20Hats,%20Belts)" | jq

echo "=== GET by brand ==="
curl -s "$BASE_URL/brand/Ruiz%20Group" | jq

echo "=== GET categories ==="
curl -s "$BASE_URL/categories" | jq

echo "=== GET brands ==="
curl -s "$BASE_URL/brands" | jq

echo "=== PATCH update product ==="
curl -s -X PATCH "$BASE_URL/$ID" \
  -H "Content-Type: application/json" \
  -d '{"price": 599, "stock": 15, "availability": "in_stock"}' | jq

echo "=== PATCH update stock ==="
curl -s -X PATCH "$BASE_URL/$ID/stock" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}' | jq

echo "=== DELETE product ==="
curl -s -X DELETE "$BASE_URL/$ID"

echo "=== DONE ==="
