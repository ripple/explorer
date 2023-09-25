import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TRANSACTION_ROUTE } from '../App/routes'
import { Loader } from '../shared/components/Loader'
import { RouteLink } from '../shared/routing'
import { AmendmentsList } from '../shared/vhsTypes'

export const AmendmentsTable: FC<{
  amendments: AmendmentsList[] | undefined
}> = ({ amendments }) => {
  const { t } = useTranslation()

  const renderEnabled = (enabled: boolean) =>
    enabled ? (
      <span className="badge yes">{t('yes')}</span>
    ) : (
      <span className="badge no">{t('no')}</span>
    )

  const renderOnTx = (onTx: string | null, txHash: string | undefined) =>
    // eslint-disable-next-line no-nested-ternary -- Disabled since there are 2 conditions.
    onTx === 'voting' ? (
      <span className="voting">{t('voting')}</span>
    ) : txHash ? (
      <RouteLink to={TRANSACTION_ROUTE} params={{ identifier: txHash }}>
        {onTx}
      </RouteLink>
    ) : (
      <span>{onTx}</span>
    )

  const renderName = (name: string, deprecated: boolean) =>
    deprecated ? (
      <div className="name-deprecated">
        <span className="name-text text-truncate">{name}</span>
        <span className="deprecated badge">{t('deprecated')}</span>
      </div>
    ) : (
      <span className="name-text">{name}</span>
    )

  const renderAmendment = (amendment, index) => (
    <tr id={amendment.amendment_id}>
      <td className="count">{index + 1}</td>
      <td className="version">{amendment.version}</td>
      <td className="amendment-id text-truncate">{amendment.id}</td>
      <td className="name text-truncate">
        {renderName(amendment.name, amendment.deprecated)}
      </td>
      <td className="voters">{amendment.voters}</td>
      <td className="threshold">{amendment.threshold}</td>
      <td className="consensus">{amendment.consensus}</td>
      <td className="enabled">{renderEnabled(amendment.enabled)}</td>
      <td className="on_tx">
        {renderOnTx(amendment.on_tx, amendment.tx_hash)}
      </td>
    </tr>
  )

  const content = amendments ? (
    <table className="basic">
      <thead>
        <tr>
          <th className="count">#</th>
          <th className="version">{t('Version')}</th>
          <th className="amendment-id">{t('amendment_id')}</th>
          <th className="name">{t('amendment_name')}</th>
          <th className="voters">{t('voters')}</th>
          <th className="threshold">{t('threshold')}</th>
          <th className="consensus">{t('consensus')}</th>
          <th className="enabled">{t('enabled')}</th>
          <th className="on_tx">{t('on_tx')}</th>
        </tr>
      </thead>
      <tbody>{amendments.map(renderAmendment)}</tbody>
    </table>
  ) : (
    <Loader />
  )
  return <div className="amendments-table">{content}</div>
}
