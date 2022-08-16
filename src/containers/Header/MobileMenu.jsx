import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  removeRoutes,
  analytics,
  ANALYTIC_TYPES,
  BREAKPOINTS,
} from '../shared/utils'
import defaultRoutes from './routes'
import Search from './Search'
import arrowIcon from '../shared/images/down_arrow_black_50.png'
import closeIcon from '../shared/images/close.png'
import unionIcon from '../shared/images/union.png'
import externalLinkIcon from '../shared/images/external_link.svg'
import './mobileMenu.scss'

const MODE = process.env.REACT_APP_ENVIRONMENT
class MobileMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
    this.handleEvents = this.handleEvents.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.width >= BREAKPOINTS.landscape) {
      return { isOpen: false }
    }
    return null
  }

  handleEvents(event) {
    event.preventDefault()
    event.stopPropagation()
    const { key, type } = event
    this.setState((prevState) => {
      const newState = { isOpen: !prevState.isOpen }
      if (key === 'Tab' && type === 'keyup') {
        newState.isOpen = true
        analytics(ANALYTIC_TYPES.event, {
          eventCategory: 'MobileMenu',
          eventAction: 'Tab-Open',
        })
      }
      return newState
    })
  }

  closeMenu() {
    this.setState((prevState) => ({ isOpen: false }))
  }

  item(route, nested = '') {
    const { t, currentPath } = this.props
    const current =
      currentPath === route.path ||
      (currentPath.indexOf(route.path) === 0 && route.path !== '/')
    const className = current
      ? `mobile-item selected ${nested}`
      : `mobile-item ${nested}`
    return (
      <div className={className} key={route.title}>
        <Link onClick={this.closeMenu} to={route.path}>
          {t(route.title)}
        </Link>
      </div>
    )
  }

  headerItem(route) {
    const { t } = this.props
    return (
      <div className="header-item" key={route.title}>
        <span className="title">{t(route.title)}</span>
        <img src={arrowIcon} alt="" className="arrow" />
      </div>
    )
  }

  externalLink(route) {
    const { t } = this.props
    const title = t(route.title)
    return (
      <div className="mobile-item link" key={route.link}>
        <a href={route.link} target="_blank" rel="noopener noreferrer">
          {title}
          <img src={externalLinkIcon} alt={title} />
        </a>
      </div>
    )
  }

  render() {
    const { handleEvents } = this
    let { routes } = this.props
    const { inNetwork } = this.props
    const { isOpen } = this.state
    const img = isOpen ? closeIcon : unionIcon
    const style = { display: isOpen ? 'block' : 'none' }
    const items = []

    if (MODE !== 'mainnet') {
      routes = removeRoutes(routes, 'tokens')
    }
    if (!inNetwork) {
      routes = removeRoutes(routes, 'explorer', 'network', 'tokens')
    }

    routes.forEach((route) => {
      if (route.children) {
        items.push(this.headerItem(route))
        route.children.forEach((child) => {
          items.push(this.item(child, 'nested'))
        })
      } else if (route.link) {
        items.push(this.externalLink(route))
      } else {
        items.push(this.item(route))
      }
    })

    return (
      <div className="mobile-menu">
        {isOpen && <div className="overlay" />}
        <div
          className="menubar"
          onClick={handleEvents}
          onKeyUp={handleEvents}
          role="menubar"
          tabIndex="0"
        >
          <img src={img} alt="" />
        </div>
        <div className="mobile-menu-items" style={style}>
          {inNetwork && <Search mobile callback={this.closeMenu} />}
          {items}
        </div>
      </div>
    )
  }
}

MobileMenu.propTypes = {
  t: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape({})),
  inNetwork: PropTypes.bool,
}

MobileMenu.defaultProps = {
  routes: defaultRoutes,
  inNetwork: true,
}

export default connect((state) => ({
  width: state.app.width,
}))(MobileMenu)
