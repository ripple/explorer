import React from 'react';
import PropTypes from 'prop-types';
import '../css/txlabel.css';

const TxLabel = props => {
  const { type, t } = props;
  return (
    <div className={`tx-label tx-type ${type}`}>
      <div>{t(`transaction_${type}`)}</div>
    </div>
  );
};

TxLabel.propTypes = {
  type: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default TxLabel;
