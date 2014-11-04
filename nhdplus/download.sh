#!/bin/bash

# Shell script to download NHDPlus data
# Primary source is http://www.horizon-systems.com/NHDPlus/NHDPlusV2_data.php
# When complete, the result will be NNN MB of .7z archives,
# NNN MB of NHDFlowline.*, and NNN MB of PlusFlowlineVAA.dbf files

# The p7zip archiver is required; available via homebrew, apt, or from
# the source at http://www.7-zip.org/download.html

set -eu

DESTDIR=./data

# URLs of data, painstakingly copied out of the web page. Could automate with a scraper
URLS=`cat << EOF
http://ec2-54-227-241-43.compute-1.amazonaws.com/NHDPlusData/NHDPlusV21/Data/NHDPlusNE/NHDPlusV21_NE_01_NHDPlusCatchment_01.7z
http://ec2-54-227-241-43.compute-1.amazonaws.com/NHDPlusData/NHDPlusV21/Data/NHDPlusNE/NHDPlusV21_NE_01_NHDPlusAttributes_03.7z
http://ec2-54-227-241-43.compute-1.amazonaws.com/NHDPlusData/NHDPlusV21/Data/NHDPlusNE/NHDPlusV21_NE_01_WBDSnapshot_01.7z
http://ec2-54-227-241-43.compute-1.amazonaws.com/NHDPlusData/NHDPlusV21/Data/NHDPlusNE/NHDPlusV21_NE_01_NHDSnapshot_03.7z
EOF`

# Set up the destination directory
mkdir -p $DESTDIR
cd $DESTDIR

# Fetch all the URLs
for url in $URLS; do
    out=`basename $url`
    if [ -e "$out" ]; then
        echo "Already have $out"
    else
        echo "Fetching $out"
        curl -f -# --retry 2 --output "$out-tmp" "$url" && mv "$out-tmp" "$out"
        chmod -w "$out"
    fi
done

echo "All files downloaded; extracting..."

for nhd in *NHDSnapshot*7z; do
    7z -y x "$nhd" | grep Extracting || true
done
for vaa in *NHDPlusAttributes*7z; do
    7z -y x "$vaa" | grep Extracting || true
done
for catch in *NHDPlusCatchment*7z; do
    7z -y x "$catch" | grep Extracting || true
done
for wbd in *WBDSnapshot*7z; do
    7z -y x "$wbd" | grep Extracting || true
done

echo
echo -n "Size of downloaded archives: "
du -chs *7z | awk '/total/ { print $1 }'
echo -n "Size of extracted data files: "
du -chs NHDPlus??  | awk '/total/ { print $1 }'