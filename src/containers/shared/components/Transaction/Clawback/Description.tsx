import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const issuer = data.tx.Account
  const amount = formatAmount(data.tx.Amount)
  const holder = amount.isMPT ? data.tx.MPTokenHolder : data.tx.Amount.issuer
  amount.issuer = issuer
  return (
    <>
      <div data-testid="from-to-line">
        <Trans
          i18nKey="claws_back_from"
          components={{
            source: <Account account={issuer} />,
            destination: <Account account={holder} />,
          }}
        />
      </div>
      <div data-testid="amount-line">
        <Trans
          i18nKey="instruct_to_claw"
          components={{
            amount: <Amount value={amount} />,
          }}
        />
      </div>
    </>
  )
}
