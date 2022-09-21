import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import TrustSet from './TrustSet'
import Payment from './Payment'
import OfferCancel from './OfferCancel'
import EscrowCreate from './EscrowCreate'
import EscrowCancel from './EscrowCancel'
import PaymentChannelCreate from './PaymentChannelCreate'
import PaymentChannelClaim from './PaymentChannelClaim'
import PaymentChannelFund from './PaymentChannelFund'
import AccountSet from './AccountSet'
import Sequence from '../../shared/components/Sequence'
import DepositPreauth from './DepositPreauth'
import { transactionTypes } from '../../shared/components/Transaction'
import { useLanguage } from '../../shared/hooks'

const TransactionDescription = (props) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const { data, instructions } = props
  let body = null

  if (!data || !data.tx) {
    return null
  }

  // Locate the component description section of the detail tab that is unique per TransactionType.
  const DescriptionComponent =
    transactionTypes[data.tx.TransactionType]?.Description

  if (DescriptionComponent) {
    body = <DescriptionComponent data={data} />
  }
  // Locate the unique transaction component the old way
  // TODO: Remove once all transactions have been moved to the new definition style
  else if (data.tx.TransactionType === 'OfferCancel') {
    body = <OfferCancel t={t} data={data} />
  } else if (data.tx.TransactionType === 'Payment') {
    body = (
      <Payment
        t={t}
        language={language}
        data={data}
        partial={instructions.partial}
      />
    )
  } else if (data.tx.TransactionType === 'TrustSet') {
    body = <TrustSet t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'EscrowCreate') {
    body = <EscrowCreate t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'EscrowCancel') {
    body = <EscrowCancel t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'PaymentChannelCreate') {
    body = <PaymentChannelCreate t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'PaymentChannelClaim') {
    body = <PaymentChannelClaim t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'PaymentChannelFund') {
    body = <PaymentChannelFund t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'AccountSet') {
    body = <AccountSet t={t} language={language} data={data} />
  } else if (data.tx.TransactionType === 'DepositPreauth') {
    body = <DepositPreauth t={t} language={language} data={data} />
  }

  return (
    <div className="detail-section">
      <div className="title">{t('description')}</div>
      <div>
        {t('transaction_sequence')}
        <b>
          {' '}
          <Sequence
            sequence={data.tx.Sequence}
            ticketSequence={data.tx.TicketSequence}
            account={data.tx.Account}
            addContextHelp
          />
        </b>
      </div>
      {body}
    </div>
  )
}

TransactionDescription.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
  instructions: PropTypes.shape({ partial: PropTypes.bool }).isRequired,
}

export default TransactionDescription
