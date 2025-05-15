import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { RouteLink } from '../../../routing'
import { TRANSACTION_ROUTE } from '../../../../App/routes'

const Simple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    owner,
    sequence,
    previousTx,
    destination,
    amount = {},
    condition,
    fulfillment,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('finish_escrow')} data-testid="escrow-finish">
        <Account account={owner} />
        {` - ${sequence}`}
      </SimpleRow>
      {condition && (
        <SimpleRow label={t('escrow_condition_short')}>
          <Account account={condition} />
        </SimpleRow>
      )}
      {fulfillment && (
        <SimpleRow
          label={t('escrow_fulfillment')}
          data-testid="escrow-fullfillments"
        >
          {fulfillment}
        </SimpleRow>
      )}
      {amount.amount && (
        <SimpleRow label={t('escrow_amount')} data-testid="escrow-amount">
          <Amount value={amount} />
        </SimpleRow>
      )}
      {destination && (
        <SimpleRow label={t('escrow_destination')}>
          <Account account={destination} />
        </SimpleRow>
      )}
      {previousTx && (
        <SimpleRow
          label={t('escrow_transaction')}
          className="tx"
          data-testid="escrow-tx"
        >
          <RouteLink
            className="hash"
            to={TRANSACTION_ROUTE}
            params={{ identifier: previousTx }}
          >
            {previousTx}
          </RouteLink>
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
