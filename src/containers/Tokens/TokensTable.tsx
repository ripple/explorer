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
import { shortenAccount } from '../shared/utils'
import {
  parseCurrencyAmount,
  parseAmount,
  parsePercent,
} from '../shared/NumberFormattingUtils'

type SortOrder = 'asc' | 'desc'

interface TokensTableProps {
  tokens: LOSToken[]
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
}

const DEFAULT_EMPTY_VALUE = '--'

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
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setPage,
}: TokensTableProps) => {
  const { t } = useTranslation()

  const renderIssuer = (token: LOSToken) => (
    <div className="issuer-content">
      {token.issuer_name && (
        <span className="issuer-name">{token.issuer_name} (</span>
      )}
      <Account
        account={token.issuer_account}
        displayText={shortenAccount(token.issuer_account)}
      />
      {token.issuer_name && <span>)</span>}
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
      <td className="issuer text-truncate">{renderIssuer(token)}</td>
      <td className="price">
        {token.price_usd && Number(token.price_usd) !== 0
          ? parseCurrencyAmount(token.price_usd)
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
        {token.daily_volume_usd
          ? parseCurrencyAmount(token.daily_volume_usd)
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
        {token.tvl_usd
          ? parseCurrencyAmount(token.tvl_usd)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="market-cap">
        {token.market_cap_usd &&
        token.price_usd &&
        Number(token.price_usd) !== 0
          ? parseCurrencyAmount(token.market_cap_usd)
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
                tooltip
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
