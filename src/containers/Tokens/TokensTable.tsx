import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Loader } from '../shared/components/Loader'
import Currency from '../shared/components/Currency'
import { LOSToken } from '../shared/losTypes'
import { Account } from '../shared/components/Account'
import UpIcon from '../shared/images/ic_up.svg'
import DownIcon from '../shared/images/ic_down.svg'
import SortTableColumn from '../shared/components/SortColumn'
import { RouteLink } from '../shared/routing'
import { TOKEN_ROUTE } from '../App/routes'

type SortOrder = 'asc' | 'desc'

interface TokensTableProps {
  tokens: LOSToken[]
  xrpPrice: number
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
}

const DEFAULT_DECIMALS = 1
const DEFAULT_EMPTY_VALUE = '--'

export const parseCurrencyAmount = (
  value: string | number,
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

let measureCanvas: HTMLCanvasElement | null = null

function getMeasureCanvas(): HTMLCanvasElement {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas')
  }
  return measureCanvas
}

function middleEllipsize(el: HTMLElement, tailLen = 3) {
  let { full } = el.dataset
  if (!full) {
    full = el.textContent ?? ''
    // eslint-disable-next-line no-param-reassign -- Safe reassignment.
    el.dataset.full = full
  }
  if (!full) return

  const style = getComputedStyle(el)
  const font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const ctx = getMeasureCanvas().getContext('2d')!
  ctx.font = font

  const wTarget = el.getBoundingClientRect().width
  const ell = '…'
  const tail = full.slice(-tailLen)

  if (ctx.measureText(full).width <= wTarget) {
    // eslint-disable-next-line no-param-reassign -- Safe reassignment.
    el.textContent = full
    return
  }

  let lo = 0
  let hi = full.length - tailLen
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const w = ctx.measureText(full.slice(0, mid) + ell + tail).width
    w <= wTarget ? (lo = mid) : (hi = mid - 1)
  }
  // eslint-disable-next-line no-param-reassign -- Safe reassignment.
  el.textContent = full.slice(0, lo) + ell + tail
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
  if (valueNumeric >= 10_000) {
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
  setPage,
}: TokensTableProps) => {
  const { t } = useTranslation()

  const renderIssuer = (token: LOSToken) => (
    <div className="issuer-content">
      {token.issuer_name && `${token.issuer_name} (`}
      <Account
        account={token.issuer_account}
        onClick={(e) => e.stopPropagation()}
        displayText={
          <span
            ref={(node) => {
              if (!node) return
              middleEllipsize(node, 3)
              new ResizeObserver(() => middleEllipsize(node, 3)).observe(node)
            }}
            className="addr middle-ellipsis"
            title={token.issuer_account}
          >
            {token.issuer_account}
          </span>
        }
      />
      {token.issuer_name && `)`}
    </div>
  )

  const renderToken = (token: LOSToken) => (
    <tr>
      <td className="count">{token.index}</td>
      <td className="name">
        <TokenLogo icon={token.icon} />
        <RouteLink
          to={TOKEN_ROUTE}
          params={{ token: `${token.currency}.${token.issuer_account}` }}
          className="text-truncate"
        >
          <Currency currency={token.currency} />
        </RouteLink>
      </td>
      <td className="issuer">{renderIssuer(token)}</td>
      <td className="price">
        {token.price
          ? parseCurrencyAmount(token.price, xrpPrice)
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
      <td className="tvl">
        {token.tvl_xrp
          ? parseCurrencyAmount(token.tvl_xrp, xrpPrice)
          : DEFAULT_EMPTY_VALUE}
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
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="count">#</th>
              <th className="name-col">{t('name')}</th>
              <th className="issuer">{t('issuer')}</th>
              <SortTableColumn
                field="price"
                label={t('price')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <SortTableColumn
                field="24h"
                label={t('24H')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="volume"
                label={t('volume')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="trades"
                label={t('trades')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="holders"
                label={t('holders')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <SortTableColumn
                field="tvl"
                label={t('tvl')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="market_cap"
                label={t('market_cap')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
            </tr>
          </thead>
          <tbody>{tokens.map(renderToken)}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader />
  )
}
