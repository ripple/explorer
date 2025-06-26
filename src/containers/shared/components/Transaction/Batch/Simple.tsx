import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { SimpleGroup } from '../SimpleGroup'
import { Account } from '../../Account'
import { TRANSACTION_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'
import SocketContext from '../../../SocketContext'
import { LedgerSummary } from '../../../../Ledgers/types'
import { getLedger } from '../../../../../rippled'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { batchTransactions, batchSigners, ledgerIndex } = data.instructions

  async function getAppliedBatchTx() {
    const ledgerData: LedgerSummary = await getLedger(
      ledgerIndex,
      rippledSocket,
    )

    return ledgerData.transactions
      .filter((tx) =>
        batchTransactions.some(
          (b) =>
            b.Account === tx.account &&
            b.TransactionType === tx.type &&
            b.Sequence === tx.sequence,
        ),
      )
      .map((tx) => ({
        account: tx.account,
        sequence: tx.sequence,
        type: tx.type,
        hash: tx.hash,
      }))
  }

  const { data: appliedTx = [] } = useQuery(
    ['appliedTx', ledgerIndex, batchTransactions],
    async () => getAppliedBatchTx(),
    {
      enabled: !!ledgerIndex && !!batchTransactions?.length && !!rippledSocket,
    },
  )

  const renderBatchTransaction = (tx) => (
    <SimpleGroup title={t('applied_transaction')}>
      <SimpleRow label={t('account')} data-testid="tx-account">
        <Account account={tx.account} />
      </SimpleRow>
      <SimpleRow label={t('transaction_type')} data-testid="tx-type">
        {tx.type}
      </SimpleRow>
      <SimpleRow label={t('sequence_number')} data-testid="tx-sequence">
        {tx.sequence}
      </SimpleRow>
      <SimpleRow label={t('hash')} data-testid="tx-hash">
        <RouteLink
          className="hash"
          to={TRANSACTION_ROUTE}
          params={{ identifier: tx.hash }}
        >
          {`${tx.hash.slice(0, 6)}...`}
        </RouteLink>
      </SimpleRow>
    </SimpleGroup>
  )
  return (
    <>
      <SimpleRow
        label={t('signers')}
        data-testid="signers"
        className="flex-column"
      >
        {batchSigners.map((account) => (
          <Account account={account.Account} />
        ))}
      </SimpleRow>
      <SimpleRow label={t('batch_transaction_count')} data-testid="inner-count">
        {batchTransactions.length}
      </SimpleRow>
      <SimpleRow
        label={t('applied_transaction_count')}
        data-testid="applied-count"
      >
        {appliedTx.length}
      </SimpleRow>
      {appliedTx.map(renderBatchTransaction)}
    </>
  )
}
