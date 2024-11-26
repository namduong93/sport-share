#!/bin/dash
psql -c "DROP DATABASE IF EXISTS postgres;"
psql -f ../database/db.sql