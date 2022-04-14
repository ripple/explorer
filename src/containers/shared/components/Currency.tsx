import React from 'react';
import PropTypes from 'prop-types';
import Account from './Account';

// https://xrpl.org/currency-formats.html#nonstandard-currency-codes
const NON_STANDARD_CODE_LENGTH = 40;

interface Props {
  issuer?: string;
  currency: string;
  link: boolean;
}

const Currency = (props: Props) => {
  const { issuer, currency, link } = props;
  const currencyCode =
    currency?.length === NON_STANDARD_CODE_LENGTH ? hexToString(currency) : currency;

  const content = issuer ? (
    <>
      {currencyCode}
      .
      <Account account={issuer} link={link} />
    </>
  ) : (
    currencyCode
  );

  return <span className="currency">{content}</span>;
};

Currency.defaultProps = {
  issuer: null,
  link: true,
};

Currency.propTypes = {
  currency: PropTypes.string.isRequired,
  issuer: PropTypes.string,
  link: PropTypes.bool,
};

export const hexToString = (hex: string) => {
  let string = '';
  for (let i = 0; i < hex.length; i += 2) {
    const part = hex.substring(i, i + 2);
    const code = parseInt(part, 16);
    if (!isNaN(code) && code !== 0) {
      string += String.fromCharCode(code);
    }
  }
  return string;
};

export default Currency;
