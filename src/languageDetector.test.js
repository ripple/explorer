import languageDetector from './languageDetector'

describe('languageDetector', () => {
  it('detect language', () => {
    expect(languageDetector.detect()).toEqual('en-US')
  })

  it('detect language from navigator', () => {
    Object.defineProperty(navigator, 'languages', {
      get: () => ['ko'],
    })

    Object.defineProperty(navigator, 'language', {
      get: () => ['zzz'],
    })

    Object.defineProperty(navigator, 'userLanguage', {
      get: () => ['yyy'],
    })

    expect(languageDetector.detect()).toEqual('ko-KP')
  })

  it('detect language from localStorage', () => {
    window.localStorage.setItem('i18nextLng', 'zh')
    expect(languageDetector.detect()).toEqual('zh-Hans')
  })

  it('detect language from url', () => {
    delete window.location
    window.location = { search: '?lng=es' }
    expect(languageDetector.detect()).toEqual('es-MX')
  })

  it('detect language from localStorage', () => {
    languageDetector.cacheUserLanguage('es-MX')
    expect(window.localStorage.getItem('i18nextLng')).toEqual('es-MX')
  })
})
