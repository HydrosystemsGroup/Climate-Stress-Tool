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
  console.log(req.body);
  // var data = req.body.data;
  var uid = uuid.v4();
  var wd = path.join(config.run_folder, uid);
  var data = req.body.data;
  var inputs = req.body.inputs;

  console.log('Creating working directory: ' + wd);

  fs.mkdir(wd, function() {
    console.log('Saving inputs file: ', path.join(wd, 'inputs.json'));
    fs.writeFile(path.join(wd, 'inputs.json'), JSON.stringify(inputs), function() {
      fs.writeFile(path.join(wd, 'data.json'), JSON.stringify(data), function() {
        console.log('Submitting Job');
        var job = jobs.create('wgen', {
            title: 'wgen job',
            wd: wd,
            uid: uid,
            inputs: inputs
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
  });
});

router.get('/wgen/:id', function(req, res) {
  var Job = kue.Job;
  Job.get(req.params.id, function(err, job) {
    if (job) {
      res.send(job);
    } else {
      res.send(404, err.message);
    }
  });
});

router.get('/wgen/:id/files', function(req, res) {
  // var data = req.body.data;
  var Job = kue.Job;
  console.log('Get Job Results: ' + req.params.id);
  Job.get(req.params.id, function(err, job) {
    fs.readdir(job.data.wd, function(err, files) {
      if (err) {
        res.status(400).send('Could not find files');
      }
      else {
        res.send(files);
      }
    });
  });
});


router.get('/wgen/:id/files/:filename', function(req, res) {
  // var data = req.body.data;
  var Job = kue.Job;
  console.log('Get Job Results: ' + req.params.id);
  Job.get(req.params.id, function(err, job) {
    if (err) {
      console.log(err)
    } else if (job.toJSON().state === 'complete') {
      // console.log(job.data);
      var filepath = path.join(job.data.wd, req.params.filename);
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

router.get('/maurer', function(req, res) {
  var latitude = req.query.latitude,
      longitude = req.query.longitude;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      res.send('Error fetching client from pool');
    }
    client.query([
      "SELECT (d.year || '-' || lpad(d.month::text, 2, '0') || '-' || lpad(d.day::text, 2, '0')) as date, d.prcp, d.tmax, d.tmin, d.wind",
      "FROM maurer_day d, (",
      "SELECT ST_Distance(m.geom, ST_SetSRID(ST_MakePoint($2, $1), 4326)) as distance,",
             "m.gid, m.latitude, m.longitude",
        "FROM maurer_locations m",
        "ORDER BY distance",
        "LIMIT 1",
      ") AS l",
      "WHERE d.location_id=l.gid",
      "ORDER BY date"].join(' '),
      [latitude, longitude],
      function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          console.log(err.message);
          res.send(400, err.message);
        } else {
          res.send(result.rows);
        }
      });
  });
});

router.post('/maurer/annual', function(req, res) {
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

router.post('/batch', function(req, res) {
  console.log(req.body);
  // var data = req.body.data;
  var uid = uuid.v4();
  var wd = path.join(config.run_folder, uid);
  var data = req.body.data;
  var inputs = req.body.inputs;

  console.log('Creating working directory: ' + wd);

  fs.mkdir(wd, function() {
    console.log('Saving inputs file: ', path.join(wd, 'inputs.json'));
    fs.writeFile(path.join(wd, 'inputs.json'), JSON.stringify(inputs), function() {
      fs.writeFile(path.join(wd, 'data.json'), JSON.stringify(data), function() {
        console.log('Submitting Job');
        var job = jobs.create('batch', {
            title: 'batch job',
            wd: wd,
            uid: uid,
            inputs: inputs
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
  });
});

router.get('/batch/:id', function(req, res) {
  var Job = kue.Job;
  Job.get(req.params.id, function(err, job) {
    if (err) {
      res.send(500, err);
    } else {
      res.send(job);
    }
  });
});

module.exports = router;
