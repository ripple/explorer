import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import InfoIcon from '../shared/images/info.svg'
import './nomatch.scss'

const NoMatch = (props) => {
  const { t } = useTranslation()
  const { title, hints, isError, warning } = props

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${t(title)}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: `${title} -- ${hints.join(', ')}`,
      path: '/404',
    })
  }, [hints, title, t])

  const notFound = title.includes('not_found')
  const hintMsg = hints.map((hint) => (
    <div className="hint" key={hint}>
      {t(hint)}
    </div>
  ))
  const derivedWarning = warning ?? (notFound && t('not_found'))

  return (
    <div className="no-match">
      {isError && <div className="uh-oh">{t('uh_oh')}</div>}
      <div className="title">{t(title)}</div>
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

NoMatch.propTypes = {
  /** The i18n key to use for the title.  If the key contains "not_found" it is treated as a 404 type page */
  title: PropTypes.string,
  /** An array of i18n keys to use for hints */
  hints: PropTypes.arrayOf(PropTypes.string),
  /** Treat the message as an error. Adds "Uh Oh". */
  isError: PropTypes.bool,
  /** Custom warning message to display next to info icon */
  warning: PropTypes.string,
}

NoMatch.defaultProps = {
  title: 'not_found_default_title',
  hints: ['not_found_check_url'],
  isError: true,
  warning: undefined,
}

export default NoMatch
