import React from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY_OPTIONS } from '../transactionUtils';
import { localizeNumber } from '../utils';
import Currency from './Currency';

interface AmountProps {
  value: {
    issuer?: string;
    currency: string;
    amount: string;
  };
  displayIssuer?: boolean; // eslint-disable-line react/require-default-props
}

export const Amount = ({ displayIssuer = true, value }: AmountProps) => {
  const { i18n } = useTranslation();
  const { issuer, currency } = value;
  const options = { ...CURRENCY_OPTIONS, currency };
  const amount = localizeNumber(value.amount, i18n.resolvedLanguage, options);

  return (
    <span className="amount">
      <span className="amount-localized">{amount}</span>{' '}
      <Currency issuer={displayIssuer ? issuer : ''} currency={currency} link />
    </span>
  );
};
