import React from 'react'
import PropTypes from 'prop-types'
import Account from '../../shared/components/Account'

const SetRegularKey = (props) => {
  const { data, t } = props
  const { quorum, max, signers } = data.instructions

  return (
    <>
      <div className="row">
        <div className="label">{t('signers')}</div>
        <div className="value">
          <ul className="signers">
            {signers.map((d) => (
              <li key={d.account}>
                <Account account={d.account} />
                <span className="label">{` ${t('weight')}: `}</span>
                <small>{d.weight}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="label">{t('quorum')}</div>
        <div className="value">
          {quorum}
          <span className="label"> {t('out_of')} </span>
          {max}
        </div>
      </div>
    </>
  )
}

SetRegularKey.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      quorum: PropTypes.number,
      max: PropTypes.number,
      signers: PropTypes.shape({
        map: PropTypes.func,
      }),
    }),
  }).isRequired,
}

export default SetRegularKey
