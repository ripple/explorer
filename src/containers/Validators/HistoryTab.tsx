import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import { localizeDate } from '../shared/utils'
import { useLanguage } from '../shared/hooks'
import './historyTab.scss'
import { ValidatorReport } from '../shared/vhsTypes'

const DEFAULT_HISTORY_TIMEZONE = 'UTC'

const ReportRow = ({ report }: { report: ValidatorReport }) => {
  const language = useLanguage()
  return (
    <tr key={report.date}>
      <td className="col-date">
        <div className="full-date">
          {localizeDate(new Date(report.date), language, {
            dateStyle: 'full',
            timeZone: DEFAULT_HISTORY_TIMEZONE,
          })}
        </div>
        <div className="abbrev-date">
          {localizeDate(new Date(report.date), language, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZone: DEFAULT_HISTORY_TIMEZONE,
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
  reports?: ValidatorReport[]
}

export const HistoryTab = ({ reports }: HistoryTabProps) => {
  const { t } = useTranslation()

  return (
    <table className="history-table basic">
      <thead>
        <tr>
          <th className="col-date">{t('validator_history.date')}</th>
          <th className="col-chain">{t('validator_history.chain')}</th>
          <th className="col-score">{t('validator_history.score')}</th>
          <th className="col-total">{t('total')}</th>
          <th className="col-missed">{t('validator_history.missed')}</th>
        </tr>
      </thead>
      <tbody>
        {reports ? (
          reports.map((report) => (
            <ReportRow report={report} key={report.date} />
          ))
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
}
