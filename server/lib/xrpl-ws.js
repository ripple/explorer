const WebSocket = require('ws');
const streams = require('./streams');
const log = require('./logger')({ name: 'xrpl ws' });

const RIPPLEDS = [
  {
    host: process.env.RIPPLED_HOST,
    port: process.env.RIPPLED_WS_PORT,
    primary: true,
  },
];

let connections = [];

if (process.env.RIPPLED_SECONDARY) {
  process.env.RIPPLED_SECONDARY.split(',').forEach(d => {
    const rippled = d.split(':');
    RIPPLEDS.push({
      host: rippled[0],
      port: rippled[1] || 51233,
    });
  });
}

const connect = rippled => {
  log.info(`${rippled.host}:${rippled.port} connecting...`);
  const ws = new WebSocket(`ws://${rippled.host}:${rippled.port}`);
  ws.rippled = rippled;

  // handle close
  ws.on('close', () => {
    log.info(`${rippled.host} closed`);
    ws.last = Date.now();
  });

  // handle error
  ws.on('error', e => {
    log.error(`${rippled.host} error - ${e.toString()}`);
  });

  // subscribe and save new connections
  ws.on('open', () => {
    log.info(`${rippled.host} connected`);
    ws.send(
      JSON.stringify({
        command: 'subscribe',
        streams: rippled.primary ? ['ledger'] : [],
      })
    );
  });

  // handle messages
  ws.on('message', message => {
    ws.last = Date.now();
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      log.error('message parse error', message);
      log.error(e);
    }

    streams.handleLedger(data);
  });

  return ws;
};

const checkHeartbeat = () => {
  connections.forEach((ws, i) => {
    if (Date.now() - ws.last > 10000) {
      ws.terminate();
      log.info(`attempt reconnect ${ws.rippled.host}`);
      connections[i] = connect(ws.rippled);
    }
  });
};

setInterval(checkHeartbeat, 2000);

module.exports.start = () => {
  connections = RIPPLEDS.map(connect);
};
