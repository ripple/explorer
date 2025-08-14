import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import { useIsOnline } from '../shared/SocketContext'
import { Legend } from './Legend'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE } from '../App/routes'
import { LedgerListEntry } from './LedgerListEntry'
import { useSelectedValidator } from './useSelectedValidator'
import { usePreviousWithPausing } from '../shared/hooks/usePreviousWithPausing'
import { useStreams } from '../shared/components/Streams/StreamsContext'
import { useVHSValidators } from '../shared/components/VHSValidators/VHSValidatorsContext'
import { Ledger } from '../shared/components/Streams/types'

export const Ledgers = ({
  paused,
  unlCount,
}: {
  paused: boolean
  unlCount?: number
}) => {
  const { validators: validatorsFromVHS } = useVHSValidators()
  const { selectedValidator } = useSelectedValidator()
  const { ledgers } = useStreams()
  const localLedgers = usePreviousWithPausing<Record<number, Ledger>>(
    ledgers,
    paused,
  )
  const isOnline = useIsOnline()

  return (
    <div className="ledgers">
      {isOnline && ledgers ? (
        <>
          <Legend />
          <div className="control">
            {selectedValidator && validatorsFromVHS && (
              <div className="selected-validator">
                {validatorsFromVHS[selectedValidator].domain && (
                  <DomainLink
                    domain={validatorsFromVHS[selectedValidator].domain}
                  />
                )}
                <RouteLink
                  to={VALIDATOR_ROUTE}
                  params={{ identifier: selectedValidator }}
                  className="pubkey"
                >
                  {selectedValidator}
                </RouteLink>
              </div>
            )}
          </div>
          <div className="ledger-list">
            {Object.values(localLedgers ?? {})
              .reverse()
              .slice(0, 20)
              ?.map((ledger) => <LedgerListEntry ledger={ledger} />)}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
