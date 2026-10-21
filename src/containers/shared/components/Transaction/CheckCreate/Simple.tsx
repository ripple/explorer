import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { parser } from './parser'
import { useLanguage } from '../../../hooks'
import { localizeDate, shortenCheckID } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<ReturnType<typeof parser>>,
) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { data } = props
  const {
    SendMax: sendMax,
    Destination: destination,
    DestinationTag: destinationTag,
    Expiration: expiration,
    InvoiceID: invoiceID,
    checkID,
  } = data.instructions
  const dt = destinationTag !== undefined ? `:${destinationTag}` : ''

  return (
    <>
      <SimpleRow label={t('max_amount')} data-testid="send-max">
        <Amount value={formatAmount(sendMax)} />
      </SimpleRow>
      <SimpleRow label={t('destination')} data-testid="destination">
        <Account account={`${destination}${dt}`} />
      </SimpleRow>
      {expiration && (
        <SimpleRow label={t('expiration')} data-testid="expiration">
          {localizeDate(
            new Date(convertRippleDate(expiration)),
            language,
            DATE_OPTIONS,
          )}{' '}
          {DATE_OPTIONS.timeZone}
        </SimpleRow>
      )}
      {invoiceID && (
        <SimpleRow
          label={t('invoice_id')}
          data-testid="invoice-id"
          className="text-truncate"
        >
          {invoiceID}
        </SimpleRow>
      )}
      {checkID && (
        <SimpleRow label={t('check_id')} data-testid="check-id">
          {shortenCheckID(checkID)}
        </SimpleRow>
      )}
    </>
  )
}
