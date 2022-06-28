import React from 'react';
import { useTranslation } from 'react-i18next';
import { Amount } from '../../Amount';
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types';

const SidechainCreateSimple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation();
  const { data } = props;
  console.log(data.instructions);
  const { price, pair, pays, gets, cancel } = data.instructions;

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
        <div className="value" data-test="amount-buy">
          <Amount value={gets} />
        </div>
      </div>
      <div className="row">
        <div className="label">{t('sell')}</div>
        <div className="value" data-test="amount-sell">
          <Amount value={pays} />
        </div>
      </div>
      {cancel && (
        <div className="row">
          <div className="label">{t('cancel_offer')}</div>
          <div className="value" data-test="cancel-id">
            #{cancel}
          </div>
        </div>
      )}
    </>
  );
};
export default SidechainCreateSimple;
