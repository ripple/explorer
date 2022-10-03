import { ReactWrapper } from 'enzyme'

export const expectSimpleRowLabel = (
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) => expect(wrapper.find(`[data-test="${dataTest}"] .label`)).toHaveText(text)

export const expectSimpleRowText = (
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) => expect(wrapper.find(`[data-test="${dataTest}"] .value`)).toHaveText(text)
