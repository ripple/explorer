import React, { KeyboardEvent, useRef } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
// import { withRouter } from 'react-router';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { ReactComponent as SidechainLogo } from '../shared/images/sidechain_logo.svg';
import Header from '../Header';
import { ANALYTIC_TYPES, analytics } from '../shared/utils';
import './sidechainhome.css';

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
    switchMode(networkText.current?.value || '');
  }

  return (
    <div className="app">
      {/* @ts-ignore -- I think this error is because Header isn't in TS */}
      <Header inNetwork={false} />
      <div className="sidechain-main-page">
        <div className="content">
          <SidechainLogo className="sidechain-logo" />
          <div className="text box-header">Sidechain Custom Network</div>
          <div className="text help">Enter sidechain node URL to access sidechain data.</div>
          <input
            type="text"
            placeholder={t('sidechain_node_input')}
            onKeyDown={sidechainOnKeyDown}
            ref={networkText}
          />
          <div className="button">
            <div tabIndex={0} role="button" onClick={clickButton} onKeyUp={clickButton}>
              <span>Go to network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(state => ({
  // @ts-ignore
  language: state.app.language,
}))(translate()(SidechainHome));
