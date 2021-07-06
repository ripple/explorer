const rippled = require('../../lib/rippled');

module.exports = async (req, res) => {
  const health = await rippled.getHealth();
  console.log(health);
  return res.status(200).json({});
};
