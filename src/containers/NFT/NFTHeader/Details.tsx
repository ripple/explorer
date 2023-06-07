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

export function Details({ data }: Props) {
  const {
    minted,
    domain,
    NFTTaxon: nftTaxon,
    uri,
    transferFee,
    owner,
    isBurned,
    NFTSerial: nftSerial,
  } = data
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      minimumFractionDigits: 3,
    })}%`

  return (
    <table className="token-table">
      <tbody>
        {minted && <TokenTableRow label={t('minted')} value={minted} />}
        {domain && <TokenTableRow label={t('domain')} value={domain} />}
        <TokenTableRow label={t('taxon_id')} value={nftTaxon} />
        <TokenTableRow label={t('serial')} value={nftSerial} />
        {uri && <TokenTableRow label="URI" value={uri} />}
        <TokenTableRow label={t('transfer_fee')} value={formattedFee} />
        {isBurned && <TokenTableRow label={t('is_burned')} value="true" />}
        {owner && (
          <TokenTableRow
            label={t('owner')}
            value={<Account account={owner!} />}
          />
        )}
      </tbody>
    </table>
  )
}
