import logger from './lib/logger';
import { formatTransaction } from './lib/utils';
import { getTransaction as getRippledTransaction } from './lib/rippled';
import summarize from './lib/txSummary';

const log = logger({ name: 'transactions' });

const getTransaction = (transactionId, url = null) => {
  log.info(`get tx: ${transactionId}`);
  return getRippledTransaction(url, transactionId)
    .then(response => {
      return formatTransaction(response);
    })
    .then(data => ({
      summary: summarize(data, true).details,
      raw: data,
    }))
    .then(data => {
      return data;
    })
    .catch(error => {
      log.error(error.toString());
      throw error;
    });
};

export default getTransaction;
