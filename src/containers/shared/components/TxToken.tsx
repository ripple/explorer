import React from 'react'
import '../css/txlabel.scss'

interface Props {
  tx: any
}

// We should consider moving this logic to each individual parser. This would give us more customizability.
function getTokenPair(
  type: string,
  fee: number,
  amount: { currency: string; amount: number },
  amount2: { currency: string; amount: number },
) {
  if (type === 'AMMBid' || type === 'AMMVote') {
    return 'LP'
  }

  const first =
    amount?.amount && amount.amount !== fee ? amount.currency : undefined
  const second =
    amount2?.amount && amount2.amount !== fee ? amount2.currency : undefined

  if (first && second) {
    return first + (type === 'Payment' ? ' for ' : ' and ') + second
  }

  return first || second
}

const TxToken = (props: Props) => {
  const { tx } = props
  return (
    <div>
      {getTokenPair(
        tx.type,
        tx.fee,
        tx.details.instructions.amount,
        tx.details.instructions.amount2,
      )}
    </div>
  )
}

export default TxToken
