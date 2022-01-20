// Note: `import` syntax is not supported here

const { resolvePayId } = require('payid-lib');
const log = require('./lib/logger')({ name: 'payString' });

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
          return { message: error.message };
        }
      }
      return { message: error.message };
    });
};

export default getPayString;
