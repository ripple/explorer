import { Component } from 'react';
import PropTypes from 'prop-types';
import Log from '../log';
import { fetchNegativeUNL, fetchQuorum, fetchMetrics } from '../utils';
import SocketContext from '../SocketContext';
import { getLedger, getServerInfo } from '../../../rippled/lib/rippled';
import { summarizeLedger, EPOCH_OFFSET } from '../../../rippled/lib/utils';

const MAX_LEDGER_COUNT = 20;

const PURGE_INTERVAL = 10 * 1000;
const MAX_AGE = 120 * 1000;

const throttle = (func, limit) => {
  let inThrottle;
  let queued = false;
  return function throttled(...args) {
    const context = this;
    if (!inThrottle) {
      queued = false;
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        if (queued) {
          func.apply(context, args);
        }
        inThrottle = false;
        queued = false;
      }, limit);
    } else {
      queued = true;
    }
  };
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// fetch full ledger
const fetchLedger = (ledger, rippledSocket, attempts = 0) => {
  return getLedger(rippledSocket, { ledger_hash: ledger.ledger_hash })
    .then(summarizeLedger)
    .then(summary => {
      Object.assign(ledger, summary);
      return summary;
    })
    .catch(error => {
      Log.error(error.toString());
      if (error.code === 404 && attempts < 5) {
        Log.info(`retry ledger ${ledger.ledger_index} (attempt:${attempts + 1})`);
        return sleep(500).then(() => fetchLedger(ledger, rippledSocket, attempts + 1));
      }
      throw error;
    });
};

const fetchLoadFee = rippledSocket => {
  return getServerInfo(rippledSocket)
    .then(result => result.info)
    .then(info => {
      const ledgerFeeInfo = info.validated_ledger;
      const loadFee = ledgerFeeInfo.base_fee_xrp * (info.load_factor ?? 1);
      return { load_fee: Number(loadFee.toPrecision(4)).toString() };
    });
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
      allLedgers: {},
      allValidators: {},
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
    if (process.env.REACT_APP_ENVIRONMENT !== 'sidechain') {
      this.updateMetricsFromServer();
    }
    this.purge = setInterval(this.purge, 5000);
    this.purgeAll = setInterval(this.purgeAll, PURGE_INTERVAL);

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
    clearInterval(this.purgeAll);
  }

  // handle ledger messages
  handleLedger(data) {
    const ledger = this.addLedger(data);
    const { ledger_hash: ledgerHash, ledger_index: ledgerIndex, txn_count: txnCount } = data;

    Log.info('new ledger', ledgerIndex);
    ledger.ledger_hash = ledgerHash;
    ledger.txn_count = txnCount;
    ledger.close_time = (data.ledger_time + EPOCH_OFFSET) * 1000;

    const baseFee = data.fee_base / 1000000;
    return {
      ledger,
      baseFee,
    };
  }

  // handle validation messages
  handleValidation(data) {
    const { ledger_hash: ledgerHash, validation_public_key: pubkey } = data;
    const ledgerIndex = Number(data.ledger_index);

    if (!this.isValidatedChain(ledgerIndex)) {
      return undefined;
    }

    this.addLedger(data);

    this.setState(prevState => {
      if (!prevState.allValidators[pubkey]) {
        const allValidators = {
          [pubkey]: { pubkey, ledger_index: 0 },
        };
        return { allValidators };
      }
      return {};
    });

    const { allValidators } = this.state;
    if (
      allValidators[pubkey].ledger_hash !== ledgerHash &&
      ledgerIndex > allValidators[pubkey].ledger_index
    ) {
      this.setState(prevState => {
        const newValidatorData = Object.assign(prevState.allValidators[pubkey], {
          ledger_hash: ledgerHash,
          ledger_index: ledgerIndex,
          last: Date.now(),
        });
        const newAllValidators = Object.assign(prevState.allValidators, {
          [pubkey]: newValidatorData,
        });
        return { allValidators: newAllValidators };
      });

      return {
        ledger_index: Number(ledgerIndex),
        ledger_hash: ledgerHash,
        pubkey,
        partial: !data.full,
        time: (data.signing_time + EPOCH_OFFSET) * 1000,
      };
    }

    return undefined;
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
        if (ledgers[ledgerIndex].txn_count == null) {
          ledgers[ledgerIndex].txn_count = data.transactions.length;
        }
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

  // purge old data
  purgeAll = () => {
    const now = Date.now();
    this.setState(prevState => {
      const allLedgers = { ...prevState.allLedgers };
      Object.keys(allLedgers).forEach(key => {
        if (now - allLedgers[key].seen > MAX_AGE) {
          delete allLedgers[key];
        }
      });

      const allValidators = { ...prevState.allValidators };
      Object.keys(allValidators).forEach(key => {
        if (now - allValidators[key].last > MAX_AGE) {
          delete allValidators[key];
        }
      });
      return { allLedgers, allValidators };
    });
  };

  // determine if the ledger index
  // is on the validated ledger chain
  isValidatedChain(ledgerIndex) {
    const { allLedgers } = this.state;
    let prev = ledgerIndex - 1;
    while (allLedgers[prev]) {
      if (allLedgers[prev].ledger_hash) {
        return true;
      }
      prev -= 1;
    }

    return false;
  }

  // add the ledger to the cache
  addLedger(data) {
    const { ledger_index: ledgerIndex } = data;

    this.setState(prevState => {
      if (!prevState.allLedgers[ledgerIndex]) {
        const allLedgers = Object.assign(prevState.allLedgers, {
          [ledgerIndex]: {
            ledger_index: Number(ledgerIndex),
            seen: Date.now(),
          },
        });
        return { allLedgers };
      }
      return {};
    });

    const { allLedgers } = this.state;
    return allLedgers[ledgerIndex];
  }

  // update rolling metrics
  updateMetrics(baseFee) {
    const ledgerChain = this.organizeChain().slice(-100);

    let time = 0;
    let fees = 0;
    let timeCount = 0;
    let txCount = 0;
    let txWithFeesCount = 0;
    let ledgerCount = 0;

    ledgerChain.forEach((d, i) => {
      const next = ledgerChain[i + 1];
      if (next && next.seen && d.seen) {
        time += next.seen - d.seen;
        timeCount += 1;
      }

      if (d.total_fees) {
        fees += d.total_fees;
        txWithFeesCount += d.txn_count;
      }
      if (d.txn_count) {
        txCount += d.txn_count;
        ledgerCount += 1;
      }
    });

    return {
      base_fee: Number(baseFee.toPrecision(4)).toString(),
      txn_sec: time && txCount ? ((txCount / time) * 1000).toFixed(2) : undefined,
      txn_ledger: ledgerCount ? (txCount / ledgerCount).toFixed(2) : undefined,
      ledger_interval: timeCount ? (time / timeCount / 1000).toFixed(3) : undefined,
      avg_fee: txWithFeesCount ? (fees / txWithFeesCount).toPrecision(4) : undefined,
    };
  }

  // convert to array and sort
  organizeChain() {
    const { allLedgers } = this.state;
    return Object.entries(allLedgers)
      .map(d => d[1])
      .sort((a, b) => a.ledger_index - b.ledger_index);
  }

  updateMetricsFromServer() {
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
      if (streamResult.type !== 'ledgerClosed') {
        return;
      }
      const { ledger, baseFee } = this.handleLedger(streamResult);
      this.onledger(ledger);
      fetchLedger(ledger, rippledSocket)
        .then(ledgerSummary => {
          this.onledgerSummary(ledgerSummary);
        })
        .then(() => {
          if (process.env.REACT_APP_ENVIRONMENT === 'sidechain') {
            this.onmetric(this.updateMetrics(baseFee));
          }
        })
        .catch(e => {
          Log.error('Ledger fetch error', e.message);
          Log.error(e);
        });
      // update the load fee
      fetchLoadFee(rippledSocket)
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
        this.onmetric(this.updateMetrics(baseFee));
      } else {
        this.updateMetricsFromServer();
      }
    });

    rippledSocket.on('validation', streamResult => {
      const data = this.handleValidation(streamResult);
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
