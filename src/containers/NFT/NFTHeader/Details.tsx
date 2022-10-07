import React from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { NFTFormattedInfo, AccountFormattedInfo } from '../../shared/Interfaces'
import Account from '../../shared/components/Account'

interface MintedProps {
  minted?: string
}

interface Props {
  data: NFTFormattedInfo & AccountFormattedInfo & MintedProps
}

const Details = ({ data }: Props) => {
  const { minted, domain, NFTTaxon, uri, transferFee, owner } = data
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
            <td className="col2">{domain}</td>
          </tr>
        )}
        <tr className="row">
          <td className="col1">{t('taxon_id')}</td>
          <td className="col2">{NFTTaxon}</td>
        </tr>
        {uri && (
          <tr className="row">
            <td className="col1">URI</td>
            <td className="col2">{uri}</td>
          </tr>
        )}
        <tr className="row">
          <td className="col1">{t('transfer_fee')}</td>
          <td className="col2">{formattedFee}</td>
        </tr>
        {owner && (
          <tr className="row">
            <td className="col1">{t('owner')}</td>
            <td className="col2">
              <Account account={owner} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
