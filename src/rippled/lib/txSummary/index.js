const OfferCreate = require('./OfferCreate');
const OfferCancel = require('./OfferCancel');
const Payment = require('./Payment');
const EscrowCreate = require('./EscrowCreate');
const EscrowCancel = require('./EscrowCancel');
const EscrowFinish = require('./EscrowFinish');
const TrustSet = require('./TrustSet');
const PaymentChannelCreate = require('./PaymentChannelCreate');
const PaymentChannelClaim = require('./PaymentChannelClaim');
const PaymentChannelFund = require('./PaymentChannelFund');
const AccountSet = require('./AccountSet');
const SetRegularKey = require('./SetRegularKey');
const SignerListSet = require('./SignerListSet');
const DepositPreauth = require('./DepositPreauth');
const EnableAmendment = require('./EnableAmendment');
const UNLModify = require('./UNLModify');
const AccountDelete = require('./AccountDelete');
const TicketCreate = require('./TicketCreate');
const NFTokenAcceptOffer = require('./NFTokenAcceptOffer');
const NFTokenBurn = require('./NFTokenBurn');
const NFTokenCancelOffer = require('./NFTokenCancelOffer');
const NFTokenCreateOffer = require('./NFTokenCreateOffer');
const NFTokenMint = require('./NFTokenMint');

const summarize = {
  OfferCreate,
  OfferCancel,
  Payment,
  EscrowCreate,
  EscrowCancel,
  EscrowFinish,
  TrustSet,
  PaymentChannelCreate,
  PaymentChannelClaim,
  PaymentChannelFund,
  SetRegularKey,
  AccountSet,
  SignerListSet,
  DepositPreauth,
  EnableAmendment,
  UNLModify,
  AccountDelete,
  TicketCreate,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
};

const getInstructions = (tx, meta) =>
  summarize[tx.TransactionType] ? summarize[tx.TransactionType](tx, meta) : {};

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
  details: details
    ? {
        instructions: getInstructions(d.tx, d.meta),
        effects: undefined,
      }
    : undefined,
});

export default summarizeTransaction;
