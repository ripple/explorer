import NewEscrowCreate from './mock_data/NewEscrowCreate.json'
import SetHook from './mock_data/SetHook.json'
import SignerListSet from './mock_data/SignerListSet.json'
import { DefaultSimple } from '../DefaultSimple'
import { createSimpleWrapperFactory } from './createWrapperFactory'
import { expectSimpleRowText } from './expectations'

const createWrapper = createSimpleWrapperFactory(DefaultSimple)

describe('DefaultSimple', () => {
  it('renders Simple for basic transaction', () => {
    const wrapper = createWrapper(NewEscrowCreate)
    expectSimpleRowText(
      wrapper,
      'Destination',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="Destination"] a`)).toExist()
    expectSimpleRowText(wrapper, 'Amount', '\uE9001.00 XRP')
    expectSimpleRowText(wrapper, 'FinishAfter', '736447590')
    wrapper.unmount()
  })

  it('renders Simple for more complex transaction', () => {
    const wrapper = createWrapper(SetHook)
    expect(wrapper.find(`[data-test="group"]`).length).toEqual(10)
    expect(wrapper.find(`[data-test="CreateCode"]`).length).toEqual(10)
    expect(wrapper.find(`[data-test="Flags"]`).length).toEqual(10)
    expect(wrapper.find(`[data-test="HookApiVersion"]`).length).toEqual(2)
    expect(wrapper.find(`[data-test="HookNamespace"]`).length).toEqual(2)
    expect(wrapper.find(`[data-test="HookOn"]`).length).toEqual(2)

    expect(wrapper.find(`[data-test="CreateCode"] .value`).at(0)).toHaveText(
      '0061736D0100000001420960027F7F017F60037F7F7F017E60037F7F7E017E60027F7F017E60047F' +
        '7F7F7F017E60017F017E6000017E60057F7F7F7F7F017E60097F7F7F7F7F7F7F7F7F017E02BC02' +
        '1403656E76025F67000003656E760A6F74786E5F6669656C64000103656E760661636365707400' +
        '0203656E7608726F6C6C6261636B000203656E760C686F6F6B5F6163636F756E...',
    )
    expect(wrapper.find(`[data-test="Flags"] .value`).at(0)).toHaveText('1')
    expect(
      wrapper.find(`[data-test="HookApiVersion"] .value`).at(0),
    ).toHaveText('0')
    expect(wrapper.find(`[data-test="HookNamespace"] .value`).at(0)).toHaveText(
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
    expect(wrapper.find(`[data-test="HookOn"] .value`).at(0)).toHaveText(
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFFFFFBFFFFF',
    )

    wrapper.unmount()
  })

  it('renders Simple for more complex transaction', () => {
    const wrapper = createWrapper(SignerListSet)
    expect(wrapper.find(`[data-test="group"]`).length).toEqual(5)
    expect(wrapper.find(`[data-test="Account"]`).length).toEqual(5)
    expect(wrapper.find(`[data-test="Account"] a`).length).toEqual(5)
    expect(wrapper.find(`[data-test="SignerWeight"]`).length).toEqual(5)

    expect(wrapper.find(`[data-test="Account"] .value`).at(0)).toHaveText(
      'rEg5sHxZVTNwRL3BAdMwJatkmWDzHMmzDF',
    )
    expect(wrapper.find(`[data-test="SignerWeight"] .value`).at(0)).toHaveText(
      '1',
    )

    expect(wrapper.find(`[data-test="Account"] .value`).at(1)).toHaveText(
      'rsDcSULqePdATo4Phosy33G9BJB3xjid6f',
    )
    expect(wrapper.find(`[data-test="SignerWeight"] .value`).at(1)).toHaveText(
      '1',
    )

    expect(wrapper.find(`[data-test="Account"] .value`).at(2)).toHaveText(
      'rL8qTrAvZ8Q1o1H9H9Ahpj3xjgmRvFLvJ3',
    )
    expect(wrapper.find(`[data-test="SignerWeight"] .value`).at(2)).toHaveText(
      '1',
    )

    expect(wrapper.find(`[data-test="Account"] .value`).at(3)).toHaveText(
      'r14FxdvpSA1JpGgcotxPFY1NZe4bhRtSh',
    )
    expect(wrapper.find(`[data-test="SignerWeight"] .value`).at(3)).toHaveText(
      '1',
    )

    expect(wrapper.find(`[data-test="Account"] .value`).at(4)).toHaveText(
      'rfsxNxZ6xB1nTPhTMwQajNnkCxWG8B714n',
    )
    expect(wrapper.find(`[data-test="SignerWeight"] .value`).at(4)).toHaveText(
      '1',
    )

    wrapper.unmount()
  })
})
