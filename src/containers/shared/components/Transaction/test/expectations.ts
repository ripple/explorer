export const expectSimpleRowLabel = (screen: any, key: string, text: string) =>
  expect(screen.getByTestId(key)).toHaveTextContent(text)

export const expectSimpleRowText = (screen: any, key: string, text: string) =>
  expect(screen.getByTestId(key)).toHaveTextContent(text)

export const expectSimpleRowNotToExist = (screen: any, key: string) =>
  expect(screen.queryByTestId(key)).toBeNull()
