import { useQuery } from 'react-query'
import { useContext } from 'react'
import { CURRENCY_OPTIONS, XRP_BASE } from '../transactionUtils'
import { useLanguage } from '../hooks'
import { localizeNumber, localizeMPTNumber } from '../utils'
import Currency from './Currency'
import { ExplorerAmount } from '../types'
import { MPTIssuanceFormattedInfo } from '../Interfaces'
import { getMPTIssuance } from '../../../rippled/lib/rippled'
import { formatMPTIssuanceInfo } from '../../../rippled/lib/utils'
import SocketContext from '../SocketContext'
import { useAnalytics } from '../analytics'

export interface AmountProps {
  value: ExplorerAmount | string
  displayIssuer?: boolean
  modifier?: `+` | '-' | '~' // value to put in front of the currency symbol and number
}

export const Amount = ({
  displayIssuer = true,
  modifier,
  value,
}: AmountProps) => {
  const language = useLanguage()
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()
  const issuer = typeof value === 'string' ? undefined : value.issuer
  const currency = typeof value === 'string' ? 'XRP' : value.currency
  const amount =
    typeof value === 'string' ? parseInt(value, 10) / XRP_BASE : value.amount
  const isMPT = typeof value === 'string' ? false : value.isMPT

  const options = { ...CURRENCY_OPTIONS, currency }

  const renderAmount = (localizedAmount) => (
    <span className="amount">
      <span className="amount-localized">
        {modifier && <span className="amount-modifier">{modifier}</span>}
        {localizedAmount}
      </span>{' '}
      <Currency
        issuer={displayIssuer ? issuer : ''}
        currency={currency}
        link
        displaySymbol={false}
        isMPT={isMPT}
      />
    </span>
  )

  const mptID = isMPT ? (value as ExplorerAmount).currency : null

  // fetch MPTIssuance only if isMPT is true
  const { data: mptIssuanceData } =
    useQuery<MPTIssuanceFormattedInfo>(
      ['getMPTIssuanceScale', mptID],
      async () => {
        const info = await getMPTIssuance(rippledSocket, mptID)
        return formatMPTIssuanceInfo(info)
      },
      {
        onError: (e: any) => {
          trackException(`mptIssuance ${mptID} --- ${JSON.stringify(e)}`)
        },
        enabled: isMPT,
      },
    ) || {}

  // if amount is MPT type, we need to fetch the scale from the MPTokenIssuance
  // object so we can show the scaled amount
  if (isMPT && typeof value !== 'string') {
    if (mptIssuanceData) {
      const scale = mptIssuanceData.assetScale ?? 0
      const scaledAmount = parseInt(amount as string, 10) / 10 ** scale
      return renderAmount(localizeMPTNumber(scaledAmount))
    }
    return null
  }

  return renderAmount(localizeNumber(amount, language, options))
}
