var express = require('express');
var router = express.Router();
var pg = require('pg');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs')
var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env]

var kue = require('kue'),
    jobs = kue.createQueue();

var conString = "postgres://jeff:jeff@localhost/cst";

router.post('/wgen', function(req, res) {
  // var data = req.body.data;
  var uid = uuid.v4();
  var wd = path.join(config.sim_dir, uid);
  console.log('Creating working directory: ' + wd);
  fs.mkdir(wd, function() {
    console.log('Submitting Job');
    var job = jobs.create('wgen', {
        title: 'wgen job',
        wd: wd,
        uid: uid,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }).save( function(err){
      console.log("Job Saved!");
      console.log(job.data);
      if( err ) res.send(400, 'Error submitting job');
      res.send(job);
    });
    job.on('failed', function() {
      console.log("Job Failed!");
    });
    job.on('complete', function() {
      console.log("Job Completed!");
    });
  });
});

router.get('/jobs/:id', function(req, res) {
  // var data = req.body.data;
  var Job = kue.Job;
  console.log('Get Job: ' + req.params.id);
  Job.get(req.params.id, function(err, job) {
    // console.log(job.toJSON());
    res.send(job);
  });
});

router.get('/jobs/:id/results', function(req, res) {
  // var data = req.body.data;
  var Job = kue.Job;
  console.log('Get Job Results: ' + req.params.id);
  Job.get(req.params.id, function(err, job) {
    if (job.toJSON().state === 'complete') {
      // console.log(job.data);
      var filepath = path.resolve(job.data.wd+'/sim.csv');
      // console.log(filepath);
      res.sendfile(filepath, function(err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
        else {
          console.log('Sent:', filepath);
        }
      });  
    } else {
      res.send('Job not finished');
    }
    
  });
});

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
