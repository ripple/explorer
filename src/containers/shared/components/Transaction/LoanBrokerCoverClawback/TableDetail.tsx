import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { amount, calculatedAmount, loanBrokerID } = instructions

  const displayAmount = calculatedAmount || amount

  return (
    <div className="loan-broker-cover-clawback">
      <span className="label">{t('claws_back')}</span>
      {displayAmount && <Amount value={displayAmount} />}
      <span>
        {t('first_loss_capital')} {t('from')} {t('loan_broker_id')}{' '}
        <b>{loanBrokerID} </b>
      </span>
    </div>
  )
}
