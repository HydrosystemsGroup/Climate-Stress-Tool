var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = "postgres://jeff:jeff@localhost/cst";

router.post('/', function(req, res) {
  var latitude = req.body.latitude,
      longitude = req.body.longitude;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      res.send('error fetching client from pool');
    }
    client.query([
      "SELECT to_date(d.year || '-01-01', 'YYYY-MM-DD') as date,",
           "sum(prcp) as prcp, avg(tmax) as tmax, avg(tmin) as tmin, avg(wind) as wind",
      "FROM maurer_day d, (",
      "SELECT ST_Distance(m.geom, ST_SetSRID(ST_MakePoint($2, $1), 4326)) as distance,",
             "m.gid, m.latitude, m.longitude",
        "FROM maurer_locations m",
        "ORDER BY distance",
        "LIMIT 1",
      ") AS l",
      "WHERE d.location_id=l.gid",
      "GROUP BY d.year",
      "ORDER BY date"].join(' '), 
      // "SELECT to_date(d.year || '-' || trim(to_char(d.month, '00')) || '-' || trim(to_char(d.day, '00')), 'YYYY-MM-DD') as date,",
      //      "prcp, tmax, tmin, wind",
      // "FROM maurer_day d, (",
      // "SELECT ST_Distance(m.geom, ST_SetSRID(ST_MakePoint($2, $1), 4326)) as distance,",
      //        "m.gid, m.latitude, m.longitude",
      //   "FROM maurer_locations m",
      //   "ORDER BY distance",
      //   "LIMIT 1",
      // ") AS l",
      // "WHERE d.location_id=l.gid",
      // "ORDER BY date"].join(' '), 
      [latitude, longitude],
      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          res.send(400, 'error running query');
        } else {
          res.send(result.rows);
        }
      });
  });

  
});

module.exports = router;
