import React from 'react'
import { mount } from 'enzyme'
import { TransactionActionIcon } from '../TransactionActionIcon'
import { TransactionAction } from '../../Transaction/types'
import { ReactComponent as TransactionCreateIcon } from '../TransactionCreateIcon.svg'
import { ReactComponent as TransactionSendIcon } from '../TransactionSendIcon.svg'
import { ReactComponent as TransactionUnknownIcon } from '../TransactionUnknownIcon.svg'

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
    const wrapper = mount(<TransactionActionIcon />)
    expect(wrapper).toContainReact(<TransactionUnknownIcon />)
    wrapper.unmount()
  })
})
