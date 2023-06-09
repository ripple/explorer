import { FC } from 'react'
import classnames from 'classnames'

import { Banner } from './Banner'
import { NavigationMenu } from './NavigationMenu'
import { routesConfig } from './routes'

import './header.scss'
import { LanguagePicker } from './LanguagePicker/LanguagePicker'
import { NetworkPicker } from './NetworkPicker/NetworkPicker'

export const Header: FC<{ inNetwork?: boolean }> = ({ inNetwork }) => (
  <header className={classnames('header', !inNetwork && 'header-no-network')}>
    <div className="topbar">
      <NetworkPicker />
      <LanguagePicker />
    </div>
    <Banner />
    <NavigationMenu routes={routesConfig} />
  </header>
)
