CREATE OR REPLACE FUNCTION location_data(lat real, lon real) 
RETURNS TABLE(date date, prcp real, tmax real, tmin real, wind real, location_id int, latitude real, longitude real)
AS $$ 
SELECT to_date(d.year || '-' || trim(to_char(d.month, '00')) || '-' || trim(to_char(d.day, '00')), 'YYYY-MM-DD') as date,
       d.prcp, d.tmax, d.tmin, d.wind, l.gid, l.latitude, l.longitude
FROM maurer_day d
JOIN (SELECT ST_Distance(geom, ST_SetSRID(ST_MakePoint(lon, lat),4326)) as distance,
             gid, latitude, longitude
      FROM maurer_locations
      ORDER BY distance limit 1) as l
ON d.location_id=l.gid;
$$
LANGUAGE SQL;
