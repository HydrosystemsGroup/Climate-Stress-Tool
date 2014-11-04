-- combine catchments for mystic basin
-- set comid of downstream flowline
-- re: union of multipolygons: http://gis.stackexchange.com/questions/31895/what-is-the-best-way-to-join-lots-of-small-polygons-to-form-a-larger-polygon
CREATE TABLE mycatchment AS
  WITH RECURSIVE upstream_flowlines(fromnode, tonode, comid) AS (
    SELECT fromnode, tonode, comid FROM flowlinesvaa WHERE comid = 5867683
  UNION ALL
    SELECT f.fromnode, f.tonode, f.comid
    FROM upstream_flowlines up, flowlinesvaa f
    WHERE up.fromnode = f.tonode
  )
  SELECT 5867683 as base, 
         sum(catchment.areasqkm) as areasqkm, 
         ST_Union(ST_SnapToGrid(catchment.geom, 0.00001)) as geom
  FROM upstream_flowlines, catchment
  WHERE upstream_flowlines.comid=catchment.featureid
  GROUP BY base;

create index mycatchment_geometry_gist on mycatchment using gist(geom);