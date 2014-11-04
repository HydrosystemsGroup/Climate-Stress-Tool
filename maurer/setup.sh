#!/bin/bash

# create postgresql database and tables

DB=cst

### Create a PostGIS database
FAIL=0; createdb $DB || FAIL=1 && true
if [ "$FAIL" -ne 0 ]; then
    echo "You need to 'dropdb $DB' for this script to run"
    exit
fi
psql -q -d $DB -c 'create extension postgis'
psql -q -d $DB -c 'create extension postgis_topology'

psql -d $DB -f schema.sql
