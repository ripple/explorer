import { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Log from '../log'
import SocketContext from '../SocketContext'
import { getNegativeUNL, getQuorum } from '../../../rippled'
import { getLedger, getServerInfo } from '../../../rippled/lib/rippled'
import { summarizeLedger } from '../../../rippled/lib/summarizeLedger'
import { convertRippleDate } from '../../../rippled/lib/convertRippleDate'

const MAX_LEDGER_COUNT = 15

const PURGE_INTERVAL = 10 * 1000
const MAX_AGE = 90 * 1000

const throttle = (func, limit) => {
  let inThrottle
  let queued = false
  return function throttled(...args) {
    const context = this
    if (!inThrottle) {
      queued = false
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => {
        if (queued) {
          func.apply(context, args)
        }
        inThrottle = false
        queued = false
      }, limit)
    } else {
      queued = true
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// fetch full ledger
const fetchLedger = (ledger, rippledSocket, attempts = 0) =>
  getLedger(rippledSocket, { ledger_hash: ledger.ledger_hash })
    .then(summarizeLedger)
    .then((summary) => {
      Object.assign(ledger, summary)
      return summary
    })
    .catch((error) => {
      Log.error(error.toString())
      if (error.code === 404 && attempts < 5) {
        Log.info(
          `retry ledger ${ledger.ledger_index} (attempt:${attempts + 1})`,
        )
        return sleep(500).then(() =>
          fetchLedger(ledger, rippledSocket, attempts + 1),
        )
      }
      throw error
    })

const fetchLoadFee = (rippledSocket) =>
  getServerInfo(rippledSocket)
    .then((result) => result.info)
    .then((info) => {
      const ledgerFeeInfo = info.validated_ledger
      const loadFee = ledgerFeeInfo.base_fee_xrp * (info.load_factor ?? 1)
      return { load_fee: Number(loadFee.toPrecision(4)).toString() }
    })

const formatLedgers = (data) =>
  Object.entries(data)
    .map(([_index, ledger]) => {
      const hashes = Object.entries(ledger.hashes || {}).map((h) => {
        const validated = h[0] === ledger.ledger_hash

        h[1].sort((a, b) => {
          if (a.time === b.time) {
            const sa = a.unl ? 1 : 0
            const sb = b.unl ? 1 : 0
            return sb - sa
          }

          return a.time - b.time
        })

        return {
          hash: h[0],
          trusted_count: h[1].filter((d) => d.unl).length,
          validations: h[1],
          unselected: !validated && Boolean(ledger.ledger_hash),
          validated,
        }
      })
      return { ...ledger, hashes }
    })
    .sort((a, b) => b.ledger_index - a.ledger_index)

export const fetchNegativeUNL = async (rippledSocket) =>
  getNegativeUNL(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined nUNL')

      return data
    })
    .catch((e) => {
      Log.error(e)
      return []
    })

export const fetchQuorum = async (rippledSocket) =>
  getQuorum(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined quorum')
      return data
    })
    .catch((e) => Log.error(e))

export const fetchMetrics = () =>
  axios
    .get('/api/v1/metrics')
    .then((result) => result.data)
    .catch((e) => Log.error(e))

class Streams extends Component {
  constructor(props) {
    super(props)
    const { updateLedgers, updateValidators } = props
    this.state = {
      ledgers: {},
      metrics: {}, // eslint-disable-line
      validators: {}, // eslint-disable-line
      maxLedger: 0,
      allLedgers: {},
      allValidators: {},
    }

    this.updateLedgers = throttle((ledgers) => {
      updateLedgers(formatLedgers(ledgers))
    }, 250)

    this.updateValidators = throttle((validators) => {
      updateValidators(Object.entries(validators).map((v) => v[1]))
    }, 100)
  }

  async componentDidMount() {
    await this.connect()
    this.updateNegativeUNL()
    if (process.env.VITE_ENVIRONMENT !== 'custom') {
      this.updateMetricsFromServer()
    }
    this.purge = setInterval(this.purge, 5000)
    this.purgeAll = setInterval(this.purgeAll, PURGE_INTERVAL)

    const rippledSocket = this.context
    rippledSocket.send({
      command: 'subscribe',
      streams: ['ledger', 'validations'],
    })
  }

  componentWillUnmount() {
    const rippledSocket = this.context
    rippledSocket.send({
      command: 'unsubscribe',
      streams: ['ledger', 'validations'],
    })

    if (this.onLedgerWrapper) {
      rippledSocket.off('ledger', this.onLedgerWrapper)
    }

    if (this.onValidationWrapper) {
      rippledSocket.off('validation', this.onValidationWrapper)
    }

    clearInterval(this.purge)
    clearInterval(this.purgeAll)
  }

  // handle ledger messages
  async handleLedger(data) {
    const ledger = await this.addLedger(data)
    const {
      ledger_hash: ledgerHash,
      ledger_index: ledgerIndex,
      txn_count: txnCount,
    } = data

    Log.info('new ledger', ledgerIndex)
    ledger.ledger_hash = ledgerHash
    ledger.txn_count = txnCount
    ledger.close_time = convertRippleDate(data.ledger_time)

    const baseFee = data.fee_base / 1000000
    return {
      ledger,
      baseFee,
    }
  }

  // handle validation messages
  async handleValidation(data) {
    const { ledger_hash: ledgerHash, validation_public_key: pubkey } = data
    const ledgerIndex = Number(data.ledger_index)

    if (!this.isValidatedChain(ledgerIndex)) {
      return undefined
    }

    await this.addLedger(data)

    this.setState((prevState) => {
      if (!prevState.allValidators[pubkey]) {
        const allValidators = {
          [pubkey]: { pubkey, ledger_index: 0 },
        }
        return { allValidators }
      }
      return {}
    })

    const { allValidators } = this.state
    if (
      allValidators[pubkey].ledger_hash !== ledgerHash &&
      ledgerIndex > allValidators[pubkey].ledger_index
    ) {
      this.setState((prevState) => {
        const newValidatorData = Object.assign(
          prevState.allValidators[pubkey],
          {
            ledger_hash: ledgerHash,
            ledger_index: ledgerIndex,
            last: Date.now(),
          },
        )
        const newAllValidators = Object.assign(prevState.allValidators, {
          [pubkey]: newValidatorData,
        })
        return { allValidators: newAllValidators }
      })

      return {
        ledger_index: Number(ledgerIndex),
        ledger_hash: ledgerHash,
        pubkey,
        partial: !data.full,
        time: convertRippleDate(data.signing_time),
        cookie: data.cookie,
      }
    }

    return undefined
  }

  onMetric(data) {
    const { updateMetrics } = this.props
    this.setState((prevState) => {
      const metrics = Object.assign(prevState.metrics, data)
      updateMetrics(metrics)
      return { metrics }
    })
  }

  onLedgerSummary(data) {
    const { ledger_index: ledgerIndex } = data
    if (ledgerIndex % 256 === 0) this.updateNegativeUNL()
    this.setState((prevState) => {
      const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex)
      ledgers[ledgerIndex] = Object.assign(
        ledgers[ledgerIndex] || { hashes: {} },
        data,
      )
      if (ledgers[ledgerIndex].txn_count == null) {
        ledgers[ledgerIndex].txn_count = data.transactions.length
      }
      this.updateLedgers(ledgers)
      return { ledgers, maxLedger }
    })
  }

  onLedger(data) {
    const { ledger_index: ledgerIndex } = data
    this.setState((prevState) => {
      const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex)
      ledgers[ledgerIndex] = Object.assign(
        ledgers[ledgerIndex] || { hashes: {} },
        data,
      )
      this.updateLedgers(ledgers)
      return { ledgers, maxLedger }
    })
  }

  onValidation(data) {
    const { validators: vList } = this.props
    const { ledger_index: ledgerIndex, ledger_hash: ledgerHash } = data

    this.setState((prevState) => {
      const { validators } = prevState
      const { ledgers, maxLedger } = this.getTruncatedLedgers(ledgerIndex)

      if (maxLedger - ledgerIndex > MAX_LEDGER_COUNT) {
        return undefined
      }

      if (!ledgers[ledgerIndex]) {
        ledgers[ledgerIndex] = {
          ledger_index: ledgerIndex,
          hashes: {},
        }
      }

      if (!ledgers[ledgerIndex].hashes[ledgerHash]) {
        ledgers[ledgerIndex].hashes[ledgerHash] = []
      }

      ledgers[ledgerIndex].hashes[ledgerHash].push({
        pubkey: data.pubkey,
        partial: data.partial,
        time: data.time,
        unl: vList && vList[data.pubkey] && vList[data.pubkey].unl,
        cookie: data.cookie,
      })

      validators[data.pubkey] = data
      this.updateLedgers(ledgers)
      this.updateValidators(validators)
      return { ledgers, validators, maxLedger }
    })
  }

  async setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    })
  }

  getTruncatedLedgers(max) {
    const { ledgers, maxLedger } = this.state
    const newMax = Math.max(max, maxLedger)
    Object.keys(ledgers).forEach((key) => {
      if (newMax - key >= MAX_LEDGER_COUNT) {
        delete ledgers[key]
      }
    })

    return { ledgers, maxLedger: max }
  }

  purge = () => {
    const now = Date.now()
    this.setState((prevState) => {
      const prev = prevState.validators
      const validators = {}

      Object.keys(prev).forEach((key) => {
        if (now - prev[key].time < 30000) {
          validators[key] = prev[key]
        }
      })

      return { validators }
    })
  }

  // purge old data
  purgeAll = () => {
    const now = Date.now()
    this.setState((prevState) => {
      const allLedgers = { ...prevState.allLedgers }
      Object.keys(allLedgers).forEach((key) => {
        if (now - allLedgers[key].seen > MAX_AGE) {
          delete allLedgers[key]
        }
      })

      const allValidators = { ...prevState.allValidators }
      Object.keys(allValidators).forEach((key) => {
        if (now - allValidators[key].last > MAX_AGE) {
          delete allValidators[key]
        }
      })
      return { allLedgers, allValidators }
    })
  }

  // determine if the ledger index
  // is on the validated ledger chain
  isValidatedChain(ledgerIndex) {
    const { allLedgers } = this.state
    let prev = ledgerIndex - 1
    while (allLedgers[prev]) {
      if (allLedgers[prev].ledger_hash) {
        return true
      }
      prev -= 1
    }

    return false
  }

  // add the ledger to the cache
  async addLedger(data) {
    const { ledger_index: ledgerIndex } = data

    await this.setStateAsync((prevState) => {
      if (!prevState.allLedgers[ledgerIndex]) {
        const allLedgers = Object.assign(prevState.allLedgers, {
          [ledgerIndex]: {
            ledger_index: Number(ledgerIndex),
            seen: Date.now(),
          },
        })
        return { allLedgers }
      }
      return {}
    })

    const { allLedgers } = this.state
    return allLedgers[ledgerIndex]
  }

  // update rolling metrics
  updateMetrics(baseFee) {
    const ledgerChain = this.organizeChain().slice(-100)

    let time = 0
    let fees = 0
    let timeCount = 0
    let txCount = 0
    let txWithFeesCount = 0
    let ledgerCount = 0

    ledgerChain.forEach((d, i) => {
      const next = ledgerChain[i + 1]
      if (next && next.seen && d.seen) {
        time += next.seen - d.seen
        timeCount += 1
      }

      if (d.total_fees) {
        fees += d.total_fees
        txWithFeesCount += d.txn_count
      }
      if (d.txn_count) {
        txCount += d.txn_count
      }
      ledgerCount += 1
    })

    return {
      base_fee: Number(baseFee.toPrecision(4)).toString(),
      txn_sec: time ? ((txCount / time) * 1000).toFixed(2) : undefined,
      txn_ledger: ledgerCount ? (txCount / ledgerCount).toFixed(2) : undefined,
      ledger_interval: timeCount
        ? (time / timeCount / 1000).toFixed(3)
        : undefined,
      avg_fee: txWithFeesCount
        ? (fees / txWithFeesCount).toPrecision(4)
        : undefined,
    }
  }

  // convert to array and sort
  organizeChain() {
    const { allLedgers } = this.state
    return Object.entries(allLedgers)
      .map((d) => d[1])
      .sort((a, b) => a.ledger_index - b.ledger_index)
  }

  updateMetricsFromServer() {
    fetchMetrics().then((metrics) => this.onMetric(metrics))
  }

  updateQuorum() {
    const rippledSocket = this.context
    fetchQuorum(rippledSocket).then((quorum) => {
      const { updateMetrics } = this.props
      this.setState((prevState) => {
        const metrics = Object.assign(prevState.metrics, { quorum })
        updateMetrics(metrics)
        return { metrics }
      })
    })
  }

  updateNegativeUNL() {
    this.updateQuorum()
    const rippledSocket = this.context
    fetchNegativeUNL(rippledSocket).then((nUnl) => {
      const { updateMetrics } = this.props
      this.setState((prevState) => {
        const metrics = Object.assign(prevState.metrics, { nUnl })
        updateMetrics(metrics)
        return { metrics }
      })
    })
  }

  async connect() {
    const rippledSocket = this.context

    this.onLedgerWrapper = async (streamResult) => {
      if (streamResult.type !== 'ledgerClosed') {
        return
      }
      const { ledger, baseFee } = await this.handleLedger(streamResult)
      this.onLedger(ledger)
      fetchLedger(ledger, rippledSocket)
        .then((ledgerSummary) => {
          this.onLedgerSummary(ledgerSummary)
        })
        .then(() => {
          if (process.env.VITE_ENVIRONMENT === 'custom') {
            this.onMetric(this.updateMetrics(baseFee))
          }
        })
        .catch((e) => {
          Log.error('Ledger fetch error', e.message)
          Log.error(e)
        })
      // update the load fee
      fetchLoadFee(rippledSocket)
        .then((loadFee) => {
          this.onMetric(loadFee)
        })
        .catch((e) => {
          Log.error('Ledger fetch error', e.message)
          Log.error(e)
        })
      // calculate custom network metrics on the frontend
      // because there is no backend server connection (since there is no one network)
      if (process.env.VITE_ENVIRONMENT === 'custom') {
        this.onMetric(this.updateMetrics(baseFee))
      } else {
        this.updateMetricsFromServer()
      }
    }

    rippledSocket.on('ledger', this.onLedgerWrapper)

    this.onValidationWrapper = async (streamResult) => {
      const data = await this.handleValidation(streamResult)
      if (data) {
        this.onValidation(data)
      }
    }

    rippledSocket.on('validation', this.onValidationWrapper)
  }

  render() {
    return null
  }
}

Streams.contextType = SocketContext

Streams.propTypes = {
  validators: PropTypes.shape({}),
  updateMetrics: PropTypes.func,
  updateLedgers: PropTypes.func,
  updateValidators: PropTypes.func,
}

Streams.defaultProps = {
  validators: {},
  updateMetrics: () => {},
  updateLedgers: () => {},
  updateValidators: () => {},
}

export default Streams
