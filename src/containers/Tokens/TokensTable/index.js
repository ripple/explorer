import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Link from '../../shared/components/InternalLink';
import './styles.css';
import Loader from '../../shared/components/Loader';
import { formatLargeNumber, getLocalizedCurrencySymbol } from '../../shared/utils';
import Currency from '../../shared/components/Currency';
import { ReactComponent as QuestIcon } from '../../shared/images/hover_question.svg';

const NUM_TOKENS_DISPLAYED = 10;

function processBigNumber(number, language, currency = undefined) {
  const { num, unit } = formatLargeNumber(Number(number), 2);
  let numberString = unit ? `${num} ${unit}` : `${num}`;
  if (number.toString().includes('e')) {
    numberString = Number(number)
      .toExponential(2)
      .toString();
  }
  if (currency) return `${getLocalizedCurrencySymbol(language, currency)} ${numberString}`;
  return numberString;
}

const TokensTable = props => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allTokens, t, isError } = props;

  useEffect(() => {
    if (allTokens.length === 0) return;
    const numTokensToDisplay = Math.min(NUM_TOKENS_DISPLAYED, allTokens.length);
    setTokens(allTokens.slice(0, numTokensToDisplay));
    setIsLoading(false);
  }, [allTokens]);

  function renderNoTokens() {
    return <div className="empty-tokens-message">{t('no_tokens_message')}</div>;
  }

  function renderTooltip(tooltipText, altText) {
    return (
      <span className="q-tooltip" data-tooltip={tooltipText}>
        <QuestIcon alt={altText} className="question" />
      </span>
    );
  }

  function renderRow(tokenInfo, rank) {
    const { lng } = props;
    const tokenName = `${tokenInfo.currency}.${tokenInfo.issuer}`;
    const currencySymbol = getLocalizedCurrencySymbol(lng, tokenInfo.currency);

    return (
      <tr key={rank} className="tokens-table-row">
        <td className="rank">{rank}</td>
        <td className="token">
          {tokenInfo.gravatar && <img alt={`${tokenName} logo`} src={tokenInfo.gravatar} />}
          {!tokenInfo.gravatar && currencySymbol}
          {!tokenInfo.gravatar && currencySymbol && ' '}
          <Currency currency={tokenInfo.currency} />
        </td>
        <td className="issuer">
          <Link className="token-issuer" title={tokenName} to={`/token/${tokenName}`}>
            {tokenInfo.domain ? tokenInfo.domain : tokenInfo.issuer}
          </Link>
          {tokenInfo.domain && (
            <span className="q-tooltip" data-tooltip={tokenInfo.issuer}>
              <QuestIcon alt={tokenInfo.issuer} className="question" />
            </span>
          )}
        </td>
        <td className="obligations">
          {tokenInfo.obligations ? processBigNumber(tokenInfo.obligations, lng) : 0}
        </td>
        <td className="volume">{tokenInfo.volume ? processBigNumber(tokenInfo.volume, lng) : 0}</td>
        <td className="market-cap">
          {`${processBigNumber(
            tokenInfo.exchangeRate && tokenInfo.obligations
              ? tokenInfo.exchangeRate * tokenInfo.obligations
              : 0,
            lng,
            'XRP'
          )}`}
        </td>
      </tr>
    );
  }

  // TODO: add "show more" button
  return (
    <div className="tokens-table-container">
      <div className="tokens-table">
        <table>
          <tbody>
            {!isLoading && (
              <tr className="tokens-table-header">
                <th>
                  {t('rank')}
                  {renderTooltip(t('rank_message'), 'Rank')}
                </th>
                <th>{t('token')}</th>
                <th>{t('issuer_address')}</th>
                <th>
                  {t('obligations')}
                  {renderTooltip(t('obligations_message'), 'Obligations')}
                </th>
                <th>{t('volume_24h')}</th>
                <th>{t('market_cap')}</th>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              tokens.map((token, index) => {
                return renderRow(token, index + 1);
              })}
          </tbody>
        </table>
        {isLoading && <Loader />}
        {isError && renderNoTokens()}
      </div>
    </div>
  );
};

TokensTable.propTypes = {
  t: PropTypes.func.isRequired,
  allTokens: PropTypes.arrayOf(
    PropTypes.shape({
      issuer: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      trustlines: PropTypes.number.isRequired,
      volume: PropTypes.number,
      gravatar: PropTypes.string,
      domain: PropTypes.string,
      obligations: PropTypes.string,
      exchangeRate: PropTypes.number,
    })
  ).isRequired,
  lng: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default translate()(TokensTable);
