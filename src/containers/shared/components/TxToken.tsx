import '../css/txlabel.scss'
import { hexToString } from './Currency'

interface Props {
  tx: any
}

const NON_STANDARD_CODE_LENGTH = 40
const LP_TOKEN_IDENTIFIER = '03'

function getCode(currency: string): string {
  return currency?.length === NON_STANDARD_CODE_LENGTH &&
    currency?.substring(0, 2) !== LP_TOKEN_IDENTIFIER
    ? hexToString(currency)
    : currency
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
      amount?.amount && amount.amount !== fee
        ? getCode(amount.currency)
        : undefined
    const second =
      amount2?.amount && amount2.amount !== fee
        ? getCode(amount2.currency)
        : undefined

    if (first && second) {
      return first + (type === 'Payment' ? ' for ' : ' and ') + second
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
        tx.details.instructions.amount,
        tx.details.instructions.amount2,
      )}
    </div>
  )
}

export default TxToken
