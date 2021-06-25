import { translate } from 'react-i18next';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../shared/components/Tooltip';
import { CURRENCY_OPTIONS } from '../shared/transactionUtils';
import { localizeNumber } from '../shared/utils';
import { ReactComponent as PauseIcon } from '../shared/images/ic_pause.svg';
import { ReactComponent as ResumeIcon } from '../shared/images/ic_play.svg';
import './css/ledgerMetrics.css';

const DEFAULTS = {
  load_fee: '--',
  txn_sec: '--',
  txn_ledger: '--',
  ledger_interval: '--',
  avg_fee: '--',
  quorum: '--',
  nUnl: []
};

const renderXRP = (d, language) => {
  const options = Object.assign({}, CURRENCY_OPTIONS, { currency: 'XRP' });
  return localizeNumber(d, language, options);
};

class LedgerMetrics extends Component {
  state = {
    tooltip: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return Object.assign({}, prevState, nextProps);
  }

  showTooltip = event => {
    this.setState({
      tooltip: Object.assign(
        {},
        { nUnl: this.state.data.nUnl },
        {
          mode: 'nUnl',
          v: this.state.nUnl,
          x: event.pageX,
          y: event.pageY
        }
      )
    });
  };

  hideTooltip = () => this.setState({ tooltip: null });

  renderPause() {
    const { t, onPause, paused } = this.props;
    const Icon = paused ? ResumeIcon : PauseIcon;
    const text = paused ? 'resume' : 'pause';

    return (
      <div tabIndex={0} role="button" className="pause-resume" onClick={onPause} onKeyUp={onPause}>
        <Icon className="icon" alt={t(text)} />
        <span>{t(text)}</span>
      </div>
    );
  }

  render() {
    const { language, t } = this.props;
    const data = Object.assign({}, DEFAULTS, this.state.data);

    if (data.load_fee === '--') {
      data.load_fee = data.base_fee || '--';
    }
    delete data.base_fee;
    const items = Object.keys(data)
      .map(key => {
        if (data[key] === undefined) return null;

        let content = null;
        let className = 'label';
        if (key.includes('fee') && !isNaN(data[key])) {
          content = renderXRP(data[key], language);
        } else if (key === 'ledger_interval' && data[key] !== '--') {
          content = `${data[key]} ${t('seconds_short')}`;
        } else if (key === 'nUnl' && data[key].length === 0) {
          return null;
        } else if (key === 'nUnl') {
          content = data[key].length;
          className = 'label nUnlMetric';
          return (
            <a href="https://xrpl.org/negative-unl.html" target="_blank" rel="noopener noreferrer">
              <div
                role="link"
                className="cell"
                onFocus={() => {}}
                onBlur={() => {}}
                onMouseOver={e => this.showTooltip(e)}
                onMouseOut={this.hideTooltip}
                tabIndex={0}
                key={key}
              >
                <div className={className}>{t(key)}</div>
                <span>{content}</span>
              </div>
            </a>
          );
        } else {
          content = data[key];
        }

        return (
          <div className="cell" key={key}>
            <div className={className}>{t(key)}</div>
            <span>{content}</span>
          </div>
        );
      })
      .reverse();

    return (
      <div className="metrics-control">
        <div className="control">{this.renderPause()}</div>
        <div className="metrics">{items}</div>
        <Tooltip t={t} language={language} data={this.state.tooltip} />
      </div>
    );
  }
}

LedgerMetrics.propTypes = {
  data: PropTypes.shape({}),
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired
};

LedgerMetrics.defaultProps = {
  data: {}
};

export default translate()(LedgerMetrics);
