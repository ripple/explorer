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
import UrlContext from '../shared/urlContext';

const MODE = process.env.REACT_APP_ENVIRONMENT;

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
    const value = event?.target?.getAttribute('value');
    const type = event?.target?.getAttribute('type');
    this.setState(prevState => {
      if (!prevState.expanded || (value == null && type == null)) {
        // only expand if:
        //  - dropdown is not already expanded OR
        //  - click is outside the dropdown (represented by value == null && type == null)
        // This is done so that the dropdown doesn't close when typing in a network
        return { expanded: !prevState.expanded };
      }
      return prevState;
    });
  };

  handleClick = event => {
    const mode = event.currentTarget.getAttribute('value');

    if (mode === MODE) {
      return;
    }

    const desiredLink = STATIC_ENV_LINKS[mode] ?? process.env.REACT_APP_MAINNET_LINK;
    this.switchMode(desiredLink);
  };

  handleCustomNetworkClick = event => {
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
      if (rippledUrl.toLowerCase() === currentRippledUrl.toLowerCase()) {
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
    window.location = desiredLink;
  };

  ignore = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  renderDropdown(network) {
    return (
      <div
        key={network}
        className={classnames('item', { selected: MODE === network })}
        role="menuitem"
        value={network}
        onClick={this.handleClick}
        onKeyUp={this.handleClick}
        tabIndex={0}
      >
        <span>{network}</span>
        {/*
        Adding this space to provide width between name
        and selected checkmark
        */}
        &nbsp;
        <CheckIcon className="check" desc={network} />
      </div>
    );
  }

  renderCustomNetworkDropdown(network) {
    const rippledUrl = this.context;
    return (
      <div
        key={network}
        className={classnames('item', 'custom', { selected: network === rippledUrl })}
        role="menuitem"
        value={network}
        onClick={this.handleCustomNetworkClick}
        onKeyUp={this.handleCustomNetworkClick}
        tabIndex={0}
      >
        <span>{network}</span>
        {/*
        Adding this space to provide width between name
        and selected checkmark
        */}
        &nbsp;
        <CheckIcon className="check" desc={network} />
      </div>
    );
  }

  renderSidechainInput() {
    return (
      <div
        key="new_sidechain"
        className={classnames('item', { selected: false })}
        value="new_sidechain"
        role="menuitem"
        tabIndex={0}
      >
        <input type="text" placeholder="Add custom sidechain" onKeyDown={this.onInputKeyDown} />
      </div>
    );
  }

  render() {
    const { t, isScrolled, width } = this.props;
    const { expanded } = this.state;
    const rippledUrl = this.context;
    const menu =
      width >= BREAKPOINTS.landscape ? <Menu t={t} currentPath={this.getCurrentPath()} /> : null;
    const mobileMenu =
      width < BREAKPOINTS.landscape ? (
        <MobileMenu t={t} currentPath={this.getCurrentPath()} />
      ) : null;

    const urlLinkMap = {
      ...STATIC_ENV_LINKS,
      [rippledUrl]: `${process.env.REACT_APP_SIDECHAIN_LINK}${rippledUrl}`,
      // TODO: store previous sidechains in cookies, add them here
    };

    return (
      <>
        <div className={classnames('header', { 'header-shadow': isScrolled })}>
          <div className={`network ${MODE}`}>
            <div
              className={classnames('dropdown', { expanded })}
              role="menubar"
              tabIndex={0}
              onClick={this.toggleExpand}
              onKeyUp={this.toggleExpand}
            >
              <div className="bg" />
              {Object.keys(urlLinkMap).map(network => {
                return isCustomNetwork(network)
                  ? this.renderCustomNetworkDropdown(network)
                  : this.renderDropdown(network);
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
            <div className="element">
              <Search />
            </div>
            <div className="element">{menu}</div>
            {mobileMenu}
          </div>

          <div className="clear" />
        </div>
      </>
    );
  }
}
Header.contextType = UrlContext;

Header.propTypes = {
  t: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(
  translate()(
    connect(state => ({
      width: state.app.width,
      isScrolled: state.app.isScrolled,
    }))(Header)
  )
);
