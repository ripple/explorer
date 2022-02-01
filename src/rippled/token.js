import logger from './lib/logger';
import { formatAccountInfo } from './lib/utils';
import { getBalances, getAccountInfo, getServerInfo } from './lib/rippled';

const log = logger({ name: 'iou' });

const getToken = async (currencyCode, issuer, url = null) => {
  try {
    log.info('fetching account info from rippled');
    const accountInfo = await getAccountInfo(url, issuer);
    const serverInfo = await getServerInfo(url);

    log.info('fetching gateway_balances from rippled');
    const balances = await getBalances(url, issuer);
    const obligations = balances?.obligations && balances.obligations[currencyCode.toUpperCase()];
    if (!obligations) {
      throw new Error('Currency not issued by account');
    }

    const {
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      previousTxn,
      previousLedger,
    } = formatAccountInfo(accountInfo, serverInfo.info.validated_ledger);

    return {
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      obligations,
      previousTxn,
      previousLedger,
    };
  } catch (error) {
    log.error(error.toString());
    throw error;
  }
};

export default getToken;
