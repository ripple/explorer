import React from 'react';
import PropTypes from 'prop-types';

const OfferCancel = props => {
  const { data, t } = props;
  const { cancel } = data.instructions;

  return (
    <div className="row">
      <div className="label">{t('cancel_offer')}</div>
      <div className="value"># {cancel}</div>
    </div>
  );
};

OfferCancel.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      cancel: PropTypes.number
    })
  }).isRequired
};

export default OfferCancel;
