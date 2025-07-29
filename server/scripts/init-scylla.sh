#!/bin/sh

echo "⏳ Waiting for ScyllaDB to be ready..."

# Wait until ScyllaDB is up
until cqlsh scylladb -e "SELECT now() FROM system.local" >/dev/null 2>&1; do
  echo "⏳ Waiting for ScyllaDB..."
  sleep 2
done

echo "✅ ScyllaDB is up. Running schema..."

# Execute the schema file
cqlsh scylladb -f /init/init.cql

echo "✅ Schema initialized successfully"
