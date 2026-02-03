import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { useLanguage } from '../../shared/hooks'
import { useTokenToUSDRate } from '../../shared/hooks/useTokenToUSDRate'
import { localizeNumber } from '../../shared/utils'
import { formatAmount } from '../utils'

interface Holder {
  account: string
  mpt_amount: string
}

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  holders: Holder[]
  totalSupply: string | undefined
  assetsTotal: string | undefined
  startRank: number
  displayCurrency: string
  asset?: AssetInfo
}

export const DepositorTable = ({
  holders,
  totalSupply,
  assetsTotal,
  startRank,
  displayCurrency,
  asset,
}: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { rate: tokenToUsdRate } = useTokenToUSDRate(asset)

  const totalSupplyNum = totalSupply ? Number(totalSupply) : 0

  // Get the display currency label
  const getDisplayCurrencyLabel = (): string =>
    displayCurrency === 'USD' ? 'USD' : asset?.currency || ''

  // Calculate the value of each holder's share
  // Value = (holder's tokens / total supply) * total assets in vault
  const calculateValue = (holderAmount: string): string => {
    const amount = Number(holderAmount)
    if (!totalSupplyNum || !assetsTotal) return '-'
    const assetsTotalNum = Number(assetsTotal)
    if (Number.isNaN(assetsTotalNum) || assetsTotalNum === 0) return '-'

    // Proportional value: (holder tokens / total supply) * total assets
    let value = (amount / totalSupplyNum) * assetsTotalNum

    // Convert to USD if needed
    if (displayCurrency === 'USD') {
      if (tokenToUsdRate > 0) {
        value *= tokenToUsdRate
        return formatAmount(value, language, {
          prefix: '$',
          currency: 'USD',
        })
      }
      return '--'
    }

    return formatAmount(value, language, {
      currency: getDisplayCurrencyLabel(),
    })
  }

  const calculatePercentOfSupply = (holderAmount: string): string => {
    if (!totalSupplyNum) return '-'
    const amount = Number(holderAmount)
    const percent = (amount / totalSupplyNum) * 100
    return `${localizeNumber(percent, language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
  }

  return (
    <table className="depositor-table">
      <thead>
        <tr>
          <th>{t('rank')}</th>
          <th>{t('account')}</th>
          <th>{t('lp_tokens')}</th>
          <th>{t('percent_of_supply')}</th>
          <th>{t('value')}</th>
        </tr>
      </thead>
      <tbody>
        {holders.map((holder, index) => (
          <tr key={holder.account}>
            <td className="rank-cell">{startRank + index}</td>
            <td className="account-cell">
              <Account account={holder.account} />
            </td>
            <td className="tokens-cell">
              {formatAmount(holder.mpt_amount, language)}
            </td>
            <td className="percent-cell">
              {calculatePercentOfSupply(holder.mpt_amount)}
            </td>
            <td className="value-cell">{calculateValue(holder.mpt_amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
