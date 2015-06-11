
module.exports = function (app) {
  app.use('/api', require('../routes/api'));
  app.use('/', require('../routes/index'));
};
