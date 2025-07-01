import type { Transaction } from 'xrpl'
import { decode, encode } from 'ripple-binary-codec'
import { bytesToHex, hexToBytes } from '@xrplf/isomorphic/dist/utils'
import { sha512 } from '@xrplf/isomorphic/sha512'
import { getTransaction } from '../../../../../rippled/lib/rippled'

export async function getBatchTxStatus(rippledSocket, batchTransactions) {
  const results = await Promise.all(
    batchTransactions.map(async (tx) => {
      try {
        await getTransaction(rippledSocket, tx.hash)
        return {
          ...tx,
          successful: true,
        }
      } catch (error) {
        return {
          ...tx,
          successful: false,
        }
      }
    }),
  )
  return results
}

enum GlobalFlags {
  tfInnerBatchTxn = 0x40000000,
}

enum HashPrefix {
  // transaction plus signature to give transaction ID 'TXN'
  TRANSACTION_ID = 0x54584e00,

  // transaction plus metadata 'TND'
  TRANSACTION_NODE = 0x534e4400,

  // inner node in tree 'MIN'
  INNER_NODE = 0x4d494e00,

  // leaf node in tree 'MLN'
  LEAF_NODE = 0x4d4c4e00,

  // inner transaction to sign 'STX'
  TRANSACTION_SIGN = 0x53545800,

  // inner transaction to sign (TESTNET) 'stx'
  TRANSACTION_SIGN_TESTNET = 0x73747800,

  // inner transaction to multisign 'SMT'
  TRANSACTION_MULTISIGN = 0x534d5400,

  // ledger 'LWR'
  LEDGER = 0x4c575200,
}

const HASH_BYTES = 32

export function hashSignedTx(tx: Transaction | string): string {
  let txBlob: string
  let txObject: Transaction
  if (typeof tx === 'string') {
    txBlob = tx
    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Required until updated in binary codec. */
    txObject = decode(tx) as unknown as Transaction
  } else {
    txBlob = encode(tx)
    txObject = tx
  }

  if (
    txObject.TxnSignature === undefined &&
    txObject.Signers === undefined &&
    txObject.SigningPubKey === undefined &&
    !hasFlag(txObject, GlobalFlags.tfInnerBatchTxn, 'tfInnerBatchTxn')
  ) {
    throw new Error('The transaction must be signed to hash it.')
  }

  const prefix = HashPrefix.TRANSACTION_ID.toString(16).toUpperCase()
  return sha512Half(prefix.concat(txBlob))
}

function hasFlag(
  tx: Transaction | Record<string, unknown>,
  flag: number,
  flagName: string,
): boolean {
  if (tx.Flags == null) {
    return false
  }
  if (typeof tx.Flags === 'number') {
    return isFlagEnabled(tx.Flags, flag)
  }
  return tx.Flags[flagName] === true
}

export function isFlagEnabled(Flags: number, checkFlag: number): boolean {
  // eslint-disable-next-line no-bitwise -- flags need bitwise
  return (BigInt(checkFlag) & BigInt(Flags)) === BigInt(checkFlag)
}

function sha512Half(hex: string): string {
  return bytesToHex(sha512(hexToBytes(hex)).slice(0, HASH_BYTES))
}
