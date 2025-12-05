import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import '../css/tabs.scss'

interface TabConfig {
  id: string
  labelKey: string
  onTabClick?: () => void
}

interface Props {
  path?: string
  selected: string
  tabs: string[] | TabConfig[]
  onTabChange?: (tabId: string) => void
}

export const Tabs = ({ tabs, selected, path, onTabChange }: Props) => {
  const { t } = useTranslation()

  // Normalize tabs to TabConfig format
  const normalizedTabs: TabConfig[] = tabs.map((tab) => {
    if (typeof tab === 'string') {
      return {
        id: tab,
        labelKey: tab.replace('-', '_'),
      }
    }
    return tab
  })

  // If path is provided, use routing-based tabs (original behavior)
  if (path) {
    const items = normalizedTabs.map((tab) => {
      const className = selected === tab.id ? 'tab selected' : 'tab'
      const title = t(tab.labelKey as any)
      return (
        <Link
          className={className}
          title={title}
          key={tab.id}
          to={`${path}/${tab.id}`}
        >
          {title}
        </Link>
      )
    })
    return <div className="tabs">{items}</div>
  }

  // Otherwise, use state-based tabs with onTabChange callback
  const items = normalizedTabs.map((tab) => {
    const className = selected === tab.id ? 'tab selected' : 'tab'
    const title = t(tab.labelKey as any)
    const handleClick = () => {
      onTabChange?.(tab.id)
      tab.onTabClick?.()
    }
    return (
      <button
        className={className}
        title={title}
        key={tab.id}
        onClick={handleClick}
        type="button"
      >
        {title}
      </button>
    )
  })
  return <div className="tabs">{items}</div>
}
