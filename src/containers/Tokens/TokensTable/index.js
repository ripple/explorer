import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import ToolTip from './ToolTip';
import retrieveExchangeDataByToken from './utils/tokens-utils';
import TokenRow from './TokenRow';
import Loader from '../../shared/components/Loader';
import Log from '../../shared/log';
import './styles.css';

const NUM_TOKENS_DISPLAYED = 10;

const TokensTable = props => {
  const { t, allTokens, isError } = props;

  const [tokensData, setTokensData] = useState([]);

  useEffect(() => {
    if (allTokens.length > 0) {
      const numTokensToDisplay = Math.min(NUM_TOKENS_DISPLAYED, allTokens.length);

      for (let rank = 1; rank <= numTokensToDisplay; rank += 1) {
        retrieveExchangeDataByToken(allTokens[rank - 1], rank)
          .then(resp => {
            setTokensData(previousTokenData => {
              return previousTokenData.concat(resp).sort((a, b) => (a.rank > b.rank ? 1 : -1));
            });
          })
          .catch(err => {
            Log.error(err);
          });
      }
    }
  }, [allTokens]);

  const headerRow = (
    <tr className="tokens-table-header">
      <th>
        {t('rank')}
        <ToolTip tooltipText={t('rank_message')} altText="Rank" />
      </th>
      <th>{t('token')}</th>
      <th>{t('issuer_address')}</th>
      <th>
        {t('obligations')}
        <ToolTip tooltipText={t('obligations_message')} altText="Obligations" />
      </th>
      <th>{t('volume_24h')}</th>
      <th>{t('market_cap')}</th>
    </tr>
  );

  return (
    <div className="tokens-table-container">
      <div className="tokens-table">
        <table>
          <tbody>
            {tokensData.length > 0 && !isError && headerRow}
            {!isError &&
              tokensData.map(tokenData => <TokenRow key={tokenData.rank} tokenData={tokenData} />)}
          </tbody>
        </table>
        {!isError && tokensData.length === 0 && <Loader />}
        {isError && <div className="empty-tokens-message">{t('no_tokens_message')}</div>}
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
      obligations: PropTypes.number,
      exchangeRate: PropTypes.number
    })
  ).isRequired,
  isError: PropTypes.bool.isRequired
};

export default translate()(TokensTable);
