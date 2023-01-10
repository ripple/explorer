/* eslint-disable no-console -- logging file */
// TODO: refactor this file to only log in dev mode
// and send logs in prod to the backend
const log = (options) => ({
  info: (message) => {
    console.info({ type: 'info', ...options, message })
  },
  warn: (message) => {
    console.warn({ type: 'warn', ...options, message })
  },
  error: (message) => {
    console.error({ type: 'error', ...options, message })
  },
  debug: (message) => {
    console.debug({ type: 'debug', ...options, message })
  },
})

export default log
