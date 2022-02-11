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

const MODE = process.env.REACT_APP_ENVIRONMENT;

const ENV_LINK_MAP = {
  mainnet: process.env.REACT_APP_MAINNET_LINK,
  testnet: process.env.REACT_APP_TESTNET_LINK,
  devnet: process.env.REACT_APP_DEVNET_LINK,
  nft_sandbox: process.env.REACT_APP_NFTSANDBOX_LINK,
  sidechain: process.env.REACT_APP_SIDECHAIN_LINK,
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getCurrentPath() {
    const { location } = this.props;
    return location.pathname;
  }

  toggleExpand = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  handleClick = event => {
    const mode = event.currentTarget.getAttribute('value');

    if (mode === MODE) {
      return;
    }

    const desiredLink = ENV_LINK_MAP[mode] ?? process.env.REACT_APP_MAINNET_LINK;
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

  render() {
    const { t, isScrolled, width } = this.props;
    const { expanded } = this.state;
    const menu =
      width >= BREAKPOINTS.landscape ? <Menu t={t} currentPath={this.getCurrentPath()} /> : null;
    const mobileMenu =
      width < BREAKPOINTS.landscape ? (
        <MobileMenu t={t} currentPath={this.getCurrentPath()} />
      ) : null;

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
              {Object.keys(ENV_LINK_MAP).map(mode => (
                <div
                  key={mode}
                  className={classnames('item', { selected: MODE === mode })}
                  role="menuitem"
                  value={mode}
                  onClick={this.handleClick}
                  onKeyUp={this.handleClick}
                  tabIndex={0}
                >
                  <span>{t(`${mode}_data`)}</span>
                  {/*
                  Adding this space to provide width between name
                  and selected checkmark
                  */}
                  &nbsp;
                  <CheckIcon className="check" desc={t(`${mode}_data`)} />
                </div>
              ))}
            </div>
            <div
              className="arrowContainer"
              onClick={this.toggleExpand}
              onKeyUp={this.toggleExpand}
              role="menubar"
              tabIndex={0}
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
