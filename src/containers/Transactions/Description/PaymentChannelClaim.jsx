import React from 'react';
import PropTypes from 'prop-types';
import { findNode, normalizeAmount } from '../../shared/transactionUtils';
import Account from '../../shared/components/Account';

const PaymentChannelClaim = props => {
  const { t, language, data } = props;
  const lines = [];
  const deleted = findNode(data, 'DeletedNode', 'PayChannel');
  const modified = findNode(data, 'ModifiedNode', 'PayChannel');
  const node = deleted || modified;
  const change =
    node && node.PreviousFields && node.PreviousFields.Balance
      ? node.FinalFields.Balance - node.PreviousFields.Balance
      : null;

  lines.push(
    <div key="line1">
      {t('transaction_initiated_by')} <Account account={data.tx.Account} />
    </div>
  );

  lines.push(
    <div key="line2">
      {t('update_payment_channel')} <span className="channel">{data.tx.Channel}</span>
    </div>
  );

  if (data.tx.Balance) {
    lines.push(
      <div key="line3">
        {t('the_channel_balance_is')}
        <b>
          {' '}
          {normalizeAmount(data.tx.Balance, language)}
          <small>XRP</small>
        </b>
        {change && (
          <span>
            {' ('}
            {t('increased_by')}
            <b>
              {' '}
              {normalizeAmount(change, language)}
              <small>XRP</small>
            </b>
            )
          </span>
        )}
      </div>
    );
  }

  if (deleted) {
    lines.push(<div key="line4">{t('payment_channel_closed_description')}</div>);
  }

  return lines;
};

PaymentChannelClaim.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default PaymentChannelClaim;
