import { mount } from 'enzyme'
import { describe, it, expect } from 'vitest'
import { TransactionActionIcon } from '../TransactionActionIcon'
import { TransactionAction } from '../../Transaction/types'
import TransactionCreateIcon from '../TransactionCreateIcon.svg'
import TransactionSendIcon from '../TransactionSendIcon.svg'
import TransactionUnknownIcon from '../TransactionUnknownIcon.svg'

describe('TransactionActionIcon', () => {
  it('renders with an action specified ', () => {
    const wrapper = mount(
      <TransactionActionIcon action={TransactionAction.CREATE} />,
    )
    expect(wrapper).toContainReact(<TransactionCreateIcon />)
    wrapper.unmount()
  })

  it('renders with type specified ', () => {
    const wrapper = mount(<TransactionActionIcon type="Payment" />)
    expect(wrapper).toContainReact(<TransactionSendIcon />)
    wrapper.unmount()
  })

  it('renders with type specified that is not defined', () => {
    const wrapper = mount(<TransactionActionIcon type="Wooo" />)
    expect(wrapper).toContainReact(<TransactionUnknownIcon />)
    wrapper.unmount()
  })

  it('renders with no action or type', () => {
    // @ts-expect-error
    const wrapper = mount(<TransactionActionIcon />)
    expect(wrapper).toContainReact(<TransactionUnknownIcon />)
    wrapper.unmount()
  })
})
