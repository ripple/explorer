const utils = require('../../lib/utils');
const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'serverInfo' });

const getQuorum = (req, res) => {
  log.info(`fetching server_info from rippled`);

  rippled
    .getServerInfo()
    .then(result => {
      if (result === undefined || result.info === undefined) {
        throw utils.Error('Undefined result from getServerInfo()');
      }

      const quorum = result.info.validation_quorum;
      if (quorum === undefined) {
        throw utils.Error('Undefined validation_quorum');
      }

      return quorum;
    })
    .then(quorum => res.send({ quorum }))
    .catch(error => {
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};

export default getQuorum;
