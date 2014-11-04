Gridded Meteorological Data: 1949-2010
======================================

This folder contains scripts for downloading the Maurer et al. 2002 gridded meteorological data, and importing this dataset into a PostgreSQL/PostGIS database.

Reference:

> Maurer, E.P., A.W. Wood, J.C. Adam, D.P. Lettenmaier, and B. Nijssen, 2002, A Long-Term Hydrologically-Based Data Set of Land Surface Fluxes and States for the Conterminous United States, J. Climate 15, 3237-3251.

## Download and Extract Data

```shell
./download.sh
```

## Setup Database

```shell
./setup.sh
```

## Import Data to Database

```shell
./import.sh
```

## Find Nearest Location from Lat/Lon

```sql
SELECT ST_Distance(geom, ST_SetSRID(ST_MakePoint(-72.06, 42.06),4326)) as d, gid, latitude, longitude
FROM maurer_locations
ORDER BY d limit 5;
```

## Find Data for Nearest Location from Lat/Lon

```sql
SELECT d.*
FROM maurer_day d
JOIN (SELECT ST_Distance(geom, ST_SetSRID(ST_MakePoint(-80.6875, 25.1875),4326)) as distance,
             gid, latitude, longitude
      FROM maurer_locations
      ORDER BY distance limit 1) as l
ON d.location_id=l.gid;
```

or use the `location_data(lat, lon)` function

```sql
SELECT * FROM location_data(42.3, -72.1);
```

## Annual Timeseries

```sql
SELECT extract(year from date) AS year,
       sum(prcp) AS prcp,
       avg(tmax) AS tmax,
       avg(tmin) AS tmin,
       avg(wind) AS wind
FROM location_data(42, -72)
GROUP BY year
ORDER BY year;
```

## Monthly Timeseries

```sql
select to_date(extract(year from date) || '-' || trim(to_char(extract(month from date), '00')) || '-01', 'YYYY-MM-DD') as monthyear,
       sum(prcp) as prcp,
       avg(tmax) as tmax,
       avg(tmin) as tmin,
       avg(wind) as wind
from location_data(42, -72)
group by monthyear
order by monthyear;
```
