import React from 'react'
import PropTypes from 'prop-types'
import Loader from '../shared/components/Loader'
import { localizeDate } from '../shared/utils'
import './historyTab.scss'

const RecordItem = (t, language, record) => (
  <li key={record.date} className="history-li">
    <div className="col-date">
      <div className="full-date">
        {localizeDate(new Date(record.date), language, {
          dateStyle: 'full',
        })}
      </div>
      <div className="abbrev-date">
        {localizeDate(new Date(record.date), language, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </div>
    </div>
    <div className="col-chain">{record.chain}</div>
    <div className={`col-score ${record.score < 1 ? 'td-missed' : ''}`}>
      {record.score}
      {record.incomplete && <span>*</span>}
    </div>
    <div className="col-total">{record.total}</div>
    <div className={`col-missed ${record.missed > 0 ? 'td-missed' : ''}`}>
      {record.missed}
    </div>
  </li>
)

const HistoryTab = (props) => {
  // TODO: add loading symbol when waiting on the reports
  const { t, reports, language } = props

  return (
    <div className="history-table">
      <ol className="history-reports">
        <li className="history-li-header">
          <div className="col-date">Date</div>
          <div className="col-chain">Chain</div>
          <div className="col-score">Score</div>
          <div className="col-total">Total</div>
          <div className="col-missed">Missed</div>
        </li>

        {reports ? (
          reports.map((report) => RecordItem(t, language, report))
        ) : (
          <Loader />
        )}
      </ol>
    </div>
  )
}

HistoryTab.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.date,
      chain: PropTypes.string,
      score: PropTypes.string,
      total: PropTypes.string,
      missed: PropTypes.string,
      incomplete: PropTypes.bool,
    }),
  ).isRequired,
}

export default HistoryTab
