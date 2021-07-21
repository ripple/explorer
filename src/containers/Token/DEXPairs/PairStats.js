import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as PairLine } from '../../shared/images/pair_line.svg';

const PairStats = props => {
  const { pair } = props;
  const { low, high, token } = pair;
  const { t } = props;

  return (
    <div className="pair-stats-container">
      <table>
        <tbody>
          <tr>
            <td className="low">{t('low')}</td>
            <td className="high">{t('high')}</td>
          </tr>
          <tr>
            <td className="low">
              <span className="low-num">
                {low.num}
                {low.unit}
              </span>
              {` ${token}`}
            </td>
            <td className="high">
              <span className="high-num">
                {high.num}
                {high.unit}
              </span>
              {` ${token}`}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <PairLine />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PairStats.propTypes = {
  pair: PropTypes.shape({
    low: PropTypes.shape({
      num: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    high: PropTypes.shape({
      num: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    average: PropTypes.shape({
      num: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default PairStats;
