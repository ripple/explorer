import React from 'react';
import PropTypes from 'prop-types';
import AccountTransactionsTable from '../../Accounts/AccountTransactionsTable';

const AccountDelete = props => {
  const { t } = props;
  const { account } = props.data.instructions;
  return (
    <React.Fragment>
      <div className="row">
        <div style={{ width: '100%', textAlign: 'center' }}>Account History</div>
      </div>
      <div className="row">
        <AccountTransactionsTable accountId={account} t={t} />
      </div>
    </React.Fragment>
  );
};
AccountDelete.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number, PropTypes.array])
  ).isRequired,
  t: PropTypes.func.isRequired
};

export default AccountDelete;
