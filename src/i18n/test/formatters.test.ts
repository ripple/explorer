import i18n from '../testConfigEnglish'

describe('i18n formatters', () => {
  describe('truncate', () => {
    it('should truncate the value to the supplied length', () => {
      i18n.addResource(
        'en-US',
        'test',
        'woo',
        `Hello {{value, truncate(length: 3)}}`,
      )
      expect(i18n.t('test:woo', { value: 'World', defaultValue: 'Default' })).toEqual('Hello Wor\u2026')
    })
})
