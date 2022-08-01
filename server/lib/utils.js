const EPOCH_OFFSET = 946684800
module.exports.EPOCH_OFFSET = EPOCH_OFFSET
module.exports.XRP_BASE = 1000000

function CustomError(message, code) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = message
  this.code = code
}

require('util').inherits(CustomError, Error)

module.exports.Error = CustomError
