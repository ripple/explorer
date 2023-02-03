/* eslint-disable no-console -- logging file */
// TODO: refactor this file to use the npm module `debug` which is already used elsewhere
// and send logs in prod to the backend
const logMessage = (type, options, message) => {
  console[type]({ ...options, message })
}

const log = (options) => ({
  info: (message) => logMessage('info', options, message),
  warn: (message) => logMessage('warn', options, message),
  error: (message) => logMessage('error', options, message),
  debug: (message) => logMessage('debug', options, message),
})

export default log
