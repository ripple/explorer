import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Account = props =>
  props.link ? (
    <Link className="account" title={props.account} to={`/accounts/${props.account}`}>
      {props.account}
    </Link>
  ) : (
    <span className="account" title={props.account}>
      {props.account}
    </span>
  );

Account.defaultProps = {
  link: true
};

Account.propTypes = {
  account: PropTypes.string.isRequired,
  link: PropTypes.bool
};

export default Account;
