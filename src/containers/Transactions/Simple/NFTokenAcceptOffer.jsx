import React from 'react';
import PropTypes from 'prop-types';

import Account from '../../shared/components/Account';
import Currency from '../../shared/components/Currency';

const NFTokenAcceptOffer = props => {
  const {
    data: {
      instructions: { amount, tokenID, seller, buyer },
    },
  } = props;

  return (
    <>
      <div className="row flex-wrap">
        <div className="label">Seller</div>
        <div className="value account">
          <Account account={seller} />
        </div>
      </div>
      <div className="row flex-wrap">
        <div className="label">Buyer</div>
        <div className="value account">
          <Account account={buyer} />
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
          {amount.amount}
          <Currency currency={amount.currency} issuer={amount.issuer} />
        </div>
      </div>
    </>
  );
};

NFTokenAcceptOffer.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      amount: PropTypes.shape({
        currency: PropTypes.string,
        amount: PropTypes.number,
        issuer: PropTypes.string,
      }),
      tokenID: PropTypes.string,
      seller: PropTypes.string,
      buyer: PropTypes.string,
    }),
  }).isRequired,
};

export default NFTokenAcceptOffer;
