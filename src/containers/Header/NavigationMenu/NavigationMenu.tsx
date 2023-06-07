import classnames from 'classnames'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import Logo from '../../shared/images/XRPLedger.svg'
import { Search } from '../Search'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import type { defaultTranslationsKey } from '../../../../@types/i18next'

import './NavigationMenu.scss'

export interface NavigationMenuRoute {
  title: defaultTranslationsKey
  children?: NavigationMenuRoute[]
  link?: string
  path?: string
}

export const NavigationMenu = ({
  routes,
}: {
  routes: NavigationMenuRoute[]
}) => {
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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Logo alt={t('xrpl_explorer')} />
      </Link>

      <input
        className="navbar-toggle-state"
        type="checkbox"
        id="navbar-toggle-state"
        ref={toggle}
        hidden
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="navbar-toggle" htmlFor="navbar-toggle-state">
        <span className="navbar-toggle-line" />
      </label>

      <div className="navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item nav-search">
            <Search />
          </li>
          {routes.map((nav) => {
            const title = t(nav.title)

            if (nav.children) {
              return (
                <Dropdown
                  key={nav.title}
                  title={title}
                  className="nav-item dropdown-right"
                  tagName="li"
                >
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
              )
            }

            if (nav.link) {
              return (
                <li key={nav.title} className="nav-item">
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
              <li
                key={nav.title}
                className={classnames('nav-item', current && 'selected')}
              >
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
      </div>
    </nav>
  )
}
