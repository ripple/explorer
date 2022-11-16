import React from 'react'
import PropTypes from 'prop-types'
import { Amount } from '../../shared/components/Amount'

const TrustSet = (props) => {
  const { data, t } = props
  const { limit } = data.instructions

  return (
    <>
      <div className="row">
        <div className="label">{t('set_limit')}</div>
        <div className="value">
          <Amount value={limit} />
        </div>
      </div>
    </>
  )
}

TrustSet.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      limit: PropTypes.shape({
        issuer: PropTypes.string,
        currency: PropTypes.string,
        amount: PropTypes.number,
      }),
    }),
  }).isRequired,
}

export default TrustSet
