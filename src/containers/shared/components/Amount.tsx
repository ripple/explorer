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
}

export const Amount = (props: AmountProps) => {
  const { value } = props;
  const { i18n } = useTranslation();
  const { issuer, currency } = value;
  const options = { ...CURRENCY_OPTIONS, currency: currency };
  const amount = localizeNumber(value.amount, i18n.resolvedLanguage, options);

  return (
    <span className="amount">
      {amount}
      <Currency issuer={issuer} currency={currency} link={true} />
    </span>
  );
};
