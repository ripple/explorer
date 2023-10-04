import { useTranslation } from 'react-i18next'
import { AmendmentVote } from '../shared/vhsTypes'
import SuccessIcon from '../shared/images/success.svg'
import DomainLink from '../shared/components/DomainLink'
import { RouteLink } from '../shared/routing'
import { VALIDATOR_ROUTE } from '../App/routes'
import { BarChartVoting } from './BarChartVoting'

interface VotesProps {
  data: AmendmentVote
  validators: Array<validatorUNL>
}

interface validatorUNL {
  pubkey: string
  signing_key: string
  domain: string
  unl: string | false
}

function compareValidators(a: validatorUNL, b: validatorUNL) {
  if (a.unl === false && b.unl !== false) {
    return 1
  }
  if (a.unl !== false && b.unl === false) {
    return -1
  }
  if (a.domain === null && b.domain !== null) {
    return 1
  }
  if (a.domain !== null && b.domain === null) {
    return -1
  }
  if (a.domain === null && b.domain === null) {
    return a.pubkey.localeCompare(b.pubkey)
  }

  // Compare non-null values by the 'name' field
  return a.domain.localeCompare(b.domain)
}

export const Votes = ({ data, validators }: VotesProps) => {
  const { t } = useTranslation()

  const renderColumn = (label: string, validatorsList: Array<validatorUNL>) => (
    <div className="votes-column">
      <div className="label">{t(label)}</div>
      <div className="vals">
        {validatorsList.map((validator, index) => (
          <div className="row" key={validator.pubkey}>
            <span className="index">{index + 1}</span>
            <span className="val">
              {validator.domain ? (
                <DomainLink domain={validator.domain} />
              ) : (
                <RouteLink
                  to={VALIDATOR_ROUTE}
                  params={{ identifier: validator.pubkey }}
                  className="key-link"
                >
                  {validator.pubkey}
                </RouteLink>
              )}
            </span>
            {validator.unl && (
              <span className="unl">
                <SuccessIcon title={validator.unl} alt={validator.unl} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const getNays = () =>
    validators
      .filter(
        (validator) =>
          !data.voted?.some(
            (voted) => voted.signing_key === validator.signing_key,
          ),
      )
      .sort(compareValidators)

  const getYeas = () =>
    validators
      .filter((validator) =>
        data.voted?.some(
          (voted) => voted.signing_key === validator.signing_key,
        ),
      )
      .sort(compareValidators)

  const yeas = getYeas()
  const nays = getNays()

  const aggregateVoting = () => [
    {
      label: 'UNL',
      yeas: yeas.filter((val) => val.unl !== false).length,
      nays: nays.filter((val) => val.unl !== false).length,
    },
    {
      label: 'non-UNL',
      yeas: yeas.filter((val) => val.unl === false).length,
      nays: nays.filter((val) => val.unl === false).length,
    },
  ]

  const aggregate = aggregateVoting()

  return data.voting_status === 'voting' ? (
    <div className="votes">
      {aggregate && <BarChartVoting data={aggregate} />}
      <div className="votes-columns">
        {renderColumn('yeas', yeas)}
        {renderColumn('nays', nays)}
      </div>
      <div className="note">
        <span className="note-text">{t('note')}:</span>
        <span className="unl">
          <SuccessIcon />
        </span>
        <span className="note-text">{t('indicate_unl')}</span>
      </div>
    </div>
  ) : null
}
