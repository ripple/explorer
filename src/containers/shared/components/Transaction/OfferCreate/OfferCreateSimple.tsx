import React from 'react';
import { useTranslation } from 'react-i18next';
import { Amount } from '../../Amount';
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types';
import { SimpleRow } from '../SimpleRow';

const OfferCreateSimple: TransactionSimpleComponent = (props: TransactionSimpleProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const { price, pair, pays, gets, cancel } = data.instructions;

  return (
    <>
      <SimpleRow label={t('price')}>
        {`${Number(price)}`}
        <span className="currency">{pair}</span>
      </SimpleRow>
      <SimpleRow label={t('buy')} data-test="amount-buy">
        <Amount value={gets} />
      </SimpleRow>
      <SimpleRow label={t('sell')} data-test="amount-sell">
        <Amount value={pays} />
      </SimpleRow>
      {cancel && (
        <SimpleRow label={t('cancel_offer')} data-test="cancel-id">
          #{cancel}
        </SimpleRow>
      )}
    </>
  );
};
export { OfferCreateSimple };
