var kue = require('kue'),
    jobs = kue.createQueue();

var shell = require('shelljs');

jobs.process('wgen', function(job, done){
  console.log('Processing wgen job ' + job.id);
  var cmd = 'Rscript ../r/daily_generator.R ' + [job.data.wd, +job.data.latitude, +job.data.longitude].join(' ');
  console.log('Running: ' + cmd);
  shell.exec(cmd, {async: true, silent: true}, function(code, output) {
    if (code===0) {
      done();
    } else {
      done('Rscript failed\n'+output);
    }
  });
});

kue.app.listen(3001);
