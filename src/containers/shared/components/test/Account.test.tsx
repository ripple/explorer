import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import i18n from '../../../../i18n/testConfig'
import { Account } from '../Account'

const createWrapper = (component: JSX.Element) =>
  render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{component}</BrowserRouter>
    </I18nextProvider>,
  )

describe('Account', () => {
  afterEach(cleanup)
  it('should render with a link', () => {
    const account = 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt'
    createWrapper(<Account account={account} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(account)
    expect(link).toHaveAttribute('href', `/accounts/${account}`)
    expect(link).toHaveAttribute('title', account)
    expect(screen.queryByTestId('dt')).toBeNull()
  })
  it('should render without a link', () => {
    createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" link={false} />,
    )
    const link = screen.getByTestId('account')
    expect(link).toHaveTextContent('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(screen.queryByTestId('dt')).toBeNull()
  })

  it('should render with a destination tag', () => {
    createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702" />,
    )
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(link).toHaveAttribute(
      'href',
      '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
    )
    expect(link).toHaveAttribute('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag and no link', () => {
    createWrapper(
      <Account
        account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702"
        link={false}
      />,
    )
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag supplied separately', () => {
    createWrapper(
      <Account account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt" tag={123} />,
    )
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(link).toHaveAttribute(
      'href',
      '/accounts/rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt',
    )
    expect(link).toHaveAttribute('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })

  it('should render with a destination tag supplied separately and no link', () => {
    createWrapper(
      <Account
        account="rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt"
        tag={123}
        link={false}
      />,
    )
    const link = screen.getByTestId('account')
    expect(link).toHaveTextContent('rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt')
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })
})
