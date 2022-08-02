import React from 'react'
import PropTypes from 'prop-types'

const SetRegularKey = (props) => {
  const { data, t } = props
  const key = data.tx.RegularKey || null
  return key ? (
    <div key="set_regular_key">
      {t('set_regular_key_description')}{' '}
      <span className="regular-key">{key}</span>
    </div>
  ) : (
    <div key="unset_regular_key">{t('unset_regular_key_description')}</div>
  )
}

SetRegularKey.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      RegularKey: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default SetRegularKey
