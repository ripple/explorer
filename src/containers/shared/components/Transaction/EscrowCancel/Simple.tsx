import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { TRANSACTION_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { data } = props
  const { owner, sequence, tx, destination, amount, condition } =
    data.instructions
  return (
    <>
      <SimpleRow label={t('cancel_escrow')} data-test="escrow-cancel">
        <Account account={owner} />
        {` - ${sequence}`}
      </SimpleRow>
      {condition && (
        <SimpleRow label={t('escrow_condition_short')}>{condition}</SimpleRow>
      )}
      {amount.amount && (
        <SimpleRow label={t('escrow_amount')} data-test="escrow-amount">
          <Amount value={amount} />
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow
          label={t('escrow_destination')}
          data-test="escrow-destination"
        >
          <Account account={destination} />
        </SimpleRow>
      )}
      {tx && (
        <SimpleRow
          label={t('escrow_transaction')}
          className="tx"
          data-test="escrow-cancel-tx"
        >
          <RouteLink
            className="hash"
            to={TRANSACTION_ROUTE}
            params={{ identifier: tx }}
          >
            {tx}
          </RouteLink>
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
