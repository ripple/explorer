import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as SuccessIcon } from '../../shared/images/success.svg';
import { ReactComponent as FailIcon } from '../../shared/images/ic_fail.svg';
import { localizeDate, analytics, ANALYTIC_TYPES } from '../../shared/utils';
import Loader from '../../shared/components/Loader';
import TxDetails from '../../shared/components/TxDetails';
import './styles.css';
import TxLabel from '../../shared/components/TxLabel';
import Log from '../../shared/log';

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

const loadAccountTransactions = async (accountId, currency, marker) => {
  let url = `/api/v1/account_transactions/${accountId}`;
  if (marker) {
    url += `?marker=${marker}`;
  }
  return axios
    .get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `${url} --- ${JSON.stringify(error)}`,
      });
      Log.error(`${url} --- ${JSON.stringify(error)}`);
    });
};

export const AccountTxTable = props => {
  const [transactions, setTransactions] = useState([]);
  const [marker, setMarker] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const { accountId, loadingError } = props;

  const processData = data => {
    setMarker(data.marker);
    setTransactions(oldTransactions => {
      return oldTransactions.concat(data.transactions);
    });
  };

  useEffect(() => {
    setLoading(true);
    loadAccountTransactions(accountId).then(data => {
      setLoading(false);
      processData(data);
    });
  }, [accountId]);

  const loadMoreTransactions = () => {
    setLoading(true);
    loadAccountTransactions(accountId, marker).then(data => {
      setLoading(false);
      processData(data);
    });
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
    return (
      marker && (
        <button type="button" className="load-more-btn" onClick={loadMoreTransactions}>
          {t('load_more_action')}
        </button>
      )
    );
  };

  const renderListContents = () => {
    const { t, currencySelected } = props;
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
    return processedTransactions.map(transaction => renderListItem(transaction));
  };

  const { t } = props;

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
        {renderListContents()}
      </ol>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  );
};

AccountTxTable.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  loadingError: PropTypes.string,
  accountId: PropTypes.string.isRequired,
  currencySelected: PropTypes.string.isRequired,
};

AccountTxTable.defaultProps = {
  loadingError: '',
};

export default translate()(AccountTxTable);
