import React from 'react';
import PropTypes from 'prop-types';

const OfferCancel = props => {
  const { t, data } = props;
  return (
    <div key="offer_cancel">
      {t('offer_cancel_description')}
      <b> {data.tx.OfferSequence}</b>
    </div>
  );
};

OfferCancel.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      OfferSequence: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OfferCancel;
