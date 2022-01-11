const os = require('os');
const axios = require('axios');

const log = require('../../lib/logger')({ name: 'cors' });
const utils = require('../../lib/utils');

const HOSTNAME = os.hostname();

const query = options => {
  const params = { ...options.options, headers: { 'X-User': HOSTNAME } };
  const url = `http://${options.url}:51234`;
  return axios.post(url, params).catch(error => {
    const message = error.response && error.response.data ? error.response.data : error.toString();
    const code = error.response && error.response.status ? error.response.status : 500;
    throw new utils.Error(`URL: ${url} - ${message}`, code);
  });
};

module.exports = async (req, res) => {
  return query({ url: req.params.url, options: req.body.options })
    .then(resp => {
      res.send(resp.data);
    })
    .catch(error => {
      log.error(`Failed cors redirect ${error.code}: ${error.message}`);
      log.error(error.stack);
      return res.status(error.code || 500).json({ message: error.message });
    });
};
