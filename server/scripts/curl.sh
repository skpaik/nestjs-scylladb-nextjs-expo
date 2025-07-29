#!/bin/sh

curl http://localhost:3000/products

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
        "seq": 994,
        "name": "Portable Clock Drone Charger Clean Ultra",
        "description": "Portable Clock Drone Charger Clean Ultra is a top product in our Accessories category.",
        "brand": "Ruiz Group",
        "category": "Accessories (Bags, Hats, Belts)",
        "price": 562,
        "currency": "USD",
        "stock": 925,
        "ean": "9133965711610",
        "color": "LightSalmon",
        "size": "30x40 cm",
        "availability": "in_stock",
        "shortDescription": "Most bar receive apply.",
        "image": "14.jpg"
      }'
