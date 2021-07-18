/**
 * Page path: /accounts/:id?
 *
 * API path: /api/v1/account_transactions/<address>?marker=<marker>
 *
 * Part 2 of 2
 */

const addressCodec = require('ripple-address-codec');
const utils = require('../../lib/utils');
const rippled = require('../../lib/rippled');
const summarize = require('../../lib/txSummary');
const log = require('../../lib/logger')({ name: 'account transactions' });

module.exports = (req, res) => {
  const { id: account, currency } = req.params;
  const { limit, marker } = req.query;

  // TODO: Retrieve txs for untagged X-address only?

  let classicAddress;
  let decomposedAddress = null;

  try {
    if (!addressCodec.isValidClassicAddress(account) && !addressCodec.isValidXAddress(account)) {
      throw new Error('Malformed address');
    }

    if (addressCodec.isValidXAddress(account)) {
      decomposedAddress = addressCodec.xAddressToClassicAddress(account);
      ({ classicAddress } = decomposedAddress);
      // TODO: Display tag, if present
      const isTestnet = decomposedAddress.test;

      // TODO: Display tag, if present
      if (
        (isTestnet && process.env.REACT_APP_ENVIRONMENT === 'mainnet') ||
        (!isTestnet &&
          (process.env.REACT_APP_ENVIRONMENT === 'testnet' ||
            process.env.REACT_APP_ENVIRONMENT === 'devnet'))
      ) {
        throw Error('Address on wrong network');
      }
    } else {
      classicAddress = account;
    }
  } catch (error) {
    log.error(error.toString());
    res.status(error.code || 500).json({ message: error.message });
  }

  log.info(`get transactions: ${account} -> ${classicAddress}`);
  rippled
    .getAccountTransactions(classicAddress, limit, marker)
    .then(data => {
      const transactions = data.transactions
        .map(tx => {
          const txn = utils.formatTransaction(tx);
          return summarize(txn, true);
        })
        .filter(
          tx =>
            !currency ||
            (currency && JSON.stringify(tx).includes(`"currency":"${currency.toUpperCase()}"`))
        );
      return {
        transactions,
        marker: data.marker,
      };
    })
    .then(d => res.send(d))
    .catch(error => {
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};
