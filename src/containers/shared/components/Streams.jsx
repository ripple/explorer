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
import SocketContext from '../SocketContext';

const MAX_LEDGER_COUNT = 20;

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
    this.purge = setInterval(this.purge, 5000);

    const rippledSocket = this.context;
    rippledSocket.send({
      command: 'subscribe',
      streams: ['ledger', 'validations'],
    });
  }

  componentWillUnmount() {
    const rippledSocket = this.context;
    rippledSocket.send({
      command: 'unsubscribe',
      streams: ['ledger', 'validations'],
    });

    this.mounted = false;
    clearInterval(this.purge);
  }

  onmetric(data) {
    const { updateMetrics } = this.props;
    if (this.mounted) {
      this.setState(prevState => {
        const metrics = Object.assign(prevState.metrics, data);
        updateMetrics(metrics);
        return { metrics };
      });
    }
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
    if (this.mounted) {
      this.setState(prevState => {
        const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex);
        ledgers[ledgerIndex] = Object.assign(ledgers[ledgerIndex] || { hashes: {} }, data);
        this.updateLedgers(ledgers);
        return { ledgers, maxLedger };
      });
    }
  }

  onvalidation(data) {
    const { validators: vList } = this.props;
    const { ledger_index: ledgerIndex, ledger_hash: ledgerHash } = data;

    if (this.mounted) {
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

  updateMetrics() {
    fetchMetrics().then(metrics => this.onmetric(metrics));
  }

  updateQuorum() {
    const rippledSocket = this.context;
    fetchQuorum(rippledSocket).then(quorum => {
      const { updateMetrics } = this.props;
      if (this.mounted) {
        this.setState(prevState => {
          const metrics = Object.assign(prevState.metrics, { quorum });
          updateMetrics(metrics);
          return { metrics };
        });
      }
    });
  }

  updateNegativeUNL() {
    this.updateQuorum();
    const rippledSocket = this.context;
    fetchNegativeUNL(rippledSocket).then(nUnl => {
      const { updateMetrics } = this.props;
      if (this.mounted) {
        this.setState(prevState => {
          const metrics = Object.assign(prevState.metrics, { nUnl });
          updateMetrics(metrics);
          return { metrics };
        });
      }
    });
  }

  connect() {
    const rippledSocket = this.context;

    rippledSocket.on('ledger', streamResult => {
      const { ledger, metrics } = handleLedger(streamResult);
      this.onledger(ledger);
      fetchLedger(ledger, rippledSocket)
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
    });

    rippledSocket.on('validation', streamResult => {
      const data = handleValidation(streamResult);
      if (data) {
        this.onvalidation(data);
      }
    });
  }

  render() {
    return null;
  }
}

Streams.contextType = SocketContext;

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
