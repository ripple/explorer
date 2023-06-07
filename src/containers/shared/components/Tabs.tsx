import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import '../css/tabs.scss'

interface Props {
  path: string
  selected: string
  tabs: string[]
}

export function Tabs({ tabs, selected, path }: Props) {
  const { t } = useTranslation()
  const items = tabs.map((key) => {
    const className = selected === key ? 'tab selected' : 'tab'
    const title = t(key.replace('-', '_') as any)
    return (
      <Link className={className} title={title} key={key} to={`${path}/${key}`}>
        {title}
      </Link>
    )
  })
  return <div className="tabs">{items}</div>
}
