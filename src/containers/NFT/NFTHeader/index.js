import React, { Component, useEffect, useContext, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadNFTState } from './actions';
import Loader from '../../shared/components/Loader';
import '../../shared/css/nested-menu.css';
import './styles.css';
import SocketContext from '../../shared/SocketContext';
import Tooltip from '../../shared/components/Tooltip';
import CopyToClipboard from '../../shared/components/CopyToClipboard';

const NFTHeader = props => {
  const { t } = useTranslation();
  const { actions, tokenId, data, loading, language } = props;
  const rippledSocket = useContext(SocketContext);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    actions.loadNFTState(tokenId, rippledSocket.clioSocket);
  }, [tokenId]);

  const showTooltip = (event, d) => {
    setTooltip({ ...d, mode: 'nftId', x: event.pageX, y: event.pageY });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  const renderDetails = () => {
    const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data;
    const abbrvEmail = emailHash?.replace(/(.{20})..+/, '$1...');
    const abbrvURI = uri?.replace(/(.{20})..+/, '$1...');
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
                <CopyToClipboard className="copy" text={emailHash} />
              </td>
            </tr>
          )}
          <tr className="row">
            <td className="col1">Taxon ID</td>
            <td className="col2">{NFTTaxon}</td>
          </tr>
          {uri && (
            <tr className="row">
              <td className="col1">URI</td>
              <td className="col2">
                {abbrvURI}
                <CopyToClipboard className="copy" text={uri} />
              </td>
            </tr>
          )}
          <tr className="row">
            <td className="col1">Transfer Fee</td>
            <td className="col2">{transferFee}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderSettings = () => {
    const { flags } = data;

    const burnable = flags?.includes('lsfBurnable') ? 'enabled' : 'disabled';
    const onlyXRP = flags?.includes('lsfOnlyXRP') ? 'enabled' : 'disabled';
    const trustLine = flags?.includes('lsfTrustLine') ? 'enabled' : 'disabled';
    const transferable = flags?.includes('lsfTransferable') ? 'enabled' : 'disabled';
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
  };

  const renderHeaderContent = () => {
    const { issuer } = data;
    const abbrvIssuer = issuer?.replace(/(.{23})..+/, '$1...');
    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Link className="value-content" to={`/accounts/${issuer}`}>
                {abbrvIssuer}
              </Link>
              <CopyToClipboard className="copy" text={issuer} />
            </div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="details">
            <div className="title">{t('details')}</div>
            {renderDetails()}
          </div>
          <div className="settings">
            <div className="title">{t('settings')}</div>
            {renderSettings()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="token-header">
      <div className="section">
        {!loading && Object.keys(data).length !== 0 && (
          <div className="box-header">
            <div className="token-title">
              NFT ID
              <div className="token-type">
                <div className="subscript">NFT</div>
              </div>
            </div>
            <div
              className="title-content"
              onMouseOver={e => showTooltip(e, { tokenId })}
              onFocus={() => {}}
              onMouseLeave={hideTooltip}
            >
              {tokenId}
            </div>
          </div>
        )}
      </div>
      <div className="box-content">
        {loading || Object.keys(data).length === 0 ? <Loader /> : renderHeaderContent()}
      </div>
      <Tooltip data={tooltip} />
    </div>
  );
};

NFTHeader.propTypes = {
  language: PropTypes.string.isRequired,
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
