import classnames from 'classnames'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Logo from '../../shared/images/XRPLedger.svg'
import { Search } from '../Search'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import type { defaultTranslationsKey } from '../../../../@types/i18next'

import './NavigationMenu.scss'
import { buildPath, RouteLink, RouteDefinition } from '../../shared/routing'

export interface NavigationMenuRoute {
  title: defaultTranslationsKey
}

export interface NavigationMenuParentRoute extends NavigationMenuRoute {
  children: NavigationMenuInternalRoute[]
}

export interface NavigationMenuExternalRoute extends NavigationMenuRoute {
  link: string
}

export interface NavigationMenuInternalRoute extends NavigationMenuRoute {
  route: RouteDefinition<any>
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
  const { t } = useTranslation()
  const toggle = useRef<HTMLInputElement>(null)

  // manually set toggle to false because the <Link> component will `preventDefault` breaking the <label> technique
  const forceClose = () => {
    if (toggle.current) {
      toggle.current.checked = false
    }
  }

  return (
    <nav className="navbar">
      <RouterLink to="/" className="navbar-brand">
        <Logo alt={t('xrpl_explorer')} />
      </RouterLink>

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
          {/* @ts-ignore */}
          {routes.map((nav): any => {
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
                      href={buildPath(child.route, {})}
                      data-title={title}
                      className="nav-link"
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
            const current = false

            return (
              <li
                key={nav.title}
                className={classnames('nav-item', current && 'selected')}
              >
                <RouteLink
                  to={nav.route}
                  className="nav-link"
                  onClick={forceClose}
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
