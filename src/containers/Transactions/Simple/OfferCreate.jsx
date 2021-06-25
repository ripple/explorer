import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber } from '../../shared/utils';
import Currency from '../../shared/components/Currency';

const OfferCreate = props => {
  const { data, t, language } = props;
  const { price, pair, pays, gets, cancel } = data.instructions;
  const buyOptions = Object.assign({}, CURRENCY_OPTIONS, { currency: pays.currency });
  const buy = localizeNumber(pays.amount, language, buyOptions);
  const sellOptions = Object.assign({}, CURRENCY_OPTIONS, { currency: gets.currency });
  const sell = localizeNumber(gets.amount, language, sellOptions);

  return (
    <React.Fragment>
      <div className="row">
        <div className="label">{t('price')}</div>
        <div className="value">
          {price}
          <span className="currency">{pair}</span>
        </div>
      </div>
      <div className="row">
        <div className="label">{t('buy')}</div>
        <div className="value">
          {buy}
          <Currency {...pays} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('sell')}</div>
        <div className="value">
          {sell}
          <Currency {...gets} />
        </div>
      </div>
      {cancel && (
        <div className="row">
          <div className="label">{t('cancel_offer')}</div>
          <div className="value"># {cancel}</div>
        </div>
      )}
    </React.Fragment>
  );
};

OfferCreate.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      price: PropTypes.number,
      pair: PropTypes.string,
      cancel: PropTypes.number,
      pays: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string
      }),
      gets: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string
      })
    })
  }).isRequired
};

export default OfferCreate;
