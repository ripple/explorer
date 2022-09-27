import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { normalizeAmount } from '../../../transactionUtils'
import Account from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { isPartialPayment } from './parser'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const partial = isPartialPayment(data.tx)

  return (
    <>
      <Trans key="payment_desc_line_1" i18nKey="payment_desc_line_1">
        The payment is from
        <Account account={data.tx.Account} />
        to
        <Account account={data.tx.Destination} />
      </Trans>
      {data.tx.SourceTag !== undefined && (
        <div key="payment_desc_line_2">
          {t('the_source_tag_is')}
          <b> {data.tx.SourceTag}</b>
        </div>
      )}
      {data.tx.DestinationTag !== undefined && (
        <div key="payment_desc_line_3">
          {t('the_destination_tag_is')}
          <b> {data.tx.DestinationTag}</b>
        </div>
      )}
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
      </div>
      {data.meta && data.meta.delivered_amount && (
        <div key="payment_desc_line_6">
          {t('payment_desc_line_6')}
          <b>
            <span>
              {' '}
              {normalizeAmount(data.meta.delivered_amount, language)}
            </span>
            <small>{data.meta.delivered_amount.currency || 'XRP'}</small>
          </b>
        </div>
      )}
    </>
  )
}
