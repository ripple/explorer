import { useTranslation, Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { t } = useTranslation()
  const issuer = data.tx.Account
  const holder = data.tx.Amount.issuer
  const amount = data.tx.Amount
  amount.issuer = issuer
  return (
    <>
      <div data-test="from-to-line">
        <Trans
          i18nKey="claws_back_from"
          components={{
            source: <Account account={issuer} />,
            destination: <Account account={holder} />,
          }}
        />
      </div>
      <div data-test="amount-line">
        {t('instruct_to_claw')}
        <Amount value={formatAmount(amount)} />
      </div>
    </>
  )
}
