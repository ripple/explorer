import React from 'react'
import PropTypes from 'prop-types'
import { findNode, normalizeAmount } from '../../shared/transactionUtils'

const PaymentChannelFund = (props) => {
  const { t, language, data } = props
  const lines = []
  const node = findNode(data, 'ModifiedNode', 'PayChannel')

  lines.push(
    <div key="line2">
      {t('update_payment_channel')}{' '}
      <span className="channel">{data.tx.Channel}</span>
    </div>,
  )

  if (data.tx.Amount) {
    lines.push(
      <div key="line3">
        {t('increase_channel_amount_by')}
        <b>
          {' '}
          {normalizeAmount(data.tx.Amount, language)}
          <small>XRP</small>
        </b>
        {node && (
          <span>
            {` ${t('from')} `}
            <b>
              {normalizeAmount(node.PreviousFields.Amount, language)}
              <small>XRP</small>
            </b>
            {` ${t('to')} `}
            <b>
              {normalizeAmount(node.FinalFields.Amount, language)}
              <small>XRP</small>
            </b>
          </span>
        )}
      </div>,
    )
  }

  return lines
}

PaymentChannelFund.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
}

export default PaymentChannelFund
