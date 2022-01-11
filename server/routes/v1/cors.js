const os = require('os');
const axios = require('axios');

const log = require('../../lib/logger')({ name: 'cors' });
const utils = require('../../lib/utils');

const HOSTNAME = os.hostname();

const query = options => {
  const params = { ...options.options, headers: { 'X-User': HOSTNAME } };
  log.info(params);
  const url = `http://${options.url}:51234`;
  return axios.post(url, params).catch(error => {
    log.info(error);
    const message = error.response && error.response.data ? error.response.data : error.toString();
    const code = error.response && error.response.status ? error.response.status : 500;
    throw new utils.Error(`URL: ${url} - ${message}`, code);
  });
};

module.exports = async (req, res) => {
  log.info(req.params);
  log.info(typeof req.query);
  log.info(JSON.stringify(req.query), JSON.parse(JSON.stringify(req.query)));
  log.info({ ...JSON.parse(JSON.stringify(req.query)) });
  log.info(req.query);
  const { url, method } = req.params;
  return query({ url, options: { method, params: [req.query] } })
    .then(resp => {
      log.info(resp.data);
      res.send(resp.data);
    })
    .catch(error => {
      log.error(`Failed cors redirect ${error.code}: ${error.message}`);
      log.error(error.stack);
      return res.status(error.code || 500).json({ message: error.message });
    });
};
