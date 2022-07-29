import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadNFTState } from './actions';
import Loader from '../../shared/components/Loader';
import '../../shared/css/nested-menu.css';
import './styles.css';
import SocketContext from '../../shared/SocketContext';

import Copy from '../../shared/components/Copy';

class NFTHeader extends Component {
  componentDidMount() {
    const { actions, tokenId } = this.props;
    const rippledSocket = this.context;
    actions.loadNFTState(tokenId, rippledSocket.clioSocket);
  }

  componentDidUpdate(prevProps) {
    const nexttokenId = prevProps.tokenId;
    const { tokenId, actions } = this.props;
    const rippledSocket = this.context;

    if (nexttokenId !== tokenId) {
      actions.loadNFTState(nexttokenId, rippledSocket.clioSocket);
    }
  }

  renderDetails() {
    const { t, data } = this.props;
    const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data;
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
                <Copy className="copy" text={emailHash} />
              </td>
            </tr>
          )}
          {NFTTaxon !== undefined && (
            <tr className="row">
              <td className="col1">Taxon ID</td>
              <td className="col2">{NFTTaxon}</td>
            </tr>
          )}
          {uri && (
            <tr className="row">
              <td className="col1">URI</td>
              <td className="col2">
                {abbrvURI}
                <Copy className="copy" text={uri} />
              </td>
            </tr>
          )}
          {transferFee !== undefined && (
            <tr className="row">
              <td className="col1">Transfer Fee</td>
              <td className="col2">{transferFee}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  renderSettings() {
    const { data } = this.props;
    const { flags } = data;

    const burnable = flags && flags.includes('lsfBurnable') ? 'enabled' : 'disabled';
    const onlyXRP = flags && flags.includes('lsfOnlyXRP') ? 'enabled' : 'disabled';
    const trustLine = flags && flags.includes('lsfTrustLine') ? 'enabled' : 'disabled';
    const transferable = flags && flags.includes('lsfTransferable') ? 'enabled' : 'disabled';
    return (
      <table>
        <tbody>
          <tr className="row">
            <td className="col1">Burnable</td>
            <td className="col2">{burnable}</td>
          </tr>
          <tr className="row">
            <td className="col1">Only XRP</td>
            <td className="col2">{onlyXRP}</td>
          </tr>
          <tr className="row">
            <td className="col1">Trust Line</td>
            <td className="col2">{trustLine}</td>
          </tr>
          <tr className="row">
            <td className="col1">Transferable</td>
            <td className="col2">{transferable}</td>
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
              <Copy className="copy" text={issuer} />
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
      </div>
    );
  }

  render() {
    const { loading, data } = this.props;
    const tokenId = data.NFTId;
    return (
      <div className="token-header">
        <div className="section">
          <div className="box-header">
            <div className="token-title">
              {!loading && <>NFT ID</>}
              {!loading && (
                <div className="token-type">
                  <div className="subscript">NFT</div>
                </div>
              )}
            </div>
            <div className="title-content">{tokenId}</div>
          </div>
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
    NFTId: PropTypes.string,
    ledgerIndex: PropTypes.number,
    owner: PropTypes.string,
    isBurned: PropTypes.bool,
    flags: PropTypes.arrayOf(PropTypes.string),
    transferFee: PropTypes.number,
    issuer: PropTypes.string,
    NFTTaxon: PropTypes.number,
    NFTSequence: PropTypes.number,
    uri: PropTypes.string,
    validated: PropTypes.bool,
    status: PropTypes.string,
    warnings: PropTypes.arrayOf(PropTypes.string),
    minted: PropTypes.string,
    domain: PropTypes.string,
    emailHash: PropTypes.string,
  }).isRequired,
  actions: PropTypes.shape({
    loadNFTState: PropTypes.func.isRequired,
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
        loadNFTState,
      },
      dispatch
    ),
  })
)(withTranslation()(NFTHeader));
