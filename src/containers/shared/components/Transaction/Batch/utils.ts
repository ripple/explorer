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
