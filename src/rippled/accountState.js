/**
 * page path: /accounts/:id?
 *
 * part 1 of 2
 */

import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec';
import {
  getAccountInfo,
  getAccountEscrows,
  getAccountPaychannels,
  getBalances,
  getServerInfo,
} from './lib/rippled';
import logger from './lib/logger';
import { formatAccountInfo, formatSignerList } from './lib/utils';

const log = logger({ name: 'account balances' });

const formatResults = (info, data) => {
  const balances = { XRP: Number(info.Balance) / 1000000 };
  const { assets = {}, obligations = {} } = data;

  Object.keys(obligations).forEach(currency => {
    if (!balances[currency]) {
      balances[currency] = 0;
    }

    balances[currency] += Number(obligations[currency]);
  });

  Object.keys(assets).forEach(issuer => {
    assets[issuer].forEach(d => {
      if (!balances[d.currency]) {
        balances[d.currency] = 0;
      }

      balances[d.currency] += Number(d.value);
    });
  });

  return balances;
};
const getAccountState = (account, url = null) => {
  // TODO: Retrieve balances for untagged X-address only? or display notice/warning

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
        throw Error('Address on wrong network.');
      }
    } else {
      classicAddress = account;
    }
  } catch (error) {
    log.error(error.toString());
    throw error;
  }

  log.info(`get balances: ${account} -> ${classicAddress}`);
  return getAccountInfo(url, classicAddress)
    .then(info =>
      Promise.all([
        getBalances(url, classicAddress, info.ledger_index).then(data => formatResults(info, data)),
        getAccountEscrows(url, classicAddress, info.ledger_index),
        getAccountPaychannels(url, classicAddress, info.ledger_index),
        getServerInfo(url),
      ]).then(data => {
        return {
          account: info.Account,
          ledger_index: info.ledger_index,
          info: formatAccountInfo(info, data[3].info.validated_ledger),
          balances: data[0],
          signerList: info.signer_lists[0] ? formatSignerList(info.signer_lists[0]) : undefined,
          escrows: data[1],
          paychannels: data[2],
          xAddress: decomposedAddress || undefined,
        };
      })
    )
    .catch(error => {
      // X-address:
      //   error.toString(): CustomError: account not found
      //   error.code: 404
      log.error(error.toString());
      throw error;
    });
};

export default getAccountState;
