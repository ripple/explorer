const rippled = require('../../lib/rippled');

module.exports = async (req, res) => {
  try {
    const health = await rippled.getHealth();
    return res.status(200).json({ message: health.data });
  } catch (error) {
    return res.status(error.code || 500).json({ message: error.message });
  }
};
