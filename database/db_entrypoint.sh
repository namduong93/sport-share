#!/bin/dash

# run the standard entrypoint
docker-entrypoint.sh postgres &

until pg_isready -h localhost -p 5432; do
  sleep 1
done

# once postgresql server is ready load the db.sql schema into it
psql -U postgres -f ./db.sql

# since we ran with & to run the standard entrypoint in the background it might still
# be running after we finish execution of this entrypoint so we should wait for it to finish
wait
