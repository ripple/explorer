import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { ReactComponent as SuccessIcon } from '../../shared/images/success.svg';
import { ReactComponent as FailIcon } from '../../shared/images/ic_fail.svg';
import { localizeDate, localizeNumber } from '../../shared/utils';
import { loadAccountTransactions } from './actions';
import Loader from '../../shared/components/Loader';
import TxDetails from '../../shared/components/TxDetails';
import './styles.css';
import TxLabel from '../../shared/components/TxLabel';

const TIME_ZONE = 'UTC';
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE
};

export class AccountTxTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      marker: undefined
    };

    this.loadMoreTransactions = this.loadMoreTransactions.bind(this);
  }

  componentWillMount() {
    const { actions, accountId } = this.props;
    actions.loadAccountTransactions(accountId);
  }

  componentWillReceiveProps(nextProps) {
    const { actions, data, accountId } = this.props;
    const nextAccountId = nextProps.accountId;
    if (nextAccountId !== accountId) {
      this.setState({
        transactions: [],
        marker: undefined
      });
      actions.loadAccountTransactions(nextAccountId);
    }

    // Only update this.state.transactions if loading just completed without error
    const newTransactionsRecieved =
      nextProps.loadingError === '' &&
      nextProps.data &&
      data !== nextProps.data &&
      nextProps.data.transactions;
    if (newTransactionsRecieved) {
      this.setState(prevState => ({
        marker: nextProps.data.marker,
        transactions: prevState.transactions.concat(nextProps.data.transactions)
      }));
    }
  }

  componentWillUnmount() {
    this.resetPage();
  }

  resetPage() {
    const { data } = this.props;
    this.setState({
      transactions: [],
      marker: data.marker
    });
  }

  loadMoreTransactions() {
    const { actions, accountId } = this.props;
    const { marker } = this.state;
    actions.loadAccountTransactions(accountId, marker);
  }

  formatTransactionData(transaction) {
    const { language } = this.props;
    const amount = {};
    return {
      account: transaction.tx.Account,
      destination: transaction.tx.Destination,
      type: transaction.tx.TransactionType,
      amount:
        !!amount &&
        localizeNumber(amount.value, language, {
          style: 'currency',
          currency: amount.currency,
          maximumFractionDigits: 6
        }),
      date: localizeDate(new Date(transaction.date), language, {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      })
    };
  }

  renderListItem(tx) {
    const { language, t } = this.props;
    const success = tx.result === 'tesSUCCESS';
    const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS);
    const status = success ? 'Success' : `Fail - ${tx.result}`;

    return (
      <li
        key={tx.hash}
        className={`transaction-li tx-type ${tx.type} ${success ? 'success' : 'fail'}`}
      >
        <Link to={`/transactions/${tx.hash}`}>
          <div className="upper">
            <div className="col-account">
              <div className="transaction-address" title={tx.account}>
                {tx.account}
              </div>
            </div>
            <div className={`col-type tx-type ${tx.type}`}>
              <TxLabel type={tx.type} t={t} />
            </div>
            <div className="col-status">
              <span title={tx.result} className={`tx-result ${success ? 'success' : 'fail'}`}>
                {success ? (
                  <SuccessIcon className="successful" alt={t('success')} />
                ) : (
                  <FailIcon className="failed" alt={t('fail')} />
                )}
                <span className="status">{status}</span>
              </span>
            </div>
            <div className="col-date">{date}</div>
          </div>
          <div className="details">
            <TxDetails language={language} type={tx.type} instructions={tx.details.instructions} />
          </div>
        </Link>
      </li>
    );
  }

  renderLoadMoreButton() {
    const { t } = this.props;
    const { marker } = this.state;
    return (
      marker && (
        <button className="load-more-btn" onClick={this.loadMoreTransactions}>
          {t('load_more_action')}
        </button>
      )
    );
  }

  renderListContents() {
    const { t, loading, loadingError, currencySelected } = this.props;
    const { transactions } = this.state;
    let processedTransactions = transactions;
    if (currencySelected !== 'XRP') {
      processedTransactions = transactions.filter(
        tx =>
          !currencySelected ||
          (currencySelected &&
            JSON.stringify(tx).includes(`"currency":"${currencySelected.toUpperCase()}"`))
      );
      if (processedTransactions.length === 0) {
        return <div className="empty-transactions-message">Try loading more transactions</div>;
      }
    }
    if (!loading && processedTransactions.length === 0 && !loadingError) {
      return <div className="empty-transactions-message">{t('no_transactions_message')}</div>;
    }
    return processedTransactions.map(transaction => this.renderListItem(transaction));
  }

  render() {
    const { t, loading } = this.props;

    return (
      <div className="section transactions-table">
        <ol className="account-transactions">
          <div className="title">Transactions</div>
          <li className="transaction-li transaction-li-header">
            <div className="col-account">{t('account')}</div>
            <div className="col-type">{t('transaction_type')}</div>
            <div className="col-status">{t('status')}</div>
            <div className="col-date">{t('transactions.date_header')}</div>
          </li>
          {this.renderListContents()}
        </ol>
        {loading ? <Loader /> : this.renderLoadMoreButton()}
      </div>
    );
  }
}

AccountTxTable.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  accountId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    marker: PropTypes.string,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        link: PropTypes.string,
        date: PropTypes.string,
        creator: PropTypes.string,
        image: PropTypes.string,
        speed: PropTypes.number
      })
    )
  }).isRequired,
  actions: PropTypes.shape({
    loadAccountTransactions: PropTypes.func
  }).isRequired,
  currencySelected: PropTypes.string.isRequired
};

AccountTxTable.defaultProps = {
  loadingError: ''
};

export default connect(
  state => ({
    language: state.app.language,
    width: state.app.width,
    loadingError: state.accountTransactions.error,
    loading: state.accountTransactions.loading,
    data: state.accountTransactions.data
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadAccountTransactions
      },
      dispatch
    )
  })
)(translate()(AccountTxTable));
