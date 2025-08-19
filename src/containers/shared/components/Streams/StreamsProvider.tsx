import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import type { LedgerStream, ValidationStream } from 'xrpl'
import { AnyJson } from 'xrpl-client'
import { useQuery } from 'react-query'
import SocketContext from '../../SocketContext'
import { getLedger } from '../../../../rippled/lib/rippled'
import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import { summarizeLedger } from '../../../../rippled/lib/summarizeLedger'
import Log from '../../log'
import { getNegativeUNL, getQuorum } from '../../../../rippled'
import { XRP_BASE } from '../../transactionUtils'
import { StreamsContext } from './StreamsContext'
import { Ledger, LedgerHash, RunningMetrics } from './types'
import { StreamValidator } from '../../vhsTypes'

const THROTTLE = 200
const MAX_LEDGERS_SHOWN = 50

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
    .catch((e) => {
      Log.error(e)
      return []
    })

const fetchQuorum = async (rippledSocket): Promise<string> =>
  getQuorum(rippledSocket)
    .then((data) => {
      if (data === undefined) throw new Error('undefined quorum')
      return data
    })
    .catch((e) => Log.error(e))

const truncateLedgers = (ledgers: Record<string, Ledger>, count) =>
  Object.entries(ledgers)
    .sort((a, b) => parseInt(b[0], 10) - parseInt(a[0], 10))
    .slice(0, count)
    .reduce((accumulator, [index, ledger]) => {
      accumulator[index] = ledger
      return accumulator
    }, {})

export const StreamsProvider: FC = ({ children }) => {
  // In custom mode we populate metrics from ledgers loaded into memory
  const useServerMetrics = process.env.VITE_ENVIRONMENT !== 'custom'
  const [ledgers, setLedgers] = useState<Record<number, Ledger>>([])
  const ledgersRef = useRef<Record<number, Ledger>>(ledgers)
  const firstLedgerRef = useRef<number>(0)
  const [validators, setValidators] = useState<Record<number, StreamValidator>>(
    {},
  )
  const validationQueue = useRef<ValidationStream[]>([])
  const socket = useContext(SocketContext)

  // metrics
  const [runningMetrics, setRunningMetrics] = useState<RunningMetrics>({})
  const [loadFee, setLoadFee] = useState<string>()
  const { data: quorum, refetch: refetchQuorum } = useQuery(
    'quorum',
    () => fetchQuorum(socket),
    { enabled: socket.getState().online },
  )
  const { data: nUnl, refetch: refetchNUnl } = useQuery<string[]>(
    'nUnl',
    () => fetchNegativeUNL(socket),
    { enabled: socket.getState().online },
  )
  const { data: serverRunningMetrics, refetch: refetchServerRunningMetrics } =
    useQuery<string[]>('runningMetrics', () => fetchMetrics(), {
      enabled: socket.getState().online,
    })

  function addLedger(index: number | string) {
    // Only add new ledgers that are newer than the last one added.
    if (!firstLedgerRef.current) {
      firstLedgerRef.current = Number(index)
    }
    if (firstLedgerRef.current > Number(index)) {
      return
    }

    if (!(index in ledgers)) {
      setLedgers((previousLedgers) => ({
        [index]: {
          index: Number(index),
          seen: Date.now(),
          hashes: [],
          transactions: undefined,
          txCount: undefined,
        },
        ...truncateLedgers(previousLedgers, MAX_LEDGERS_SHOWN - 1),
      }))
    }
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

    setRunningMetrics({
      txn_ledger: ledgerCount ? (txCount / ledgerCount).toFixed(2) : undefined,
      txn_sec: time ? ((txCount / time) * 1000).toFixed(2) : undefined,
      avg_fee: txWithFeesCount
        ? (fees / txWithFeesCount).toPrecision(4)
        : undefined,
      ledger_interval: timeCount
        ? (time / timeCount / 1000).toFixed(3)
        : undefined,
    })
  }

  function onLedger(data: LedgerStream) {
    if (!ledgersRef.current[data.ledger_index]) {
      // The ledger closed, but we did not have an existing entry likely because the page just loaded and its
      // validations came in before we connected to the websocket.
      addLedger(data.ledger_index)
    }

    useServerMetrics ? refetchServerRunningMetrics() : updateMetrics()

    setLoadFee((data.fee_base / XRP_BASE).toString())

    // After each flag ledger we should check the UNL and quorum which are correlated and can only update every flag ledger.
    if (data.ledger_index % 256 === 0 || !quorum) {
      refetchNUnl()
      refetchQuorum()
    }

    // TODO: Set fields before getting full ledger info
    // set validated hash
    // set closetime
    getLedger(socket, { ledger_hash: data.ledger_hash }).then(
      populateFromLedgerResponse,
    )
  }

  const populateFromLedgerResponse = (ledger: any) => {
    const ledgerSummary = summarizeLedger(ledger)
    setLedgers((previousLedgers) => {
      const newLedger = Object.assign(
        previousLedgers[ledgerSummary.ledger_index] ?? {},
        {
          index: ledgerSummary.ledger_index,
          txCount: ledgerSummary.transactions.length,
          closeTime: convertRippleDate(ledgerSummary.ledger_time),
          transactions: ledgerSummary.transactions,
          totalFees: ledgerSummary.total_fees, // fix type
        },
      )
      const matchingHashIndex = newLedger?.hashes.findIndex(
        (hash) => hash.hash === ledgerSummary.ledger_hash,
      )
      const matchingHash = newLedger?.hashes[matchingHashIndex]
      if (matchingHash) {
        matchingHash.validated = true
      }
      if (newLedger && matchingHash) {
        newLedger.hashes[matchingHashIndex] = {
          ...matchingHash,
        }
      }

      // eslint-disable-next-line no-param-reassign
      previousLedgers[ledgerSummary.ledger_index] = newLedger

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
        let matchingHash = ledger?.hashes[matchingHashIndex] as LedgerHash
        if (!matchingHash) {
          matchingHash = {
            hash: validation.ledger_hash,
            unselected: true,
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
      socket.on('ledger', onLedger as (json: AnyJson) => void)
      socket.on('validation', onValidation as (json: AnyJson) => void)

      // Load in the most recent validated ledger to prevent the page from being empty until the next validations come in.
      getLedger(socket, { ledger_index: 'validated' }).then(
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

  const value = useMemo(
    () => ({
      ledgers,
      validators,
      metrics: {
        ...(useServerMetrics ? serverRunningMetrics : runningMetrics),
        load_fee: loadFee,
        quorum,
        nUnl,
      },
    }),
    [
      ledgers,
      runningMetrics,
      serverRunningMetrics,
      validators,
      loadFee,
      quorum,
      nUnl,
    ],
  )

  return (
    <StreamsContext.Provider value={value}>{children}</StreamsContext.Provider>
  )
}
