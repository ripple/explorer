import { render } from '@testing-library/react'
import { TransactionActionIcon } from '../TransactionActionIcon'
import { TransactionAction } from '../../Transaction/types'

describe('TransactionActionIcon', () => {
  it('renders with an action specified ', () => {
    const { container } = render(
      <TransactionActionIcon action={TransactionAction.CREATE} />,
    )
    // SVG should be rendered
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with type specified ', () => {
    const { container } = render(<TransactionActionIcon type="Payment" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with type specified that is not defined', () => {
    const { container } = render(<TransactionActionIcon type="Wooo" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with no action or type', () => {
    // @ts-expect-error
    const { container } = render(<TransactionActionIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
