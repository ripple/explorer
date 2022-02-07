const proxy = require('http-proxy-middleware');

module.exports = app => {
  app.use(proxy('/ws', { target: 'ws://localhost:5001', ws: true }));
  app.use(proxy('/api', { target: 'http://localhost:5001' }));
};
