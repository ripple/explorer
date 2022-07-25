import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadTokenState } from './actions';
import Loader from '../../shared/components/Loader';
import '../../shared/css/nested-menu.css';
import './styles.css';
import { localizeNumber, formatLargeNumber } from '../../shared/utils';
import SocketContext from '../../shared/SocketContext';

import Copy from '../../shared/components/Copy';

class NFTHeader extends Component {
  componentDidMount() {
    const { actions, tokenId } = this.props;
    const rippledSocket = this.context;
    actions.loadTokenState(tokenId, rippledSocket);
  }

  componentDidUpdate(prevProps) {
    const nexttokenId = prevProps.tokenId;
    const { tokenId, actions } = this.props;
    const rippledSocket = this.context;

    if (nexttokenId !== tokenId) {
      actions.loadTokenState(nexttokenId, rippledSocket);
    }
  }

  renderDetails() {
    const { t, data } = this.props;

    // hard coded variables
    const emailHash = 'Some hash';
    const minted = 'Some date';
    const domain = 'xrptoolkit.com';
    const nftId = data.nft_id;
    const taxonId = data.nft_taxon;
    const transferFee = data.transfer_fee;
    const { uri } = data;

    const abbrvEmail = emailHash && emailHash.replace(/(.{20})..+/, '$1...');
    const abbrvURI = uri && uri.replace(/(.{20})..+/, '$1...');
    return (
      <table>
        <tbody>
          {minted && (
            <tr className="row">
              <td className="col1">Minted</td>
              <td className="col2">{minted}</td>
            </tr>
          )}
          {domain && (
            <tr className="row">
              <td className="col1">{t('domain')}</td>
              <td className="col2">
                <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                  {domain}
                </a>
              </td>
            </tr>
          )}
          {emailHash && (
            <tr className="row">
              <td className="col1">{t('email_hash')}</td>
              <td className="col2">
                {abbrvEmail}
                <Copy styleName="copy" text={emailHash} />
              </td>
            </tr>
          )}
          <tr className="row">
            <td className="col1">Taxon ID</td>
            <td className="col2">{taxonId}</td>
          </tr>
          <tr className="row">
            <td className="col1">URI</td>
            <td className="col2">
              {abbrvURI}
              <Copy styleName="copy" text={uri} />
            </td>
          </tr>
          <tr className="row">
            <td className="col1">Transfer Fee</td>
            <td className="col2">{transferFee}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderSettings() {
    const { data } = this.props;
    const { flags } = data;

    const flag1 = 'enabled';
    const flag2 = 'enabled';
    const flag3 = 'enabled';
    const flag4 = 'enabled';
    return (
      <table>
        <tbody>
          <tr className="row">
            <td className="col1">Flag 1</td>
            <td className="col2">{flag1}</td>
          </tr>
          <tr className="row">
            <td className="col1">Flag 2</td>
            <td className="col2">{flag2}</td>
          </tr>
          <tr className="row">
            <td className="col1">Flag 3</td>
            <td className="col2">{flag3}</td>
          </tr>
          <tr className="row">
            <td className="col1">Flag 4</td>
            <td className="col2">{flag4}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderHeaderContent() {
    const { t, data, language, tokenId } = this.props;
    const { issuer } = data;
    const abbrvIssuer = issuer && issuer.replace(/(.{23})..+/, '$1...');
    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Link className="value-content" to={`/accounts/${issuer}`}>
                {abbrvIssuer}
              </Link>
              <Copy styleName="copy" text={issuer} />
            </div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="details">
            <div className="title">{t('details')}</div>
            {this.renderDetails()}
          </div>
          <div className="settings">
            <div className="title">{t('settings')}</div>
            {this.renderSettings()}
          </div>
        </div>
        <div className="note-container">
          <div className="note-left">Disclaimer Text</div>
          <div className="note-right">some very long date</div>
        </div>
      </div>
    );
  }

  render() {
    const { loading, data } = this.props;
    const tokenId = data.nft_id;
    const abbrvtokenId = tokenId && tokenId.replace(/(.{30})..+/, '$1...');
    return (
      <div className="box token-header">
        <div className="section box-header">
          <span className="token-header box-header">
            {tokenId}
            <div className="token-type">
              <div className="subscript">NFT</div>
            </div>
          </span>
        </div>
        <div className="box-content">{loading ? <Loader /> : this.renderHeaderContent()}</div>
      </div>
    );
  }
}

NFTHeader.contextType = SocketContext;

NFTHeader.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tokenId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    nft_id: PropTypes.string,
    ledger_index: PropTypes.number,
    owner: PropTypes.string,
    is_burned: PropTypes.bool,
    flags: PropTypes.number,
    transfer_fee: PropTypes.number,
    issuer: PropTypes.string,
    nft_taxon: PropTypes.number,
    nft_sequence: PropTypes.number,
    uri: PropTypes.string,
    validated: PropTypes.bool,
    status: PropTypes.string,
    warnings: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  actions: PropTypes.shape({
    loadTokenState: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  state => ({
    language: state.app.language,
    loading: state.NFTHeader.loading,
    data: state.NFTHeader.data,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadTokenState,
      },
      dispatch
    ),
  })
)(withTranslation()(NFTHeader));
