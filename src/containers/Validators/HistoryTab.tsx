import React from 'react'
import Loader from '../shared/components/Loader'
import { localizeDate } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import './historyTab.scss'

export interface Report {
  date: string
  chain: string
  score: string
  total: string
  missed: string
  incomplete: boolean
}

const ReportRow = ({ report }: { report: Report }) => {
  const language = useLanguage()

  return (
    <tr key={report.date}>
      <td className="col-date">
        <div className="full-date">
          {localizeDate(new Date(report.date), language, {
            dateStyle: 'full',
          })}
        </div>
        <div className="abbrev-date">
          {localizeDate(new Date(report.date), language, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </div>
      </td>
      <td className="col-chain">{report.chain}</td>
      <td
        className={`col-score ${
          parseFloat(report.score) < 1 ? 'td-missed' : ''
        }`}
      >
        {report.score}
        {report.incomplete && <span>*</span>}
      </td>
      <td className="col-total">{report.total}</td>
      <td
        className={`col-missed ${
          parseFloat(report.missed) > 0 ? 'td-missed' : ''
        }`}
      >
        {report.missed}
      </td>
    </tr>
  )
}

export interface HistoryTabProps {
  reports?: Report[]
}

export const HistoryTab = ({ reports }: HistoryTabProps) => (
  <table className="history-table basic">
    <tr>
      <th className="col-date">Date</th>
      <th className="col-chain">Chain</th>
      <th className="col-score">Score</th>
      <th className="col-total">Total</th>
      <th className="col-missed">Missed</th>
    </tr>
    <tbody>
      {reports ? (
        reports.map((report) => <ReportRow report={report} />)
      ) : (
        <tr>
          <td colSpan={5}>
            <Loader />
          </td>
        </tr>
      )}
    </tbody>
  </table>
)
