import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import Tabs from '../shared/components/Tabs';
import Streams from '../shared/components/Streams';
import Hexagons from './Hexagons';
import ValidatorsTable from './ValidatorsTable';
import Log from '../shared/log';
import { localizeNumber } from '../shared/utils';

class Validators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vList: {},
      liveValidators: [],
      metrics: {}
    };
  }

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // ensure the latest reported ledger is shown
  mergeLatest = (validators = [], live = []) => {
    const latest = {};
    live.forEach(d => {
      latest[d.pubkey] = {
        ledger_index: d.ledger_index,
        ledger_hash: d.ledger_hash
      };
    });

    return validators.map(d => {
      const updated = {};
      if (latest[d.signing_key] && latest[d.signing_key].ledger_index > d.ledger_index) {
        updated.ledger_index = latest[d.signing_key].ledger_index;
        updated.ledger_hash = latest[d.signing_key].ledger_hash;
      }

      return Object.assign(d, updated);
    });
  };

  updateMetrics = metrics => {
    this.setState({ metrics });
  };

  updateValidators = liveValidators =>
    this.setState(prevState => ({
      liveValidators,
      validators: this.mergeLatest(prevState.validators, liveValidators)
    }));

  fetchData = () => {
    const url = '/api/v1/validators?verbose=true';

    axios
      .get(url)
      .then(resp => {
        const vList = {};
        resp.data.forEach(v => {
          vList[v.signing_key] = {
            signing_key: v.signing_key,
            master_key: v.master_key,
            unl: v.unl,
            domain: v.domain
          };
        });

        this.setState(prevState => ({
          vList,
          validators: this.mergeLatest(resp.data, prevState.liveValidators),
          unlCount: resp.data.filter(d => Boolean(d.unl)).length
        }));
      })
      .catch(e => Log.error(e));
  };

  render() {
    const { validators, unlCount, vList, liveValidators, metrics } = this.state;
    const { path, t, language } = this.props;
    const tabs = ['nodes', 'validators'];
    return (
      <div className="network-page">
        <Streams
          validators={vList}
          updateValidators={this.updateValidators}
          updateMetrics={this.updateMetrics}
        />
        <Hexagons data={liveValidators} list={vList} />
        <div className="stat">
          {validators && (
            <>
              <span>{t('validators_found')}: </span>
              <span>
                {localizeNumber(validators.length, language)}
                {unlCount !== 0 && (
                  <i>
                    {' '}
                    ({t('unl')}: {unlCount})
                  </i>
                )}
              </span>
            </>
          )}
        </div>
        <div className="wrap">
          <Tabs tabs={tabs} selected="validators" path={path} />
          <ValidatorsTable validators={validators} metrics={metrics} />
        </div>
      </div>
    );
  }
}

Validators.propTypes = {
  path: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(state => ({
  language: state.app.language
}))(translate()(Validators));
