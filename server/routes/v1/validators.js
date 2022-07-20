const axios = require('axios');
const log = require('../../lib/logger')({ name: 'validators' });

const cache = {};

const fetchValidators = () => {
  const validatorURI = encodeURIComponent(process.env.REACT_APP_VALIDATOR);
  return axios
    .get(`${process.env.REACT_APP_DATA_URL}/validators/${validatorURI}`)
    .then(response => response.data.validators);
};

const cacheValidators = async () => {
  if (!cache.pending) {
    cache.pending = true;
    try {
      cache.validators = await fetchValidators();
      cache.time = Date.now();
      cache.pending = false;
    } catch (e) {
      cache.pending = false;
      log.error(e.toString());
    }
  }
};

cacheValidators();

module.exports = (req, res) => {
  // refresh cache if older than 2.5 seconds
  if (Date.now() - (cache.time || 0) > 2500) {
    cacheValidators();
  }

  log.info(`get validators v2`);
  const validators = cache.validators || [];

  if (req.query.verbose) {
    const validatorsFormatted = validators.map(v => ({
      master_key: v.master_key,
      signing_key: v.signing_key,
      unl: v.unl,
      domain: v.domain,
      ledger_index: v.current_index,
      agreement_1hour: v.agreement_1h,
      agreement_24hour: v.agreement_24h,
      agreement_30day: v.agreement_30day,
      chain: v.chain,
      partial: v.partial,
    }));

    if (req.query.key) {
      return res.json(
        validatorsFormatted.find(
          v => v.master_key === req.query.key || v.signing_key === req.query.key
        )
      );
    }

    return res.send(validatorsFormatted);
  }

  const validatorSummary = validators.map(v => ({
    signing_key: v.signing_key,
    master_key: v.master_key,
    unl: v.unl,
    domain: v.domain,
  }));

  if (req.query.unl === process.env.REACT_APP_VALIDATOR) {
    return res.send(
      validatorSummary.filter(val => {
        return val.unl === req.query.unl;
      })
    );
  }

  return res.send(validatorSummary);
};
