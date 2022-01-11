const { encodeNodePublic } = require('ripple-address-codec');
const rippled = require('../../lib/rippled');
const log = require('../../lib/logger')({ name: 'nunl' });

const getNegativeUNL = (req, res) => {
  log.info(`getting nUNL from rippled`);

  rippled
    .getNegativeUNL()
    .then(result => {
      if (result === undefined || result.length === 0) return [];

      if (result.node === undefined) throw new Error('node is not a included in this ledger_entry');

      const validators = result.node.DisabledValidators;
      if (validators !== undefined)
        return validators
          .map(obj => obj.DisabledValidator.PublicKey)
          .map(key => encodeNodePublic(Buffer.from(key, 'hex')));

      return [];
    })
    .then(data => res.send(data))
    .catch(error => {
      log.error(error.toString());
      res.status(error.code || 500).json({ message: error.message });
    });
};

export default getNegativeUNL;
