import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizeDate, localizeNumber, BREAKPOINTS } from '../shared/utils'
import { Account } from '../shared/components/Account'
import Sequence from '../shared/components/Sequence'
import { Simple } from './Simple'

import { useLanguage } from '../shared/hooks'
import { CURRENCY_OPTIONS, XRP_BASE } from '../shared/transactionUtils'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import '../shared/css/simpleTab.scss'
import './simpleTab.scss'

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

function SimpleTab({ data, width }) {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderRowIndex = (
    time,
    ledgerIndex,
    fee,
    account,
    sequence,
    ticketSequence,
  ) => (
    <>
      <SimpleRow
        label={t('formatted_date', { timeZone: TIME_ZONE })}
        data-test="tx-date"
      >
        {time}
      </SimpleRow>
      <SimpleRow label={t('ledger_index')} data-test="ledger-index">
        <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
      </SimpleRow>
      <SimpleRow label={t('account')} data-test="account">
        <Account account={account} />
      </SimpleRow>
      <SimpleRow label={t('sequence_number')} data-test="sequence">
        <Sequence
          sequence={sequence}
          ticketSequence={ticketSequence}
          account={account}
        />
      </SimpleRow>
      <SimpleRow label={t('transaction_cost')} data-test="tx-cost">
        {fee}
      </SimpleRow>
    </>
  )

  const { raw } = data
  const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
  const time = localizeDate(new Date(raw.date), language, DATE_OPTIONS)
  const ledgerIndex = raw.ledger_index
  const fee = raw.tx.Fee
    ? localizeNumber(
        Number.parseFloat(raw.tx.Fee) / XRP_BASE,
        language,
        numberOptions,
      )
    : 0

  const rowIndex = renderRowIndex(
    time,
    ledgerIndex,
    fee,
    raw.tx.Account,
    raw.tx.Sequence,
    raw.tx.TicketSequence,
  )

  return (
    <div className="simple-body simple-body-tx">
      <div className="rows">
        <Simple type={raw.tx.TransactionType} data={data.summary} />
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
      <div className="clear" />
    </div>
  )
}

SimpleTab.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
}

export { SimpleTab }
