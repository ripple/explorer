import React from 'react';
import PropTypes from 'prop-types';
import Account from './Account';

const Currency = props => {
  const content = props.issuer ? (
    <React.Fragment>
      {props.currency}
      {'.'}
      <Account account={props.issuer} link={props.link} />
    </React.Fragment>
  ) : (
    props.currency
  );

  return <span className="currency">{content}</span>;
};

Currency.defaultProps = {
  issuer: null,
  link: true
};

Currency.propTypes = {
  currency: PropTypes.string.isRequired,
  issuer: PropTypes.string,
  link: PropTypes.bool
};

export default Currency;
