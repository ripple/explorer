import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { localizeDate, localizeNumber, BREAKPOINTS } from '../shared/utils'
import { Account } from '../shared/components/Account'
import { Sequence } from '../shared/components/Sequence'
import { Simple } from './Simple'

import { useLanguage } from '../shared/hooks'
import { RouteLink } from '../shared/routing'
import { CURRENCY_OPTIONS, XRP_BASE } from '../shared/transactionUtils'
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
        data-testid="tx-date"
      >
        {time}
      </SimpleRow>
      <SimpleRow label={t('ledger_index')} data-testid="ledger-index">
        <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledgerIndex }}>
          {ledgerIndex}
        </RouteLink>
      </SimpleRow>
      {account && (
        <SimpleRow label={t('account')} data-testid="tx-account">
          <Account account={account} />
        </SimpleRow>
      )}
      <SimpleRow label={t('sequence_number')} data-testid="sequence">
        <Sequence
          sequence={sequence}
          ticketSequence={ticketSequence}
          account={account}
          isHook={isHook}
        />
      </SimpleRow>
      <SimpleRow label={t('transaction_cost')} data-testid="tx-cost">
        {fee}
      </SimpleRow>
    </>
  )

  const { processed } = data
  const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  const time = localizeDate(new Date(processed.date), language, DATE_OPTIONS)
  const ledgerIndex = processed.ledger_index
  const fee = processed.tx.Fee
    ? localizeNumber(
        Number.parseFloat(processed.tx.Fee) / XRP_BASE,
        language,
        numberOptions,
      )
    : 0

  const rowIndex = renderRowIndex(
    time,
    ledgerIndex,
    fee,
    processed.tx.Account,
    processed.tx.Sequence,
    processed.tx.TicketSequence,
    !!processed.tx.EmitDetails,
  )

  return (
    <div className="simple-body simple-body-tx" data-testid="simple-body">
      <div className="rows">
        <Simple type={processed.tx.TransactionType} data={data.summary} />
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
      <div className="clear" />
    </div>
  )
}
