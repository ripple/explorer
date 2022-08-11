import React from 'react'
import { useTranslation } from 'react-i18next'
import { CopyToClipboard } from '../../shared/components/CopyToClipboard'
import './styles.css'
import { formatPrice } from '../../shared/utils'

interface Props {
  data: {
    NFTId: string
    ledgerIndex: number | undefined
    owner: string
    isBurned: boolean | undefined
    flags: string[] | undefined
    transferFee: number
    issuer: string
    NFTTaxon: number
    NFTSequence: number | undefined
    uri: string | undefined
    validated: boolean | undefined
    status: string | undefined
    warnings: string[] | undefined
    minted: string | undefined
    domain: string | undefined
    emailHash: string | undefined
  }
}

const Details = ({ data }: Props) => {
  const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data
  const { t } = useTranslation()

  const formattedFee =
    transferFee === 0
      ? `${transferFee}%`
      : `${formatPrice(transferFee / 1000, {
          currency: 'none',
          decimals: 5,
          padding: 3,
        })}%`

  const abbrvEmail =
    emailHash &&
    (emailHash.length > 20 ? emailHash.slice(0, 20).concat('...') : emailHash)
  const abbrvURI =
    uri && (uri.length > 20 ? uri.slice(0, 20).concat('...') : uri)

  return (
    <table className="token-table">
      <tbody>
        {minted && (
          <tr className="row">
            <td className="col1">{t('minted')}</td>
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
          <td className="col2">{formattedFee}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Details
