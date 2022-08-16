import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import defaultRoutes from './routes'
import arrowIcon from '../shared/images/down_arrow_black_50.png'
import { removeRoutes } from '../shared/utils'
import externalLinkIcon from '../shared/images/external_link.svg'
import './menu.scss'

const MODE = process.env.REACT_APP_ENVIRONMENT
class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleEvents = this.handleEvents.bind(this)
  }

  handleEvents(event) {
    event.preventDefault()
    event.stopPropagation()
    const title = event.currentTarget.getAttribute('data-id')
    const { key, type } = event
    this.setState((prevState) => {
      const newState = {}
      newState[title] = !prevState[title]
      if (type === 'mouseleave') {
        newState[title] = false
      } else if (type === 'mouseenter' || (key === 'Tab' && type === 'keyup')) {
        newState[title] = true
      }
      return newState
    })
  }

  item(route, pos) {
    const { t, currentPath } = this.props
    const current =
      currentPath === route.path ||
      (currentPath.indexOf(route.path) === 0 && route.path !== '/')
    const className = current
      ? `menu-item ${pos} ${pos}-selected`
      : `${pos} menu-item`
    return (
      <div className={className} key={route.title}>
        <Link to={route.path}>{t(route.title)}</Link>

        <div className="dot" />
      </div>
    )
  }

  nestedItem(route) {
    const { t } = this.props
    const { handleEvents } = this
    // eslint-disable-next-line react/destructuring-assignment
    const style = { display: this.state[route.title] ? 'block' : 'none' }
    return (
      <div
        className="nested-menu"
        key={route.title}
        data-id={route.title}
        onMouseEnter={handleEvents}
        onClick={handleEvents}
        onKeyUp={handleEvents}
        onMouseLeave={handleEvents}
        role="menubar"
        tabIndex="0"
      >
        <span className="title">{t(route.title)}</span>
        <img src={arrowIcon} alt="" className="arrow" />
        <div className="nested-items" style={style}>
          {route.children.map((child) => this.item(child, 'vertical'))}
        </div>
      </div>
    )
  }

  externalLink(route) {
    const { t } = this.props
    const title = t(route.title)
    return (
      <div className="menu-item link" key={route.link}>
        <a href={route.link} target="_blank" rel="noopener noreferrer">
          {title}
          <img src={externalLinkIcon} alt={title} />
        </a>
      </div>
    )
  }

  render() {
    let { routes } = this.props
    const { inNetwork } = this.props

    if (!inNetwork) {
      routes = removeRoutes(routes, 'explorer', 'network')
    }

    const menu = routes.map((route) => {
      if (route.path) {
        return this.item(route, 'horizontal')
      }
      if (route.link) {
        return this.externalLink(route)
      }

      return this.nestedItem(route)
    })

    return <div className="menu">{menu}</div>
  }
}

Menu.propTypes = {
  t: PropTypes.func.isRequired,
  currentPath: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape({})),
  inNetwork: PropTypes.bool,
}

Menu.defaultProps = {
  routes: defaultRoutes,
  inNetwork: true,
}

export default Menu
