import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanBrokerCoverWithdraw } from './types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanBrokerCoverWithdraw>) => {
  const { t } = useTranslation()
  const { Amount: amount, Destination } = instructions

  return (
    <div className="loan-broker-cover-withdraw">
      <span className="label">{t('withdraw')}</span>
      <Amount value={formatAmount(amount)} />
      <span>{t('first_loss_capital')}</span>
      {Destination && (
        <>
          <span>{t('to')}</span>
          <Account account={Destination} />
        </>
      )}
    </div>
  )
}
