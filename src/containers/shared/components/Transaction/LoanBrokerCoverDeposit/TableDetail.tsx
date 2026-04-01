import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanBrokerCoverDeposit } from './types'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanBrokerCoverDeposit>) => {
  const { t } = useTranslation()
  const { Amount: amount, LoanBrokerID } = instructions

  return (
    <div className="loan-broker-cover-deposit">
      <span className="label">{t('transaction_action_SEND')}</span>
      <Amount value={formatAmount(amount)} />
      <span>
        {t('first_loss_capital')} {t('to')} {t('loan_broker_id')}
      </span>
      <span className="case-sensitive">
        <b>{LoanBrokerID}</b>
      </span>
    </div>
  )
}
