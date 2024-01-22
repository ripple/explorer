import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import SocketContext from './SocketContext'
import { getLedger } from '../../rippled/lib/rippled'
import { convertRippleDate } from '../../rippled/lib/convertRippleDate'
import { summarizeLedger } from '../../rippled/lib/summarizeLedger'
import Log from './log'
import { getNegativeUNL, getQuorum } from '../../rippled'
import { XRP_BASE } from './transactionUtils'

const THROTTLE = 100

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
  time: number
  cookie?: string
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

// TODO: use useQuery
const fetchMetrics = () =>
  axios
    .get('/api/v1/metrics')
    .then((result) => result.data)
    .catch((e) => Log.error(e))

// TODO: use useQuery
const fetchNegativeUNL = async (rippledSocket) =>
  getNegativeUNL(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined nUNL')

      return data
    })
    .catch((e) => {
      Log.error(e)
      return []
    })

// TODO: use useQuery
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
  const [validators, setValidators] = useState<Record<number, any>>({})
  const validationQueue = useRef<ValidationStream[]>([])
  const socket = useContext(SocketContext)

  // metrics
  const [loadFee, setLoadFee] = useState<string>('--')
  const [txnSec, setTxnSec] = useState<string>('--')
  const [txnLedger, setTxnLedger] = useState<string>('--')
  const [ledgerInterval, setLedgerInterval] = useState<string>('--')
  const [avgFee, setAvgFee] = useState<string>('--')
  const [quorum, setQuorum] = useState<string>('--')
  const [nUnl, setNUnl] = useState<string[]>([])

  function addLedger(index: number | string) {
    if (!firstLedgerRef.current) {
      firstLedgerRef.current = Number(index)
    }
    if (firstLedgerRef.current > Number(index)) {
      return
    }

    // TODO: only keep 20
    if (!(index in ledgers)) {
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
  }

  // TODO: use useQuery
  function updateMetricsFromServer() {
    fetchMetrics().then((serverMetrics) => {
      setTxnSec(serverMetrics.txn_sec)
      setTxnLedger(serverMetrics.txn_ledger)
      setAvgFee(serverMetrics.avg_fee)
      setLedgerInterval(serverMetrics.ledger_interval)
    })
  }

  function updateMetrics() {
    const ledgerChain = Object.values(ledgers)
      .sort((a, b) => a.index - b.index)
      .slice(-100)

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

      if (d.totalFees) {
        fees += d.totalFees
        txWithFeesCount += d.txCount ?? 0
      }
      if (d.txCount) {
        txCount += d.txCount
      }
      ledgerCount += 1
    })

    setTxnSec(time ? ((txCount / time) * 1000).toFixed(2) : '--')
    setTxnLedger(ledgerCount ? (txCount / ledgerCount).toFixed(2) : '--')
    setLedgerInterval(timeCount ? (time / timeCount / 1000).toFixed(3) : '--')
    setAvgFee(txWithFeesCount ? (fees / txWithFeesCount).toPrecision(4) : '--')
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
    } else {
      updateMetrics()
    }

    setLoadFee((data.fee_base / XRP_BASE).toString())
    if (data.ledger_index % 256 === 0 || quorum === '--') {
      updateNegativeUNL()
      updateQuorum()
    }

    getLedger(socket, { ledger_hash: data.ledger_hash })
      .then(summarizeLedger)
      .then((ledgerSummary) => {
        setLedgers((previousLedgers) => {
          Object.assign(previousLedgers[data.ledger_index] ?? {}, {
            txCount: data.txn_count,
            closeTime: convertRippleDate(data.ledger_time),
            transactions: ledgerSummary.transactions,
            totalFees: ledgerSummary.total_fees, // fix type
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
    // copy the queue and clear it so we aren't adding more while processing
    const queue = [...validationQueue.current]
    validationQueue.current = []
    setLedgers((previousLedgers) => {
      queue.forEach((validation) => {
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
            time: convertRippleDate(validation.signing_time),
            cookie: validation.cookie,
          }
          ledger.hashes.push(matchingHash)
        }
        matchingHash.validations = [...matchingHash.validations, validation]
        if (ledger) {
          ledger.hashes = [...(ledger?.hashes || [])]
          ledger.hashes[matchingHashIndex] = {
            ...matchingHash,
          }
        }
      })
      return { ...previousLedgers }
    })
    setValidators((previousValidators) => {
      const newValidators: any = { ...previousValidators }
      queue.forEach((validation) => {
        newValidators[validation.validation_public_key] = {
          ...previousValidators[validation.validation_public_key],
          cookie: validation.cookie,
          ledger_index: Number(validation.ledger_index),
          ledger_hash: validation.ledger_hash,
          pubkey: validation.validation_public_key,
          partial: !validation.full,
          time: convertRippleDate(validation.signing_time),
          // ledger_hash: validation.ledger_hash,
          // ledger_index: validation.ledger_index,
          last: Date.now(),
        }
      })
      return newValidators
    })
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
  }, [socket])

  useEffect(() => {
    ledgersRef.current = ledgers
  }, [ledgers])

  return {
    ledgers,
    validators,
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
