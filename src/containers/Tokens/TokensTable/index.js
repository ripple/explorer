import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import axios from 'axios';
import './styles.css';
import Log from '../../shared/log';
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
  const [isLoading, setIsLoading] = useState(true);
  const [tokenMap, setTokenMap] = useState(new Map());
  const [loadingMap, setLoadingMap] = useState(new Map());
  const [renderThing, setRenderThing] = useState(0);

  const updateTokenMap = (k, v) => {
    setTokenMap(tokenMap.set(k, v));
  };
  const updateLoadingMap = (k, v) => {
    setLoadingMap(loadingMap.set(k, v));
  };
  const promises = [];

  const { allTokens, t, isError } = props;

  /**
   * Retrieves all the necessary information for a specific token
   *
   * @param {*} tokenInfo
   * @param {*} rank
   * @returns
   */
  const retrieveExchangeDataByToken = (tokenInfo, rank) => {
    const { issuer, currency } = tokenInfo;

    // Fetch exchange info for market cap
    const exchangeURL = `/api/v1/token/${currency}.${issuer}/offers/XRP`;
    const tokenURL = `/api/v1/token/${currency}.${issuer}`;

    const exchangeRequest = axios.get(exchangeURL);
    const tokenRequest = axios.get(tokenURL);

    let obligations;
    let exchangeRate;
    let gravatar;
    let domain;

    const pushTokenData = () => {
      const tokenData = {
        rank,
        ...tokenInfo,
        obligations,
        exchangeRate,
        gravatar,
        domain
      };

      // Populate allTokensInfo array
      updateTokenMap(rank, tokenData);
      updateLoadingMap(rank, false);
    };

    // .then returns a Promise
    return axios
      .all([exchangeRequest, tokenRequest])
      .then(
        axios.spread((...responses) => {
          const exchangeResponse = responses[0].data;
          const tokenResponse = responses[1].data;

          exchangeRate = exchangeResponse.lowestExchangeRate / 1000000;
          ({ obligations, gravatar, domain } = tokenResponse);

          pushTokenData();
        })
      )
      .catch(err => {
        Log.error(err);
        pushTokenData();
      });
  };

  useEffect(() => {
    if (allTokens.length === 0) return;
    setIsLoading(false);
    const numTokensToDisplay = Math.min(NUM_TOKENS_DISPLAYED, allTokens.length);
    for (let rank = 1; rank <= numTokensToDisplay; rank += 1) {
      const tokenInfo = allTokens[rank - 1];

      updateTokenMap(rank, tokenInfo);
      updateLoadingMap(rank, true);
      // We populate 'promises' with Promises to then be able to use Promise.all
      promises.push(retrieveExchangeDataByToken(tokenInfo, rank));
    }

    // Once all the HTTP request calls (ie Promises) are resolved
    Promise.all(promises)
      .then(() => {
        setRenderThing(old => old + 1);
      })
      .catch(err => {
        Log.error(err);
      });
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

  function renderRow(tokenInfo) {
    const { lng } = props;
    const tokenName = `${tokenInfo.currency}.${tokenInfo.issuer}`;
    const currencySymbol = getLocalizedCurrencySymbol(lng, tokenInfo.currency);
    const { rank } = tokenInfo;
    const obligations = tokenInfo.obligations ? processBigNumber(tokenInfo.obligations, lng) : 0;

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
        <td className="obligations">{loadingMap.get(rank) ? <Loader /> : obligations}</td>
        <td className="volume">{tokenInfo.volume ? processBigNumber(tokenInfo.volume, lng) : 0}</td>
        <td className="market-cap">
          {loadingMap.get(rank) ? (
            <Loader />
          ) : (
            `${processBigNumber(
              tokenInfo.exchangeRate && tokenInfo.obligations
                ? tokenInfo.exchangeRate * tokenInfo.obligations
                : 0,
              lng,
              'XRP'
            )}`
          )}
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
              Array.from(tokenMap.keys()).map(rank => {
                return renderRow({ ...tokenMap.get(rank), rank });
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
      rank: PropTypes.number,
      gravatar: PropTypes.string,
      domain: PropTypes.string,
      exchangeRate: PropTypes.number,
      obligations: PropTypes.number
    })
  ).isRequired,
  lng: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired
};

export default translate()(TokensTable);
