import React from 'react'
import { useTranslation } from 'react-i18next'
import { CURRENCY_OPTIONS } from '../../../transactionUtils'
import { localizeNumber } from '../../../utils'
import Currency from '../../Currency'
import Account from '../../Account'
import { PaymentSimpleProps } from './types'

export const Simple = (props: PaymentSimpleProps) => {
  const { data } = props
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const { convert } = data.instructions

  const renderPartial = () => {
    const { partial } = data.instructions
    return partial ? (
      <div className="partial-row">{t('partial_payment_allowed')}</div>
    ) : null
  }

  const renderPayment = () => {
    const { amount, max, destination, sourceTag, partial } = data.instructions
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
              {
                // @ts-ignore
                <Currency amount={max.amount} currency={max.currency} />
              }
            </div>
          </div>
        )}
        <div className="row">
          <div className="label">{partial ? t('delivered') : t('send')}</div>
          <div className="value">
            {amt}
            {
              // @ts-ignore
              <Currency amount={amount.amount} currency={amount.currency} />
            }
            {renderPartial()}
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

  const renderConversion = () => {
    const { amount } = data.instructions
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
            {
              // @ts-ignore
              <Currency amount={convert.amount} currency={convert.currency} />
            }
          </div>
        </div>
        <div className="row">
          <div className="label">{t('convert_to')}</div>
          <div className="value">
            {amt}
            {
              // @ts-ignore
              <Currency amount={amount.amount} currency={amount.currency} />
            }
          </div>
        </div>
        {renderPartial()}
      </>
    )
  }
  return convert ? renderConversion() : renderPayment()
}
