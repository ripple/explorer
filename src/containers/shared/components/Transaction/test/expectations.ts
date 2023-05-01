import { ReactWrapper } from 'enzyme'
import { expect } from 'vitest'

const getSelector = (selector: string) =>
  selector.indexOf('.') === 0 ? selector : `[data-test="${selector}"]`

export const expectSimpleRowLabel = (
  wrapper: ReactWrapper<any, Readonly<{}>>,
  key: string,
  text: string,
) => expect(wrapper.find(`${getSelector(key)} .label`)).toHaveText(text)

export const expectSimpleRowText = (
  wrapper: ReactWrapper<any, Readonly<{}>>,
  key: string,
  text: string,
) => expect(wrapper.find(`${getSelector(key)} .value`)).toHaveText(text)

export const expectSimpleRowNotToExist = (
  wrapper: ReactWrapper<any, Readonly<{}>>,
  key: string,
) => expect(wrapper.find(`${getSelector(key)}`)).not.toExist()
