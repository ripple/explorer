import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, screen } from '@testing-library/react'
import i18n from '../../../../i18n/testConfig'
import { Account } from '../Account'

const renderComponent = (component: JSX.Element) =>
  render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{component}</BrowserRouter>
    </I18nextProvider>,
  )

const ACCOUNT = 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt'
const ACCOUNT_PLUS_DT = `${ACCOUNT}:381702`

describe('Account', () => {
  afterEach(cleanup)
  it('should render with a link', () => {
    renderComponent(<Account account={ACCOUNT} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveClass('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toBeNull()
  })
  it('should render without a link', () => {
    renderComponent(<Account account={ACCOUNT} link={false} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).not.toHaveAttribute('href')
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toBeNull()
  })

  it('should render with a destination tag', () => {
    renderComponent(<Account account={ACCOUNT_PLUS_DT} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveClass('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag and no link', () => {
    renderComponent(<Account account={ACCOUNT_PLUS_DT} link={false} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveClass('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).not.toHaveAttribute('href')
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag supplied separately', () => {
    renderComponent(<Account account={ACCOUNT} tag={123} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveClass('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })

  it('should render with a destination tag supplied separately and no link', () => {
    renderComponent(<Account account={ACCOUNT} tag={123} link={false} />)
    const element = screen.getByTestId('account')
    expect(element).toHaveTextContent(ACCOUNT)
    expect(element).not.toHaveAttribute('href')
    expect(element).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })
})
