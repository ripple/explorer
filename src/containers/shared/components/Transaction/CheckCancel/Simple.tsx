import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { parser } from './parser'
import { shortenCheckID, shortenTxHash } from '../../../utils'
import { RouteLink } from '../../../routing'
import { TRANSACTION_ROUTE } from '../../../../App/routes'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<ReturnType<typeof parser>>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { CheckID: checkID, checkTx } = data.instructions

  return (
    <>
      <SimpleRow label={t('check_id')} data-testid="check-id">
        {shortenCheckID(checkID)}
      </SimpleRow>
      {checkTx && (
        <SimpleRow
          label={t('check_transaction')}
          className="tx"
          data-testid="check-tx"
        >
          <RouteLink
            className="hash"
            to={TRANSACTION_ROUTE}
            params={{ identifier: checkTx }}
          >
            {shortenTxHash(checkTx)}
          </RouteLink>
        </SimpleRow>
      )}
    </>
  )
}
