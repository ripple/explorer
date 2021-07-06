import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getLocalizedCurrencySymbol } from '../../shared/utils';
import Currency from '../../shared/components/Currency';
import { ReactComponent as QuestIcon } from '../../shared/images/hover_question.svg';
import { processBigNumber } from './utils/tokens-utils';
import './styles.css';

const TokenRow = props => {
  const { tokenData, lng } = props;

  const tokenName = `${tokenData.currency}.${tokenData.issuer}`;
  const currencySymbol = getLocalizedCurrencySymbol(lng, tokenData.currency);

  return (
    <tr key={tokenData.rank} className="tokens-table-row">
      <td className="rank">{tokenData.rank}</td>
      <td className="token">
        {tokenData.gravatar && <img alt={`${tokenName} logo`} src={tokenData.gravatar} />}
        {!tokenData.gravatar && currencySymbol}
        {!tokenData.gravatar && currencySymbol && ' '}
        <Currency currency={tokenData.currency} />
      </td>
      <td className="issuer">
        <Link className="token-issuer" title={tokenName} to={`/token/${tokenName}`}>
          {tokenData.domain ? tokenData.domain : tokenData.issuer}
        </Link>
        {tokenData.domain && (
          <span className="q-tooltip" data-tooltip={tokenData.issuer}>
            <QuestIcon alt={tokenData.issuer} className="question" />
          </span>
        )}
      </td>
      <td className="obligations">
        {tokenData.obligations ? processBigNumber(tokenData.obligations, lng) : 0}
      </td>
      <td className="volume">{tokenData.volume ? processBigNumber(tokenData.volume, lng) : 0}</td>
      <td className="market-cap">
        {`${processBigNumber(
          tokenData.exchangeRate && tokenData.obligations
            ? tokenData.exchangeRate * tokenData.obligations
            : 0,
          lng,
          'XRP'
        )}`}
      </td>
    </tr>
  );
};

TokenRow.propTypes = {
  tokenData: PropTypes.shape({
    issuer: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    trustlines: PropTypes.number.isRequired,
    volume: PropTypes.number,
    rank: PropTypes.number.isRequired,
    gravatar: PropTypes.string,
    domain: PropTypes.string,
    obligations: PropTypes.number,
    exchangeRate: PropTypes.number
  }).isRequired,
  lng: PropTypes.string.isRequired
};

export default TokenRow;
