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
  // sidechain: process.env.REACT_APP_SIDECHAIN_LINK,
};

function isCustomNetwork(mode) {
  return !Object.keys(STATIC_ENV_LINKS).includes(mode);
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line class-methods-use-this
  onKeyDown(event) {
    if (event.key === 'Enter') {
      console.log('done entering');
      const rippledUrl = event.currentTarget.value.trim();
      console.log(rippledUrl);
      // const { callback } = this.props;
      // const currentRippledUrl = this.context;

      // analytics(ANALYTIC_TYPES.event, {
      //   eventCategory: 'globalSearch',
      //   eventAction: type,
      //   eventLabel: id,
      // });

      // this.setState(
      //   {
      //     redirect: type === 'invalid' ? `/search/${id}` : `/${type}/${normalize(id, type)}`,
      //   },
      //   callback
      // );
    }
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
        return { expanded: !prevState.expanded };
      }
      return prevState;
    });
  };

  handleClick = event => {
    const mode = event.currentTarget.getAttribute('value');
    // TODO: get link for new sidechain

    if (mode === MODE) {
      return;
    }

    const desiredLink = STATIC_ENV_LINKS[mode] ?? process.env.REACT_APP_MAINNET_LINK;
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: desiredLink,
    });
    // window.location = desiredLink;
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
        // eslint-disable-next-line no-return-assign
        ref={node => (this.node = node)}
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
        className={classnames('item', { selected: network === rippledUrl })}
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

  renderSidechainInput() {
    return (
      <div
        key="new_sidechain"
        className={classnames('item', { selected: false })}
        value="new_sidechain"
        role="menuitem"
        tabIndex={0}
      >
        <input type="text" placeholder="Add custom sidechain" onKeyDown={this.onKeyDown} />
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

    const ENV_LINK_MAP = {
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
              {Object.keys(ENV_LINK_MAP).map(network => {
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
