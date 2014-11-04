DROP TABLE IF EXISTS maurer_day;

CREATE TABLE maurer_day (
  year REAL,
  month REAL,
  day REAL,
  prcp REAL,
  tmax REAL,
  tmin REAL,
  wind REAL,
  latitude REAL,
  longitude REAL
);
CREATE INDEX idx_maurer_day_latlon ON maurer_day (latitude, longitude);

CREATE TABLE maurer_locations (
  latitude real,
  longitude real
);
CREATE INDEX idx_maurer_locations_latlon ON maurer_locations (latitude, longitude)
