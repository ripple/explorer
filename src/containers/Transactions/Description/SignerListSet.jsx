import React from 'react';
import PropTypes from 'prop-types';
import Account from '../../shared/components/Account';

const SignerListSet = props => {
  const { t, data } = props;
  const { tx } = data;

  return tx.SignerQuorum === 0 ? (
    <div>{t('delete_singer_list_description')}</div>
  ) : (
    <>
      <div>{t('set_signer_list_description', { quorum: tx.SignerQuorum })}:</div>
      <ul className="signers">
        {tx.SignerEntries.map(d => (
          <li key={d.SignerEntry.Account}>
            <Account account={d.SignerEntry.Account} />
            <span className="label">{` - ${t('weight')}: `}</span>
            <span>{d.SignerEntry.SignerWeight}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

SignerListSet.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      SignerQuorum: PropTypes.number,
      SignerEntries: PropTypes.shape({
        map: PropTypes.func,
      }),
    }).isRequired,
  }).isRequired,
};

export default SignerListSet;
