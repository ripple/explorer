import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactJson from 'react-json-view';
import NoMatch from '../NoMatch';
import Loader from '../shared/components/Loader';
import successIcon from '../shared/images/success.png';
import infoIcon from '../shared/images/info_orange.png';
import Tabs from '../shared/components/Tabs';
import { analytics, ANALYTIC_TYPES, NOT_FOUND, BAD_REQUEST } from '../shared/utils';
import { SUCCESSFULL_TRANSACTION } from '../shared/transactionUtils';
import { loadTransaction } from './actions';
import SimpleTab from './SimpleTab';
import DetailTab from './DetailTab';
import './transaction.css';
import SocketContext from '../shared/SocketContext';

const ERROR_MESSAGES = {};
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'transaction_not_found',
  hints: ['check_transaction_hash'],
};
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_transaction_hash',
  hints: ['check_transaction_hash'],
};
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
};

const getErrorMessage = error => ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

class Transaction extends Component {
  componentDidMount() {
    const { t, actions, match, data } = this.props;
    const hash = data.raw ? data.raw.hash : undefined;
    const { identifier = '', tab = 'simple' } = match.params;
    const rippledSocket = this.context;
    const short = identifier.substr(0, 8);

    document.title = `${t('xrpl_explorer')} | ${t('transaction_short')} ${short}...`;
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Transaction',
      path: `/transactions/:hash/${tab}`,
    });

    if (identifier && identifier !== hash) {
      actions.loadTransaction(identifier, rippledSocket);
    }
  }

  renderSummary() {
    const { t, data } = this.props;
    const type = data.raw.tx.TransactionType;
    const status =
      data.raw.meta.TransactionResult === SUCCESSFULL_TRANSACTION ? (
        <div className="status success">
          <img src={successIcon} alt="success" />
          {t('success')}
        </div>
      ) : (
        <div className="status fail">
          <img src={infoIcon} alt="fail" />
          {t('fail')} -<span>{data.raw.meta.TransactionResult}</span>
        </div>
      );
    return (
      <div className="summary">
        <div className="type">{type}</div>
        {status}
        <div className="hash" title={data.raw.hash}>
          {data.raw.hash}
        </div>
      </div>
    );
  }

  renderTabs() {
    const { match } = this.props;
    const { path = '/', params } = match;
    const { tab = 'simple', identifier } = params;
    const tabs = ['simple', 'detailed', 'raw'];
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`;
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />;
  }

  renderTransaction() {
    const { t, language, data, width, match } = this.props;
    const { tab = 'simple' } = match.params;
    let body;

    switch (tab) {
      case 'detailed':
        body = (
          <DetailTab
            t={t}
            language={language}
            data={data.raw}
            instructions={data.summary.instructions}
          />
        );
        break;
      case 'raw':
        body = (
          <ReactJson
            src={data.raw}
            collapsed={5}
            displayObjectSize={false}
            displayDataTypes={false}
            name={false}
            collapseStringsAfterLength={65}
            theme="bright"
          />
        );
        break;
      default:
        body = <SimpleTab t={t} language={language} data={data} width={width} />;
        break;
    }
    return (
      <>
        {this.renderSummary()}
        {this.renderTabs()}
        <div className="tab-body">{body}</div>
      </>
    );
  }

  render() {
    const { loading, data } = this.props;
    const loader = loading ? <Loader className="show" /> : <Loader />;
    let body;

    if (data.error) {
      const message = getErrorMessage(data.error);
      body = <NoMatch title={message.title} hints={message.hints} />;
    } else if (data.raw && data.raw.hash) {
      body = this.renderTransaction();
    } else if (!loading) {
      body = (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Enter a transaction hash in the search box</h2>
        </div>
      );
    }

    return (
      <div className="transaction">
        {loader}
        {body}
      </div>
    );
  }
}

Transaction.contextType = SocketContext;

Transaction.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number, PropTypes.array])
  ).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      identifier: PropTypes.string,
      tab: PropTypes.string,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadTransaction: PropTypes.func,
  }).isRequired,
};

export default connect(
  state => ({
    loading: state.transaction.loading,
    data: state.transaction.data,
    width: state.app.width,
    language: state.app.language,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadTransaction,
      },
      dispatch
    ),
  })
)(translate()(Transaction));
