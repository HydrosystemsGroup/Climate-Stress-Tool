#!/bin/bash

# Load the Flowlines databases into PostGIS
# See also https://gist.github.com/mojodna/b1f169b33db907f2b8dd

### Defensive shell scripting
set -eu

### Configurable variables
DATADIR=./data
DB=cst

### Set up logging
LOG=`mktemp nhd.log.XXXXXX`
echo "Script output logging to $LOG"

# psql -q -d $DB -c 'create extension postgis'
# psql -q -d $DB -c 'create extension postgis_topology'

# ### Import NHDFlowline tables
# # Find the data files
# flowlines="$DATADIR/NHDPlus??/NHDPlus*/NHDSnapshot/Hydrography/*lowline.shp"
# 
# # Create the schema based on the first file
# set -- $flowlines
# echo "Creating nhdflowline schema"
# (shp2pgsql -p -D -t 2d -s 4269 -W LATIN1 "$1" | psql -d $DB -q) >> $LOG 2>&1
# 
# # Import the files
# for flowline in $flowlines; do
#     echo "Importing $flowline"
#     (shp2pgsql -a -D -t 2d -s 4269 -W LATIN1 "$flowline" | psql -d $DB -q) >> $LOG 2>&1
# done
# 
### Import PlusFlowlineVAA
# Find the data files
vaas="$DATADIR/NHDPlus??/NHDPlus*/NHDPlusAttributes/PlusFlowlineVAA.dbf"

# Create the schema based on the first file
set -- $vaas
echo "Creating plusflowlinevaa schema"
(pgdbf -D -s LATIN1 "$1" | psql -d $DB -q) >> $LOG 2>&1
psql -d $DB -c "TRUNCATE TABLE plusflowlinevaa;" >> $LOG 2>&1

# Import the files
for vaa in $vaas; do
    echo "Importing $vaa"
    (pgdbf -CD -s LATIN1 "$vaa" | psql -d $DB -q) >> $LOG 2>&1
done

### Import Catchment
# Find the data files
catchs="$DATADIR/NHDPlus??/NHDPlus*/NHDPlusCatchment/Catchment.shp"

# Create the schema based on the first file
set -- $catchs
echo "Creating catchment schema"
(shp2pgsql -p -t 2d -s 4269:4326 -W LATIN1 "$1" | psql -d $DB -q) >> $LOG 2>&1

# Import the files
for catch in $catchs; do
    echo "Importing $catch"
    (shp2pgsql -a -t 2d -s 4269:4326 -W LATIN1 "$catch" | psql -d $DB -q) >> $LOG 2>&1
done

# ### Import WBD
# # Find the data files
# wbds="$DATADIR/NHDPlus??/NHDPlus*/WBDSnapshot/WBD/WBD_Subwatershed.shp"

# # Create the schema based on the first file
# set -- $wbds
# echo "Creating wbd schema"
# (shp2pgsql -p -D -t 2d -s 4269 -W LATIN1 "$1" | psql -d $DB -q) >> $LOG 2>&1

# # Import the files
# for wbd in $wbds; do
#     echo "Importing $wbd"
#     (shp2pgsql -a -D -t 2d -s 4269 -W LATIN1 "$wbd" | psql -d $DB -q) >> $LOG 2>&1
# done
