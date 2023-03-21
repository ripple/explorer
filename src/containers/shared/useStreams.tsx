import { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from './SocketContext'
import { getLedger } from '../../rippled/lib/rippled'
import { EPOCH_OFFSET } from '../../rippled/lib/convertRippleDate'
import { summarizeLedger } from '../../rippled/lib/summarizeLedger'

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

export const useStreams = () => {
  const [ledgers, setLedgers] = useState<Record<number, Ledger>>([])
  const ledgersRef = useRef<Record<number, Ledger>>(ledgers)
  const firstLedgerRef = useRef<number>(0)
  // const [validators, setValidators] = useState<{}>()
  const validationQueue = useRef<ValidationStream[]>([])
  const socket = useContext(SocketContext)

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

  function onLedger(data: LedgerStream) {
    if (!ledgersRef.current[data.ledger_index]) {
      addLedger(data.ledger_index)
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
  }
}
