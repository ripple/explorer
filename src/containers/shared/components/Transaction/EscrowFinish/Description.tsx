import { useTranslation, Trans } from 'react-i18next'
import type { EscrowFinish } from 'xrpl'
import { normalizeAmount, findNode } from '../../../transactionUtils'
import { Account } from '../../Account'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'
import { RouteLink } from '../../../routing'
import { TRANSACTION_ROUTE } from '../../../../App/routes'

const Description: TransactionDescriptionComponent = (
  props: TransactionDescriptionProps<EscrowFinish>,
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
        {t('escrow_completion_desc')} <Account account={data.tx.Account} />
      </div>
      <div>
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
                deleted.FinalFields.Amount - parseInt(data.tx.Fee || '0', 10),
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
        <RouteLink
          className="hash"
          to={TRANSACTION_ROUTE}
          params={{ identifier: deleted.FinalFields.PreviousTxnID }}
        >
          {`${deleted.FinalFields.PreviousTxnID.substr(0, 6)}...`}
        </RouteLink>
      </Trans>
      {data.tx.Fulfillment && (
        <div>
          {t('escrow_finish_fullfillment_desc')}
          <span className="fulfillment"> {data.tx.Fulfillment}</span>
        </div>
      )}
    </>
  )
}
export { Description }
