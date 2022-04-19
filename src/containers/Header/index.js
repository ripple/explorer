import classnames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BREAKPOINTS, ANALYTIC_TYPES, analytics } from '../shared/utils';
import Menu from './Menu';
import MobileMenu from './MobileMenu';
import Banner from './Banner';
import Search from './Search';
import { ReactComponent as Logo } from '../shared/images/XRPLedger.svg';
import { ReactComponent as ArrowIcon } from '../shared/images/down_arrow.svg';
import { ReactComponent as CheckIcon } from '../shared/images/checkmark.svg';
import './header.css';
import SocketContext from '../shared/SocketContext';

const STATIC_ENV_LINKS = {
  mainnet: process.env.REACT_APP_MAINNET_LINK,
  testnet: process.env.REACT_APP_TESTNET_LINK,
  devnet: process.env.REACT_APP_DEVNET_LINK,
  nft_sandbox: process.env.REACT_APP_NFTSANDBOX_LINK,
};

const SIDECHAIN_BASE_LINK = process.env.REACT_APP_SIDECHAIN_LINK;

function isCustomNetwork(mode) {
  return !Object.keys(STATIC_ENV_LINKS).includes(mode);
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  getCurrentPath() {
    const { location } = this.props;
    return location.pathname;
  }

  toggleExpand = event => {
    const className = event?.target?.getAttribute('class');
    const { expanded } = this.state;
    if (!(expanded && className === 'sidechain_input'))
      // don't de-expand if clicking in the textbox
      this.setState(prevState => {
        return { expanded: !prevState.expanded };
      });
  };

  handleClick = event => {
    const mode = event.currentTarget.getAttribute('value');

    if (mode === process.env.REACT_APP_ENVIRONMENT) {
      return;
    }

    const desiredLink = STATIC_ENV_LINKS[mode] ?? process.env.REACT_APP_MAINNET_LINK;
    this.switchMode(desiredLink);
  };

  handleCustomNetworkClick = event => {
    const { expanded } = this.state;
    if (!expanded) {
      return;
    }
    const currentRippledUrl = this.context; // this is undefined if not in sidechain mode
    const newRippledUrl = event.currentTarget.getAttribute('value');

    if (newRippledUrl.toLowerCase() === currentRippledUrl.toLowerCase()) {
      return;
    }

    this.switchMode(`${SIDECHAIN_BASE_LINK}/${newRippledUrl}`);
  };

  onInputKeyDown = event => {
    if (event.key === 'Enter') {
      const currentRippledUrl = this.context;
      const rippledUrl = event.currentTarget.value.trim();
      if (
        currentRippledUrl != null &&
        rippledUrl.toLowerCase() === currentRippledUrl.toLowerCase()
      ) {
        return;
      }
      this.switchMode(`${SIDECHAIN_BASE_LINK}/${rippledUrl}`);
    }
  };

  switchMode = desiredLink => {
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: desiredLink,
    });
    window.location.assign(desiredLink);
  };

  ignore = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  renderDropdown = (network, handleClick, classname, text) => {
    return (
      <div
        key={network}
        className={classname}
        role="menuitem"
        value={network}
        onClick={handleClick}
        onKeyUp={handleClick}
        tabIndex={0}
      >
        <span>{text}</span>
        {/*
        Adding this space to provide width between name
        and selected checkmark
        */}
        &nbsp;
        <CheckIcon className="check" desc={network} />
      </div>
    );
  };

  renderSidechainInput() {
    return (
      <div
        key="new_sidechain"
        className="item input"
        value="new_sidechain"
        role="menuitem"
        tabIndex={0}
      >
        <input
          className="sidechain_input"
          type="text"
          placeholder="Add custom sidechain"
          onKeyDown={this.onInputKeyDown}
        />
      </div>
    );
  }

  render() {
    const { t, isScrolled, width, inNetwork } = this.props;
    const { expanded } = this.state;
    const rippledUrl = this.context;
    const menu =
      width >= BREAKPOINTS.landscape || !inNetwork ? (
        <Menu t={t} currentPath={this.getCurrentPath()} inNetwork={inNetwork} />
      ) : null;
    const mobileMenu =
      width < BREAKPOINTS.landscape && inNetwork ? (
        <MobileMenu t={t} currentPath={this.getCurrentPath()} inNetwork={inNetwork} />
      ) : null;
    const currentMode = process.env.REACT_APP_ENVIRONMENT;

    const urlLinkMap = {
      ...STATIC_ENV_LINKS,
      // TODO: store previous sidechains in cookies, add them here
    };

    if (rippledUrl != null) {
      urlLinkMap[rippledUrl] = `${process.env.REACT_APP_SIDECHAIN_LINK}${rippledUrl}`;
    }

    return (
      <>
        <div className={classnames('header', { 'header-shadow': isScrolled })}>
          <div className={`network ${currentMode}`}>
            <div
              className={classnames('dropdown', { expanded })}
              role="menubar"
              tabIndex={0}
              onClick={this.toggleExpand}
              onKeyUp={this.toggleExpand}
            >
              <div className="bg" />
              {!inNetwork &&
                !expanded &&
                this.renderDropdown(
                  'no-network',
                  this.handleCustomNetworkClick,
                  classnames('item', 'custom', { selected: true }),
                  t('no_network_selected')
                )}
              {Object.keys(urlLinkMap).map(network => {
                return isCustomNetwork(network)
                  ? this.renderDropdown(
                      network,
                      this.handleCustomNetworkClick,
                      classnames('item', 'custom', { selected: network === rippledUrl }),
                      `${t('sidechain_data')}: ${network.toLowerCase()}`
                    )
                  : this.renderDropdown(
                      network,
                      this.handleClick,
                      classnames('item', { selected: currentMode === network }),
                      t(`${network}_data`)
                    );
              })}
              {this.renderSidechainInput()}
            </div>
            <div
              className="arrowContainer"
              onClick={this.toggleExpand}
              onKeyUp={this.toggleExpand}
              role="menubar"
              tabIndex={0}
              value="arrow"
            >
              <ArrowIcon className={classnames('arrow', { open: expanded })} />
            </div>
          </div>
          <Banner />
          <div className="topbar">
            <div className="element">
              <Link to="/">
                <Logo className="logo" alt={t('xrpl_explorer')} />
              </Link>
            </div>
            {inNetwork && (
              <div className="element">
                <Search />
              </div>
            )}
            <div className={classnames('element', { notInNetwork: !inNetwork })}>{menu}</div>
            {mobileMenu}
          </div>

          <div className="clear" />
        </div>
      </>
    );
  }
}
Header.contextType = SocketContext;

Header.defaultProps = {
  inNetwork: true,
};

Header.propTypes = {
  t: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  inNetwork: PropTypes.bool,
};

export default withRouter(
  translate()(
    connect(state => ({
      width: state.app.width,
      isScrolled: state.app.isScrolled,
    }))(Header)
  )
);
