import React, { useState, useEffect, useRef, useContext } from 'react';
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
  ANALYTIC_TYPES,
} from '../../shared/utils';
import { getOffers } from '../../../rippled';
import PairStats from './PairStats';
import SocketContext from '../../shared/SocketContext';

// Hard Coded Pairs that we always check for
const pairsHardCoded = [
  { currency: 'XRP' },
  { currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' }, // Bitstamp USD
  { currency: 'BTC', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' }, // Bitstamp BTC
];

const DEXPairs = props => {
  const { accountId, currency, t } = props;
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const rippledSocket = useContext(SocketContext);

  useEffect(() => {
    isMountedRef.current = true;
    const promises = [];
    axios
      .get(`/api/v1/token/top`)
      .then(tokenRes => {
        let tokenList = tokenRes.data?.tokens;
        if (tokenList) {
          tokenList = tokenList.map(element => {
            return { currency: element.currency, issuer: element.issuer };
          });
          // Limit to top 20 tokens so that page in reasonable amount of time.
          // TODO: add "Load more pairs feature"
          tokenList = tokenList.slice(0, 20);
        } else {
          tokenList = [];
        }

        tokenList = tokenList.concat(pairsHardCoded);

        for (const token of tokenList) {
          if (
            !(token.currency.toUpperCase() === currency.toUpperCase() && token.issuer === accountId)
          ) {
            promises.push(
              // currency.accountId = "taker gets" token = "taker pays" pairs are "taker pays"/ "taker gets"
              getOffers(currency, accountId, token.currency, token.issuer, rippledSocket)
                .then(data => {
                  if (data.offers && data.offers.length > 0) {
                    let { averageExchangeRate, lowestExchangeRate, highestExchangeRate } = data;
                    if (token.currency === 'XRP') {
                      averageExchangeRate /= 1000000;
                      lowestExchangeRate /= 1000000;
                      highestExchangeRate /= 1000000;
                    }

                    const low = formatLargeNumber(lowestExchangeRate, 6);
                    const high = formatLargeNumber(highestExchangeRate, 6);
                    const average = formatLargeNumber(averageExchangeRate, 6);

                    if (isMountedRef.current) {
                      setPairs(previousPairs => {
                        return previousPairs.concat({
                          token: token.currency,
                          issuer: token.issuer,
                          low,
                          high,
                          average,
                        });
                      });
                    }
                  }
                })
                .catch(err => {
                  Log.error(err);
                  analytics(ANALYTIC_TYPES.exception, {
                    exDescription: `Error getting offers endpoint ${currency}.${accountId}/${token}`,
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
          exDescription: `Error getting top tokens from /api/v1/tokens/top`,
        });
      });
    return () => {
      isMountedRef.current = false;
    };
  }, [accountId, currency, rippledSocket]);

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
          <thead>
            <tr>
              <th className="pair-header">{t('pair')}</th>
              <th>{t('issuer')}</th>
              <th className="stats-header">{t('offer_range')}</th>
            </tr>
          </thead>
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
  t: PropTypes.func.isRequired,
};
export default translate()(DEXPairs);
