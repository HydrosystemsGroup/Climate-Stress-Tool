var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    env: 'development',
    root: rootPath,
    run_folder: path.join(rootPath, 'runs'),
    app: {
      name: 'Climate Stress Tool - dev'
    }
  },
  test: {
    env: 'test',
    root: rootPath,
    run_folder: path.join(rootPath, 'runs'),
    app: {
      name: 'Climate Stress Tool - test'
    }
  },
  production: {
    env: 'production',
    root: rootPath,
    run_folder: path.join(rootPath, 'runs'),
    app: {
      name: 'Climate Stress Tool'
    }
  }
};
