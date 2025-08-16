import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../shared/components/Loader'
import Currency from '../shared/components/Currency'
import { LOSToken } from '../shared/losTypes'
import { Account } from '../shared/components/Account'
import UpIcon from '../shared/images/ic_up.svg'
import DownIcon from '../shared/images/ic_down.svg'
import SortTableColumn from '../shared/components/SortColumn'

type SortOrder = 'asc' | 'desc'

interface TokensTableProps {
  tokens: LOSToken[]
  xrpPrice: number
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
}

const DEFAULT_DECIMALS = 1
const DEFAULT_EMPTY_VALUE = '--'

export const parseCurrencyAmount = (
  value: string,
  xrpPrice: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const usdValue = Number(value) * xrpPrice
  return `$${parseAmount(usdValue, decimals)}`
}

const formatDecimals = (
  val: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const rounded = Number(val.toFixed(decimals))

  if (rounded === 0 && val !== 0) {
    const str = val.toPrecision(1)
    return Number(str).toString()
  }

  return val.toFixed(decimals).replace(/\.?0+$/, '')
}

const parseAmount = (
  value: string | number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const valueNumeric = Number(value)

  if (valueNumeric >= 1_000_000_000) {
    return `${formatDecimals(valueNumeric / 1_000_000_000, decimals)}B`
  }
  if (valueNumeric >= 1_000_000) {
    return `${formatDecimals(valueNumeric / 1_000_000, decimals)}M`
  }
  if (valueNumeric >= 1_000) {
    return `${formatDecimals(valueNumeric / 1_000, decimals)}K`
  }

  return formatDecimals(valueNumeric)
}

const parsePercent = (percent: number): string => `${percent.toFixed(2)}%`

const TokenLogo: FC<{ icon: string | undefined }> = ({ icon }) =>
  icon ? (
    <object data={icon} className="icon">
      <div className="icon" />
    </object>
  ) : (
    <div className="icon no-logo" />
  )

const PriceChange: FC<{ percent: number }> = ({ percent }) => (
  <div className={`percent ${percent > 0 ? 'increase' : 'decrease'}`}>
    <div className="amount">
      {percent > 0
        ? parsePercent(percent)
        : parsePercent(percent).replace('-', '')}
    </div>
    {percent > 0 ? (
      <UpIcon className="arrow" />
    ) : (
      <DownIcon className="arrow" />
    )}
  </div>
)

export const TokensTable = ({
  tokens,
  xrpPrice,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: TokensTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const renderToken = (token: LOSToken) => (
    <tr
      className="clickable-row"
      onClick={() =>
        navigate(`/token/${token.currency}.${token.issuer_account}`)
      }
    >
      <td className="count">{token.index}</td>
      <td className="name">
        <TokenLogo icon={token.icon} />
        <Currency currency={token.currency} />
      </td>
      <td className="issuer text-truncate">
        <Account
          account={token.issuer_account}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="price">
        {token.price
          ? parseCurrencyAmount(token.price, xrpPrice, 4)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="24h">
        {token.price_change ? (
          <PriceChange percent={token.price_change} />
        ) : (
          DEFAULT_EMPTY_VALUE
        )}
      </td>
      <td className="volume">
        {token.daily_volume
          ? parseCurrencyAmount(token.daily_volume, xrpPrice)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="trades">
        {token.daily_trades
          ? parseAmount(token.daily_trades)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="holders">
        {token.holders ? parseAmount(token.holders) : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="market-cap">
        {token.market_cap
          ? parseCurrencyAmount(token.market_cap, xrpPrice)
          : DEFAULT_EMPTY_VALUE}
      </td>
    </tr>
  )
  return tokens.length > 0 ? (
    <div className="tokens-table">
      <table className="basic">
        <thead>
          <tr>
            <th className="count">#</th>
            <th className="name">{t('name')}</th>
            <SortTableColumn
              field="issuer"
              label={t('issuer')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="price"
              label={t('price')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="24h"
              label={t('24H')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="volume"
              label={t('volume')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="trades"
              label={t('trades')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="holders"
              label={t('holders')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <SortTableColumn
              field="market_cap"
              label={t('market_cap')}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </tr>
        </thead>
        <tbody>{tokens.map(renderToken)}</tbody>
      </table>
    </div>
  ) : (
    <Loader />
  )
}
