import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Account from '../../shared/components/Account';
import Currency from '../../shared/components/Currency';
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber } from '../../shared/utils';

const EscrowFinish = props => {
  const { data, language, t } = props;
  const {
    owner,
    sequence,
    tx,
    destination,
    amount = {},
    condition,
    fulfillment
  } = data.instructions;
  const options = Object.assign({}, CURRENCY_OPTIONS, { currency: amount.currency });
  const amt = localizeNumber(amount.amount, language, options);

  return (
    <React.Fragment>
      <div className="row">
        <div className="label">{t('finish_escrow')}</div>
        <div className="value">
          <Account account={owner} />
          {` - ${sequence}`}
        </div>
      </div>
      {condition && (
        <div className="row">
          <div className="label">{t('escrow_condition_short')}</div>
          <div className="value condition">{condition}</div>
        </div>
      )}
      {fulfillment && (
        <div className="row">
          <div className="label">{t('escrow_fulfillment')}</div>
          <div className="value fulfillment">{fulfillment}</div>
        </div>
      )}
      {amount.amount && (
        <div className="row">
          <div className="label">{t('escrow_amount')}</div>
          <div className="value">
            {amt}
            <Currency {...amount} />
          </div>
        </div>
      )}
      {destination && (
        <div className="row">
          <div className="label">{t('escrow_destination')}</div>
          <div className="value">
            <Account account={destination} />
          </div>
        </div>
      )}
      {tx && (
        <div className="row">
          <div className="label">{t('escrow_transaction')}</div>
          <div className="value tx">
            <Link className="hash" to={`/transactions/${tx}`}>
              {tx}
            </Link>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

EscrowFinish.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      owner: PropTypes.string,
      sequence: PropTypes.number,
      tx: PropTypes.string,
      destination: PropTypes.string,
      amount: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string
      }),
      condition: PropTypes.string,
      fulfillment: PropTypes.string
    })
  }).isRequired
};

export default EscrowFinish;
