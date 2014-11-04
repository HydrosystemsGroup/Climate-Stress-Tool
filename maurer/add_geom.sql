ALTER TABLE maurer_locations ADD COLUMN
  geom geometry(POINT,4326);

CREATE INDEX idx_maurer_geom ON maurer_locations USING GIST(geom);

UPDATE maurer_locations
SET geom=ST_SetSRID(ST_MakePoint(longitude,latitude),4326);

vacuum analyze;
