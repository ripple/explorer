import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import Logo from '../../shared/images/XRPLedger.svg'
import { Search } from '../Search'

import routesConfig from '../routes'
import './NavigationMenu.scss'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'

export const NavigationMenu = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const toggle = useRef<HTMLInputElement>(null)

  // manually set toggle to false because the <Link> component will `preventDefault` breaking the <label> technique
  const forceClose = () => {
    if (toggle.current) {
      toggle.current.checked = false
    }
  }

  return (
    <div className="bottom-bar">
      <Link to="/" className="nav-link logo">
        <Logo alt={t('xrpl_explorer')} />
      </Link>

      <input
        className="side-menu"
        type="checkbox"
        id="side-menu"
        ref={toggle}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="mobile-menu-toggle" htmlFor="side-menu">
        <span className="mobile-menu-line" />
      </label>

      <nav className="nav">
        <ul className="menu">
          <li className="nav-search">
            <Search />
          </li>
          {routesConfig.map((nav) => {
            const title = t(nav.title)

            if (nav.children) {
              return (
                <li key={nav.title}>
                  <div className="nav-link">
                    <Dropdown title={title} className="dropdown-right">
                      {nav.children.map((child) => (
                        <DropdownItem
                          href={child.path}
                          data-title={title}
                          className="nav-link"
                        >
                          {t(child.title)}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                </li>
              )
            }

            if (nav.link) {
              return (
                <li key={nav.title}>
                  <a
                    href={nav.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-title={title}
                    className="nav-link"
                  >
                    {title}
                  </a>
                </li>
              )
            }
            const current =
              pathname === nav.path ||
              (pathname.indexOf(nav.path || '') === 0 && nav.path !== '/')

            return (
              <li key={nav.title} className={current ? 'selected' : ''}>
                <Link
                  to={nav.path || ''}
                  className="nav-link"
                  onClick={forceClose}
                >
                  {t(nav.title)}
                </Link>
                <div className="dot" />
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
