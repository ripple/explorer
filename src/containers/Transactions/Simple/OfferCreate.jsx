import React from 'react';
import PropTypes from 'prop-types';
import { CURRENCY_OPTIONS } from '../../shared/transactionUtils';
import { localizeNumber } from '../../shared/utils';
import Currency from '../../shared/components/Currency';

const OfferCreate = props => {
  const { data, t, language } = props;
  const { price, pair, pays, gets, cancel } = data.instructions;
  const buyOptions = { ...CURRENCY_OPTIONS, currency: pays.currency };
  const buy = localizeNumber(pays.amount, language, buyOptions);
  const sellOptions = { ...CURRENCY_OPTIONS, currency: gets.currency };
  const sell = localizeNumber(gets.amount, language, sellOptions);

  return (
    <>
      <div className="row">
        <div className="label">{t('price')}</div>
        <div className="value">
          {`${Number(price)}`}
          <span className="currency">{pair}</span>
        </div>
      </div>
      <div className="row">
        <div className="label">{t('buy')}</div>
        <div className="value">
          {buy}
          <Currency amount={pays.amount} currency={pays.currency} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('sell')}</div>
        <div className="value">
          {sell}
          <Currency amount={gets.amount} currency={gets.currency} />
        </div>
      </div>
      {cancel && (
        <div className="row">
          <div className="label">{t('cancel_offer')}</div>
          <div className="value">#{cancel}</div>
        </div>
      )}
    </>
  );
};

OfferCreate.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      price: PropTypes.string,
      pair: PropTypes.string,
      cancel: PropTypes.number,
      pays: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      gets: PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default OfferCreate;
