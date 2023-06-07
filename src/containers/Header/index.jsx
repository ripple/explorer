import classnames from 'classnames'
import PropTypes from 'prop-types'

import Banner from './Banner'
import { NavigationMenu } from './NavigationMenu'
import { routesConfig } from './routes'

import './header.scss'
import { LanguagePicker } from './LanguagePicker/LanguagePicker'
import { NetworkPicker } from './NetworkPicker/NetworkPicker'

export function Header({ inNetwork }) {
  return (
    <header className={classnames('header', !inNetwork && 'header-no-network')}>
      <div className="topbar">
        <NetworkPicker />
        <LanguagePicker />
      </div>
      <Banner />
      <NavigationMenu routes={routesConfig} />
    </header>
  )
}

Header.defaultProps = {
  inNetwork: true,
}

Header.propTypes = {
  inNetwork: PropTypes.bool,
}
