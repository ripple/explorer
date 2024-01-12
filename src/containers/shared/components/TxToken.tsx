import { Trans } from 'react-i18next'
import Currency from './Currency'

import '../css/txlabel.scss'

interface Props {
  tx: any
}

// TODO: We should consider moving this logic to each individual parser. This would give us more customizability.
function getTokenPair(
  type: string,
  fee: number,
  amount: { currency: string; amount: number },
  amount2: { currency: string; amount: number },
) {
  if (
    type === 'AMMWithdraw' ||
    type === 'AMMDeposit' ||
    type === 'AMMCreate' ||
    type === 'Payment'
  ) {
    const first =
      amount?.amount && amount.amount !== fee ? (
        <Currency currency={amount.currency} />
      ) : undefined
    const second =
      amount2?.amount && amount2.amount !== fee ? (
        <Currency currency={amount2.currency} />
      ) : undefined

    if (first && second) {
      return (
        <Trans
          i18nKey={
            type === 'Payment'
              ? 'transaction_tokens_swapped'
              : 'transaction_tokens_involved'
          }
          components={{
            Currency: first,
            Currency2: second,
          }}
        />
      )
    }

    return first || second
  }

  return 'LP'
}

const TxToken = (props: Props) => {
  const { tx } = props
  return (
    <div>
      {getTokenPair(
        tx.type,
        tx.fee,
        tx.details?.instructions?.amount,
        tx.details?.instructions?.amount2,
      )}
    </div>
  )
}

export default TxToken
