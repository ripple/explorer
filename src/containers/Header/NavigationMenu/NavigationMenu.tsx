import classnames from 'classnames'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import Logo from '../../shared/images/XRPLedger.svg'
import { Search } from '../Search'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import type { defaultTranslationsKey } from '../../../../@types/i18next'
import { useAnalytics } from '../../shared/analytics'
import { buildPath, RouteLink, RouteDefinition } from '../../shared/routing'

import './NavigationMenu.scss'

export interface NavigationMenuRoute {
  title: defaultTranslationsKey
  current?: (path: string) => boolean
}

export interface NavigationMenuParentRoute extends NavigationMenuRoute {
  children: NavigationMenuInternalRoute[]
}

export interface NavigationMenuExternalRoute extends NavigationMenuRoute {
  link: string
}

export interface NavigationMenuInternalRoute extends NavigationMenuRoute {
  route: RouteDefinition<any>
  params?: any
}

export type NavigationMenuAnyRoute =
  | NavigationMenuParentRoute
  | NavigationMenuExternalRoute
  | NavigationMenuInternalRoute

export const NavigationMenu = ({
  routes,
}: {
  routes: NavigationMenuAnyRoute[]
}) => {
  const { track } = useAnalytics()
  const location = useLocation()
  const { t } = useTranslation()
  const toggle = useRef<HTMLInputElement>(null)

  // manually set toggle to false because the <Link> component will `preventDefault` breaking the <label> technique
  const forceClose = () => {
    if (toggle.current) {
      toggle.current.checked = false
    }
  }

  const trackOpened = () => {
    track('mobile_menu', {})
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" data-testid="navbar-brand">
        <Logo alt={t('xrpl_explorer')} />
      </Link>

      <input
        className="navbar-toggle-state"
        type="checkbox"
        id="navbar-toggle-state"
        ref={toggle}
        hidden
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions -- just for tracking */}
      <label
        className="navbar-toggle"
        htmlFor="navbar-toggle-state"
        onClick={trackOpened}
      >
        <span className="navbar-toggle-line" />
      </label>

      <div className="navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item nav-search">
            <Search />
          </li>
          {routes.map((nav) => {
            const title = t(nav.title)

            if ('children' in nav) {
              return (
                <Dropdown
                  key={nav.title}
                  title={title}
                  className="nav-item dropdown-right"
                  tagName="li"
                >
                  {nav.children.map((child) => (
                    <DropdownItem
                      href={buildPath(child.route, child.params)}
                      data-title={title}
                      className="nav-link"
                      key={child.title}
                    >
                      {t(child.title)}
                    </DropdownItem>
                  ))}
                </Dropdown>
              )
            }
            if ('link' in nav) {
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

            return (
              <li
                key={nav.title}
                className={classnames(
                  'nav-item',
                  nav.current && nav.current(location.pathname) && 'selected',
                )}
              >
                <RouteLink
                  to={nav.route}
                  className="nav-link"
                  onClick={forceClose}
                  params={nav.params || {}}
                >
                  {t(nav.title)}
                </RouteLink>
                <div className="dot" />
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
