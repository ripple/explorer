import debug from 'debug'

const BASE = 'xrpl-debug'
const COLOURS = {
  trace: 'lightblue',
  info: 'blue',
  warn: 'orange',
  error: 'red',
}

class Log {
  debuggers = {}

  getDebugger(level) {
    if (!this.debuggers[level]) {
      this.debuggers[level] = debug(`${BASE}:${level}`)
      this.debuggers[level].color = COLOURS[level]
    }

    return this.debuggers[level]
  }

  generateMessage(level, message, source) {
    const log = this.getDebugger(level)
    return source ? log(source, message) : log(message)
  }

  trace(message, source) {
    return this.generateMessage('trace', message, source)
  }

  info(message, source) {
    return this.generateMessage('info', message, source)
  }

  warn(message, source) {
    return this.generateMessage('warn', message, source)
  }

  error(message, source) {
    return this.generateMessage('error', message, source)
  }
}

const logger = new Log()

export default logger
