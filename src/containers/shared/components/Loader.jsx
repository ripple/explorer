import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import loader from '../images/xrp-loader.png';
import '../css/loader.css';

const Loader = props => (
  <div className={`loader ${props.className}`}>
    <img src={loader} alt={props.t('loading')} />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func.isRequired
};

Loader.defaultProps = {
  className: ''
};

export default translate()(Loader);
