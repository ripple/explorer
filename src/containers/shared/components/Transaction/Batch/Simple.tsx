import { Trans, useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { SimpleGroup } from '../SimpleGroup'
import { Account } from '../../Account'
import { TRANSACTION_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'
import SocketContext from '../../../SocketContext'
import { getBatchTxStatus } from './utils'
import '../../../css/txstatus.scss'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { batchTransactions } = data.instructions

  const { data: updatedBatchTransactions = [] } = useQuery(
    ['batchTxStatus', batchTransactions],
    () => getBatchTxStatus(rippledSocket, batchTransactions),
    {
      enabled: !!batchTransactions.length && !!rippledSocket,
    },
  )

  const renderFailedStatus = (status) => {
    if (status === 'not validated') {
      return t('not-validated')
    }

    return <span className="failed">{status}</span>
  }

  const renderBatchTransaction = (tx) => (
    <SimpleGroup title={t('inner_transaction')} key={tx.Account}>
      <SimpleRow label={t('account')} data-testid="tx-account">
        <Account account={tx.Account} />
      </SimpleRow>
      <SimpleRow label={t('hash')} data-testid="tx-hash">
        {tx.successful || tx.status !== 'not validated' ? (
          <RouteLink
            className="hash"
            to={TRANSACTION_ROUTE}
            params={{ identifier: tx.hash }}
          >
            {tx.hash}
          </RouteLink>
        ) : (
          tx.hash
        )}
      </SimpleRow>
      <SimpleRow label={t('status')} data-testid="tx-status">
        {tx.successful ? (
          t('successful')
        ) : (
          <Trans
            i18nKey="failed"
            components={{
              Status: (
                <span className="tx-result fail">
                  {renderFailedStatus(tx.status)}
                </span>
              ),
            }}
          />
        )}
      </SimpleRow>
    </SimpleGroup>
  )
  return <>{updatedBatchTransactions.map(renderBatchTransaction)}</>
}
