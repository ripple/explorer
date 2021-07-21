import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Account from '../../shared/components/Account';
import { normalizeAmount } from '../../shared/transactionUtils';

const TrustSet = props => {
  const { language, data } = props;
  const amount = normalizeAmount(data.tx.LimitAmount, language);
  const { currency, issuer } = data.tx.LimitAmount;

  return (
    <div key="trust_set">
      <Trans i18nKey="trust_set_description">
        It establishes <b>{{ amount }}</b>
        as the maximum amount of <b>{{ currency }}</b>
        from <Account account={issuer} />
        that <Account account={data.tx.Account} />
        is willing to hold
      </Trans>
    </div>
  );
};

TrustSet.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      Account: PropTypes.string,
      LimitAmount: PropTypes.shape({
        currency: PropTypes.string,
        issuer: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default TrustSet;
