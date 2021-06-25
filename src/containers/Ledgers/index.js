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
  state = {
    validators: {},
    ledgers: [],
    paused: false
  };

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
      selected: prevState.selected === pubkey ? null : pubkey
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
    return (
      <div className="ledgers-page">
        <Streams
          validators={this.state.validators}
          updateLedgers={this.updateLedgers}
          updateMetrics={this.updateMetrics}
        />
        <LedgerMetrics
          language={language}
          data={this.state.metrics}
          onPause={() => this.pause()}
          paused={this.state.paused}
        />
        <Ledgers
          language={language}
          ledgers={this.state.ledgers}
          validators={this.state.validators}
          unlCount={this.state.unlCount}
          selected={this.state.selected}
          setSelected={this.setSelected}
          paused={this.state.paused}
        />
      </div>
    );
  }
}

LedgersPage.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(state => ({
  language: state.app.language
}))(translate()(LedgersPage));
