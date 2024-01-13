import { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { Legend } from './Legend'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE } from '../App/routes'
import { LedgerListEntry } from './LedgerListEntry'

class Ledgers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ledgers: [],
      validators: {},
      tooltip: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      selected: nextProps.selected,
      ledgers: nextProps.paused ? prevState.ledgers : nextProps.ledgers,
      validators: nextProps.validators,
      unlCount: nextProps.unlCount,
    }
  }

  getMissingValidators = (hash) => {
    const { validators } = this.props
    const unl = {}

    Object.keys(validators).forEach((pubkey) => {
      if (validators[pubkey].unl) {
        unl[pubkey] = false
      }
    })

    hash.validations.forEach((v) => {
      if (unl[v.pubkey] !== undefined) {
        delete unl[v.pubkey]
      }
    })

    return Object.keys(unl).map((pubkey) => validators[pubkey])
  }

  renderSelected = () => {
    const { validators, selected } = this.state
    const v = validators[selected] || {}
    return (
      <div className="selected-validator">
        {v.domain && <DomainLink domain={v.domain} />}
        <RouteLink
          to={VALIDATOR_ROUTE}
          params={{ identifier: selected }}
          className="pubkey"
        >
          {selected}
        </RouteLink>
      </div>
    )
  }

  render() {
    const { ledgers, selected, tooltip } = this.state
    const { t, language, isOnline } = this.props
    return (
      <div className="ledgers">
        {isOnline && ledgers.length > 0 ? (
          <>
            <Legend />
            <div className="control">{selected && this.renderSelected()}</div>
            <div className="ledger-list">
              {ledgers.map((ledger) => (
                <LedgerListEntry ledger={ledger} key={ledger.ledger_index} />
              ))}{' '}
              <Tooltip t={t} language={language} data={tooltip} />
            </div>{' '}
          </>
        ) : (
          <Loader />
        )}
      </div>
    )
  }
}

Ledgers.contextType = SocketContext

Ledgers.propTypes = {
  ledgers: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  validators: PropTypes.shape({}), // eslint-disable-line
  unlCount: PropTypes.number, // eslint-disable-line
  selected: PropTypes.string, // eslint-disable-line
  setSelected: PropTypes.func,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  paused: PropTypes.bool,
  isOnline: PropTypes.bool.isRequired,
}

Ledgers.defaultProps = {
  ledgers: [],
  validators: {},
  unlCount: 0,
  selected: null,
  setSelected: () => {},
  paused: false,
}

export default withTranslation()(Ledgers)
