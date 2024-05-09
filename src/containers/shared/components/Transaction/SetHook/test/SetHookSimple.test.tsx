import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockSetHook from './mock_data/SetHook.json'
import mockSetHook2 from './mock_data/SetHook2.json'
import mockSetHookFailure from './mock_data/SetHookFailure.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('SetHook: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockSetHook)

    expect(screen.find('.group')).toHaveLength(2)

    const hook1 = screen.find('.group').at(0)
    const hook2 = screen.find('.group').at(1)

    expectSimpleRowText(
      hook1,
      'hook-hash',
      '4E57C7FE7A84ABFA53CFE411DE9BA3420B94F55038BF238EBE1EB89095ABA4DE',
    )
    expectSimpleRowText(hook1, 'hook-on', 'Invoke')
    expectSimpleRowText(
      hook1,
      'hook-namespace',
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
    expectSimpleRowText(hook1, 'hook-flags', 'hsfOverride')
    expectSimpleRowText(hook1, 'hook-api-version', '0')

    expectSimpleRowText(
      hook2,
      'hook-hash',
      'C04E2043B656B578CB30E9FF465304AF402B7AFE38B6CE2D8CEFECDD669E3424',
    )
    expectSimpleRowText(hook2, 'hook-on', '98')
    expectSimpleRowText(
      hook2,
      'hook-namespace',
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
    expectSimpleRowText(hook2, 'hook-flags', 'hsfOverride')
    expectSimpleRowText(hook2, 'hook-api-version', '0')
  })

  it('renders a different SetHook tx', () => {
    renderComponent(mockSetHook2)

    expect(screen.find('.group')).toHaveLength(1)

    const hook = screen.find('.group').at(0)

    expectSimpleRowText(
      hook,
      'hook-hash',
      '548BBB700F5841C2D41E227456E8A80E6A6335D1149BA3B5FF745A00CC0EBECE',
    )

    expect(hook.find('.grant')).toHaveLength(2)

    const grant1 = hook.find('.grant').at(0)
    const grant2 = hook.find('.grant').at(1)

    expect(grant1.find('.hash')).toHaveTextContent(
      '096A70632BBB67488F4804AE55604A01F52226BD556E3589270D0D30C9A6AF81',
    )
    expect(grant1.find('.account').at(0)).toHaveTextContent(
      'rQUhXd7sopuga3taru3jfvc1BgVbscrb1X',
    )
    expect(grant1.find(`.account a`)).toBeDefined()

    expect(grant2.find('.hash')).toHaveTextContent(
      '3F47684053E1A653E54EAC1C5F50BCBAF7F69078CEFB5846BB046CE44B8ECDC2',
    )
    expect(grant2.find('.account').at(0)).toHaveTextContent(
      'raPSFU999HcwpyRojdNh2i96T22gY9fgxL',
    )
    expect(grant2.find(`.account a`)).toBeDefined()
  })

  it('renders a failed SetHook tx', () => {
    renderComponent(mockSetHookFailure)

    expect(screen.find('.group')).toHaveLength(1)

    const hook = screen.find('.group').at(0)

    expectSimpleRowText(hook, 'hook-hash', 'undefined')

    expectSimpleRowText(hook, 'hook-on', 'Payment')
    expectSimpleRowText(
      hook,
      'hook-namespace',
      'CAE662172FD450BB0CD710A769079C05BFC5D8E35EFA6576EDC7D0377AFDD4A2',
    )
    expectSimpleRowText(hook, 'hook-flags', 'hsfOverride')
    expectSimpleRowText(hook, 'hook-api-version', '0')
  })
})
