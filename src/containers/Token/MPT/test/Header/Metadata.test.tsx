import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { Metadata } from '../../Header/Metadata'

describe('Metadata component', () => {
  const createWrapper = (props: any) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Metadata decodedMPTMetadata={props.decodedMPTMetadata} />
      </I18nextProvider>,
    )

  it('renders header box with metadata title', () => {
    const wrapper = createWrapper({ decodedMPTMetadata: {} })
    expect(wrapper.find('.header-box.metadata-box').length).toBe(1)
    expect(wrapper.find('.header-box-title').text()).toBe('metadata')
    wrapper.unmount()
  })

  it('renders JSON view for object metadata', () => {
    const metadata = {
      ticker: 'TEST',
      issuer_name: 'Test Issuer',
      description: 'A test token',
    }
    const wrapper = createWrapper({ decodedMPTMetadata: metadata })
    expect(wrapper.find('.metadata-json').length).toBe(1)
    expect(wrapper.find('.metadata-string').length).toBe(0)
    wrapper.unmount()
  })

  it('renders string for string metadata', () => {
    const metadata = 'This is raw metadata string'
    const wrapper = createWrapper({ decodedMPTMetadata: metadata })
    expect(wrapper.find('.metadata-string').length).toBe(1)
    expect(wrapper.find('.metadata-string').text()).toBe(metadata)
    wrapper.unmount()
  })

  it('handles empty object metadata', () => {
    const wrapper = createWrapper({ decodedMPTMetadata: {} })
    expect(wrapper.find('.metadata-json').length).toBe(1)
    wrapper.unmount()
  })

  it('handles complex nested metadata', () => {
    const metadata = {
      ticker: 'TEST',
      uris: [
        { uri: 'https://example.com', category: 'website' },
        { uri: 'https://docs.example.com', category: 'documentation' },
      ],
      nested: {
        level1: {
          level2: 'deep value',
        },
      },
    }
    const wrapper = createWrapper({ decodedMPTMetadata: metadata })
    expect(wrapper.find('.metadata-json').length).toBe(1)
    wrapper.unmount()
  })
})
