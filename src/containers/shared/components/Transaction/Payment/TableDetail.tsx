import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionTableDetailProps } from '../types'
import { PaymentInstructions } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PaymentInstructions>) => {
  const { t } = useTranslation()
  const { convert, amount, destination, partial, sourceTag } = instructions

  const renderPartial = () => (
    <div className="partial-payment">{t('partial_payment_allowed')}</div>
  )

  if (convert) {
    return (
      <div className="payment conversion">
        <span className="label">{t('convert_maximum')}</span>
        <Amount value={convert} />
        <span>{t('to')}</span>
        <Amount value={amount} />
        {partial && renderPartial()}
      </div>
    )
  }

  return (
    <div className="payment">
      <span className="label">{t('send')}</span>
      <Amount value={amount} />
      <span>{t('to')}</span>
      <span className="account">{destination}</span>
      {sourceTag !== undefined && (
        <div className="st">
          {t('source_tag')}
          {': '}
          <span>{sourceTag}</span>
        </div>
      )}
      {partial && renderPartial()}
    </div>
  )
}
