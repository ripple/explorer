import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import loader from '../images/xrp-loader.png'
import '../css/loader.scss'

interface Props {
  className: string
}

const Loader = (props: Props) => {
  const { t } = useTranslation()
  const { className } = props
  return (
    <div className={`loader ${className}`}>
      <img src={loader} alt={t('loading')} />
    </div>
  )
}

Loader.propTypes = {
  className: PropTypes.string,
}

Loader.defaultProps = {
  className: '',
}

export default Loader
