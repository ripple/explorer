import classnames from 'classnames'
import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { connect } from 'react-redux'
import { BREAKPOINTS, ANALYTIC_TYPES, analytics } from '../shared/utils'

import Banner from './Banner'
import ArrowIcon from '../shared/images/down_arrow.svg'
import CheckIcon from '../shared/images/checkmark.svg'
import './header.scss'
import './NetworkSelector/NetworkSelector.scss'
import './menu.scss'
import SocketContext from '../shared/SocketContext'
import { NavigationMenu } from './NavigationMenu/NavigationMenu'

const STATIC_ENV_LINKS = {
  mainnet: process.env.VITE_MAINNET_LINK,
  testnet: process.env.VITE_TESTNET_LINK,
  devnet: process.env.VITE_DEVNET_LINK,
  amm: process.env.VITE_AMM_LINK,
}

const CUSTOM_NETWORK_BASE_LINK = process.env.VITE_CUSTOMNETWORK_LINK

function isCustomNetwork(mode) {
  return !Object.keys(STATIC_ENV_LINKS).includes(mode)
}

function getSocketUrl(socket) {
  return socket?.endpoint.replace('wss://', '').replace('ws://', '')
}

const Header = ({ inNetwork }) => {
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
    if (!(expanded && className === 'custom_network_input'))
      // don't de-expand if clicking in the textbox
      setExpanded((prevExpanded) => !prevExpanded)
  }

  function handleClick(event) {
    const mode = event.currentTarget.getAttribute('value')

    if (mode === process.env.VITE_ENVIRONMENT) {
      return
    }

    const desiredLink = STATIC_ENV_LINKS[mode] ?? process.env.VITE_MAINNET_LINK
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

    switchMode(`${CUSTOM_NETWORK_BASE_LINK}/${newRippledUrl}`)
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
      switchMode(`${CUSTOM_NETWORK_BASE_LINK}/${rippledUrl}`)
    }
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

  function renderCustomNetworkInput() {
    return (
      <div
        key="new_network"
        className="item input"
        value="new_network"
        role="menuitem"
        tabIndex={0}
      >
        <input
          className="custom_network_input"
          type="text"
          placeholder="Add custom network"
          onKeyDown={onInputKeyDown}
        />
      </div>
    )
  }

  const currentMode = process.env.VITE_ENVIRONMENT

  const urlLinkMap = {
    ...STATIC_ENV_LINKS,
    // TODO: store previous custom networks in cookies, add them here
  }

  const rippledUrl = getSocketUrl(rippledSocket)

  if (process.env.VITE_ENVIRONMENT === 'custom') {
    urlLinkMap[
      rippledUrl
    ] = `${process.env.VITE_CUSTOMNETWORK_LINK}${rippledUrl}`
  }

  return (
    <header className={classnames('header', inNetwork && 'header-in-network')}>
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
                  `${t('custom_network_data')}: ${network.toLowerCase()}`,
                )
              : renderDropdown(
                  network,
                  handleClick,
                  classnames('item', { selected: currentMode === network }),
                  t(`${network}_data`),
                ),
          )}
          {renderCustomNetworkInput()}
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
      <NavigationMenu />
    </header>
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
