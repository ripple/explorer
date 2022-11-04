import React from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { NFTFormattedInfo, AccountFormattedInfo } from '../../shared/Interfaces'
import { Account } from '../../shared/components/Account'
import { TokenTableRow } from '../../shared/components/TokenTableRow'

interface MintedProps {
  minted?: string
}

interface Props {
  data: NFTFormattedInfo & AccountFormattedInfo & MintedProps
}

export const Details = ({ data }: Props) => {
  const {
    minted,
    domain,
    NFTTaxon: nftTaxon,
    uri,
    transferFee,
    owner,
    isBurned,
    NFTSequence: nftSequence,
  } = data
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
        <TokenTableRow
          shouldDisplay={!!minted}
          label={t('minted')}
          value={minted}
        />
        <TokenTableRow
          shouldDisplay={!!domain}
          label={t('domain')}
          value={domain}
        />
        <TokenTableRow label={t('taxon_id')} value={nftTaxon} />
        <TokenTableRow label={t('sequence_number_short')} value={nftSequence} />
        <TokenTableRow shouldDisplay={!!uri} label="URI" value={uri} />
        <TokenTableRow label={t('transfer_fee')} value={formattedFee} />
        <TokenTableRow
          shouldDisplay={!!isBurned}
          label={t('is_burned')}
          value="true"
        />
        <TokenTableRow
          shouldDisplay={!!owner}
          label={t('owner')}
          value={<Account account={owner!} />}
        />
      </tbody>
    </table>
  )
}
