import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import CopyToClipboard from '../../shared/components/CopyToClipboard'
import './styles.css'

const Details = ({ data }) => {
  const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data
  const { t } = useTranslation()

  const abbrvEmail =
    emailHash?.length > 20 ? emailHash?.slice(0, 20).concat('...') : emailHash
  const abbrvURI = uri?.length > 20 ? uri?.slice(0, 20).concat('...') : uri

  return (
    <table className="token-table">
      <tbody>
        {minted && (
          <tr className="row">
            <td className="col1">Minted</td>
            <td className="col2">{minted}</td>
          </tr>
        )}
        {domain && (
          <tr className="row">
            <td className="col1">{t('domain')}</td>
            <td className="col2">
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {domain}
              </a>
            </td>
          </tr>
        )}
        {emailHash && (
          <tr className="row">
            <td className="col1">{t('email_hash')}</td>
            <td className="col2">
              {abbrvEmail}
              <CopyToClipboard className="copy" text={emailHash} />
            </td>
          </tr>
        )}
        <tr className="row">
          <td className="col1">{t('taxon_id')}</td>
          <td className="col2">{NFTTaxon}</td>
        </tr>
        {uri && (
          <tr className="row">
            <td className="col1">{t('uri')}</td>
            <td className="col2">
              <a href={uri} target="_blank" rel="noopener noreferrer">
                {abbrvURI}
              </a>
            </td>
          </tr>
        )}
        <tr className="row">
          <td className="col1">{t('transfer_fee')}</td>
          <td className="col2">{transferFee}</td>
        </tr>
      </tbody>
    </table>
  )
}

Details.propTypes = {
  data: PropTypes.shape({
    NFTId: PropTypes.string,
    ledgerIndex: PropTypes.number,
    owner: PropTypes.string,
    isBurned: PropTypes.bool,
    flags: PropTypes.arrayOf(PropTypes.string),
    transferFee: PropTypes.number,
    issuer: PropTypes.string,
    NFTTaxon: PropTypes.number,
    NFTSequence: PropTypes.number,
    uri: PropTypes.string,
    validated: PropTypes.bool,
    status: PropTypes.string,
    warnings: PropTypes.arrayOf(PropTypes.string),
    minted: PropTypes.string,
    domain: PropTypes.string,
    emailHash: PropTypes.string,
  }),
}

Details.defaultProps = {
  data: null,
}

export default Details
