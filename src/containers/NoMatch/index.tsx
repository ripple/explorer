import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SocketContext from '../shared/SocketContext'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import InfoIcon from '../shared/images/info.svg'
import './nomatch.scss'

export interface NoMatchProps {
  /** The i18n key to use for the title.  If the key contains "not_found" it is treated as a 404 type page */
  title?: string
  /** An array of i18n keys to use for hints */
  hints?: string[]
  /** Treat the message as an error. Adds "Uh Oh". */
  isError?: boolean
  /** Custom warning message to display next to info icon */
  warning?: string
}

/**
 * Provides messaging for not found. I18n values have access to XrplClient's ConnectionState through the variable `connection`.
 * @constructor
 */
const NoMatch = ({
  title = 'not_found_default_title',
  hints = ['not_found_check_url'],
  isError = true,
  warning = undefined,
}: NoMatchProps) => {
  const { t } = useTranslation()
  const socket = useContext(SocketContext)
  const values = { connection: socket?.getState() }

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${t(title as any)}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: `${title} -- ${hints.join(', ')}`,
      path: '/404',
    })
  }, [hints, title, t])

  const notFound = title.includes('not_found')
  const hintMsg = hints.map((hint) => (
    <div className="hint" key={hint}>
      {t(hint as any, values)}
    </div>
  ))
  const derivedWarning = warning ?? (notFound && t('not_found'))

  return (
    <div className="no-match">
      {isError && <div className="uh-oh">{t('uh_oh')}</div>}
      <div className="title">{t(title as any, values)}</div>
      {hintMsg}
      {(derivedWarning || isError) && (
        <div className="warning">
          <InfoIcon title={derivedWarning} />
          &nbsp;
          <span>{derivedWarning}</span>
        </div>
      )}
    </div>
  )
}

export default NoMatch
