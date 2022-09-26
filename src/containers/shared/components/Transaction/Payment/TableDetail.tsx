import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const { convert, amount, destination, partial, sourceTag } = instructions

  const renderAmount = (d: any) => <Amount value={d} />

  if (convert) {
    return (
      <div className="payment conversion">
        <span className="label">{t('convert_maximum')}</span>
        {renderAmount(convert)}
        <span>{t('to')}</span>
        {renderAmount(amount)}
        {partial && (
          <div className="partial-payment">{t('partial_payment_allowed')}</div>
        )}
      </div>
    )
  }

  return amount ? (
    <div className="payment">
      <span className="label">{t('send')}</span>
      {renderAmount(amount)}
      <span>{t('to')}</span>
      <span className="account"> {destination} </span>
      {sourceTag !== undefined && (
        <div className="st">
          {t('source_tag')}
          {': '}
          <span>{sourceTag}</span>
        </div>
      )}
      {partial && (
        <div className="partial-payment">{t('partial_payment_allowed')}</div>
      )}
    </div>
  ) : null
}
