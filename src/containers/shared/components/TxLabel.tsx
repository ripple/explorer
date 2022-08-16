import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import '../css/txlabel.scss'

interface Props {
  type: string
}

const TxLabel = (props: Props) => {
  const { t } = useTranslation()
  const { type } = props
  return (
    <div className={`tx-label tx-type ${type}`}>
      <div>{t(`transaction_${type}`)}</div>
    </div>
  )
}

TxLabel.propTypes = {
  type: PropTypes.string.isRequired,
}

export default TxLabel
