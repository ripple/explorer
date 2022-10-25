import React from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { useLanguage } from '../../../hooks'
import { localizeDate } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { data } = props
  const { amount, destination, condition, finishAfter, cancelAfter } =
    data.instructions
  const caDate = localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS)
  const faDate = localizeDate(Date.parse(finishAfter), language, DATE_OPTIONS)

  return (
    <>
      <SimpleRow label={t('escrow')} data-test="escrow-amount">
        <Amount value={amount} />
      </SimpleRow>
      {destination && (
        <SimpleRow label={t('destination')} data-test="escrow-destination">
          <Account account={destination} />
        </SimpleRow>
      )}
      {condition && (
        <SimpleRow label={t('condition')} data-test="escrow-condition">
          {condition}
        </SimpleRow>
      )}
      {cancelAfter && (
        <SimpleRow label={t('cancel_after')}>
          {caDate} {DATE_OPTIONS.timeZone}
        </SimpleRow>
      )}
      {finishAfter && (
        <SimpleRow label={t('finish_after')}>
          {faDate} {DATE_OPTIONS.timeZone}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
