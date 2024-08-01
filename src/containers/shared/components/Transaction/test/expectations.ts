import { ReactWrapper } from 'enzyme'

const getSelector = (selector: string) =>
  selector.indexOf('.') === 0 ? selector : `[data-testid="${selector}"]`

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
