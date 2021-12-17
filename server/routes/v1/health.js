const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'health' });

module.exports = async (req, res) => {
  try {
    const health = await rippled.getHealth();
    return res.status(200).json({ message: health.data });
  } catch (error) {
    log.error(`Failed healthcheck w/ code ${error.code}: ${error.message}`);
    return res.status(error.code || 500).json({ message: error.message });
  }
};
