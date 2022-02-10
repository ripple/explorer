import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ReactComponent as SuccessIcon } from '../../shared/images/success.svg';
import { ReactComponent as FailIcon } from '../../shared/images/ic_fail.svg';
import { localizeDate, concatTx } from '../../shared/utils';
import Loader from '../../shared/components/Loader';
import TxDetails from '../../shared/components/TxDetails';
import '../../Accounts/AccountTransactionsTable/styles.css'; // Reuse AccountTransactionsTable styling
import TxLabel from '../../shared/components/TxLabel';

import { loadTokenTransactions } from './actions';
import UrlContext from '../../shared/urlContext';

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
  const [transactions, setTransactions] = useState([]);
  const [marker, setMarker] = useState(null);
  const rippledUrl = useContext(UrlContext);

  const { accountId, currency, actions, data, loading, t, loadingError } = props;

  useEffect(() => {
    if (data.transactions == null) return;
    setMarker(data.marker);
    setTransactions(oldTransactions => {
      return concatTx(oldTransactions, data.transactions);
    });
  }, [data]);

  useEffect(() => {
    actions.loadTokenTransactions(accountId, currency, undefined, rippledUrl);
  }, [accountId, currency, actions, rippledUrl]);

  const loadMoreTransactions = () => {
    actions.loadTokenTransactions(accountId, currency, marker);
  };

  const renderListItem = tx => {
    const { language } = props;
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
    return (
      marker && (
        <button className="load-more-btn" onClick={loadMoreTransactions} type="button">
          {t('load_more_action')}
        </button>
      )
    );
  };

  const renderListContents = () => {
    if (!loading && transactions.length === 0 && !loadingError) {
      return <div className="empty-transactions-message">{t('no_transactions_message')}</div>;
    }
    return transactions.map(transaction => renderListItem(transaction));
  };

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
