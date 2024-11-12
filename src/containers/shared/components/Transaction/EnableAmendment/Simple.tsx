import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../hooks'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { EnableAmendment } from './types'
import { getExpectedDate, getRippledVersion } from '../../../amendmentUtils'
import { AMENDMENT_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'
import SocketContext from '../../../SocketContext'
import { getFeature } from '../../../../../rippled/lib/rippled'

const states = {
  loading: 'Loading',
  unknown: 'Unknown',
}

export const Simple = ({ data }: TransactionSimpleProps<EnableAmendment>) => {
  const language = useLanguage()
  const { t } = useTranslation()
  const [amendmentDetails, setAmendmentDetails] = useState({
    name: states.loading,
    minRippledVersion: states.loading,
  })
  const rippledSocket = useContext(SocketContext)

  useEffect(() => {
    const amendmentId = data.instructions.Amendment
    getFeature(rippledSocket, amendmentId).then((feature) => {
      const name =
        feature && feature[amendmentId] ? feature[amendmentId].name : ''
      getRippledVersion(name).then((rippledVersion) => {
        setAmendmentDetails({
          name: name || states.unknown,
          minRippledVersion: rippledVersion || states.unknown,
        })
      })
    })
  }, [data.instructions.Amendment, rippledSocket])

  let amendmentStatus = states.unknown
  let expectedDate: string | null = states.unknown

  switch (data.instructions.Flags) {
    case undefined:
      amendmentStatus = 'Enabled'
      break
    case 65536:
      amendmentStatus = 'Got Majority'
      expectedDate = getExpectedDate(data.instructions.date, language)
      break
    case 131072:
      amendmentStatus = 'Lost Majority'
      break
    default:
      amendmentStatus = states.unknown
  }

  return (
    <>
      <SimpleRow label={t('enable_amendment_name')} data-test="name">
        <RouteLink
          to={AMENDMENT_ROUTE}
          params={{ identifier: data.instructions.Amendment }}
        >
          {amendmentDetails.name}
        </RouteLink>
      </SimpleRow>
      <SimpleRow label={t('amendment_status')} data-test="status">
        <a href="https://xrpl.org/enableamendment.html#enableamendment-flags">
          {amendmentStatus}
        </a>
      </SimpleRow>
      <SimpleRow label={t('introduced_in')} data-test="version">
        {amendmentDetails.minRippledVersion}
      </SimpleRow>
      {amendmentStatus === 'Got Majority' && (
        <SimpleRow label={t('expected_date')} data-test="date">
          {expectedDate}
        </SimpleRow>
      )}
    </>
  )
}
