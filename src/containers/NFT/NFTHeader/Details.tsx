import React from 'react'
import { useTranslation } from 'react-i18next'
import { CopyToClipboard } from '../../shared/components/CopyToClipboard'
import './styles.scss'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'

interface Props {
  data: {
    NFTId: string
    ledgerIndex?: number
    owner?: string
    isBurned?: boolean
    flags?: string[]
    transferFee?: number
    issuer?: string
    NFTTaxon?: number
    NFTSequence?: number
    uri?: string
    validated?: boolean
    status?: string
    warnings?: string[]
    minted?: string
    domain?: string
    emailHash?: string
  }
}

const Details = ({ data }: Props) => {
  const { minted, domain, emailHash, NFTTaxon, uri, transferFee } = data
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      style: 'currency',
      currency: 'none',
      minimumFractionDigits: 3,
    })}%`

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
              <div className="abbrv">{domain}</div>
            </td>
          </tr>
        )}
        {emailHash && (
          <tr className="row">
            <td className="col1">{t('email_hash')}</td>
            <td className="col2">
              <div className="abbrv">
                {emailHash}
                <CopyToClipboard className="copy" text={emailHash} />
              </div>
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
              <div className="abbrv">{uri}</div>
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
