import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Settings = ({ flags }) => {
  const burnable = flags.includes('lsfBurnable') ? 'enabled' : 'disabled'
  const onlyXRP = flags.includes('lsfOnlyXRP') ? 'enabled' : 'disabled'
  const trustLine = flags.includes('lsfTrustLine') ? 'enabled' : 'disabled'
  const transferable = flags.includes('lsfTransferable')
    ? 'enabled'
    : 'disabled'

  return (
    <table className="token-table">
      <tbody>
        <tr className="row">
          <td className="col1">Burnable</td>
          <td className="col2">{burnable}</td>
        </tr>
        <tr className="row">
          <td className="col1">Only XRP</td>
          <td className="col2">{onlyXRP}</td>
        </tr>
        <tr className="row">
          <td className="col1">Trust Line</td>
          <td className="col2">{trustLine}</td>
        </tr>
        <tr className="row">
          <td className="col1">Transferable</td>
          <td className="col2">{transferable}</td>
        </tr>
      </tbody>
    </table>
  )
}

Settings.propTypes = {
  flags: PropTypes.arrayOf(PropTypes.string),
}

Settings.defaultProps = {
  flags: [],
}

export default Settings
