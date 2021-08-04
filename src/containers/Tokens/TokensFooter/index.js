import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from '../../shared/components/Loader';

import './styles.css';

/**
 * Calculate the time between the moment the Tokens page is loaded and the last Big Query execution
 *
 * @param number lastUpdatedTime
 * @returns A string indicating the last updated time in minutes or hours
 */
const calculateDelaySinceLastUpdate = lastUpdatedTime => {
  // TODO: handle translations for this
  if (!isNaN(lastUpdatedTime)) {
    const diff = Date.now() - lastUpdatedTime;

    const diffInMinutes = Math.floor(diff / 1000 / 60);

    if (diffInMinutes <= 1) {
      return `Last updated 1 minute ago`;
    }
    if (diffInMinutes < 60) {
      return `Last updated ${diffInMinutes} minutes ago`;
    }
    if (diffInMinutes >= 60 && diffInMinutes < 90) {
      return `Last updated 1 hour ago`;
    }
    if (diffInMinutes >= 90) {
      return `Last updated ${Math.round(diffInMinutes / 60)} hours ago`;
    }
  }
  return `Last updated time unavailable`;
};

const TokensFooter = props => {
  const [updatedTime, setUpdatedTime] = useState();
  const { updated, isLoading, isError } = props;

  useEffect(() => {
    if (!isError) {
      setUpdatedTime(calculateDelaySinceLastUpdate(updated));
    } else {
      setUpdatedTime(calculateDelaySinceLastUpdate(NaN));
    }
  }, [updated, isError]);

  return (
    <div className="tokens-footer-container">
      <div className="disclaimer" />
      <div className="last-update">{isLoading ? <Loader /> : updatedTime}</div>
    </div>
  );
};

TokensFooter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  updated: PropTypes.number,
  isError: PropTypes.bool.isRequired,
};

TokensFooter.defaultProps = {
  updated: undefined,
};

export default TokensFooter;
