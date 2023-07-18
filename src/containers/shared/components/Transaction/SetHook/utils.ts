import { zeroPad } from '../../../transactionUtils'

// TODO: import from ripple-binary-codec
const TRANSACTION_TYPES: Record<string, number> = {
  Invalid: -1,
  Payment: 0,
  EscrowCreate: 1,
  EscrowFinish: 2,
  AccountSet: 3,
  EscrowCancel: 4,
  SetRegularKey: 5,
  NickNameSet: 6,
  OfferCreate: 7,
  OfferCancel: 8,
  Contract: 9,
  TicketCreate: 10,
  TicketCancel: 11,
  SignerListSet: 12,
  PaymentChannelCreate: 13,
  PaymentChannelFund: 14,
  PaymentChannelClaim: 15,
  CheckCreate: 16,
  CheckCash: 17,
  CheckCancel: 18,
  DepositPreauth: 19,
  TrustSet: 20,
  AccountDelete: 21,
  SetHook: 22,
  NFTokenMint: 25,
  NFTokenBurn: 26,
  NFTokenCreateOffer: 27,
  NFTokenCancelOffer: 28,
  NFTokenAcceptOffer: 29,
  Invoke: 99,
  EnableAmendment: 100,
  SetFee: 101,
  UNLModify: 102,
  EmitFailure: 103,
}

const transactionMap = Object.entries(TRANSACTION_TYPES).reduce(
  (flipped, [key, value]) => {
    // eslint-disable-next-line no-param-reassign -- fine for a reduce
    flipped[value] = key
    return flipped
  },
  {} as Record<number, string>,
)

const maxTransactionValue: number = 103

function hex2bin(input) {
  const hex = input.replace('0x', '').toLowerCase()
  let bin = ''
  for (let i = 0; i < hex.length; i += 1) {
    const binFragment = parseInt(hex[i], 16).toString(2)
    bin += binFragment.padStart(4, '0')
  }
  return bin
}

export function hookOnToTxList(hookOn?: string): string[] | undefined {
  if (hookOn == null) return undefined
  if (
    hookOn ===
    '0000000000000000000000000000000000000000000000000000000000000000'
  )
    return ['All transactions']
  const bits = hex2bin(hookOn).split('')

  const txs = bits
    .map((value, i) => {
      const bin = zeroPad(1, 256 - i, true)
      const int = Math.log2(parseInt(bin, 2))
      // const type = i < 8 ? 'universal' : (i < 16 ? 'type_specific' : 'reserved');
      const flagOn = int === 22 ? '1' : '0'
      if (value === flagOn && int < maxTransactionValue)
        return transactionMap[int] || int
      return undefined
    })
    .filter((d) => Boolean(d)) as string[]
  return txs.length === 0 ? undefined : txs
}
