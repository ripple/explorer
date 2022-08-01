import React from 'react'
import PropTypes from 'prop-types'

const SetRegularKey = (props) => {
  const { data, t } = props
  const { key } = data.instructions

  return key ? (
    <div className="row">
      <div className="label">{t('regular_key')}</div>
      <div className="value">{key}</div>
    </div>
  ) : (
    <div className="row">
      <div className="label">{null}</div>
      <div className="value unset">{t('unset_regular_key')}</div>
    </div>
  )
}

SetRegularKey.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      key: PropTypes.string,
    }),
  }).isRequired,
}

export default SetRegularKey
