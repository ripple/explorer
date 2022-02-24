import React, { KeyboardEvent, useRef } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ReactComponent as SidechainLogo } from '../shared/images/sidechain_logo.svg';
import Header from '../Header';
import { ANALYTIC_TYPES, analytics } from '../shared/utils';
import './sidechainhome.css';
import { ReactComponent as RightArrow } from '../shared/images/side_arrow_green.svg';

interface Props {
  t: (arg: string) => string;
}

const SidechainHome = (props: Props) => {
  const { t } = props;

  const networkText = useRef<HTMLInputElement>(null);

  function switchMode(desiredLink: string) {
    const sidechainUrl = process.env.REACT_APP_SIDECHAIN_LINK;
    const url = `${sidechainUrl}/${desiredLink}`;
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: url,
    });
    // TODO: do some validation on this??
    window.location.assign(url);
  }

  function sidechainOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const sidechainUrl = event.currentTarget.value.trim();
      switchMode(sidechainUrl);
    }
  }

  function clickButton(
    _event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>
  ) {
    const sidechainUrl = networkText.current?.value;
    if (sidechainUrl != null) {
      switchMode(sidechainUrl);
    }
  }

  function renderCustomNetwork(network: string) {
    return (
      <Link key={network} className="custom-network-item" to={`/${network}`}>
        <div key={network} className="custom-network-text">
          {network}
        </div>
        <RightArrow className="custom-network-arrow" />
      </Link>
    );
  }

  // TODO: get previous networks from cookies
  const existingNetworks: string[] = [];

  return (
    <div className="app">
      {/* @ts-ignore -- I think this error is because Header isn't in TS */}
      <Header inNetwork={false} />
      <div className="sidechain-main-page">
        <div className="logo-content">
          <SidechainLogo className="sidechain-logo" />
          <div className="page-header">Sidechain Custom Network</div>
          <div className="input-help">Enter sidechain node URL to access sidechain data.</div>
          <input
            className="sidechain-input"
            type="text"
            placeholder={t('sidechain_node_input')}
            onKeyDown={sidechainOnKeyDown}
            ref={networkText}
          />
          <div
            className="sidechain-input-button"
            tabIndex={0}
            role="button"
            onClick={clickButton}
            onKeyUp={clickButton}
          >
            <span>Go to network</span>
          </div>
        </div>
        {existingNetworks.length > 0 && (
          <div className="custom-network-list">
            <div className="custom-network-header">Custom Networks</div>
            {existingNetworks.map(renderCustomNetwork)}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(state => ({
  // @ts-ignore
  language: state.app.language,
}))(translate()(SidechainHome));
