/**
 * page path: /accounts/:id?
 *
 * part 1 of 2
 */

const addressCodec = require('ripple-address-codec');
const streams = require('../../lib/streams');
const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'account balances' });
const utils = require('../../lib/utils');

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
const getAccountState = (req, res) => {
  const { id: account } = req.params;

  // TODO: Retrieve balances for untagged X-address only? or display notice/warning

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
        throw Error('Address on wrong network.');
      }
    } else {
      classicAddress = account;
    }
  } catch (error) {
    log.error(error.toString());
    res.status(error.code || 500).json({ message: error.message });
  }

  log.info(`get balances: ${account} -> ${classicAddress}`);
  rippled
    .getAccountInfo(classicAddress)
    .then(info =>
      Promise.all([
        rippled
          .getBalances(classicAddress, info.ledger_index)
          .then(data => formatResults(info, data)),
        rippled.getAccountEscrows(classicAddress, info.ledger_index),
        rippled.getAccountPaychannels(classicAddress, info.ledger_index),
      ]).then(data => {
        res.send({
          account: info.Account,
          ledger_index: info.ledger_index,
          info: utils.formatAccountInfo(info, streams.getReserve()),
          balances: data[0],
          signerList: info.signer_lists[0]
            ? utils.formatSignerList(info.signer_lists[0])
            : undefined,
          escrows: data[1],
          paychannels: data[2],
          xAddress: decomposedAddress || undefined,
        });
      })
    )
    .catch(error => {
      // X-address:
      //   error.toString(): CustomError: account not found
      //   error.code: 404
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};

export default getAccountState;
