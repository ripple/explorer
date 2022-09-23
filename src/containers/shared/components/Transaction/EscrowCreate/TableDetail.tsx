import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { localizeDate } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { useLanguage } from '../../../hooks'

export const TableDetail = (props: any) => {
  const { t } = useTranslation()
  const { instructions } = props
  const language = useLanguage()
  const { amount, destination, finishAfter, cancelAfter, condition } =
    instructions
  return (
    <div className="escrow">
      {amount && (
        <div>
          <span className="label">{t('amount')}</span>
          <Amount value={amount} data-test="amount" />
        </div>
      )}
      {destination && (
        <div>
          <span className="label">{t('destination')}</span>
          <span className="account" data-test="account">
            {' '}
            {destination}{' '}
          </span>
        </div>
      )}
      {condition && (
        <div>
          <span className="label">{t('condition')}</span>
          <span className="condition" data-test="condition">
            {' '}
            {condition}{' '}
          </span>
        </div>
      )}
      {finishAfter && (
        <div>
          <span className="label">{t('finish_after')}</span>
          <span data-test="finish_after">
            {localizeDate(Date.parse(finishAfter), language, DATE_OPTIONS)} UTC
          </span>
        </div>
      )}
      {cancelAfter && (
        <div>
          <span className="label">{t('cancel_after')}</span>
          <span data-test="cancel_after">
            {localizeDate(Date.parse(cancelAfter), language, DATE_OPTIONS)} UTC
          </span>
        </div>
      )}
    </div>
  )
}
