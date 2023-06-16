import { useTranslation, Trans } from 'react-i18next'
import type { EscrowCreate } from 'xrpl'
import { DATE_OPTIONS, normalizeAmount } from '../../../transactionUtils'
import { Account } from '../../Account'
import { localizeDate } from '../../../utils'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'

const Description: TransactionDescriptionComponent = (
  props: TransactionDescriptionProps<EscrowCreate>,
) => {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const { data } = props

  const formatDate = (time: number) =>
    `${localizeDate(convertRippleDate(time), language, DATE_OPTIONS)} ${
      DATE_OPTIONS.timeZone
    }`

  return (
    <>
      {data.tx.Destination !== data.tx.Account ? (
        <Trans i18nKey="escrow_is_from">
          The escrow is from
          <Account account={data.tx.Account} />
          to
          <Account account={data.tx.Destination} />
        </Trans>
      ) : (
        <Trans i18nKey="escrow_is_created_by">
          the escrow was created by
          <Account account={data.tx.Account} />
          and the funds will be returned to the same account
        </Trans>
      )}
      {data.tx.Condition && (
        <div>
          {t('escrow_condition')}
          <span className="condition"> {data.tx.Condition}</span>
        </div>
      )}
      <div>
        {t('escrowed_amount')}
        <b>
          {' '}
          {normalizeAmount(data.tx.Amount, language)}
          <small>XRP</small>
        </b>
      </div>
      {data.tx.CancelAfter && (
        <div>
          {t('describe_cancel_after')}
          <span className="time"> {formatDate(data.tx.CancelAfter)}</span>
        </div>
      )}
      {data.tx.FinishAfter && (
        <div>
          {t('describe_finish_after')}
          <span className="time"> {formatDate(data.tx.FinishAfter)}</span>
        </div>
      )}
    </>
  )
}
export { Description }
