#!/bin/sh
set -e

echo "⏳ Waiting for ScyllaDB to be ready..."

# Wait until CQL port is open
until cqlsh scylladb 9042 -e "DESCRIBE KEYSPACES;" > /dev/null 2>&1; do
  echo "🔄 ScyllaDB not ready yet, retrying..."
  sleep 2
done

echo "✅ ScyllaDB is ready. Running schema..."

cqlsh scylladb 9042 -f /init/init.cql

echo "✅ Keyspace and table created."
