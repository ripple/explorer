import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Notification from '../shared/components/Notification';

const Banner = props => {
  const { t, messages } = props;
  return (
    <div className={`banner ${messages.length ? 'show' : ''}`}>
      {messages.map(d => (
        <Notification key={d[0]} usage="danger" message={t(d[1])} />
      ))}
    </div>
  );
};

Banner.propTypes = {
  t: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default connect(state => {
  const messages = [
    ['ledgerError', state.ledger.error],
    ['transactionError', state.transaction.error],
    ['balanceError', state.accountHeader.error],
    ['transactionsError', state.accountTransactions.error],
    ['payStringError', state.payStringData.error],
  ];

  return { messages: messages.filter(d => Boolean(d[1])) };
})(translate()(Banner));
