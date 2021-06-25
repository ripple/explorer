import React from 'react';
import PropTypes from 'prop-types';

const OfferCreate = props => {
  const { data, t } = props;
  const { ticketCount } = data.instructions;

  return (
    <React.Fragment>
      <div className="row">
        <div className="label ticket-count">{t('ticket_count')}</div>
        <div className="value">{ticketCount}</div>
      </div>
    </React.Fragment>
  );
};

OfferCreate.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      ticketCount: PropTypes.number,
      ticketSequence: PropTypes.number
    })
  }).isRequired
};

export default OfferCreate;
