import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { ReactComponent as SidechainLogo } from '../shared/images/sidechain_logo.svg';
import './sidechainhome.css';

// interface Props {

// }

const SidechainHome = () => {
  return (
    <div className="sidechain-main-page">
      <div className="content">
        <SidechainLogo className="sidechain-logo" />
      </div>
    </div>
  );
};

export default SidechainHome;
