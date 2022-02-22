import { connect } from 'react-redux';
import React, { KeyboardEvent } from 'react';
import { translate } from 'react-i18next';
// import { withRouter } from 'react-router';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { ReactComponent as SidechainLogo } from '../shared/images/sidechain_logo.svg';
import './sidechainhome.css';

interface Props {
  t: (arg: string) => string;
}

const SidechainHome = (props: Props) => {
  console.log(props);
  const { t } = props;
  console.log(t);

  function sidechainOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const sidechainUrl = event.currentTarget.value.trim();
      console.log(sidechainUrl);
    }
  }

  function clickButton(
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>
  ) {
    console.log(event.target);
    console.log('button clicked');
  }

  return (
    <div className="sidechain-main-page">
      <div className="content">
        <SidechainLogo className="sidechain-logo" />
        <div className="text box-header">Sidechain Custom Network</div>
        <div className="text help">Enter sidechain node URL to access sidechain data.</div>
        <input
          type="text"
          placeholder={t('header.search.placeholder')}
          onKeyDown={sidechainOnKeyDown}
        />
        <div
          tabIndex={0}
          role="button"
          className="button"
          onClick={clickButton}
          onKeyUp={clickButton}
        >
          <span>Go to network</span>
        </div>
      </div>
    </div>
  );
};

export default connect(state => ({
  // @ts-ignore
  language: state.app.language,
}))(translate()(SidechainHome));
