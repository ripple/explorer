import { Component } from 'react';
import PropTypes from 'prop-types';
import Log from '../log';
import { fetchNegativeUNL, fetchQuorum, fetchMetrics } from '../utils';
import {
  handleValidation,
  handleLedger,
  fetchLedger,
  fetchLoadFee,
} from '../../../rippled/lib/streams';
import UrlContext from '../urlContext';

const MAX_LEDGER_COUNT = 20;

const DEFAULT_WS_URL = `wss://${process.env.REACT_APP_RIPPLED_HOST}:${process.env.REACT_APP_RIPPLED_WS_PORT}`;

const throttle = (func, limit) => {
  let inThrottle;
  return function throttled(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

const formatLedgers = data =>
  Object.entries(data)
    .map(l => {
      const hashes = Object.entries(l[1].hashes || {}).map(h => {
        const validated = h[0] === l[1].ledger_hash;

        h[1].sort((a, b) => {
          if (a.time === b.time) {
            const sa = a.unl ? 1 : 0;
            const sb = b.unl ? 1 : 0;
            return sb - sa;
          }

          return a.time - b.time;
        });

        return {
          hash: h[0],
          trusted_count: h[1].filter(d => d.unl).length,
          validations: h[1],
          unselected: !validated && Boolean(l[1].ledger_hash),
          validated,
        };
      });
      return { ...l[1], hashes };
    })
    .sort((a, b) => b.ledger_index - a.ledger_index);

class Streams extends Component {
  constructor(props) {
    super(props);
    const { updateLedgers, updateValidators } = props;
    this.state = {
      ledgers: {},
      metrics: {}, // eslint-disable-line
      validators: {}, // eslint-disable-line
      maxLedger: 0,
    };

    this.updateLedgers = throttle(ledgers => {
      updateLedgers(formatLedgers(ledgers));
    }, 250);

    this.updateValidators = throttle(validators => {
      updateValidators(Object.entries(validators).map(v => v[1]));
    }, 100);
  }

  componentDidMount() {
    this.mounted = true;
    this.connect();
    this.updateNegativeUNL();
    this.updateMetrics();
    this.heartbeat = setInterval(this.checkHeartbeat, 2000);
    this.purge = setInterval(this.purge, 5000);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.heartbeat);
    clearInterval(this.purge);
    this.ws.close();
    delete this.ws;
  }

  onmetric(data) {
    const { updateMetrics } = this.props;
    this.setState(prevState => {
      const metrics = Object.assign(prevState.metrics, data);
      updateMetrics(metrics);
      return { metrics };
    });
  }

  onledgerSummary(data) {
    const { ledger_index: ledgerIndex } = data;
    if (ledgerIndex % 256 === 0) this.updateNegativeUNL();
    if (this.mounted) {
      this.setState(prevState => {
        const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex);
        ledgers[ledgerIndex] = Object.assign(ledgers[ledgerIndex] || { hashes: {} }, data);
        this.updateLedgers(ledgers);
        return { ledgers, maxLedger };
      });
    }
  }

  onledger(data) {
    const { ledger_index: ledgerIndex } = data;
    this.setState(prevState => {
      const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex);
      ledgers[ledgerIndex] = Object.assign(ledgers[ledgerIndex] || { hashes: {} }, data);
      this.updateLedgers(ledgers);
      return { ledgers, maxLedger };
    });
  }

  onvalidation(data) {
    const { validators: vList } = this.props;
    const { ledger_index: ledgerIndex, ledger_hash: ledgerHash } = data;

    this.setState(prevState => {
      const { validators } = prevState;
      const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex);

      if (maxLedger - ledgerIndex > MAX_LEDGER_COUNT) {
        return undefined;
      }

      if (!ledgers[ledgerIndex]) {
        ledgers[ledgerIndex] = {
          ledger_index: ledgerIndex,
          hashes: {},
        };
      }

      if (!ledgers[ledgerIndex].hashes[ledgerHash]) {
        ledgers[ledgerIndex].hashes[ledgerHash] = [];
      }

      ledgers[ledgerIndex].hashes[ledgerHash].push({
        ledger_index: ledgerIndex,
        ledger_hash: ledgerHash,
        pubkey: data.pubkey,
        partial: data.partial,
        time: data.time,
        unl: vList && vList[data.pubkey] && vList[data.pubkey].unl,
      });

      validators[data.pubkey] = data;
      this.updateLedgers(ledgers);
      this.updateValidators(validators);
      return { ledgers, validators, maxLedger };
    });
  }

  getTruncatedLedgers(max) {
    const { ledgers, maxLedger } = this.state;
    const newMax = Math.max(max, maxLedger);
    Object.keys(ledgers).forEach(key => {
      if (newMax - key >= MAX_LEDGER_COUNT) {
        delete ledgers[key];
      }
    });

    return { ledgers, maxLedger: max };
  }

  purge = () => {
    const now = Date.now();
    this.setState(prevState => {
      const prev = prevState.validators;
      const validators = {};

      Object.keys(prev).forEach(key => {
        if (now - prev[key].time < 30000) {
          validators[key] = prev[key];
        }
      });

      return { validators };
    });
  };

  checkHeartbeat = () => {
    if (Date.now() - this.ws.last > 5000) {
      this.ws.close();
      this.connect();
    }
  };

  updateMetrics() {
    fetchMetrics().then(metrics => this.onmetric(metrics));
  }

  updateQuorum() {
    const rippledUrl = this.context;
    fetchQuorum(rippledUrl).then(quorum => {
      const { updateMetrics } = this.props;
      this.setState(prevState => {
        const metrics = Object.assign(prevState.metrics, { quorum });
        updateMetrics(metrics);
        return { metrics };
      });
    });
  }

  updateNegativeUNL() {
    this.updateQuorum();
    const rippledUrl = this.context;
    fetchNegativeUNL(rippledUrl).then(nUnl => {
      const { updateMetrics } = this.props;
      this.setState(prevState => {
        const metrics = Object.assign(prevState.metrics, { nUnl });
        updateMetrics(metrics);
        return { metrics };
      });
    });
  }

  connect() {
    const rippledUrl = this.context;
    const rippledWsUrl = `wss://${rippledUrl}:${process.env.REACT_APP_RIPPLED_WS_PORT}`;
    this.ws = new WebSocket(rippledUrl == null ? DEFAULT_WS_URL : rippledWsUrl);
    this.ws.last = Date.now();
    Log.info(`connecting...`);

    // handle error
    this.ws.onclose = () => {
      Log.warn(`ws closed`);
    };

    // handle error
    this.ws.onerror = e => {
      Log.error(e.toString());
    };

    // subscribe and save new connections
    this.ws.onopen = () => {
      Log.info(`connected`);
      this.ws.send(
        JSON.stringify({
          command: 'subscribe',
          streams: ['ledger', 'validations'],
        })
      );
    };

    // handle messages
    this.ws.onmessage = message => {
      this.ws.last = Date.now();

      try {
        const streamResult = JSON.parse(message.data);

        if (streamResult.type === 'validationReceived') {
          const data = handleValidation(streamResult);
          if (data) {
            this.onvalidation(data);
          }
        } else if (streamResult.type === 'ledgerClosed') {
          const { ledger, metrics } = handleLedger(streamResult);
          this.onledger(ledger);
          fetchLedger(ledger, rippledUrl)
            .then(ledgerSummary => {
              this.onledgerSummary(ledgerSummary);
            })
            .catch(e => {
              Log.error('Ledger fetch error', e.message);
              Log.error(e);
            });
          // update the load fee
          fetchLoadFee()
            .then(loadFee => {
              this.onmetric(loadFee);
            })
            .catch(e => {
              Log.error('Ledger fetch error', e.message);
              Log.error(e);
            });
          // calculate sidechain metrics on the frontend
          // because there is no backend server connection (since there is no one network)
          if (process.env.REACT_APP_ENVIRONMENT === 'sidechain') {
            this.onmetric(metrics);
          } else {
            this.updateMetrics();
          }
        }
      } catch (e) {
        Log.error('message parse error', message);
        Log.error(e);
      }
    };
  }

  render() {
    return null;
  }
}

Streams.contextType = UrlContext;

Streams.propTypes = {
  validators: PropTypes.shape({}),
  updateMetrics: PropTypes.func,
  updateLedgers: PropTypes.func,
  updateValidators: PropTypes.func,
};

Streams.defaultProps = {
  validators: {},
  updateMetrics: () => {},
  updateLedgers: () => {},
  updateValidators: () => {},
};

export default Streams;
