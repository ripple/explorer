import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { translate } from 'react-i18next';

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
  const errorInfoRef = useRef({ title: '', hints: '' });

  const { t, error } = props;

  document.title = `${t('xrpl_explorer')} | ${t('tokens')}`;

  useEffect(() => {
    axios
      .get(TOP_TOKENS_URL)
      .then(res => {
        const { tokens } = res.data;

        if (res.data.result === 'error') {
          Log.error(`${TOP_TOKENS_URL} --- ${JSON.stringify(res.data)}`);

          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `${TOP_TOKENS_URL} --- ${JSON.stringify(res.data)}`,
          });

          errorInfoRef.current = res.data;
          setIsError(true);
        }
        setAllTokens(tokens);
        setIsLoading(false);
      })
      .catch(axiosError => {
        Log.error(`${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`);

        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`,
        });

        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  function renderError(errorInfo) {
    const { result, message } = errorInfo;
    return <NoMatch title={result} hints={[message]} />;
  }

  return error || isError ? (
    renderError(errorInfoRef.current)
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

export default translate()(Tokens);
