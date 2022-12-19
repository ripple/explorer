import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { localizeDate, BREAKPOINTS } from '../shared/utils'
import Simple from './Simple'
import '../shared/css/simpleTab.scss'
import './simpleTab.scss'
import successIcon from '../shared/images/success.png'
import { SimpleRow } from '../shared/components/Transaction/SimpleRow'
import { useLanguage } from '../shared/hooks'
import { ValidatorSupplemented } from '../shared/vhsTypes'

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

export interface SimpleTabProps {
  data: ValidatorSupplemented
  width: number
}

const SimpleTab = ({ data, width }: SimpleTabProps) => {
  const language = useLanguage()
  const { t } = useTranslation()

  const renderRowIndex = ({
    last_ledger_time: lastLedgerTime,
    current_index: ledgerIndex,
    unl,
  }: ValidatorSupplemented) => {
    const unlRow = unl && (
      <SimpleRow label="UNL" className="unl yes">
        <img src={successIcon} alt={unl.toString()} /> {unl}
      </SimpleRow>
    )
    return (
      <>
        {lastLedgerTime && (
          <SimpleRow
            label={`Last Ledger ${t('formatted_date', {
              timeZone: TIME_ZONE,
            })}`}
            data-test="ledger-time"
          >
            {localizeDate(new Date(lastLedgerTime), language, DATE_OPTIONS)}
          </SimpleRow>
        )}
        <SimpleRow label={`Last ${t('ledger_index')}`} data-test="ledger-index">
          <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
        </SimpleRow>
        {unlRow}
      </>
    )
  }

  const rowIndex = renderRowIndex(data)

  return (
    <div className="simple-body simple-body-validator">
      <div className="rows">
        <Simple data={data} />
        {width < BREAKPOINTS.landscape && rowIndex}
      </div>
      {width >= BREAKPOINTS.landscape && (
        <div className="index">{rowIndex}</div>
      )}
      <div className="clear" />
    </div>
  )
}

// TODO: Remove in the next PR
SimpleTab.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
      PropTypes.bool,
    ]),
  ).isRequired,
}

export default SimpleTab
