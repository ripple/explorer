import { resolvePayId } from 'payid-lib';
import logger from './lib/logger';

const log = logger({ name: 'payString' });

const getPayString = payString => {
  log.info(`get paystring: ${payString}`);

  return resolvePayId(payString)
    .then(result => {
      return result;
    })
    .catch(error => {
      log.error(error.toString());
      if (error.code) {
        const codeNumber = Number(error.code); // fetch gives codes like 'ETIMEDOUT' which are NaN
        if (codeNumber > 0 && codeNumber < 999) {
          throw error;
        }
      }
      throw error;
    });
};

export default getPayString;
