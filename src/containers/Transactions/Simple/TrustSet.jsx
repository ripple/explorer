import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber } from '../../shared/utils';
import Currency from '../../shared/components/Currency';

const TrustSet = props => {
  const { data, t, language } = props;
  const { limit } = data.instructions;
  const options = { ...CURRENCY_OPTIONS, currency: limit.currency };
  const amount = localizeNumber(limit.amount, language, options);

  return (
    <>
      <div className="row">
        <div className="label">{t('set_limit')}</div>
        <div className="value">
          {amount}
          <Currency currency={limit.currency} amount={limit.amount} />
        </div>
      </div>
    </>
  );
};

TrustSet.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      limit: PropTypes.shape({
        currency: PropTypes.string,
        amount: PropTypes.number
      })
    })
  }).isRequired
};

export default TrustSet;
