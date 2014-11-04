ALTER TABLE maurer_locations ADD COLUMN
  gid serial PRIMARY KEY;

ALTER TABLE maurer_locations ADD COLUMN
  geom geometry(POINT,4326);

CREATE INDEX idx_maurer_geom ON maurer_locations USING GIST(geom);

UPDATE maurer_locations
SET geom=ST_SetSRID(ST_MakePoint(longitude,latitude),4326);

ALTER TABLE maurer_day ADD COLUMN
  location_id integer;

CREATE INDEX idx_maurer_day_loc ON maurer_day (location_id);

UPDATE maurer_day
SET location_id=l.gid
FROM maurer_day d
JOIN maurer_locations l
ON d.latitude=l.latitude AND d.longitude=l.longitude;

ALTER TABLE maurer_day DROP COLUMN latitude, longitude;

vacuum analyze;
