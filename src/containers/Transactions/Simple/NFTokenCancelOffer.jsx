import React from 'react';
import PropTypes from 'prop-types';

import Account from '../../shared/components/Account';
import Currency from '../../shared/components/Currency';

const NFTokenCancelOffer = props => {
  const {
    data: {
      instructions: { cancelledOffers },
    },
  } = props;

  return (
    <>
      {cancelledOffers.map(
        ({ amount: { amount, issuer, currency }, offerID, tokenID, offerer }) => (
          <>
            <div className="row flex-wrap">
              <div className="label">Offer ID</div>
              <div className="value">
                <div className="dt">{offerID}</div>
              </div>
            </div>
            <div className="row flex-wrap">
              <div className="label">Token ID</div>
              <div className="value">
                <div className="dt">{tokenID}</div>
              </div>
            </div>
            <div className="row">
              <div className="label">Amount</div>
              <div className="value">
                {amount}
                <Currency currency={currency} issuer={issuer} />
              </div>
            </div>
            <div className="row">
              <div className="label">Offerer</div>
              <div className="value account">
                <Account account={offerer} />
              </div>
            </div>
          </>
        )
      )}
    </>
  );
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
          offerID: PropTypes.string,
          tokenID: PropTypes.string,
          offerer: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
};

export default NFTokenCancelOffer;
