import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';
import Log from '../shared/log';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import Streams from '../shared/components/Streams';
import LedgerMetrics from './LedgerMetrics';
import Ledgers from './Ledgers';

class LedgersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validators: {},
      ledgers: [],
      metrics: {},
      paused: false,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.fetchValidators();
    this.interval = setInterval(this.fetchValidators, 5 * 60 * 1000);
    document.title = `${t('xrpl_explorer')} | ${t('ledgers')}`;
    analytics(ANALYTIC_TYPES.pageview, { title: 'Ledgers', path: '/' });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setSelected = pubkey => {
    this.setState(prevState => ({
      selected: prevState.selected === pubkey ? null : pubkey,
    }));
  };

  updateLedgers = ledgers => {
    this.setState({ ledgers });
  };

  updateMetrics = metrics => {
    this.setState({ metrics });
  };

  pause = () => this.setState(prevState => ({ paused: !prevState.paused }));

  fetchValidators = () => {
    const url = `/api/v1/validators`;

    axios
      .get(url)
      .then(resp => {
        const validators = {};
        let unlCount = 0;

        resp.data.forEach(v => {
          unlCount += v.unl === process.env.REACT_APP_VALIDATOR ? 1 : 0;
          validators[v.signing_key] = v;
        });

        return { validators, unlCount };
      })
      .then(data => this.setState(data))
      .catch(e => Log.error(e));
  };

  render() {
    const { language } = this.props;
    const { validators, metrics, paused, ledgers, unlCount, selected } = this.state;
    return (
      <div className="ledgers-page">
        <Streams
          validators={validators}
          updateLedgers={this.updateLedgers}
          updateMetrics={this.updateMetrics}
        />
        <LedgerMetrics
          language={language}
          data={metrics}
          onPause={() => this.pause()}
          paused={paused}
        />
        <Ledgers
          language={language}
          ledgers={ledgers}
          validators={validators}
          unlCount={unlCount}
          selected={selected}
          setSelected={this.setSelected}
          paused={paused}
        />
      </div>
    );
  }
}

LedgersPage.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect(state => ({
  language: state.app.language,
}))(translate()(LedgersPage));
