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
import arrowIcon from '../shared/images/down_arrow.svg';
import checkIcon from '../shared/images/checkmark.svg';
import './header.css';

const MAINNET = 'mainnet';
const TESTNET = 'testnet';
const DEVNET = 'devnet';
const MODE = process.env.REACT_APP_ENVIRONMENT;
const MAINNET_LINK = process.env.REACT_APP_MAINNET_LINK;
const TESTNET_LINK = process.env.REACT_APP_TESTNET_LINK;
const DEVNET_LINK = process.env.REACT_APP_DEVNET_LINK;
class Header extends Component {
  state = {};

  getCurrentPath() {
    return this.props.location.pathname;
  }

  toggleExpand = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  handleClick = event => {
    const mode = event.currentTarget.getAttribute('value');
    if (mode !== MODE) {
      switch (mode) {
        case MAINNET:
          analytics(ANALYTIC_TYPES.event, {
            eventCategory: 'mode switch',
            eventAction: MAINNET_LINK
          });
          window.location = MAINNET_LINK;
          break;
        case TESTNET:
          analytics(ANALYTIC_TYPES.event, {
            eventCategory: 'mode switch',
            eventAction: TESTNET_LINK
          });
          window.location = TESTNET_LINK;
          break;
        case DEVNET:
          analytics(ANALYTIC_TYPES.event, {
            eventCategory: 'mode switch',
            eventAction: DEVNET_LINK
          });
          window.location = DEVNET_LINK;
          break;
        default:
          analytics(ANALYTIC_TYPES.event, {
            eventCategory: 'mode switch',
            eventAction: MAINNET_LINK
          });
          window.location = MAINNET_LINK;
          break;
      }
    }
  };

  ignore = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const { t, isScrolled, width } = this.props;
    const classNames = `dropdown ${this.state.expanded ? 'expanded' : ''}`;
    const headerShadow = isScrolled ? 'header-shadow' : '';
    const menu =
      width >= BREAKPOINTS.landscape ? <Menu t={t} currentPath={this.getCurrentPath()} /> : null;
    const mobileMenu =
      width < BREAKPOINTS.landscape ? (
        <MobileMenu t={t} currentPath={this.getCurrentPath()} />
      ) : null;

    return (
      <React.Fragment>
        <div className={`header ${headerShadow}`}>
          <div className={`network ${MODE}`}>
            <div
              className={classNames}
              role="menubar"
              tabIndex={0}
              onClick={this.toggleExpand}
              onKeyUp={this.toggleExpand}
            >
              <div className="bg" />
              <img className="arrow" src={arrowIcon} alt="" />
              <div
                key="mainnet"
                className={MODE === MAINNET ? 'item selected' : 'item'}
                role="menuitem"
                value={MAINNET}
                onClick={this.handleClick}
                onKeyUp={this.handleClick}
                tabIndex={0}
              >
                <span>{t('live_data')}</span>
                <img className="check" src={checkIcon} alt={t('live_data')} />
              </div>
              <div
                key="testnet"
                className={MODE === TESTNET ? 'item selected' : 'item'}
                role="menuitem"
                value={TESTNET}
                onClick={this.handleClick}
                onKeyUp={this.handleClick}
                tabIndex={0}
              >
                <span>{t('testnet_data')}</span>
                <img className="check" src={checkIcon} alt={t('testnet_data')} />
              </div>
              <div
                key="devnet"
                className={MODE === DEVNET ? 'item selected' : 'item'}
                role="menuitem"
                value={DEVNET}
                onClick={this.handleClick}
                onKeyUp={this.handleClick}
                tabIndex={0}
              >
                <span>{t('devnet_data')}</span>
                <img className="check" src={checkIcon} alt={t('devnet_data')} />
              </div>
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
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  t: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(
  translate()(
    connect(state => ({
      width: state.app.width,
      isScrolled: state.app.isScrolled
    }))(Header)
  )
);
