import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import {
  DATE_OPTIONS,
  RIPPLE_EPOCH,
  normalizeAmount,
} from '../../../transactionUtils'
import Account from '../../Account'
import { localizeDate } from '../../../utils'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'

const Description: TransactionDescriptionComponent = (
  props: TransactionDescriptionProps,
) => {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const { data } = props
  const cancelAfter = localizeDate(
    (data.tx.CancelAfter + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS,
  )
  const finishAfter = localizeDate(
    (data.tx.FinishAfter + RIPPLE_EPOCH) * 1000,
    language,
    DATE_OPTIONS,
  )
  return (
    <>
      {data.tx.Destination !== data.tx.Account ? (
        <>
          <Trans i18nKey="escrow_is_from">
            The escrow is from
            <Account account={data.tx.Account} />
            to
            <Account account={data.tx.Destination} />
          </Trans>
        </>
      ) : (
        <>
          <Trans i18nKey="escrow_is_created_by">
            the escrow was created by
            <Account account={data.tx.Account} />
            and the funds will be returned to the same account
          </Trans>
        </>
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
          <span className="time">{` ${cancelAfter} ${DATE_OPTIONS.timeZone}`}</span>
        </div>
      )}
      {data.tx.FinishAfter && (
        <div>
          {t('describe_finish_after')}
          <span className="time">{` ${finishAfter} ${DATE_OPTIONS.timeZone}`}</span>
        </div>
      )}
    </>
  )
}
export { Description }
