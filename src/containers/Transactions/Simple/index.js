import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import PaymentChannelCreate from './PaymentChannelCreate'
import PaymentChannelClaim from './PaymentChannelClaim'
import PaymentChannelFund from './PaymentChannelFund'
import EnableAmendment from './EnableAmendment'
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
    case 'PaymentChannelCreate':
      return <PaymentChannelCreate t={t} language={language} data={data} />
    case 'PaymentChannelClaim':
      return <PaymentChannelClaim t={t} language={language} data={data} />
    case 'PaymentChannelFund':
      return <PaymentChannelFund t={t} language={language} data={data} />
    case 'EnableAmendment':
      return <EnableAmendment t={t} language={language} data={data} />
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
