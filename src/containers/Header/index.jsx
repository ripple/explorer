import classnames from 'classnames'
import PropTypes from 'prop-types'

import Banner from './Banner'
import { navigationConfig } from '../App/routes'
import { NavigationMenu } from './NavigationMenu'

import './header.scss'
import { LanguagePicker } from './LanguagePicker/LanguagePicker'
import { NetworkPicker } from './NetworkPicker/NetworkPicker'

export const Header = ({ inNetwork }) => (
  <header className={classnames('header', !inNetwork && 'header-no-network')}>
    <div className="topbar">
      <NetworkPicker />
      <LanguagePicker />
    </div>
    <Banner />
    <NavigationMenu routes={navigationConfig} />
  </header>
)

Header.defaultProps = {
  inNetwork: true,
}

Header.propTypes = {
  inNetwork: PropTypes.bool,
}
