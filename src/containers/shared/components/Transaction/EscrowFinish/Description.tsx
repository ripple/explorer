import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { normalizeAmount, findNode } from '../../../transactionUtils'
import Account from '../../Account'
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
  const deleted: any = findNode(data, 'DeletedNode', 'Escrow')

  if (!deleted) {
    return null
  }
  return (
    <>
      <div key="line1">
        {t('escrow_completion_desc')} <Account account={data.tx.Account} />
      </div>
      <div key="line2">
        <Trans i18nKey="escrow_completion_desc_2">
          The escrowed amount of
          <b>
            {normalizeAmount(deleted.FinalFields.Amount, language)}
            <small>XRP</small>
          </b>
          was delivered to
          <Account account={deleted.FinalFields.Destination} />
        </Trans>
        {deleted.FinalFields.Destination === data.tx.Account && (
          <span>
            {' '}
            (
            <b>
              {normalizeAmount(
                deleted.FinalFields.Amount - data.tx.Fee,
                language,
              )}
              <small>XRP</small>
            </b>{' '}
            {t('escrow_after_transaction_cost')})
          </span>
        )}
      </div>
      <Trans key="line3" i18nKey="escrow_created_by_desc">
        The escrow was created by
        <Account account={data.tx.Owner} />
        with transaction
        <Link
          className="hash"
          to={`/transactions/${deleted.FinalFields.PreviousTxnID}`}
        >
          {`${deleted.FinalFields.PreviousTxnID.substr(0, 6)}...`}
        </Link>
      </Trans>
      {data.tx.Fulfillment && (
        <div key="line4">
          {t('escrow_finish_fullfillment_desc')}
          <span className="fulfillment"> {data.tx.Fulfillment}</span>
        </div>
      )}
    </>
  )
}
export { Description }
