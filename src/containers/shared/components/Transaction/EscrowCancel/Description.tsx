import { useTranslation, Trans } from 'react-i18next'
import type { EscrowCancel } from 'xrpl'
import { findNode } from '../../../transactionUtils'
import { Account } from '../../Account'
import {
  TransactionDescriptionComponent,
  TransactionDescriptionProps,
} from '../types'
import { TRANSACTION_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'
import {
  formatAmount,
  isXRP,
} from '../../../../../rippled/lib/txSummary/formatAmount'
import { Amount } from '../../Amount'

const Description: TransactionDescriptionComponent = (
  props: TransactionDescriptionProps<EscrowCancel>,
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
        {t('escrow_cancellation_desc')} <Account account={data.tx.Account} />
      </div>
      <div data-testid="amount-line">
        <Trans i18nKey="escrow_cancellation_desc_2">
          The escrowed amount of
          <b>
            <Amount value={formatAmount(deleted.FinalFields.Amount)} />
          </b>
          was returned to
          <Account account={data.tx.Owner} />
        </Trans>
        {isXRP(deleted.FinalFields.Amount) &&
          data.tx.Owner === data.tx.Account && (
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
    </>
  )
}
export { Description }
