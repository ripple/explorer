/* eslint-disable no-console -- logging file */
// TODO: refactor this file to only log in dev mode
// and send logs in prod to the backend
const log = (options) => ({
  info: (message) => {
    console.info({ type: 'info', ...options, message: JSON.stringify(message) })
  },
  warn: (message) => {
    console.warn({ type: 'warn', ...options, message: JSON.stringify(message) })
  },
  error: (message) => {
    console.error({
      type: 'error',
      ...options,
      message: JSON.stringify(message),
    })
  },
  debug: (message) => {
    console.debug({
      type: 'debug',
      ...options,
      message: JSON.stringify(message),
    })
  },
})

export default log
