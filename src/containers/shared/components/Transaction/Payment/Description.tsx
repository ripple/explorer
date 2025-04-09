import { Trans, useTranslation } from 'react-i18next'
import type { Payment } from 'xrpl'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { isPartialPayment } from './parser'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({ data }: TransactionDescriptionProps<Payment>) => {
  const { t } = useTranslation()
  const partial = isPartialPayment(data.tx.Flags)

  return (
    <>
      <div data-testid="from-to-line">
        <Trans
          i18nKey="payment_desc_line_1"
          components={{
            source: <Account account={data.tx.Account} />,
            destination: <Account account={data.tx.Destination} />,
          }}
        />
      </div>
      {data.tx.SourceTag != null && (
        <div data-testid="source-tag-line">
          {t('the_source_tag_is')}
          <b>{data.tx.SourceTag}</b>
        </div>
      )}
      {data.tx.DestinationTag != null && (
        <div data-testid="destination-tag-line">
          {t('the_destination_tag_is')} <b>{data.tx.DestinationTag}</b>
        </div>
      )}
      <div data-testid="amount-line">
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
        <div data-testid="delivered-line">
          {t('payment_desc_line_6')}{' '}
          <b>
            <Amount value={formatAmount(data.meta.delivered_amount)} />
          </b>
        </div>
      )}
    </>
  )
}
