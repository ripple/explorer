import React from 'react'
import Tabs from '../shared/components/Tabs'

interface Props {
  selected: string
  path: string
}

const NetworkTabs = (props: Props) => {
  const { selected, path } = props
  const tabs = ['nodes', 'validators', 'upgrade-status']
  return <Tabs tabs={tabs} selected={selected} path={path.split('/:')[0]} />
}

export default NetworkTabs
