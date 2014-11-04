#!/bin/bash

# import maurer datasets to postgresql
# assumes download.sh and setup.sh have already been run

# database name
db=cst

# regions="east glakes"
regions="east"

locfile=locations.txt

if [ -e "$locfile" ]; then
  echo "Deleting existing $locfile"
  rm "$locfile"
fi

# create locations file for each region
for region in $regions; do
  echo "Getting locations for region $region..."
  # extract lat/lon from file names, extract columns 2 and 3, replace _ with ' '
  find ./"$region"/ -name "data_*" | cut -d'_' -f 2,3 | sed 's/_/ /g' >> "$locfile"
done

# sort, add row number
cat "$locfile" | sort | awk '{print NR, $0}' > "$locfile"-tmp
mv "$locfile"-tmp "$locfile"

# import to postgresql
cat "$locfile" | psql -d "$db" -c "COPY maurer_locations FROM stdin DELIMITER ' '"

# add geom table to locations
psql -d "$db" -f add_geom.sql

# copy original files to import directory
for region in $regions; do
  for file in $region/data_*; do
    echo "Importing $file"
    base=`basename $file`
    
    # extract latitude/longitude from filename
    LAT=`echo $base | cut -d'_' -f 2`
    LON=`echo $base | cut -d'_' -f 3`

    # extract id from location file
    ID=`grep "$LAT $LON" "$locfile" | cut -d' ' -f 1`

    # add location_id column to file, import to postgresql
    sed "s/$/	$ID/" $file | psql -d "$db" -c "COPY maurer_day FROM stdin"
  done
done

psql -d "$db" -c "vacuum analyze;"
