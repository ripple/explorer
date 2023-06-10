import { Tabs } from '../shared/components/Tabs'
import { build } from '../shared/routing'
import { NETWORK } from '../App/routes'

interface Props {
  selected: string
}

const NetworkTabs = (props: Props) => {
  const { selected } = props
  const tabs = ['nodes', 'validators', 'upgrade-status']
  return <Tabs tabs={tabs} selected={selected} path={build(NETWORK, {})} />
}

export default NetworkTabs
