import { useRouteMatch } from 'react-router'
import { Tabs } from '../shared/components/Tabs'

interface Props {
  selected: string
}

function NetworkTabs(props: Props) {
  const { selected } = props
  const { path = '/' } = useRouteMatch()
  const tabs = ['nodes', 'validators', 'upgrade-status']
  return <Tabs tabs={tabs} selected={selected} path={path.split('/:')[0]} />
}

export default NetworkTabs
