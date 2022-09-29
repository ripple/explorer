import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Account from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { isPartialPayment } from './parser'
import { Amount } from '../../Amount'
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { t } = useTranslation()
  const partial = isPartialPayment(data.tx.Flags)

  return (
    <>
      <div data-test="from-to-line">
        <Trans
          i18nKey="payment_desc_line_1"
          components={{
            source: <Account account={data.tx.Account} />,
            destination: <Account account={data.tx.Destination} />,
          }}
        />
      </div>
      {data.tx.SourceTag != undefined && (
        <div data-test="source-tag-line">
          {t('the_source_tag_is')}
          <b>{data.tx.SourceTag}</b>
        </div>
      )}
      {data.tx.DestinationTag != undefined && (
        <div data-test="destination-tag-line">
          {t('the_destination_tag_is')} <b>{data.tx.DestinationTag}</b>
        </div>
      )}
      <div data-test="amount-line">
        {`${t('payment_desc_line_4')}${partial ? ' up to' : ''}`}{' '}
        <b>
          <Amount value={formatAmount(data.tx.Amount)} />
        </b>
        {data.tx.SendMax && (
          <>
            <span> {t('payment_desc_line_5')}</span>{' '}
            <b>
              <Amount value={formatAmount(data.tx.SendMax)} />
            </b>
          </>
        )}
      </div>
      {data?.meta?.delivered_amount && (
        <div data-test="delivered-line">
          {t('payment_desc_line_6')}{' '}
          <b>
            <Amount value={formatAmount(data.meta.delivered_amount)} />
          </b>
        </div>
      )}
    </>
  )
}
