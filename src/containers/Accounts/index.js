import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import AccountHeader from './AccountHeader';
import AccountTransactionsTable from './AccountTransactionsTable';
import NoMatch from '../NoMatch';

import './styles.css';
import { analytics, ANALYTIC_TYPES, NOT_FOUND, BAD_REQUEST } from '../shared/utils';

const ERROR_MESSAGES = {};
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'account_not_found',
  hints: ['check_account_id'],
};
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_account_id'],
};
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
};

const getErrorMessage = error => ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencySelected: 'XRP',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps;
    return {
      accountId: match.params.id,
      prevId: prevState && prevState.accountId,
    };
  }

  static renderError(error) {
    const message = getErrorMessage(error);
    return (
      <div className="accounts-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    );
  }

  componentDidMount() {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' });
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
  }

  setCurrencySelected(currency) {
    this.setState({
      currencySelected: currency,
    });
  }

  render() {
    const { t, error, match } = this.props;
    const { prevId } = this.state;
    const accountId = match.params.id || '';
    const showError = accountId === prevId && error;
    const { currencySelected } = this.state;

    document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`;

    return showError ? (
      Accounts.renderError(error)
    ) : (
      <div className="accounts-page">
        {accountId && (
          <AccountHeader
            accountId={accountId}
            t={t}
            onSetCurrencySelected={currency => this.setCurrencySelected(currency)}
            currencySelected={currencySelected}
          />
        )}
        {accountId && (
          <AccountTransactionsTable
            accountId={accountId}
            t={t}
            currencySelected={currencySelected}
          />
        )}
        {!accountId && (
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <h2>Enter an account ID in the search box</h2>
          </div>
        )}
      </div>
    );
  }
}

Accounts.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

Accounts.defaultProps = {
  error: null,
};

export default connect(state => ({
  width: state.app.width,
  error: state.accountHeader.status,
}))(translate()(Accounts));
