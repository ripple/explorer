import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../shared/components/Account'
import { Simple } from './Simple'

import { RouteLink } from '../shared/routing'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import '../shared/css/simpleTab.scss'
import './simpleTab.scss'
import { LEDGER_ROUTE, TRANSACTION_ROUTE } from '../App/routes'
import { BREAKPOINTS } from '../shared/utils'

export const SimpleTab: FC<{ data: any; width: number }> = ({
  data,
  width,
}) => {
  const { t } = useTranslation()

  const renderRowIndex = (owner, prevLedgerIndex, prevTx) => (
    <>
      {owner && (
        <SimpleRow label={t('owner')} data-test="owner">
          <Account account={owner} />
        </SimpleRow>
      )}
      <SimpleRow label={t('prev_ledger_index')} data-test="prev-ledger-index">
        <RouteLink to={LEDGER_ROUTE} params={{ identifier: prevLedgerIndex }}>
          {prevLedgerIndex}
        </RouteLink>
      </SimpleRow>
      <SimpleRow label={t('prev_tx_id')} data-test="prev-tx">
        <RouteLink to={TRANSACTION_ROUTE} params={{ identifier: prevTx }}>
          {prevTx}
        </RouteLink>
      </SimpleRow>
    </>
  )

  const rowIndex = renderRowIndex(
    data?.node?.Owner ?? data?.node?.Account,
    data?.node?.PreviousTxnLgrSeq,
    data?.node?.PreviousTxnID,
  )

  return (
    <div className="simple-body simple-body-tx">
      <div className="rows">
        <Simple type={data?.node.LedgerEntryType} data={data} />
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
      <div className="clear" />
    </div>
  )
}
