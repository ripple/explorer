import React from 'react';
import PropTypes from 'prop-types';
import '../css/txlabel.css';

interface Props {
  type: string;
  t: (s: string) => string;
}

const TxLabel = (props: Props) => {
  const { type, t } = props;
  return (
    <div className={`tx-label tx-type ${type}`}>
      <div>{t(`transaction_${type}`)}</div>
    </div>
  );
};

TxLabel.propTypes = {
  type: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default TxLabel;
