const { default: axios } = require('axios');
const log = require('../../lib/logger')({ name: 'nodes' });

const ENV_NETWORK_MAP = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
};

const cache = {};

const semverCompare = (a = '', b = '') => {
  const chopa = a.split('+')[0];
  const chopb = b.split('+')[0];
  const pa = chopa.split('.');
  const pb = chopb.split('.');

  for (let i = 0; i < 3; i += 1) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }

  return 0;
};

const ledgerCompare = (a = 0, b = 0) => {
  const aLedger = a.validated_ledger ? a.validated_ledger.ledger_index : 0;
  const bLedger = b.validated_ledger ? b.validated_ledger.ledger_index : 0;
  return bLedger === aLedger ? semverCompare(b.version, a.version) : bLedger - aLedger;
};

const fetchNodes = () => {
  const network = ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT];
  return axios
    .get(`${process.env.REACT_APP_DATA_URL}/topology/nodes/${network}`)
    .then(resp => resp.data.nodes);
};

const cacheNodes = async () => {
  if (!cache.pending) {
    cache.pending = true;
    try {
      const nodes = await fetchNodes();

      cache.nodes = nodes.map(node => ({
        host: node.ip,
        port: node.port,
        pubkey_node: node.node_public_key,
        version: node.version.startsWith('rippled') ? node.version.split('-')[1] : node.version,
        ledgers: node.complete_ledgers,
        uptime: node.uptime,
        networks: node.networks,
        validated_ledger: {
          ledger_index: node.complete_ledgers ? Number(node.complete_ledgers.split('-')[1]) : 0,
        },
        in: node.inbound_count,
        out: node.outbound_count,
        server_state: node.server_state,
        latency: node.io_latency_ms,
        load_factor: Number(node.load_factor_server),
        lat: node.lat,
        long: node.long,
      }));

      cache.nodes.sort((a, b) => {
        if (a.server_state === b.server_state) {
          return ledgerCompare(a, b);
        }
        if (a.server_state && !b.server_state) {
          return -1;
        }
        return 1;
      });
      cache.time = Date.now();
      cache.pending = false;
    } catch (e) {
      cache.pending = false;
      log.error(e.toString());
    }
  }
};

cacheNodes();

module.exports = (req, res) => {
  log.info('get nodes');

  if (Date.now() - (cache.time || 0) > 60 * 1000) {
    cacheNodes();
  }
  res.send(cache.nodes || []);
};
