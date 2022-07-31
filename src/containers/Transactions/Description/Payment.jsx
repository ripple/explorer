import React from 'react'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { normalizeAmount } from '../../shared/transactionUtils'
import Account from '../../shared/components/Account'

const Payment = (props) => {
  const { t, language, data, partial } = props
  const lines = []

  lines.push(
    <Trans key="payment_desc_line_1" i18nKey="payment_desc_line_1">
      The payment is from
      <Account account={data.tx.Account} />
      to
      <Account account={data.tx.Destination} />
    </Trans>,
  )

  if (data.tx.SourceTag !== undefined) {
    lines.push(
      <div key="payment_desc_line_2">
        {t('the_source_tag_is')}
        <b> {data.tx.SourceTag}</b>
      </div>,
    )
  }

  if (data.tx.DestinationTag !== undefined) {
    lines.push(
      <div key="payment_desc_line_3">
        {t('the_destination_tag_is')}
        <b> {data.tx.DestinationTag}</b>
      </div>,
    )
  }

  lines.push(
    <div key="payment_desc_line_4">
      {`${t('payment_desc_line_4')}${partial ? ' up to' : ''}`}
      <b>
        <span> {normalizeAmount(data.tx.Amount, language)}</span>
        <small>{data.tx.Amount.currency || 'XRP'}</small>
      </b>
      {data.tx.SendMax && (
        <>
          <span> {t('payment_desc_line_5')}</span>
          <b>
            <span> {normalizeAmount(data.tx.SendMax, language)}</span>
            <small>{data.tx.SendMax.currency || 'XRP'}</small>
          </b>
        </>
      )}
    </div>,
  )

  if (data.meta && data.meta.delivered_amount) {
    lines.push(
      <div key="payment_desc_line_6">
        {t('payment_desc_line_6')}
        <b>
          <span> {normalizeAmount(data.meta.delivered_amount, language)}</span>
          <small>{data.meta.delivered_amount.currency || 'XRP'}</small>
        </b>
      </div>,
    )
  }

  return lines
}

Payment.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  partial: PropTypes.bool,
}

Payment.defaultProps = {
  partial: false,
}

export default Payment
