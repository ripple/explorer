import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Currency from '../../shared/components/Currency'
import { Amount } from '../../shared/components/Amount'
import Loader from '../../shared/components/Loader'

interface Props {
  account: any
}

export const AccountIssuedTokenTable = (props: Props) => {
  const { account } = props
  const { t } = useTranslation()

  function renderNoResults() {
    return (
      <tr>
        <td colSpan={3} className="empty-message">
          {t('assets.no_issued_message')}
        </td>
      </tr>
    )
  }

  function renderRow(token: any) {
    const tokenName = `${token.currency}.${token.issuer}`

    return (
      <tr key={tokenName}>
        <td>
          <Currency currency={token.currency} />
        </td>
        <td>
          <Link
            className="token-issuer"
            title={tokenName}
            to={`/token/${tokenName}`}
          >
            {token.issuer}
          </Link>
        </td>
        <td className="right">
          <Amount value={token} displayIssuer={false} />
        </td>
      </tr>
    )
  }

  return (
    <div className="nodes-table">
      <table className="basic">
        <thead>
          <tr>
            <th>{t('currency_code')}</th>
            <th>{t('issuer')}</th>
            <th className="right">{t('amount')}</th>
          </tr>
        </thead>
        <tbody>
          {account.tokens &&
            (account?.tokens?.length
              ? account?.tokens.map(renderRow)
              : renderNoResults())}
        </tbody>
      </table>
      {!account.tokens && <Loader />}
    </div>
  )
}
