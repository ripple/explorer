import logger from './lib/logger';
import { Error } from './lib/utils';
import { getServerInfo } from './lib/rippled';

const log = logger({ name: 'serverInfo' });

const getQuorum = rippledSocket => {
  log.info(`fetching server_info from rippled`);

  return getServerInfo(rippledSocket)
    .then(result => {
      if (result === undefined || result.info === undefined) {
        throw Error('Undefined result from getServerInfo()');
      }

      const quorum = result.info.validation_quorum;
      if (quorum === undefined) {
        throw Error('Undefined validation_quorum');
      }

      return quorum;
    })
    .catch(error => {
      log.error(error.toString());
      throw error;
    });
};

export default getQuorum;
