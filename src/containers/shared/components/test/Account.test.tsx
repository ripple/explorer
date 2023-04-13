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

const ACCOUNT = 'rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt'
const ACCOUNT_PLUS_DT = `${ACCOUNT}:381702`

describe('Account', () => {
  afterEach(cleanup)
  it('should render with a link', () => {
    createWrapper(<Account account={ACCOUNT} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toBeNull()
  })
  it('should render without a link', () => {
    createWrapper(<Account account={ACCOUNT} link={false} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toBeNull()
  })

  it('should render with a destination tag', () => {
    createWrapper(<Account account={ACCOUNT_PLUS_DT} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag and no link', () => {
    createWrapper(<Account account={ACCOUNT_PLUS_DT} link={false} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':381702')
  })

  it('should render with a destination tag supplied separately', () => {
    createWrapper(<Account account={ACCOUNT} tag={123} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveClass('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).toHaveAttribute('href', `/accounts/${ACCOUNT}`)
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })

  it('should render with a destination tag supplied separately and no link', () => {
    createWrapper(<Account account={ACCOUNT} tag={123} link={false} />)
    const link = screen.getByTestId('account')
    expect(link).toHaveTextContent(ACCOUNT)
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('title', ACCOUNT)
    expect(screen.queryByTestId('dt')).toHaveTextContent(':123')
  })
})
