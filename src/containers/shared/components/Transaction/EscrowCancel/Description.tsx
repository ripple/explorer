import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { findNode, normalizeAmount } from '../../../transactionUtils'
import { Account } from '../../Account'
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
  const deleted: any = findNode(data.meta, 'DeletedNode', 'Escrow')
  if (deleted == null) {
    return null
  }
  return (
    <>
      <div>
        {t('escrow_cancellation_desc')} <Account account={data.tx.Account} />
      </div>
      <div>
        <Trans i18nKey="escrow_cancellation_desc_2">
          The escrowed amount of
          <b>
            {normalizeAmount(deleted.FinalFields.Amount, language)}
            <small>XRP</small>
          </b>
          was returned to
          <Account account={data.tx.Owner} />
        </Trans>
        {data.tx.Owner === data.tx.Account && (
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
      <Trans i18nKey="escrow_created_by_desc">
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
    </>
  )
}
export { Description }
