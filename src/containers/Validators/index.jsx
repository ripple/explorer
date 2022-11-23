import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { withTranslation, useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import { Tabs } from '../shared/components/Tabs'
import { analytics, ANALYTIC_TYPES, NOT_FOUND } from '../shared/utils'
import { loadValidator } from './actions'
import SimpleTab from './SimpleTab'
import { HistoryTab } from './HistoryTab'
import './validator.scss'
import SocketContext from '../shared/SocketContext'

const ERROR_MESSAGES = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'validator_not_found',
  hints: ['check_validator_key'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const Validator = (props) => {
  const [reports, setReports] = useState({})
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { actions, match, data } = props
  const { identifier = '', tab = 'details' } = match.params

  let short = ''
  if (data.domain) {
    short = data.domain
  } else if (data.master_key) {
    short = `${data.master_key.substr(0, 8)}...`
  } else if (data.signing_key) {
    short = `${data.signing_key.substr(0, 8)}...`
  }
  document.title = `Validator ${short} | ${t('xrpl_explorer')}`

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Validator',
      path: `/validators/:identifier/${tab}`,
    })
  }, [tab])

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DATA_URL}/validator/${identifier}/reports`)
      .then((resp) => resp.data.reports)
      .then((vhsReports) => {
        const sortedValidatorReports = vhsReports.sort((a, b) =>
          a.date > b.date ? -1 : 1,
        )
        setReports(sortedValidatorReports)
      })
  }, [identifier])

  useEffect(() => {
    if (
      identifier &&
      identifier !== data.master_key &&
      identifier !== data.signing_key
    ) {
      actions.loadValidator(identifier, rippledSocket)
    }
  }, [actions, data.master_key, data.signing_key, identifier, rippledSocket])

  function renderSummary() {
    let name = 'Unknown Validator'
    if (data.domain) {
      name = `Validator / Domain: ${data.domain}`
    } else if (data.master_key) {
      name = `Validator / Public Key: ${data.master_key.substr(0, 8)}...`
    } else if (data.signing_key) {
      name = `Validator / Ephemeral Key: ${data.signing_key.substr(0, 8)}...`
    }

    let subtitle = 'UNKNOWN KEY'
    if (data.master_key) {
      subtitle = `MASTER KEY: ${data.master_key}`
    } else if (data.signing_key) {
      subtitle = `SIGNING KEY: ${data.signing_key}`
    }

    return (
      <div className="summary">
        <div className="type">{name}</div>
        <div className="hash" title={subtitle}>
          {subtitle}
        </div>
      </div>
    )
  }

  function renderTabs() {
    const { path = '/' } = match
    const tabs = ['details', 'history']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderValidator() {
    const { width } = props
    let body

    switch (tab) {
      case 'history':
        body = <HistoryTab reports={reports} />
        break
      default:
        body = <SimpleTab t={t} data={data} width={width} />
        break
    }

    return (
      <>
        {renderSummary()}
        {renderTabs()}
        <div className="tab-body">{body}</div>
      </>
    )
  }

  const { loading } = props
  const loader = loading ? <Loader className="show" /> : <Loader />
  let body

  if (data.error) {
    const message = getErrorMessage(data.error)
    body = <NoMatch title={message.title} hints={message.hints} />
  } else if (data.master_key || data.signing_key) {
    body = renderValidator()
  } else if (!loading) {
    body = (
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <h2>Could not load validator</h2>
      </div>
    )
  }

  return (
    <div className="validator">
      {loader}
      {body}
    </div>
  )
}

Validator.contextType = SocketContext

Validator.propTypes = {
  loading: PropTypes.bool.isRequired,
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
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      identifier: PropTypes.string,
      tab: PropTypes.string,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadValidator: PropTypes.func,
  }).isRequired,
}

export default connect(
  (state) => ({
    loading: state.validator.loading, // refers to state object in rootReducer.js
    language: state.app.language,
    data: state.validator.data,
    width: state.app.width,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadValidator,
      },
      dispatch,
    ),
  }),
)(withTranslation()(Validator))
