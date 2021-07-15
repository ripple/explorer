import React from 'react';
import PropTypes from 'prop-types';

const DepositPreauth = props => {
  const { data, t } = props;
  const { authorize, unauthorize } = data.instructions;

  return authorize ? (
    <div className="row">
      <div className="label">{t('authorize')}</div>
      <div className="value">{authorize}</div>
    </div>
  ) : (
    <div className="row">
      <div className="label unauthorize">{t('unauthorize')}</div>
      <div className="value">{unauthorize}</div>
    </div>
  );
};

DepositPreauth.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      authorize: PropTypes.string,
      unauthorize: PropTypes.string,
    }),
  }).isRequired,
};

export default DepositPreauth;
