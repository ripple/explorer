import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';
import './styles.css';
import Log from '../../shared/log';
import Loader from '../../shared/components/Loader';
import {
  formatLargeNumber,
  getLocalizedCurrencySymbol,
  analytics,
  ANALYTIC_TYPES
} from '../../shared/utils';
import PairStats from './PairStats';

// Hard Coded Pairs that we always check for
const pairsHardCoded = [
  'XRP',
  'USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B', // Bitstamp USD
  'BTC.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' // Bitstamp BTC
];

const DEXPairs = props => {
  const { accountId, currency, t } = props;
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    const promises = [];
    axios
      .get(`/api/v1/token/top`)
      .then(tokenRes => {
        let tokenList = tokenRes.data?.tokens;
        if (tokenList) {
          tokenList = tokenList.map(element => `${element.currency}.${element.issuer}`);
          // Limit to top 20 tokens so that page in reasonable amount of time.
          // TODO: add "Load more pairs feature"
          tokenList = tokenList.slice(0, 20);
        } else {
          tokenList = [];
        }

        tokenList = tokenList.concat(pairsHardCoded);

        const tokenSet = new Set(tokenList);
        for (const token of tokenSet) {
          if (token !== `${currency.toUpperCase()}.${accountId}`) {
            const url = `/api/v1/token/${currency}.${accountId}/offers/${token}`;
            promises.push(
              axios
                // currency.accountId = "taker gets" token = "taker pays" pairs are "taker pays"/ "taker gets"
                .get(url)
                .then(res => {
                  if (res.data.offers && res.data.offers.length > 0) {
                    let { averageExchangeRate, lowestExchangeRate, highestExchangeRate } = res.data;
                    if (token === 'XRP') {
                      averageExchangeRate /= 1000000;
                      lowestExchangeRate /= 1000000;
                      highestExchangeRate /= 1000000;
                    }

                    const low = formatLargeNumber(lowestExchangeRate);
                    const high = formatLargeNumber(highestExchangeRate);
                    const average = formatLargeNumber(averageExchangeRate);
                    const tokenSplit = token.split('.');

                    if (isMountedRef.current) {
                      setPairs(previousPairs => {
                        return previousPairs.concat({
                          token: tokenSplit[0],
                          issuer: tokenSplit[1],
                          low,
                          high,
                          average
                        });
                      });
                    }
                  }
                })
                .catch(err => {
                  Log.error(err);
                  analytics(ANALYTIC_TYPES.exception, {
                    exDescription: `Error getting offers endpoint ${url}`
                  });
                })
            );
          }
        }
        Promise.allSettled(promises).then(() => {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        if (isMountedRef.current) {
          setIsError(true);
          setIsLoading(false);
        }
        Log.error(err);
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `Error getting top tokens from /api/v1/tokens/top`
        });
      });
    return () => {
      isMountedRef.current = false;
    };
  }, [accountId, currency]);

  function renderNoPairs() {
    return <div className="no-pairs-message">{t('no_pairs_message')}</div>;
  }
  const renderRow = pair => {
    return (
      <tr key={`${pair.token}.${pair.issuer}`}>
        <td className="pair">
          {`${currency.toUpperCase()}/${pair.token} ${pair.average.num}${pair.average.unit}`}
        </td>
        <td className="issuer-address">
          {pair.issuer !== undefined ? (
            <a href={`/token/${pair.token}.${pair.issuer}`}>{pair.issuer}</a>
          ) : (
            getLocalizedCurrencySymbol('en-US', 'XRP')
          )}
        </td>
        <td>
          <PairStats pair={pair} t={t} />
        </td>
      </tr>
    );
  };

  return (
    <div className="section dex-pairs-container">
      <div className="title"> {t('top_trading_pairs')}</div>
      <div className="pairs-table">
        <table>
          <tbody>
            {pairs.map(renderRow)}
            {isLoading && (
              <tr key="loader">
                <td colSpan="3" className="loader">
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {(isError || (pairs.length === 0 && !isLoading)) && renderNoPairs()}
      </div>
    </div>
  );
};

DEXPairs.propTypes = {
  accountId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};
export default translate()(DEXPairs);
