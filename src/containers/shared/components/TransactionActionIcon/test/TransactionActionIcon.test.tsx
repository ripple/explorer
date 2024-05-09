import { cleanup, render, screen } from '@testing-library/react'
import { TransactionActionIcon } from '../TransactionActionIcon'
import { TransactionAction } from '../../Transaction/types'

describe('TransactionActionIcon', () => {
  afterEach(cleanup)
  it('renders with an action specified ', () => {
    render(<TransactionActionIcon action={TransactionAction.CREATE} />)
    expect(screen.getByTitle('tx-create')).toBeDefined()
  })

  it('renders with type specified ', () => {
    render(<TransactionActionIcon type="Payment" />)
    expect(screen.getByTitle('tx-send')).toBeDefined()
  })

  it('renders with type specified that is not defined', () => {
    render(<TransactionActionIcon type="Wooo" />)
    expect(screen.getByTitle('tx-unknown')).toBeDefined()
  })

  it('renders with no action or type', () => {
    // @ts-expect-error
    render(<TransactionActionIcon />)
    expect(screen.getByTitle('tx-unknown')).toBeDefined()
  })
})
