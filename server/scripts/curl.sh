#!/bin/sh

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Thermostat Drone Heater",
    "Description": "<div><p><strong>Thermostat Drone Heater</strong> is a top product...</p></div>",
    "Brand": "Bradford-Yu",
    "Category": "Kitchen Appliances",
    "Price": 74,
    "Currency": "USD",
    "Stock": 139,
    "EAN": 8619793560985,
    "Color": "Orchid",
    "Size": "Medium",
    "Availability": "backorder",
    "ShortDescription": "Consumer approach woman us those star.",
    "Image": "1.jpg",
    "Internal ID": "6ce4b628-2bcc-4829-8c64-b3a71bf09a60"
  }'
