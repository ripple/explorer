import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

import { PayStringHeader } from './PayStringHeader'
import PayStringMappingsTable from './PayStringMappingsTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'

const PayString = ({ error }) => {
  const { id: accountId = '' } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 24)}${
      accountId.length > 24 ? '...' : ''
    }`
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'PayStrings',
      path: '/paystrings',
    })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  const renderError = () => (
    <div className="paystring-page">
      <NoMatch title="resolve_paystring_failed" hints={['not_your_fault']} />
    </div>
  )

  return error ? (
    renderError(error)
  ) : (
    <div className="paystring-page">
      {accountId && <PayStringHeader accountId={accountId} />}
      {accountId && <PayStringMappingsTable accountId={accountId} />}
      {!accountId && (
        <NoMatch
          title="paystring_empty_title"
          hints={['paystring_empty_hint']}
          isError={false}
        />
      )}
    </div>
  )
}

PayString.propTypes = {
  error: PropTypes.number,
}

PayString.defaultProps = {
  error: null,
}

export default connect((state) => ({
  error: state.payStringData.error,
}))(PayString)
