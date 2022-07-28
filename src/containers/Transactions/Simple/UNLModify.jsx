import React from 'react'
import PropTypes from 'prop-types'
import { encodeNodePublic } from 'ripple-address-codec'

const UNLModify = (props) => {
  const { data, t } = props
  const { validator, disabling } = data.instructions

  const encoded = encodeNodePublic(Buffer.from(validator, 'hex'))

  return (
    <>
      <div className="row">
        <div className="label">{t('validator')}</div>
        <div className="value">
          <small>{encoded}</small>
        </div>
      </div>
      <div className="row">
        <div className="label">{t('action')}</div>
        <div className="value"> {disabling ? 'DISABLE' : 'ENABLE'}</div>
      </div>
    </>
  )
}

UNLModify.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      validator: PropTypes.string,
      disabling: PropTypes.number,
    }),
  }).isRequired,
}

export default UNLModify
