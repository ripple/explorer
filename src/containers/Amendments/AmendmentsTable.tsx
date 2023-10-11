import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TRANSACTION_ROUTE } from '../App/routes'
import { Loader } from '../shared/components/Loader'
import { useLanguage } from '../shared/hooks'
import { RouteLink } from '../shared/routing'
import { localizeDate } from '../shared/utils'
import { AmendmentsList, Voter } from '../shared/vhsTypes'

const DATE_OPTIONS_AMENDMENTS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
}

const DEFAULT_EMPTY_VALUE = '--'

export const AmendmentsTable: FC<{
  amendments: AmendmentsList[] | undefined
}> = ({ amendments }) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderEnabled = (enabled: boolean) =>
    enabled ? (
      <span className="badge yes">{t('yes')}</span>
    ) : (
      <span className="badge no">{t('no')}</span>
    )

  const renderOnTx = (amendment) => {
    if (amendment.voted) {
      return <span className="voting">{t('voting')}</span>
    }

    if (amendment.date) {
      const dateLocalized = localizeDate(
        new Date(amendment.date),
        language,
        DATE_OPTIONS_AMENDMENTS,
      )
      return amendment.tx_hash ? (
        <RouteLink
          to={TRANSACTION_ROUTE}
          params={{ identifier: amendment.tx_hash }}
        >
          {dateLocalized}
        </RouteLink>
      ) : (
        <span>{dateLocalized}</span>
      )
    }

    return DEFAULT_EMPTY_VALUE
  }

  const renderName = (name: string, deprecated: boolean) =>
    deprecated ? (
      <div className="name-deprecated">
        <span className="name-text text-truncate">{name}</span>
        <span className="deprecated badge">{t('deprecated')}</span>
      </div>
    ) : (
      <span className="name-text">{name}</span>
    )

  const getVoter = (voted: Voter | undefined) => {
    if (!voted) return DEFAULT_EMPTY_VALUE
    return voted.validators.filter((val) => val.unl !== false).length
  }

  const renderAmendment = (amendment, index) => (
    <tr key={amendment.amendment_id}>
      <td className="count">{index + 1}</td>
      <td className="version">{amendment.version}</td>
      <td className="amendment-id text-truncate">{amendment.id}</td>
      <td className="name text-truncate">
        {renderName(amendment.name, amendment.deprecated)}
      </td>
      <td className="voters">{getVoter(amendment.voted)}</td>
      <td className="threshold">
        {amendment.threshold ?? DEFAULT_EMPTY_VALUE}
      </td>
      <td className="consensus">
        {amendment.consensus ?? DEFAULT_EMPTY_VALUE}
      </td>
      <td className="enabled">
        {renderEnabled(amendment.voted === undefined)}
      </td>
      <td className="on_tx">{renderOnTx(amendment)}</td>
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
