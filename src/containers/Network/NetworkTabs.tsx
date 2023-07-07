import { Tabs } from '../shared/components/Tabs'
import { buildPath } from '../shared/routing'
import { NETWORK_ROUTE } from '../App/routes'

interface Props {
  selected: string
}

const NetworkTabs = (props: Props) => {
  const { selected } = props
  const tabs = ['nodes', 'validators', 'upgrade-status']
  return (
    <Tabs tabs={tabs} selected={selected} path={buildPath(NETWORK_ROUTE, {})} />
  )
}

export default NetworkTabs
