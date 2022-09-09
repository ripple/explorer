import classnames from 'classnames'
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { BREAKPOINTS, ANALYTIC_TYPES, analytics } from '../shared/utils'
import Menu from './Menu'
import MobileMenu from './MobileMenu'
import Banner from './Banner'
import Search from './Search'
import { ReactComponent as Logo } from '../shared/images/XRPLedger.svg'
import { ReactComponent as ArrowIcon } from '../shared/images/down_arrow.svg'
import { ReactComponent as CheckIcon } from '../shared/images/checkmark.svg'
import './header.scss'
import SocketContext from '../shared/SocketContext'

const STATIC_ENV_LINKS = {
  mainnet: process.env.REACT_APP_MAINNET_LINK,
  testnet: process.env.REACT_APP_TESTNET_LINK,
  devnet: process.env.REACT_APP_DEVNET_LINK,
  nft_sandbox: process.env.REACT_APP_NFTSANDBOX_LINK,
}

const SIDECHAIN_BASE_LINK = process.env.REACT_APP_SIDECHAIN_LINK

function isCustomNetwork(mode) {
  return !Object.keys(STATIC_ENV_LINKS).includes(mode)
}

function getSocketUrl(socket) {
  return socket?.endpoint.replace('wss://', '').replace(/:[0-9]+/, '')
}

const Header = (props) => {
  const rippledSocket = useContext(SocketContext)
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  function switchMode(desiredLink) {
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: desiredLink,
    })
    window.location.assign(desiredLink)
  }

  function getCurrentPath() {
    return location.pathname
  }

  function toggleExpand(event) {
    const className = event?.target?.getAttribute('class')
    if (!(expanded && className === 'sidechain_input'))
      // don't de-expand if clicking in the textbox
      setExpanded((prevExpanded) => !prevExpanded)
  }

  function handleClick(event) {
    const mode = event.currentTarget.getAttribute('value')

    if (mode === process.env.REACT_APP_ENVIRONMENT) {
      return
    }

    const desiredLink =
      STATIC_ENV_LINKS[mode] ?? process.env.REACT_APP_MAINNET_LINK
    switchMode(desiredLink)
  }

  function handleCustomNetworkClick(event) {
    if (!expanded) {
      return
    }

    const currentRippledUrl = getSocketUrl(rippledSocket)
    const newRippledUrl = event.currentTarget.getAttribute('value')

    if (newRippledUrl.toLowerCase() === currentRippledUrl.toLowerCase()) {
      return
    }

    switchMode(`${SIDECHAIN_BASE_LINK}/${newRippledUrl}`)
  }

  function onInputKeyDown(event) {
    if (event.key === 'Enter') {
      const currentRippledUrl = getSocketUrl(rippledSocket)
      const rippledUrl = event.currentTarget.value.trim()
      if (
        currentRippledUrl != null &&
        rippledUrl.toLowerCase() === currentRippledUrl.toLowerCase()
      ) {
        return
      }
      switchMode(`${SIDECHAIN_BASE_LINK}/${rippledUrl}`)
    }
  }

  function ignore(event) {
    event.preventDefault()
    event.stopPropagation()
  }

  function renderDropdown(network, clickHandler, classname, text) {
    return (
      <div
        key={network}
        className={classname}
        role="menuitem"
        value={network}
        onClick={clickHandler}
        onKeyUp={clickHandler}
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
    )
  }

  function renderSidechainInput() {
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
          onKeyDown={onInputKeyDown}
        />
      </div>
    )
  }

  const { isScrolled, width, inNetwork } = props
  const menu =
    width >= BREAKPOINTS.landscape || !inNetwork ? (
      <Menu t={t} currentPath={getCurrentPath()} inNetwork={inNetwork} />
    ) : null
  const mobileMenu =
    width < BREAKPOINTS.landscape && inNetwork ? (
      <MobileMenu t={t} currentPath={getCurrentPath()} inNetwork={inNetwork} />
    ) : null
  const currentMode = process.env.REACT_APP_ENVIRONMENT

  const urlLinkMap = {
    ...STATIC_ENV_LINKS,
    // TODO: store previous sidechains in cookies, add them here
  }

  const rippledUrl = getSocketUrl(rippledSocket)

  if (process.env.REACT_APP_ENVIRONMENT === 'sidechain') {
    urlLinkMap[
      rippledUrl
    ] = `${process.env.REACT_APP_SIDECHAIN_LINK}${rippledUrl}`
  }

  return (
    <>
      <div className={classnames('header', { 'header-shadow': isScrolled })}>
        <div className={`network ${currentMode}`}>
          <div
            className={classnames('dropdown', { expanded })}
            role="menubar"
            tabIndex={0}
            onClick={toggleExpand}
            onKeyUp={toggleExpand}
          >
            <div className="bg" />
            {!inNetwork &&
              !expanded &&
              renderDropdown(
                'no-network',
                handleCustomNetworkClick,
                classnames('item', 'custom', { selected: true }),
                t('no_network_selected'),
              )}
            {Object.keys(urlLinkMap).map((network) =>
              isCustomNetwork(network)
                ? renderDropdown(
                    network,
                    handleCustomNetworkClick,
                    classnames('item', 'custom', {
                      selected: network === rippledUrl,
                    }),
                    `${t('sidechain_data')}: ${network.toLowerCase()}`,
                  )
                : renderDropdown(
                    network,
                    handleClick,
                    classnames('item', { selected: currentMode === network }),
                    t(`${network}_data`),
                  ),
            )}
            {renderSidechainInput()}
          </div>
          <div
            className="arrow-container"
            onClick={toggleExpand}
            onKeyUp={toggleExpand}
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
          <div
            className={classnames('element', { 'not-in-network': !inNetwork })}
          >
            {menu}
          </div>
          {mobileMenu}
        </div>

        <div className="clear" />
      </div>
    </>
  )
}

Header.defaultProps = {
  inNetwork: true,
}

Header.propTypes = {
  width: PropTypes.number.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  inNetwork: PropTypes.bool,
}

export default connect((state) => ({
  width: state.app.width,
  isScrolled: state.app.isScrolled,
}))(Header)
