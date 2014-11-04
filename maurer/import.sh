#!/bin/bash

# import maurer datasets to postgresql
# assumes download.sh and setup.sh have already been run

# regions="east glakes"
regions="east"

# create locations file for each region
for region in $regions; do
  echo "Getting locations for region $region..."
  # extract lat/lon from file names, extract columns 2 and 3, replace _ with ' ', import to postgresql
  find ./"$region"/ -name "data_*" | cut -d'_' -f 2,3 | sed 's/_/ /g' | psql -d cst -c "COPY maurer_locations FROM stdin DELIMITER ' '"
done

importdir=tmp
mkdir -p $importdir
rm $importdir/*

# copy original files to import directory
for region in $regions; do
  for file in $region/data_*; do
    echo "Importing $file"
    base=`basename $file`
    
    # extract latitude/longitude from filename
    LAT=`echo $base | cut -d'_' -f 2`
    LON=`echo $base | cut -d'_' -f 3`

    # add lat/lon columns to file, import to postgresql
    sed "s/$/	$LAT	$LON/" $file | psql -d cst -c "COPY maurer_day FROM stdin"
  done
done

# echo "Converting database tables"
# psql -d cst -f convert.sql
