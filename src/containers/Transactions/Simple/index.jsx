import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { transactionTypes } from '../../shared/components/Transaction'

export const Simple = ({ data, type }) => {
  const { t } = useTranslation()

  // Locate the component for the left side of the simple tab that is unique per TransactionType.
  const SimpleComponent = transactionTypes[type]?.Simple
  if (SimpleComponent) {
    return <SimpleComponent data={data} />
  }

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

Simple.propTypes = {
  data: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
}
