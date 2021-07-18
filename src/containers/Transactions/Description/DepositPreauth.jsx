import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Account from '../../shared/components/Account';

const DepositPreauth = props => {
  const { data } = props;
  const { tx } = data;
  return tx.Authorize ? (
    <div>
      <Trans i18nKey="deposit_auth">
        It Authorizes
        <Account account={tx.Authorize} />
        to send payments to the account
      </Trans>
    </div>
  ) : (
    <div>
      <Trans i18nKey="deposit_unauth">
        It removes the authorization for
        <Account account={tx.Unauthorize} />
        to send payments to the account
      </Trans>
    </div>
  );
};

DepositPreauth.propTypes = {
  data: PropTypes.shape({
    tx: PropTypes.shape({
      Authorize: PropTypes.string,
      Unauthorize: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default DepositPreauth;
