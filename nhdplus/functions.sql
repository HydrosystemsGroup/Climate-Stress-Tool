-- 5867673 is mystic outlet


-- get catchment at lat/lon point
CREATE OR REPLACE FUNCTION get_catchment(lat real, lon real) 
RETURNS TABLE(gid int, gridcode int, featureid int, sourcefc char, areasqkm numeric, geom geometry)
AS $$ 
SELECT *
FROM catchment c
WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(lon, lat),4326));
$$
LANGUAGE SQL;

-- get catchment id at lat/lon point
CREATE OR REPLACE FUNCTION get_catchment_id(lat real, lon real) 
RETURNS int
AS $$ 
SELECT featureid
FROM get_catchment(lat, lon)
LIMIT 1;
$$
LANGUAGE SQL;

-- get upstream basin from downstream catchment id
CREATE OR REPLACE FUNCTION get_upstream(startid int) 
RETURNS TABLE(startid int, areasqkm numeric, n bigint, geom geometry)
AS $$
WITH RECURSIVE upstream_catchment(fromnode, tonode, comid) AS (
  SELECT fromnode, tonode, comid FROM plusflowlinevaa WHERE comid = startid
UNION ALL
  SELECT f.fromnode, f.tonode, f.comid
  FROM upstream_catchment up, plusflowlinevaa f
  WHERE up.fromnode = f.tonode
)
SELECT startid as startid, 
       sum(catchment.areasqkm) as areasqkm, 
       count(catchment.featureid) as n,
       ST_Union(ST_SnapToGrid(catchment.geom, 0.00001)) as geom
FROM upstream_catchment, catchment
WHERE upstream_catchment.comid=catchment.featureid
GROUP BY startid;
$$
LANGUAGE SQL;

-- get upstream basin from lat/lon point
CREATE OR REPLACE FUNCTION get_upstream(lat real, lon real) 
RETURNS TABLE(startid int, areasqkm numeric, n bigint, geom geometry)
AS $$
select * from get_upstream(get_catchment_id(lat, lon));
$$
LANGUAGE SQL;

-- get daily data average over locations within upstream basin from lat/lon point
CREATE OR REPLACE FUNCTION get_daily_upstream_within(lat real, lon real) 
RETURNS TABLE(date date, prcp real, tmax real, tmin real, wind real)
AS $$
SELECT to_date(d.year || '-' || trim(to_char(d.month, '00')) || '-' || trim(to_char(d.day, '00')), 'YYYY-MM-DD') as date,
       avg(d.prcp)::real as prcp, avg(d.tmax)::real as tmax, avg(d.tmin)::real as tmin, avg(d.wind)::real as wind
FROM maurer_day d, maurer_locations l, get_upstream(lat, lon) c
WHERE ST_Contains(c.geom, l.geom)
AND d.location_id=l.gid
GROUP BY date;
$$
LANGUAGE SQL;

-- get daily data average from location nearest to centroid of upstream basin from lat/lon point
CREATE OR REPLACE FUNCTION get_daily_upstream_nearest(lat real, lon real) 
RETURNS TABLE(date date, prcp real, tmax real, tmin real, wind real, gid int)
AS $$
SELECT to_date(d.year || '-' || trim(to_char(d.month, '00')) || '-' || trim(to_char(d.day, '00')), 'YYYY-MM-DD') as date,
       avg(d.prcp)::real as prcp, avg(d.tmax)::real as tmax, avg(d.tmin)::real as tmin, avg(d.wind)::real as wind, l.gid as gid
FROM maurer_day d, (
  SELECT ST_Distance(m.geom, ST_Centroid(c.geom)) as distance,
         m.gid, m.latitude, m.longitude
  FROM maurer_locations m, get_upstream(lat, lon) c
  ORDER BY distance 
  LIMIT 1
) AS l
WHERE d.location_id=l.gid
GROUP BY date, l.gid;
$$
LANGUAGE SQL;
