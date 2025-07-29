import { useTranslation, Trans } from 'react-i18next'
import type { EscrowFinish } from 'xrpl'
import { findNode } from '../../../transactionUtils'
import { Account } from '../../Account'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'
import { RouteLink } from '../../../routing'
import { TRANSACTION_ROUTE } from '../../../../App/routes'
import { Amount } from '../../Amount'
import {
  formatAmount,
  isXRP,
} from '../../../../../rippled/lib/txSummary/formatAmount'

const Description: TransactionDescriptionComponent = (
  props: TransactionDescriptionProps<EscrowFinish>,
) => {
  const { t } = useTranslation()
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
      <div data-testid="amount-line">
        <Trans i18nKey="escrow_completion_desc_2">
          The escrowed amount of
          <b>
            <Amount value={formatAmount(deleted.FinalFields.Amount)} />
          </b>
          was delivered to
          <Account account={deleted.FinalFields.Destination} />
        </Trans>
        {isXRP(deleted.FinalFields.Amount) &&
          deleted.FinalFields.Destination === data.tx.Account && (
            <span>
              {' '}
              (
              <b>
                <Amount
                  value={formatAmount(
                    deleted.FinalFields.Amount -
                      parseInt(data.tx.Fee || '0', 10),
                  )}
                />
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
          {`${deleted.FinalFields.PreviousTxnID.substring(0, 6)}...`}
        </RouteLink>
      </Trans>
      {data.tx.Fulfillment && (
        <div>
          {t('escrow_finish_fulfillment_desc')}
          <span className="fulfillment"> {data.tx.Fulfillment}</span>
        </div>
      )}
    </>
  )
}
export { Description }
