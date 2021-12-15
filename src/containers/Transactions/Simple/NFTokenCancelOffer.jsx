import React from 'react';
import PropTypes from 'prop-types';

import Account from '../../shared/components/Account';
import Currency from '../../shared/components/Currency';

const renderCancelledOffer = ({ tokenID, amount, owner }) => (
  <>
    <div className="row flex-wrap">
      <div className="label">Token ID</div>
      <div className="value">
        <div className="dt">{tokenID}</div>
      </div>
    </div>
    <div className="row">
      <div className="label">Amount</div>
      <div className="value">
        {amount.amount}
        <Currency currency={amount.currency} issuer={amount.issuer} />
      </div>
    </div>
    <div className="row">
      <div className="label">Owner</div>
      <div className="value account">
        <Account account={owner} />
      </div>
    </div>
  </>
);

const NFTokenCancelOffer = props => {
  const {
    data: {
      instructions: { cancelledOffers },
    },
  } = props;

  return <>{cancelledOffers.map(offer => renderCancelledOffer(offer))}</>;
};

NFTokenCancelOffer.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      cancelledOffers: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.shape({
            currency: PropTypes.string,
            amount: PropTypes.number,
            issuer: PropTypes.string,
          }),
          tokenID: PropTypes.string,
          owner: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
};

export default NFTokenCancelOffer;
