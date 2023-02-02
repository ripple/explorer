import { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import NoMatch from '../NoMatch'
import Loader from '../shared/components/Loader'
import LeftArrow from '../shared/images/ic_left_arrow.svg'
import RightArrow from '../shared/images/ic_right_arrow.svg'
import { loadLedger } from './actions'
import {
  localizeDate,
  localizeNumber,
  formatPrice,
  NOT_FOUND,
  BAD_REQUEST,
  analytics,
  ANALYTIC_TYPES,
} from '../shared/utils'
import './ledger.scss'
import SocketContext from '../shared/SocketContext'
import { LedgerTransactionTable } from './LedgerTransactionTable'

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

const ERROR_MESSAGES = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'ledger_not_found',
  hints: ['check_ledger_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_ledger_id',
  hints: ['check_ledger_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

class Ledger extends Component {
  componentDidMount() {
    const { t, actions, match, data } = this.props
    const rippledSocket = this.context
    const { identifier = '' } = match.params
    document.title = `${t('xrpl_explorer')} | ${t('ledger')} ${identifier}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Ledger',
      path: '/ledgers/:id',
    })
    if (Number(identifier) !== data.ledger_index) {
      actions.loadLedger(identifier, rippledSocket)
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { actions, match } = nextProps
    const rippledSocket = this.context
    const { match: prevMatch } = this.props
    const { identifier = '' } = match.params
    const { identifier: prev } = prevMatch.params

    if (identifier !== prev) {
      actions.loadLedger(identifier, rippledSocket)
    }
  }

  renderNav() {
    const { t, language, data } = this.props
    const { ledger_index: LedgerIndex, ledger_hash: LedgerHash } = data
    const previousIndex = LedgerIndex - 1
    const nextIndex = LedgerIndex + 1
    const date = new Date(data.close_time)
    return (
      <div className="ledger-header">
        <div className="ledger-nav">
          <Link to={`/ledgers/${previousIndex}`}>
            <div className="previous">
              <LeftArrow alt="previous ledger" />
              {previousIndex}
            </div>
          </Link>
          <Link to={`/ledgers/${nextIndex}`}>
            <div className="next">
              {nextIndex}
              <RightArrow alt="next ledger" />
            </div>
          </Link>
          <div className="clear" />
        </div>
        <div className="ledger-info">
          <div className="summary">
            <div className="ledger-cols">
              <div className="ledger-col ledger-index">
                <div className="title">{t('ledger_index')}</div>
                <div className="value">{LedgerIndex}</div>
              </div>
              <div className="ledger-col">
                <div className="title">{t('total_transactions')}</div>
                <div className="value">
                  {localizeNumber(data.transactions.length, language)}
                </div>
              </div>
              <div className="ledger-col">
                <div className="title">{t('total_fees')}</div>
                <div className="value">
                  {formatPrice(data.total_fees, {
                    lang: language,
                    currency: 'XRP',
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="ledger-hash">{LedgerHash}</div>
          <div className="closed-date">
            {localizeDate(date, language, DATE_OPTIONS)} {TIME_ZONE}
          </div>
        </div>
      </div>
    )
  }

  renderLedger() {
    const { data, loading } = this.props
    return data.ledger_hash ? (
      <>
        {this.renderNav()}
        <LedgerTransactionTable
          transactions={data.transactions}
          loading={loading}
        />
      </>
    ) : null
  }

  renderError() {
    const { data } = this.props

    if (!data.error) {
      return null
    }

    const message = getErrorMessage(data.error)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  render() {
    const { loading } = this.props

    return (
      <div className="ledger-page">
        {loading && <Loader />}
        {this.renderLedger()}
        {this.renderError()}
      </div>
    )
  }
}

Ledger.contextType = SocketContext

Ledger.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadLedger: PropTypes.func,
  }).isRequired,
}

export default connect(
  (state) => ({
    loading: state.ledger.loading,
    data: state.ledger.data,
    language: state.app.language,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadLedger,
      },
      dispatch,
    ),
  }),
)(withTranslation()(Ledger))
