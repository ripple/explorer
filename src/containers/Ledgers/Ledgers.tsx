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

export const Ledgers = ({
  paused,
  ledgers = [],
  unlCount,
  validators = {},
}: {
  paused: boolean
  ledgers: any[]
  unlCount?: number
  validators: any
}) => {
  const { selectedValidator } = useSelectedValidator()
  const localLedgers = usePreviousWithPausing(ledgers, paused)
  const isOnline = useIsOnline()

  return (
    <div className="ledgers" title="ledgers">
      {isOnline && ledgers.length > 0 ? (
        <>
          <Legend />
          <div className="control">
            {selectedValidator && (
              <div className="selected-validator">
                {validators[selectedValidator].domain && (
                  <DomainLink domain={validators[selectedValidator].domain} />
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
            {localLedgers?.map((ledger) => (
              <LedgerListEntry
                ledger={ledger}
                key={ledger.ledger_index}
                unlCount={unlCount}
                validators={validators}
              />
            ))}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
