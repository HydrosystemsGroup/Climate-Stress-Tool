#!/bin/bash

# download maurer datasets

regions="east glakes"

for region in $regions; do
  url=http://hydro.engr.scu.edu/files/gridded_obs/daily/ascii/"$region"_daily_met.tgz
  out=`basename $url`
  if [ -e "$out" ]; then
      echo "Already have $out"
  else
      echo "Fetching $out"
      curl -f -# --retry 2 --output "$out-tmp" "$url" && mv "$out-tmp" "$out"
      chmod -w "$out"
  fi
done

for zfile in *_daily_met.tgz; do
  echo "Extracting $zfile"
  tar xvfz "$zfile"
done

