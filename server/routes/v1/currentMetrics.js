const log = require('../../lib/logger')({ name: 'current_metrics' });
const streams = require('../../lib/streams');

module.exports = async (req, res) => {
  try {
    const metrics = await streams.getCurrentMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    log.error(`Failed healthcheck w/ code ${error.code}: ${error.message}`);
    return res.status(error.code || 500).json({ message: error.message });
  }
};
