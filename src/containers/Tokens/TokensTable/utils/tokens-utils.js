import axios from 'axios';

import Log from '../../../shared/log';
import { formatLargeNumber, getLocalizedCurrencySymbol } from '../../../shared/utils';

const retrieveExchangeDataByToken = (tokenInfo, rank) => {
  return new Promise((resolve, reject) => {
    const { issuer, currency } = tokenInfo;

    // Fetch exchange info for market cap
    const exchangeURL = `/api/v1/token/${currency}.${issuer}/offers/XRP`;
    const tokenURL = `/api/v1/token/${currency}.${issuer}`;

    // Two Promises to retrieve the correct information
    const exchangePromise = axios.get(exchangeURL);
    const tokenPromise = axios.get(tokenURL);

    // Once both Promises above resolve
    Promise.all([exchangePromise, tokenPromise])
      .then(
        axios.spread((...responses) => {
          const exchangeResponse = responses[0].data;
          const tokenResponse = responses[1].data;

          const exchangeRate = exchangeResponse.lowestExchangeRate / 1000000;
          const { obligations, gravatar, domain } = tokenResponse;

          // Create the object containing the token data to return
          const tokenData = {
            rank,
            ...tokenInfo,
            obligations: +obligations,
            exchangeRate,
            gravatar,
            domain
          };

          resolve(tokenData);
        })
      )
      .catch(err => {
        Log.error(err);
        reject(err);
      });
  });
};

export const processBigNumber = (number, language, currency = undefined) => {
  const { num, unit } = formatLargeNumber(Number(number), 2);
  let numberString = unit ? `${num} ${unit}` : `${num}`;
  if (number.toString().includes('e')) {
    numberString = Number(number)
      .toExponential(2)
      .toString();
  }
  if (currency) return `${getLocalizedCurrencySymbol(language, currency)} ${numberString}`;
  return numberString;
};

export default retrieveExchangeDataByToken;
