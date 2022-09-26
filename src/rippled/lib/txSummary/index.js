import React from 'react'
import { transactionTypes } from '../../../containers/shared/components/Transaction'

const OfferCancel = require('./OfferCancel')
const Payment = require('./Payment')
const EscrowCreate = require('./EscrowCreate')
const EscrowCancel = require('./EscrowCancel')
const TrustSet = require('./TrustSet')
const PaymentChannelCreate = require('./PaymentChannelCreate')
const PaymentChannelClaim = require('./PaymentChannelClaim')
const PaymentChannelFund = require('./PaymentChannelFund')
const AccountSet = require('./AccountSet')
const DepositPreauth = require('./DepositPreauth')
const EnableAmendment = require('./EnableAmendment')
const UNLModify = require('./UNLModify')
const AccountDelete = require('./AccountDelete')
const TicketCreate = require('./TicketCreate')
const NFTokenAcceptOffer = require('./NFTokenAcceptOffer')
const NFTokenCancelOffer = require('./NFTokenCancelOffer')
const NFTokenCreateOffer = require('./NFTokenCreateOffer')
const NFTokenMint = require('./NFTokenMint')

const summarize = {
  OfferCancel,
  Payment,
  EscrowCreate,
  EscrowCancel,
  TrustSet,
  PaymentChannelCreate,
  PaymentChannelClaim,
  PaymentChannelFund,
  AccountSet,
  DepositPreauth,
  EnableAmendment,
  UNLModify,
  AccountDelete,
  TicketCreate,
  NFTokenAcceptOffer,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
}

const getInstructions = (tx, meta) => {
  const type = tx.TransactionType
  // Locate the transaction parser which returns "instructions" to be used in transaction specific components
  // TODO: Remove summarize[type] lookup once all transactions have been moved to the new definition style
  const mappingFn = transactionTypes[type]?.parser
    ? transactionTypes[type]?.parser
    : summarize[type]

  return mappingFn ? mappingFn(tx, meta) : {}
}

const summarizeTransaction = (d, details = false) => ({
  hash: d.hash,
  type: d.tx.TransactionType,
  result: d.meta.TransactionResult,
  account: d.tx.Account,
  index: Number(d.meta.TransactionIndex),
  fee: d.tx.Fee / 1000000,
  sequence: d.tx.Sequence,
  ticketSequence: d.tx.TicketSequence,
  date: d.date,
  details: {
    instructions: getInstructions(d.tx, d.meta),
  },
})

export default summarizeTransaction
