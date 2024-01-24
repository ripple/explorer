import { FC, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import type { LedgerStream, ValidationStream } from 'xrpl'
import SocketContext from '../../SocketContext'
import { getLedger } from '../../../../rippled/lib/rippled'
import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import { summarizeLedger } from '../../../../rippled/lib/summarizeLedger'
import Log from '../../log'
import { getNegativeUNL, getQuorum } from '../../../../rippled'
import { XRP_BASE } from '../../transactionUtils'
import { StreamsContext } from './StreamsContext'
import { Ledger } from './types'

const THROTTLE = 150

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

export const StreamsProvider: FC = ({ children }) => {
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
    // Only add new ledgers that are newer than the last one added.
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
          transactions: undefined,
          txCount: undefined,
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
      // The ledger closed, but we did not have an existing entry likely because the page just loaded and its
      // validations came in before we connected to the websocket.
      addLedger(data.ledger_index)
    }

    if (process.env.VITE_ENVIRONMENT !== 'custom') {
      // In custom mode we populate metrics from ledgers loaded into memory
      updateMetricsFromServer()
    } else {
      // Make call to metrics tracked on the backend
      updateMetrics()
    }

    setLoadFee((data.fee_base / XRP_BASE).toString())

    // After each flag ledger we should check the UNL and quorum which are correlated and can only update every flag ledger.
    if (data.ledger_index % 256 === 0 || quorum === '--') {
      updateNegativeUNL()
      updateQuorum()
    }

    // TODO: Set fields before getting full ledger info
    // set validated hash
    // set closetime

    getLedger(socket, { ledger_hash: data.ledger_hash }).then(
      populateFromLedgerResponse,
    )
  }

  const populateFromLedgerResponse = (ledger: Promise<any>) => {
    const ledgerSummary = summarizeLedger(ledger)
    setLedgers((previousLedgers) => {
      const ledger = Object.assign(
        previousLedgers[ledgerSummary.ledger_index] ?? {},
        {
          txCount: ledgerSummary.transactions.length,
          closeTime: convertRippleDate(ledgerSummary.ledger_time),
          transactions: ledgerSummary.transactions,
          totalFees: ledgerSummary.total_fees, // fix type
        },
      )
      const matchingHashIndex = ledger?.hashes.findIndex(
        (hash) => hash.hash === ledgerSummary.ledger_hash,
      )
      const matchingHash = ledger?.hashes[matchingHashIndex]
      if (matchingHash) {
        matchingHash.validated = true
      }
      if (ledger && matchingHash) {
        ledger.hashes[matchingHashIndex] = {
          ...matchingHash,
        }
      }

      // eslint-disable-next-line no-param-reassign
      previousLedgers[ledgerSummary.ledger_index] = ledger

      return { ...previousLedgers }
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

  // Process validations in chunks to make re-renders more manageable.
  function processValidationQueue() {
    setTimeout(processValidationQueue, THROTTLE)

    if (validationQueue.current.length < 1) {
      return
    }
    // copy the queue and clear it, so we aren't adding more while processing
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

      // Load in the most recent validated ledger to prevent the page from being empty until the next validations come in.
      getLedger(socket, { ledger_index: 'current' }).then(
        populateFromLedgerResponse,
      )
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

  const value = {
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

  return (
    <StreamsContext.Provider value={value}>{children}</StreamsContext.Provider>
  )
}
