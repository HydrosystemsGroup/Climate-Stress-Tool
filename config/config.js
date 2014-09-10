var path = require('path')
  , rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    env: 'development',
    root: rootPath,
    app: {
      name: 'Climate Stress Tool - dev'
    }
  },
  test: {
    env: 'test',
    root: rootPath,
    app: {
      name: 'Climate Stress Tool - test'
    }
  },
  production: {
    env: 'production',
    root: rootPath,
    app: {
      name: 'Climate Stress Tool'
    }
  }
}