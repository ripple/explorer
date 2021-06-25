import React from 'react';
import PropTypes from 'prop-types';

const OfferCancel = props => (
  <div key="offer_cancel">
    {props.t('offer_cancel_description')}
    <b> {props.data.tx.OfferSequence}</b>
  </div>
);

OfferCancel.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tx: PropTypes.shape({
      OfferSequence: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default OfferCancel;
