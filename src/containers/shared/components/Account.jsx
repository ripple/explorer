import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Account = props => {
  const { link, account } = props;
  return link ? (
    <Link className="account" title={account} to={`/accounts/${account}`}>
      {account}
    </Link>
  ) : (
    <span className="account" title={account}>
      {account}
    </span>
  );
};

Account.defaultProps = {
  link: true,
};

Account.propTypes = {
  account: PropTypes.string.isRequired,
  link: PropTypes.bool,
};

export default Account;
