import React from 'react'
import PropTypes from 'prop-types'
import { decodeHex, ACCOUNT_FLAGS } from '../../shared/transactionUtils'

const AccountSet = (props) => {
  const { t, data } = props
  const lines = []

  if (data.tx.Domain) {
    lines.push(
      <div key="domain">
        {t('set_domain_description')}{' '}
        <a
          className="domain"
          rel="noopener noreferrer"
          target="_blank"
          href={`http://${decodeHex(data.tx.Domain)}`}
        >
          {decodeHex(data.tx.Domain)}
        </a>
      </div>,
    )
  }

  if (data.tx.EmailHash) {
    lines.push(
      <div key="email">
        {t('set_email_description')}
        <span className="email"> {data.tx.EmailHash}</span>
      </div>,
    )
  }

  if (data.tx.MessageKey) {
    lines.push(
      <div key="message-key">
        {t('set_message_key_description')}
        <span className="message-key"> {data.tx.MessageKey}</span>
      </div>,
    )
  }

  if (data.tx.SetFlag) {
    lines.push(
      <div key="set-flag">
        {t('set_flag_description')}
        <span className="flag">
          {' '}
          {ACCOUNT_FLAGS[data.tx.SetFlag] || data.tx.SetFlag}
        </span>
      </div>,
    )
  }

  if (data.tx.ClearFlag) {
    lines.push(
      <div key="clear-flag">
        {t('clear_flag_description')}
        <span className="flag">
          {' '}
          {ACCOUNT_FLAGS[data.tx.ClearFlag] || data.tx.ClearFlag}
        </span>
      </div>,
    )
  }

  return lines
}

AccountSet.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      Domain: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default AccountSet
