#!/bin/sh
set -e

# Runs only on the first initialization of the data volume.
# POSTGRES_SCHEMA comes from the container environment (see docker-compose.yaml).
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
  CREATE SCHEMA IF NOT EXISTS "$POSTGRES_SCHEMA";
EOSQL
