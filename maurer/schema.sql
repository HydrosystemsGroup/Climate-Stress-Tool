CREATE TABLE maurer_locations (
  gid INTEGER PRIMARY KEY,
  latitude REAL,
  longitude REAL
);

CREATE TABLE maurer_day (
  year INTEGER,
  month INTEGER,
  day INTEGER,
  prcp REAL,
  tmax REAL,
  tmin REAL,
  wind REAL,
  location_id INTEGER REFERENCES maurer_locations (gid)
);
CREATE INDEX idx_maurer_day_location_id ON maurer_day (location_id);
