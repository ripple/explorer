import React from 'react'
import '../css/txlabel.scss'

interface Props {
  tx: any
}

// We should consider moving this logic to each individual parser. This would give us more customizability.
const getCurrency = (tx: any) => {
  let token = ''
  if (tx.type === 'AMMBid' || tx.type === 'AMMVote') {
    token = 'LP'
  } else if (tx.details.instructions.amount) {
    token += tx.details.instructions.amount.currency

    if (tx.details.instructions.amount2) {
      if (tx.type === 'Payment') token += ' for '
      else token += ' and '

      token += tx.details.instructions.amount2.currency
    }
  }

  return token || 'XRP'
}

const TxToken = (props: Props) => {
  const { tx } = props
  return <div>{getCurrency(tx)}</div>
}

export default TxToken
