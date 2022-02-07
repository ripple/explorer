require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressWs = require('express-ws');
const xrpl = require('./lib/xrpl-ws');
const streams = require('./lib/streams');
const routes = require('./routes/v1');

const log = require('./lib/logger')({ name: 'server' });

const PORT = process.env.PORT || 5001;
const ADDR = process.env.ADDR || 'localhost';
const app = express();
const files = express.static(path.join(__dirname, '/../build'));

expressWs(app);
app.use(bodyParser.json());
app.use(files);
app.ws('/ws', ws => streams.addWs(ws));
app.use('/api/v1', routes);

if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '/../build/index.html'));
  });
}

app.use('*', (req, res) => {
  log.error('not found:', req.originalUrl);
  res.status(404).send({ error: 'route not found' });
});

xrpl.start();
app.listen(PORT, ADDR);
log.info(`server listening on ${ADDR}:${PORT}`);
