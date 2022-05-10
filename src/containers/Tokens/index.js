import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import Log from '../shared/log';
import TokensHeader from './TokensHeader';
import TokensTable from './TokensTable';
import './styles.css';
import NoMatch from '../NoMatch';

const TOP_TOKENS_URL = '/api/v1/token/top';

const Tokens = props => {
  const [allTokens, setAllTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { t, error } = props;

  document.title = `${t('xrpl_explorer')} | ${t('tokens')}`;

  useEffect(() => {
    axios
      .get(TOP_TOKENS_URL)
      .then(res => {
        if (res.data.result === 'error') {
          Log.error(`${TOP_TOKENS_URL} --- ${JSON.stringify(res.data)}`);

          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `${TOP_TOKENS_URL} --- ${JSON.stringify(res.data)}`,
          });

          setIsError(true);
          setAllTokens([]);
          setIsLoading(false);
        } else {
          const { tokens } = res.data;
          setAllTokens(tokens);
          setIsLoading(false);
        }
      })
      .catch(axiosError => {
        Log.error(`${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`);

        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`,
        });

        setAllTokens([]);
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  function renderError() {
    return (
      <div className="token-discovery-page">
        <NoMatch title="generic_error" hints={['not_your_fault']} />
      </div>
    );
  }

  return error || isError ? (
    renderError()
  ) : (
    <div className="token-discovery-page">
      <TokensHeader tokens={allTokens} isLoading={isLoading} isError={isError} />
      <TokensTable allTokens={allTokens} isError={isError} />
    </div>
  );
};

Tokens.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.number,
};

Tokens.defaultProps = {
  error: null,
};

export default withTranslation()(Tokens);
