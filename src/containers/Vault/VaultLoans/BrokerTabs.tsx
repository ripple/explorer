
interface LoanBrokerData {
  index: string
  Data?: string
}

interface Props {
  brokers: LoanBrokerData[]
  selectedIndex: number
  onSelect: (index: number) => void
  loanCountMap: Record<string, number>
}

export const BrokerTabs = ({ brokers, selectedIndex, onSelect, loanCountMap }: Props) => (
  <div className="broker-tabs">
    {brokers.map((broker, index) => {
      const name = `Broker ${index + 1}`
      const loanCount = loanCountMap[broker.index] ?? 0
      const isSelected = index === selectedIndex
      return (
        <button
          key={broker.index}
          type="button"
          className={`broker-tab ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect(index)}
        >
          {name} ({loanCount})
        </button>
      )
    })}
  </div>
)
