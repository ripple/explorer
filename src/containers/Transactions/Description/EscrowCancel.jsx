import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { findNode, normalizeAmount } from '../../shared/transactionUtils';
import Account from '../../shared/components/Account';

const EscrowCancel = props => {
  const { t, language, data } = props;
  const deleted = findNode(data, 'DeletedNode', 'Escrow');
  const lines = [];

  if (!deleted) {
    return null;
  }

  lines.push(
    <div key="line1">
      {t('escrow_cancellation_desc')} <Account account={data.tx.Account} />
    </div>
  );

  lines.push(
    <div key="line2">
      <Trans i18nKey="escrow_cancellation_desc_2">
        The escrowed amount of
        <b>
          {normalizeAmount(deleted.FinalFields.Amount, language)}
          <small>XRP</small>
        </b>
        was returned to
        <Account account={data.tx.Owner} />
      </Trans>
      {data.tx.Owner === data.tx.Account && (
        <span>
          {' '}
          (
          <b>
            {normalizeAmount(deleted.FinalFields.Amount - data.tx.Fee, language)}
            <small>XRP</small>
          </b>{' '}
          {t('escrow_after_transaction_cost')})
        </span>
      )}
    </div>
  );

  lines.push(
    <Trans key="line3" i18nKey="escrow_created_by_desc">
      The escrow was created by
      <Account account={data.tx.Owner} />
      with transaction
      <Link className="hash" to={`/transactions/${deleted.FinalFields.PreviousTxnID}`}>
        {`${deleted.FinalFields.PreviousTxnID.substr(0, 6)}...`}
      </Link>
    </Trans>
  );

  return lines;
};

EscrowCancel.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default EscrowCancel;
