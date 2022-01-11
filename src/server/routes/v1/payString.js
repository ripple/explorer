// Note: `import` syntax is not supported here

const { resolvePayId } = require('payid-lib');
const log = require('../../lib/logger')({ name: 'payString' });

const getPayString = (req, res) => {
  log.info(`get paystring: ${req.params.id}`);

  return resolvePayId(req.params.id)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      log.error(error.toString());
      if (error.code) {
        const codeNumber = Number(error.code); // fetch gives codes like 'ETIMEDOUT' which are NaN
        if (codeNumber > 0 && codeNumber < 999) {
          return res.status(codeNumber).json({ message: error.message });
        }
      }
      return res.status(500).json({ message: error.message });
    });
};

export default getPayString;
