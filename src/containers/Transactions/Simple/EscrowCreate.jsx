import React from 'react'
import PropTypes from 'prop-types'
import { CURRENCY_OPTIONS, DATE_OPTIONS } from '../../shared/transactionUtils'
import { localizeNumber, localizeDate } from '../../shared/utils'
import Currency from '../../shared/components/Currency'
import Account from '../../shared/components/Account'

const EscrowCreate = (props) => {
  const { data, language, t } = props
  const { amount, destination, condition, finishAfter, cancelAfter } =
    data.instructions
  const options = { ...CURRENCY_OPTIONS, currency: amount.currency }
  const amt = localizeNumber(amount.amount, language, options)
  const caDate = localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS)
  const faDate = localizeDate(Date.parse(finishAfter), language, DATE_OPTIONS)

  return (
    <>
      <div className="row">
        <div className="label">{t('escrow')}</div>
        <div className="value">
          {amt}
          <Currency currency={amount.currency} />
        </div>
      </div>
      {destination && (
        <div className="row">
          <div className="label">{t('destination')}</div>
          <div className="value">
            <Account account={destination} />
          </div>
        </div>
      )}
      {condition && (
        <div className="row">
          <div className="label">{t('condition')}</div>
          <div className="value condition">{condition}</div>
        </div>
      )}
      {cancelAfter && (
        <div className="row">
          <div className="label">{t('cancel_after')}</div>
          <div className="value date">
            {caDate} {DATE_OPTIONS.timeZone}
          </div>
        </div>
      )}
      {finishAfter && (
        <div className="row">
          <div className="label">{t('finish_after')}</div>
          <div className="value date">
            {faDate} {DATE_OPTIONS.timeZone}
          </div>
        </div>
      )}
    </>
  )
}

EscrowCreate.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      destination: PropTypes.string,
      amount: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      condition: PropTypes.string,
      finishAfter: PropTypes.string,
      cancelAfter: PropTypes.string,
    }),
  }).isRequired,
  language: PropTypes.string.isRequired,
}

export default EscrowCreate
