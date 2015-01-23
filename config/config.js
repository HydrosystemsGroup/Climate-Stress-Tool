var path = require('path')
  , rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    env: 'development',
    root: rootPath,
    sim_dir: '/Users/jeff/Projects/UMass/runs',
    app: {
      name: 'Climate Stress Tool - dev'
    }
  },
  test: {
    env: 'test',
    root: rootPath,
    sim_dir: '/Users/jeff/Projects/UMass/runs',
    app: {
      name: 'Climate Stress Tool - test'
    }
  },
  production: {
    env: 'production',
    root: rootPath,
    sim_dir: '/Users/jeff/Projects/UMass/runs',
    app: {
      name: 'Climate Stress Tool'
    }
  }
}