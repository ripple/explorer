import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils'
import { localizeNumber } from '../../shared/utils'
import Currency from '../../shared/components/Currency'
import { Account } from '../../shared/components/Account'

class Payment extends Component {
  renderPartial() {
    const { t, data } = this.props
    const { partial } = data.instructions
    return partial ? (
      <div className="partial-row">{t('partial_payment_allowed')}</div>
    ) : null
  }

  renderPayment() {
    const { data, t, language } = this.props
    const {
      amount,
      max = {},
      destination,
      sourceTag,
      partial,
    } = data.instructions
    const parts = destination.split(':')
    const options = { ...CURRENCY_OPTIONS, currency: amount.currency }
    const amt = localizeNumber(amount.amount, language, options)
    const maxOptions = { ...CURRENCY_OPTIONS, currency: max.currency }
    const maxAmount = localizeNumber(max.amount, language, maxOptions)

    return (
      <>
        {max.amount && (
          <div className="row">
            <div className="label">{t('using_at_most')}</div>
            <div className="value">
              {maxAmount}
              <Currency amount={max.amount} currency={max.currency} />
            </div>
          </div>
        )}
        <div className="row">
          <div className="label">{partial ? t('delivered') : t('send')}</div>
          <div className="value">
            {amt}
            <Currency amount={amount.amount} currency={amount.currency} />
            {this.renderPartial()}
          </div>
        </div>
        {sourceTag !== undefined && (
          <div className="row">
            <div className="label">{t('source_tag')}</div>
            <div className="value">{sourceTag}</div>
          </div>
        )}
        <div className="row">
          <div className="label">{t('destination')}</div>
          <div className="value">
            <Account account={parts[0]} />
            {parts[1] && <span className="dt">:{parts[1]}</span>}
          </div>
        </div>
      </>
    )
  }

  renderConversion() {
    const { data, t, language } = this.props
    const { convert, amount } = data.instructions
    const options = { ...CURRENCY_OPTIONS, currency: amount.currency }
    const amt = localizeNumber(amount.amount, language, options)
    const convertOptions = { ...CURRENCY_OPTIONS, currency: convert.currency }
    const convertAmount = localizeNumber(
      convert.amount,
      language,
      convertOptions,
    )

    return (
      <>
        <div className="row">
          <div className="label">{t('using_at_most')}</div>
          <div className="value">
            {convertAmount}
            <Currency amount={convert.amount} currency={convert.currency} />
          </div>
        </div>
        <div className="row">
          <div className="label">{t('convert_to')}</div>
          <div className="value">
            {amt}
            <Currency amount={amount.amount} currency={amount.currency} />
          </div>
        </div>
        {this.renderPartial()}
      </>
    )
  }

  render() {
    const { data } = this.props
    const { convert } = data.instructions
    return convert ? this.renderConversion() : this.renderPayment()
  }
}

Payment.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      partial: PropTypes.bool,
      amount: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      max: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      convert: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      destination: PropTypes.oneOfType([
        PropTypes.shape({
          split: PropTypes.func,
        }),
        PropTypes.string,
      ]),
      sourceTag: PropTypes.number,
    }),
  }).isRequired,
}

export default Payment
