import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { Metadata } from '../../Header/Metadata'

describe('Metadata component', () => {
  const renderComponent = (props: any) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Metadata decodedMPTMetadata={props.decodedMPTMetadata} />
      </I18nextProvider>,
    )

  it('renders header box with metadata title', () => {
    const { container } = renderComponent({ decodedMPTMetadata: {} })
    expect(container.querySelectorAll('.header-box.metadata-box')).toHaveLength(
      1,
    )
    expect(container.querySelector('.header-box-title')).toHaveTextContent(
      'metadata',
    )
  })

  it('renders JSON view for object metadata', () => {
    const metadata = {
      ticker: 'TEST',
      issuer_name: 'Test Issuer',
      description: 'A test token',
    }
    const { container } = renderComponent({ decodedMPTMetadata: metadata })
    expect(container.querySelectorAll('.metadata-json')).toHaveLength(1)
    expect(container.querySelectorAll('.metadata-string')).toHaveLength(0)
  })

  it('renders string for string metadata', () => {
    const metadata = 'This is raw metadata string'
    const { container } = renderComponent({ decodedMPTMetadata: metadata })
    expect(container.querySelectorAll('.metadata-string')).toHaveLength(1)
    expect(container.querySelector('.metadata-string')).toHaveTextContent(
      metadata,
    )
  })

  it('handles empty object metadata', () => {
    const { container } = renderComponent({ decodedMPTMetadata: {} })
    expect(container.querySelectorAll('.metadata-json')).toHaveLength(1)
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
    const { container } = renderComponent({ decodedMPTMetadata: metadata })
    expect(container.querySelectorAll('.metadata-json')).toHaveLength(1)
  })
})
