import { Tabs } from '../shared/components/Tabs'
import { buildPath } from '../shared/routing'
import { VALIDATORS_ROUTE } from '../App/routes'

interface Props {
  selected: string
}

const ValidatorsTabs = (props: Props) => {
  const { selected } = props
  const tabs = ['uptime', 'voting']
  return (
    <Tabs
      tabs={tabs}
      selected={selected}
      path={buildPath(VALIDATORS_ROUTE, {})}
    />
  )
}

export default ValidatorsTabs
