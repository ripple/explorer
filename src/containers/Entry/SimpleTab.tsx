import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../shared/components/Account'
import { Sequence } from '../shared/components/Sequence'
import { Simple } from './Simple'

import { useLanguage } from '../shared/hooks'
import { RouteLink } from '../shared/routing'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import '../shared/css/simpleTab.scss'
import './simpleTab.scss'
import { LEDGER_ROUTE } from '../App/routes'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

export const SimpleTab: FC<{ data: any; width: number }> = ({
  data,
  width,
}) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderRowIndex = (
    time,
    ledgerIndex,
    fee,
    account,
    sequence,
    ticketSequence,
    isHook,
  ) => (
    <>
      <SimpleRow
        label={t('formatted_date', { timeZone: TIME_ZONE })}
        data-test="tx-date"
      >
        {time}
      </SimpleRow>
      <SimpleRow label={t('ledger_index')} data-test="ledger-index">
        <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledgerIndex }}>
          {ledgerIndex}
        </RouteLink>
      </SimpleRow>
      {account && (
        <SimpleRow label={t('account')} data-test="account">
          <Account account={account} />
        </SimpleRow>
      )}
      <SimpleRow label={t('sequence_number')} data-test="sequence">
        <Sequence
          sequence={sequence}
          ticketSequence={ticketSequence}
          account={account}
          isHook={isHook}
        />
      </SimpleRow>
      <SimpleRow label={t('transaction_cost')} data-test="tx-cost">
        {fee}
      </SimpleRow>
    </>
  )

  const { node } = data
  // const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  // const time = localizeDate(new Date(node.date), language, DATE_OPTIONS)
  // const ledgerIndex = node.ledger_index
  // const fee = node.tx.Fee
  //   ? localizeNumber(
  //       Number.parseFloat(node.tx.Fee) / XRP_BASE,
  //       language,
  //       numberOptions,
  //     )
  //   : 0

  // const rowIndex = renderRowIndex(
  //   time,
  //   ledgerIndex,
  //   fee,
  //   node.tx.Account,
  //   node.tx.Sequence,
  //   node.tx.TicketSequence,
  //   !!node.tx.EmitDetails,
  // )

  return (
    <div className="simple-body simple-body-tx">
      <div className="rows">
        <Simple type={node.LedgerEntryType} data={data} />
        {/* {width < BREAKPOINTS.landscape && rowIndex} */}
      </div>
      {/* {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )} */}
      <div className="clear" />
    </div>
  )
}
