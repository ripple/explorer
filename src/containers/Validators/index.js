import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NoMatch from '../NoMatch';
import Loader from '../shared/components/Loader';
import Tabs from '../shared/components/Tabs';
import { analytics, ANALYTIC_TYPES, NOT_FOUND } from '../shared/utils';
import { loadValidator } from './actions';
import SimpleTab from './SimpleTab';
import HistoryTab from './HistoryTab';
import './validator.css';
import SocketContext from '../shared/SocketContext';

const ERROR_MESSAGES = {};
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'validator_not_found',
  hints: ['check_validator_key'],
};
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
};

const getErrorMessage = error => ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

class Validator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { t, actions, match, data } = this.props;
    const { identifier = '', tab = 'details' } = match.params;
    let short = '';
    if (data.domain) {
      short = data.domain;
    } else if (data.master_key) {
      short = `${data.master_key.substr(0, 8)}...`;
    } else if (data.signing_key) {
      short = `${data.signing_key.substr(0, 8)}...`;
    }
    this.fetchData();

    document.title = `Validator ${short} | ${t('xrpl_explorer')}`;

    analytics(ANALYTIC_TYPES.pageview, {
      title: 'Validator',
      path: `/validators/:identifier/${tab}`,
    });

    const rippledSocket = this.context;

    if (identifier && identifier !== data.master_key && identifier !== data.signing_key) {
      actions.loadValidator(identifier, rippledSocket);
    }
  }

  fetchData = () => {
    const { match } = this.props;
    const { identifier = '' } = match.params;
    axios.get(`/api/v1/validator_report/${identifier}`).then(resp => {
      this.setState({ reports: resp.data });
    });
  };

  renderSummary() {
    const { /* t, */ data } = this.props;
    // TODO: translate

    let name = 'Unknown Validator';
    if (data.domain) {
      name = `Validator / Domain: ${data.domain}`;
    } else if (data.master_key) {
      name = `Validator / Public Key: ${data.master_key.substr(0, 8)}...`;
    } else if (data.signing_key) {
      name = `Validator / Ephemeral Key: ${data.signing_key.substr(0, 8)}...`;
    }

    let subtitle = 'UNKNOWN KEY';
    if (data.master_key) {
      subtitle = `MASTER KEY: ${data.master_key}`;
    } else if (data.signing_key) {
      subtitle = `SIGNING KEY: ${data.signing_key}`;
    }

    return (
      <div className="summary">
        <div className="type">{name}</div>
        <div className="hash" title={subtitle}>
          {subtitle}
        </div>
      </div>
    );
  }

  renderTabs() {
    const { match } = this.props;
    const { tab = 'details', identifier } = match.params;
    const { path = '/' } = match;
    const tabs = ['details', 'history'];
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${identifier}`;
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />;
  }

  renderValidator() {
    const { reports } = this.state;
    const { t, language, data, width, match } = this.props;
    const { tab = 'details' } = match.params;
    let body;

    switch (tab) {
      case 'history':
        body = <HistoryTab t={t} language={language} reports={reports} />;
        break;
      default:
        body = <SimpleTab t={t} language={language} data={data} width={width} />;
        break;
    }

    return (
      <>
        {this.renderSummary()}
        {this.renderTabs()}
        <div className="tab-body">{body}</div>
      </>
    );
  }

  render() {
    const { loading, data } = this.props;
    const loader = loading ? <Loader className="show" /> : <Loader />;
    let body;

    if (data.error) {
      const message = getErrorMessage(data.error);
      body = <NoMatch title={message.title} hints={message.hints} />;
    } else if (data.master_key || data.signing_key) {
      body = this.renderValidator();
    } else if (!loading) {
      body = (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Could not load validator</h2>
        </div>
      );
    }

    return (
      <div className="validator">
        {loader}
        {body}
      </div>
    );
  }
}
Validator.contextType = SocketContext;

Validator.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
      PropTypes.bool,
    ])
  ).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      identifier: PropTypes.string,
      tab: PropTypes.string,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadValidator: PropTypes.func,
  }).isRequired,
};

export default connect(
  state => ({
    loading: state.validator.loading, // refers to state object in rootReducer.js
    data: state.validator.data,
    width: state.app.width,
    language: state.app.language,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadValidator,
      },
      dispatch
    ),
  })
)(translate()(Validator));
