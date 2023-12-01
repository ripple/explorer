import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import SocketContext from './SocketContext'
import { getLedger, getNegativeUNL } from '../../rippled/lib/rippled'
import { EPOCH_OFFSET } from '../../rippled/lib/convertRippleDate'
import { summarizeLedger } from '../../rippled/lib/summarizeLedger'
import Log from './log'
import { getQuorum } from '../../rippled'

const THROTTLE = 250

/* eslint-disable camelcase -- server interfaces */
export interface LedgerStream {
  type: string
  fee_base: number
  fee_ref: number
  ledger_hash: string
  ledger_index: number
  ledger_time: number
  reserve_base: number
  reserve_info: number
  txn_count: number
  validated_ledgers: string
  total_fee: number // TODO: Not on server response
}

export interface ValidationStream {
  amendments?: string[]
  base_fee?: number
  cookie?: string
  flags: number
  full: boolean
  ledger_hash: string
  ledger_index: string
  load_fee?: number
  master_key?: string
  reserve_base?: number
  reserve_inc?: number
  server_version?: string | number
  signature: string
  signing_time: number
  validated_hash: string
  validation_public_key: string
}
/* eslint-enable camelcase */

export interface LedgerHash {
  hash: string
  validated: boolean
  validations: ValidationStream[]
  unselected: boolean
  trusted_count: number
}

export interface Ledger {
  transactions: any[]
  index: number
  hashes: LedgerHash[]
  seen: number
  txCount?: number
  closeTime: number
  totalFees: number
}

export interface Metrics {
  load_fee: string
  txn_sec: string
  txn_ledger: string
  ledger_interval: string
  avg_fee: string
  quorum: string
  nUnl: string[]
}

const DEFAULT_METRICS = {
  load_fee: '--',
  txn_sec: '--',
  txn_ledger: '--',
  ledger_interval: '--',
  avg_fee: '--',
  quorum: '--',
  nUnl: [],
}

const fetchMetrics = () =>
  axios
    .get('/api/v1/metrics')
    .then((result) => result.data)
    .catch((e) => Log.error(e))

const fetchNegativeUNL = async (rippledSocket) =>
  getNegativeUNL(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined nUNL')

      return data
    })
    .catch((e) => Log.error(e))

const fetchQuorum = async (rippledSocket) =>
  getQuorum(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined quorum')
      return data
    })
    .catch((e) => Log.error(e))

export const useStreams = () => {
  const [ledgers, setLedgers] = useState<Record<number, Ledger>>([])
  const ledgersRef = useRef<Record<number, Ledger>>(ledgers)
  const firstLedgerRef = useRef<number>(0)
  // const [validators, setValidators] = useState<{}>()
  const validationQueue = useRef<ValidationStream[]>([])
  const socket = useContext(SocketContext)

  // metrics
  const [loadFee, setLoadFee] = useState<string>(DEFAULT_METRICS.load_fee)
  const [txnSec, setTxnSec] = useState<string>(DEFAULT_METRICS.txn_sec)
  const [txnLedger, setTxnLedger] = useState<string>(DEFAULT_METRICS.txn_ledger)
  const [ledgerInterval, setLedgerInterval] = useState<string>(
    DEFAULT_METRICS.ledger_interval,
  )
  const [avgFee, setAvgFee] = useState<string>(DEFAULT_METRICS.avg_fee)
  const [quorum, setQuorum] = useState<string>(DEFAULT_METRICS.quorum)
  const [nUnl, setNUnl] = useState<string[]>(DEFAULT_METRICS.nUnl)

  function addLedger(index: number | string) {
    if (!firstLedgerRef.current) {
      firstLedgerRef.current = Number(index)
    }
    if (firstLedgerRef.current > Number(index)) {
      return
    }

    // TODO: only keep 20
    setLedgers((previousLedgers) => ({
      [index]: {
        index: Number(index),
        seen: Date.now(),
        hashes: [],
        transactions: [],
      },
      ...previousLedgers,
    }))
  }

  function updateMetricsFromServer() {
    fetchMetrics().then((serverMetrics) => {
      setLoadFee(serverMetrics.base_fee)
      setTxnSec(serverMetrics.txn_sec)
      setTxnLedger(serverMetrics.txn_ledger)
      setAvgFee(serverMetrics.avg_fee)
      setLedgerInterval(serverMetrics.ledger_interval)
    })
  }

  function updateQuorum() {
    fetchQuorum(socket).then((newQuorum) => {
      setQuorum(newQuorum)
    })
  }

  function updateNegativeUNL() {
    fetchNegativeUNL(socket).then((newNUnl) => {
      setNUnl(newNUnl)
    })
  }

  function onLedger(data: LedgerStream) {
    if (!ledgersRef.current[data.ledger_index]) {
      addLedger(data.ledger_index)
    }

    if (process.env.VITE_ENVIRONMENT !== 'custom') {
      updateMetricsFromServer()
    }
    if (data.ledger_index % 256 === 0 || nUnl === DEFAULT_METRICS.nUnl) {
      updateNegativeUNL()
    }
    if (data.ledger_index % 256 === 0 || quorum === DEFAULT_METRICS.quorum) {
      updateQuorum()
    }

    getLedger(socket, { ledger_hash: data.ledger_hash })
      .then(summarizeLedger)
      .then((ledgerSummary) => {
        setLedgers((previousLedgers) => {
          Object.assign(previousLedgers[data.ledger_index], {
            txCount: data.txn_count,
            closeTime: (data.ledger_time + EPOCH_OFFSET) * 1000,
            transactions: ledgerSummary.transactions,
            totalFee: ledgerSummary.total_fees, // fix type
          })
          const ledger = previousLedgers[Number(ledgerSummary.ledger_index)]
          const matchingHashIndex = ledger?.hashes.findIndex(
            (hash) => hash.hash === ledgerSummary.ledger_hash,
          )
          const matchingHash = ledger?.hashes[matchingHashIndex]
          if (matchingHash) {
            matchingHash.unselected = false
            matchingHash.validated = true
          }
          if (ledger && matchingHash) {
            ledger.hashes[matchingHashIndex] = {
              ...matchingHash,
            }
          }

          return { ...previousLedgers }
        })
      })
  }

  const onValidation = (data: ValidationStream) => {
    if (!ledgersRef.current[Number(data.ledger_index)]) {
      addLedger(data.ledger_index)
    }
    if (firstLedgerRef.current <= Number(data.ledger_index)) {
      validationQueue.current.push(data)
    }
  }

  function processValidationQueue() {
    setTimeout(processValidationQueue, THROTTLE)

    if (validationQueue.current.length < 1) {
      return
    }
    // copy the queue and clear it so we arent adding more while processing
    const queue = [...validationQueue.current]
    validationQueue.current = []
    setLedgers((previousLedgers) => {
      // const newValidators: any = { ...validators }
      queue.forEach((validation) => {
        // newValidators[validation.validation_public_key] = {
        //   ledger_hash: validation.ledger_hash,
        //   ledger_index: validation.ledger_index,
        //   last: Date.now(),
        // }

        const ledger = previousLedgers[Number(validation.ledger_index)]
        const matchingHashIndex = ledger?.hashes.findIndex(
          (hash) => hash.hash === validation.ledger_hash,
        )
        let matchingHash = ledger?.hashes[matchingHashIndex]
        if (!matchingHash) {
          matchingHash = {
            hash: validation.ledger_hash,
            validated: false,
            unselected: false,
            validations: [],
          }
          ledger.hashes.push(matchingHash)
        }
        matchingHash.validations = [...matchingHash.validations, validation]
        if (ledger) {
          ledger.hashes = [...ledger?.hashes]
          ledger.hashes[matchingHashIndex] = {
            ...matchingHash,
          }
        }
      })
      return { ...previousLedgers }
    })
    // setValidators(validators)
  }

  useEffect(() => {
    const interval = setTimeout(processValidationQueue, THROTTLE)

    if (socket) {
      socket.send({
        command: 'subscribe',
        streams: ['ledger', 'validations'],
      })
      socket.on('ledger', onLedger as any)
      socket.on('validation', onValidation as any)
    }

    return () => {
      clearTimeout(interval)
      if (socket) {
        socket.send({
          command: 'unsubscribe',
          streams: ['ledger', 'validations'],
        })
        socket.off('ledger', onLedger)
        socket.off('validation', onValidation)
      }
    }
  }, [])

  useEffect(() => {
    ledgersRef.current = ledgers
  }, [ledgers])

  return {
    ledgers,
    // validators,
    metrics: {
      load_fee: loadFee,
      txn_sec: txnSec,
      txn_ledger: txnLedger,
      ledger_interval: ledgerInterval,
      avg_fee: avgFee,
      quorum,
      nUnl,
    },
  }
}
