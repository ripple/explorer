import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import OfferCancel from './OfferCancel'
import PaymentChannelCreate from './PaymentChannelCreate'
import PaymentChannelClaim from './PaymentChannelClaim'
import PaymentChannelFund from './PaymentChannelFund'
import EscrowCreate from './EscrowCreate'
import EscrowCancel from './EscrowCancel'
import TrustSet from './TrustSet'
import AccountSet from './AccountSet'
import DepositPreauth from './DepositPreauth'
import EnableAmendment from './EnableAmendment'
import UNLModify from './UNLModify'
import AccountDelete from './AccountDelete'
import TicketCreate from './TicketCreate'
import NFTokenBurn from './NFTokenBurn'
import NFTokenCancelOffer from './NFTokenCancelOffer'
import NFTokenMint from './NFTokenMint'
import { transactionTypes } from '../../shared/components/Transaction'
import { useLanguage } from '../../shared/hooks'

const Simple = (props) => {
  const { data, type } = props
  const language = useLanguage()
  const { t } = useTranslation()

  // Locate the component for the left side of the simple tab that is unique per TransactionType.
  const SimpleComponent = transactionTypes[type]?.Simple
  if (SimpleComponent) {
    return <SimpleComponent data={data} />
  }

  // Locate the unique transaction component the old way
  // TODO: Remove once all transactions have been moved to the new definition style
  switch (type) {
    case 'OfferCancel':
      return <OfferCancel t={t} data={data} />
    case 'PaymentChannelCreate':
      return <PaymentChannelCreate t={t} language={language} data={data} />
    case 'PaymentChannelClaim':
      return <PaymentChannelClaim t={t} language={language} data={data} />
    case 'PaymentChannelFund':
      return <PaymentChannelFund t={t} language={language} data={data} />
    case 'EscrowCreate':
      return <EscrowCreate t={t} language={language} data={data} />
    case 'EscrowCancel':
      return <EscrowCancel t={t} language={language} data={data} />
    case 'TrustSet':
      return <TrustSet t={t} language={language} data={data} />
    case 'AccountSet':
      return <AccountSet t={t} language={language} data={data} />
    case 'DepositPreauth':
      return <DepositPreauth t={t} language={language} data={data} />
    case 'EnableAmendment':
      return <EnableAmendment t={t} language={language} data={data} />
    case 'UNLModify':
      return <UNLModify t={t} language={language} data={data} />
    case 'AccountDelete':
      return <AccountDelete t={t} language={language} data={data} />
    case 'TicketCreate':
      return <TicketCreate t={t} language={language} data={data} />
    case 'NFTokenBurn':
      return <NFTokenBurn t={t} language={language} data={data} />
    case 'NFTokenCancelOffer':
      return <NFTokenCancelOffer t={t} language={language} data={data} />
    case 'NFTokenMint':
      return <NFTokenMint t={t} language={language} data={data} />
    default:
      // Some transactions do not have simple views.
      return (
        <div className="not-supported">
          <div>
            {t('simple_not_supported')}
            <span className="type">{type}</span>
          </div>
          <div>{t('try_detailed_raw')}</div>
        </div>
      )
  }
}

Simple.propTypes = {
  data: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
}

export default Simple
