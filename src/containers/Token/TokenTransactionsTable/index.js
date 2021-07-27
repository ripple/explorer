import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { ReactComponent as SuccessIcon } from '../../shared/images/success.svg';
import { ReactComponent as FailIcon } from '../../shared/images/ic_fail.svg';
import { localizeDate, concatTx } from '../../shared/utils';
import { loadTokenTransactions } from './actions';
import Loader from '../../shared/components/Loader';
import TxDetails from '../../shared/components/TxDetails';
import '../../Accounts/AccountTransactionsTable/styles.css'; // Reuse AccountTransactionsTable styling
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
  timeZone: TIME_ZONE,
};

export const TokenTxTable = props => {
  const [state, setState] = useState({
    transactions: [],
    marker: undefined,
    prevProps: { accountId: '', currency: '', data: '', actions: {} },
  });

  const { accountId, actions, data, currency } = props;

  useEffect(() => {
    actions.loadTokenTransactions(accountId, currency);
    // returned function will be called on component unmount
    return () => {
      resetPage();
    };
  }, []);

  useEffect(() => {
    setState({
      transactions: [],
      marker: undefined,
    });
    actions.loadTokenTransactions(accountId, currency);
  }, [accountId, currency]);

  useEffect(() => {
    // Only update this.state.transactions if loading just completed without error
    const newTransactionsRecieved =
      props.loadingError === '' &&
      props.data &&
      state.data !== props.data &&
      props.data.transactions;

    if (newTransactionsRecieved) {
      setState(prevState => ({
        marker: props.data.marker,
        transactions: concatTx(prevState.transactions, props.data.transactions),
      }));
    }
  }, [props]);

  const resetPage = () => {
    setState({
      transactions: [],
      marker: data.marker,
    });
  };

  const loadMoreTransactions = () => {
    const { marker } = state;
    actions.loadTokenTransactions(accountId, currency, marker);
  };

  const renderListItem = tx => {
    const { language, t } = props;
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
  };

  const renderLoadMoreButton = () => {
    const { t } = props;
    const { marker } = state;
    return (
      marker && (
        <button className="load-more-btn" onClick={loadMoreTransactions} type="button">
          {t('load_more_action')}
        </button>
      )
    );
  };

  const renderListContents = () => {
    const { t, loading, loadingError } = props;
    const { transactions } = state;
    if (!loading && transactions.length === 0 && !loadingError) {
      return <div className="empty-transactions-message">{t('no_transactions_message')}</div>;
    }
    return transactions.map(transaction => renderListItem(transaction));
  };

  const { t, loading } = props;

  return (
    <div className="section transactions-table">
      <ol className="account-transactions">
        <div className="title">Token Transactions</div>
        <li className="transaction-li transaction-li-header">
          <div className="col-account">{t('account')}</div>
          <div className="col-type">{t('transaction_type')}</div>
          <div className="col-status">{t('status')}</div>
          <div className="col-date">{t('transactions.date_header')}</div>
        </li>
        {renderListContents()}
      </ol>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  );
};

TokenTxTable.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  accountId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
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
        speed: PropTypes.number,
      })
    ),
  }).isRequired,
  actions: PropTypes.shape({
    loadTokenTransactions: PropTypes.func,
  }).isRequired,
};

TokenTxTable.defaultProps = {
  loadingError: '',
};

export default connect(
  state => ({
    language: state.app.language,
    width: state.app.width,
    loadingError: state.accountTransactions.error,
    loading: state.accountTransactions.loading,
    data: state.accountTransactions.data,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadTokenTransactions,
      },
      dispatch
    ),
  })
)(translate()(TokenTxTable));
