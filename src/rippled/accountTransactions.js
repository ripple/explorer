/**
 * Page path: /accounts/:id?
 *
 * API path: /api/v1/account_transactions/<address>?marker=<marker>
 *
 * Part 2 of 2
 */

import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec';

import { formatTransaction } from './lib/utils';
import { getAccountTransactions as getAccountTxs } from './lib/rippled';
import summarize from './lib/txSummary';
import logger from './lib/logger';

const log = logger({ name: 'account transactions' });

const getAccountTransactions = async (account, currency, marker, limit, rippledSocket) => {
  // TODO: Retrieve txs for untagged X-address only?

  let classicAddress;
  let decomposedAddress = null;

  try {
    if (!isValidClassicAddress(account) && !isValidXAddress(account)) {
      throw new Error('Malformed address');
    }

    if (isValidXAddress(account)) {
      decomposedAddress = xAddressToClassicAddress(account);
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
    throw error;
  }

  log.info(`get transactions: ${account} -> ${classicAddress}`);
  return getAccountTxs(rippledSocket, classicAddress, limit, marker)
    .then(data => {
      const transactions = data.transactions
        .map(tx => {
          const txn = formatTransaction(tx);
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
    .then(d => {
      return d;
    })
    .catch(error => {
      log.error(error.toString());
      throw error;
    });
};

export default getAccountTransactions;
