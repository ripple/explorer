import { decodeBrokerName } from './utils'

interface LoanBrokerData {
  index: string
  Data?: string
}

interface Props {
  brokers: LoanBrokerData[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export const BrokerTabs = ({ brokers, selectedIndex, onSelect }: Props) => (
  <div className="broker-tabs">
    {brokers.map((broker, index) => {
      // TODO: Explore the necessity of alpha, beta and gamma in the names of brokers. If necessary, change the below numeric system.
      const name = decodeBrokerName(broker.Data, index)
      const isSelected = index === selectedIndex
      return (
        <button
          key={broker.index}
          type="button"
          className={`broker-tab ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect(index)}
        >
          {name}
        </button>
      )
    })}
  </div>
)
