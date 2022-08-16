import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { classicAddressToXAddress } from 'ripple-address-codec'
import { loadPayStringData } from './actions'
import Loader from '../../shared/components/Loader'
import './styles.scss'

export class PayStringAddressesTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountId: '',
      actions: '',
      data: {},
    }
  }

  componentDidMount() {
    const { accountId, actions } = this.props
    actions.loadPayStringData(accountId)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextAccountId = nextProps.accountId
    const { accountId, actions, data } = prevState

    if (nextAccountId !== accountId) {
      return {
        accountId: nextAccountId,
        actions,
        data: {},
      }
    }
    // Only update this.state.data if loading just completed without error
    const newDataRecieved =
      nextProps.loadingError === '' && nextProps.data && data !== nextProps.data

    if (newDataRecieved) {
      return {
        accountId: nextAccountId,
        actions,
        data: nextProps.data,
      }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    const { accountId, actions } = this.props
    if (prevProps.accountId !== accountId) {
      actions.loadPayStringData(accountId)
    }
  }

  componentWillUnmount() {
    this.resetPage()
  }

  resetPage() {
    this.setState({
      data: {},
    })
  }

  renderListItem(payString) {
    const { t } = this.props

    // Force values to upper case and replace anything
    // that is not a letter or number with a hyphen.
    const paymentNetwork = payString.paymentNetwork
      .toUpperCase()
      .replace(/([^A-Z0-9]+])/g, '-')
    const environment = payString.environment
      .toUpperCase()
      .replace(/([^A-Z0-9]+])/g, '-')

    const INVALID = t('paystring_address_invalid') // (Invalid)

    // Check that values contain only contains letters, numbers, and certain symbols
    const address = payString.addressDetails.address.match(
      /^[A-Za-z0-9?=&:$/.]+$/,
    )
      ? payString.addressDetails.address
      : INVALID

    let tag = ''
    if (payString.addressDetails.tag) {
      if (payString.addressDetails.tag.match(/^[A-Za-z0-9?=&]+$/)) {
        ;({ tag } = payString.addressDetails)
      } else {
        tag = INVALID
      }
    }

    let addressLink = ''
    let title = ''
    if (paymentNetwork === 'XRPL') {
      if (environment === 'MAINNET') {
        if (tag && tag !== INVALID) {
          // XRPL - with tag
          try {
            const xAddress = classicAddressToXAddress(address, tag, false)
            addressLink = `/accounts/${xAddress}`
            title = `View ${xAddress}`
          } catch (error) {
            title = `Error: ${error.message}`
          }
        } else {
          // XRPL - no tag
          addressLink = `/accounts/${address}`
          title = `View ${address}`
        }
      } else if (environment === 'TESTNET') {
        // XRPL - TESTNET
        if (tag && tag !== INVALID) {
          // XRPL - with tag
          try {
            const xAddress = classicAddressToXAddress(address, tag, true) // true for TESTNET
            addressLink = `https://testnet.xrpl.org/accounts/${xAddress}`
            title = `View ${xAddress}`
          } catch (error) {
            title = `Error: ${error.message}`
          }
        } else {
          // XRPL - no tag
          addressLink = `https://testnet.xrpl.org/accounts/${address}`
          title = `View ${address}`
        }
      }
    } else if (paymentNetwork === 'BTC') {
      addressLink = `https://live.blockcypher.com/btc/address/${address}/`
      title = `BlockCypher: ${address}`
    } else if (paymentNetwork === 'ETH') {
      addressLink = `https://etherscan.io/address/${address}`
      title = `Etherscan: ${address}`
    }

    return (
      <tr key={`${paymentNetwork}.${environment}.${address}.${tag}`}>
        <td className={`col-network paystring-type ${paymentNetwork}`}>
          {addressLink ? (
            <a href={addressLink} title={title} className="address-link link">
              {paymentNetwork}
            </a>
          ) : (
            paymentNetwork
          )}
        </td>
        <td
          className={`col-environment paystring-environment ${environment}`}
          title={environment}
        >
          {environment}
        </td>
        <td className="col-address">
          {addressLink ? (
            <a href={addressLink} title={title} className="address-link">
              {address}
            </a>
          ) : (
            address
          )}
        </td>
        <td className="col-tag">{tag}</td>
      </tr>
    )
  }

  renderListContents() {
    const { loading, loadingError } = this.props
    const { data } = this.state

    if (
      !loading &&
      (!data.addresses || data.addresses.length === 0) &&
      !loadingError
    ) {
      return (
        <tr>
          <td colSpan={4} className="empty-message">
            No PayString Mapping(s) Found
          </td>
        </tr>
      )
    }
    if (!data.addresses) {
      return (
        <tr>
          <td colSpan={4} className="empty-message">
            ...
          </td>
        </tr>
      )
    }
    return data.addresses.map((address) => this.renderListItem(address))
  }

  render() {
    // TODO: translate e.g. {t('transaction_type')}
    const { loading } = this.props
    return (
      <table className="basic paystring-table">
        <thead>
          <tr>
            <th className="col-network">Network</th>
            <th className="col-environment">Environment</th>
            <th className="col-address">Address</th>
            <th className="col-tag">Tag</th>
          </tr>
        </thead>
        <tbody>
          {this.renderListContents()}
          {loading && (
            <tr>
              <td colSpan={4}>
                <Loader />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}

PayStringAddressesTable.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  accountId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    payString: PropTypes.string,
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        paymentNetwork: PropTypes.string,
        environment: PropTypes.string,
        addressDetailsType: PropTypes.string,
        addressDetails: PropTypes.shape({
          address: PropTypes.string,
          tag: PropTypes.string, // optional
        }),
      }),
    ),
  }).isRequired,
  actions: PropTypes.shape({
    loadPayStringData: PropTypes.func,
  }).isRequired,
}

PayStringAddressesTable.defaultProps = {
  loadingError: '',
}

export default connect(
  (state) => ({
    loadingError: state.payStringData.error,
    loading: state.payStringData.loading,
    data: state.payStringData.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadPayStringData,
      },
      dispatch,
    ),
  }),
)(withTranslation()(PayStringAddressesTable))
