import { Trans, useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionTableDetailProps } from '../types'
import SocketContext from '../../../SocketContext'
import { getBatchTxStatus } from './utils'
import { RouteLink } from '../../../routing'
import { TRANSACTION_ROUTE } from '../../../../App/routes'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { batchTransactions } = tx
  const rippledSocket = useContext(SocketContext)

  const { data: updatedBatchTransactions = [] } = useQuery(
    ['batchTxStatus', batchTransactions],
    () => getBatchTxStatus(rippledSocket, batchTransactions),
    {
      enabled: !!batchTransactions.length && !!rippledSocket,
    },
  )

  function renderTxList() {
    const successfulTxs = updatedBatchTransactions.filter(
      (transaction) => transaction.successful,
    )

    return successfulTxs.map((transaction, index) => (
      <span key={transaction.hash}>
        <RouteLink
          className="hash"
          to={TRANSACTION_ROUTE}
          params={{ identifier: transaction.hash }}
        >
          {transaction.hash}
        </RouteLink>
        {index < successfulTxs.length - 1 && ', '}
      </span>
    ))
  }

  return (
    <>
      <div>
        <Trans
          i18nKey="batch_table_detail_count"
          components={{
            BatchLabel: <span className="label">{t('batch')}</span>,
          }}
          values={{
            batch_count: batchTransactions.length,
          }}
        />
      </div>
      <div>
        <Trans
          i18nKey="batch_table_detail_list"
          components={{
            TxList: <>{renderTxList()}</>,
          }}
        />
      </div>
    </>
  )
}
