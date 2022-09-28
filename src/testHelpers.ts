import { ReactWrapper } from 'enzyme'

export function expectSimpleRowLabel(
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) {
  expect(wrapper.find(`[data-test="${dataTest}"] .label`)).toHaveText(text)
}

export function expectSimpleRowText(
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) {
  expect(wrapper.find(`[data-test="${dataTest}"] .value`)).toHaveText(text)
}
