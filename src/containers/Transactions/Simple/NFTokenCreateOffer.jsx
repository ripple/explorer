import React from 'react';
import PropTypes from 'prop-types';

import Account from '../../shared/components/Account';
import Currency from '../../shared/components/Currency';

const NFTokenCreateOffer = props => {
  const {
    data: {
      instructions: { offerID, account, amount, tokenID, isSellOffer, owner },
    },
  } = props;

  return (
    <>
      <div className="row flex-wrap">
        <div className="label">Offer ID</div>
        <div className="value">
          <div className="dt">{offerID}</div>
        </div>
      </div>
      <div className="row flex-wrap">
        <div className="label">{isSellOffer ? 'Seller' : 'Buyer'}</div>
        <div className="value account">
          <Account account={account} />
        </div>
      </div>
      {!isSellOffer && (
        <div className="row flex-wrap">
          <div className="label">Owner</div>
          <div className="value account">
            <Account account={owner} />
          </div>
        </div>
      )}
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
    </>
  );
};

NFTokenCreateOffer.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      account: PropTypes.string,
      amount: PropTypes.shape({
        currency: PropTypes.string,
        amount: PropTypes.number,
        issuer: PropTypes.string,
      }),
      tokenID: PropTypes.string,
      isSellOffer: PropTypes.bool,
      owner: PropTypes.string,
      offerID: PropTypes.string,
    }),
  }).isRequired,
};

export default NFTokenCreateOffer;
