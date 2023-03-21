import { useTranslation } from 'react-i18next'
import { classicAddressToXAddress } from 'ripple-address-codec'
import Loader from '../../shared/components/Loader'
import './styles.scss'
import { PayStringResponse } from '../../../rippled/payString'

export interface PayStringAddressesTable {
  data?: PayStringResponse
  loading: boolean
}

export const PayStringMappingsTable = ({
  data,
  loading,
}: PayStringAddressesTable) => {
  const { t } = useTranslation()

  const renderListItem = (payString) => {
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

    const tagNumber = typeof tag === 'number' ? parseInt(tag, 10) : false

    let addressLink = ''
    let title = ''
    if (paymentNetwork === 'XRPL') {
      if (environment === 'MAINNET') {
        if (tag && tag !== INVALID) {
          // XRPL - with tag
          try {
            const xAddress = classicAddressToXAddress(address, tagNumber, false)
            addressLink = `/accounts/${xAddress}`
            title = `View ${xAddress}`
          } catch (error: any) {
            title = `Error: ${error?.message}`
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
            const xAddress = classicAddressToXAddress(address, tagNumber, true) // true for TESTNET
            addressLink = `https://testnet.xrpl.org/accounts/${xAddress}`
            title = `View ${xAddress}`
          } catch (error: any) {
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

  const renderListContents = () => {
    if (!loading && (!data?.addresses || data?.addresses.length === 0)) {
      return (
        <tr>
          <td colSpan={4} className="empty-message">
            No PayString Mapping(s) Found
          </td>
        </tr>
      )
    }
    if (!data?.addresses) {
      return (
        <tr>
          <td colSpan={4} className="empty-message">
            ...
          </td>
        </tr>
      )
    }
    return data.addresses.map((address) => renderListItem(address))
  }

  return (
    <table className="basic paystring-table">
      <thead>
        <tr>
          <th className="col-network">{t('paystring_network')}</th>
          <th className="col-environment">{t('paystring_environment')}</th>
          <th className="col-address">{t('paystring_address')}</th>
          <th className="col-tag">{t('paystring_tag')}</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4}>
              <Loader />
            </td>
          </tr>
        ) : (
          renderListContents()
        )}
      </tbody>
    </table>
  )
}
