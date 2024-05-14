import { FC } from 'react'
import classnames from 'classnames'

import { navigationConfig } from '../App/navigation'
import { NavigationMenu } from './NavigationMenu'

import './header.scss'
import { LanguagePicker } from './LanguagePicker/LanguagePicker'
import { NetworkPicker } from './NetworkPicker/NetworkPicker'

export const Header: FC<{ inNetwork?: boolean }> = ({ inNetwork = true }) => (
  <header className={classnames('header', !inNetwork && 'header-no-network')}>
    <div className="topbar">
      <NetworkPicker />
      <LanguagePicker />
    </div>
    <NavigationMenu routes={navigationConfig} />
  </header>
)
