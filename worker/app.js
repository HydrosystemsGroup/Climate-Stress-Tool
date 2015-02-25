var kue = require('kue'),
    jobs = kue.createQueue();

var exec = require('child_process').exec;

jobs.process('wgen', function(job, done){
  console.log('Processing job: ' + job.id);
  var cmd = 'Rscript ../r/daily_generator.R ' + job.data.wd;
  console.log('> ' + cmd);

  var child = exec(cmd, function (error, stdout, stderr) {
    if (error !== null) {
      done(stderr);
    } else {
      done();
    }
  });
});

jobs.process('batch', function(job, done){
  console.log('Processing job: ' + job.id);
  var cmd = 'Rscript ../r/batch_generator.R ' + job.data.wd;
  console.log('> ' + cmd);

  var child = exec(cmd, function (error, stdout, stderr) {
    if (error !== null) {
      done(stderr);
    } else {
      done();
    }
  });
});
