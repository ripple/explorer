import React from 'react';
import PropTypes from 'prop-types';

const NFTokenBurn = props => {
  const {
    data: {
      instructions: { tokenID },
    },
  } = props;

  return (
    <div className="row flex-wrap">
      <div className="label">Token ID</div>
      <div className="value">
        <div className="dt">{tokenID}</div>
      </div>
    </div>
  );
};

NFTokenBurn.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      tokenID: PropTypes.string,
    }),
  }).isRequired,
};

export default NFTokenBurn;
