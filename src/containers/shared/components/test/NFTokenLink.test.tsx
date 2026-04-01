import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NFTokenLink } from '../NFTokenLink'

const renderComponent = (component: JSX.Element) =>
  render(<BrowserRouter>{component}</BrowserRouter>)

const TOKEN_ID =
  '000827103B94ECBB7BF0A0A6ED62B3607801A27B65F4B11F5E1D5E8A3F3D8E9A'

describe('NFTokenLink', () => {
  it('should render with full tokenID', () => {
    renderComponent(<NFTokenLink tokenID={TOKEN_ID} />)
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent(TOKEN_ID)
    expect(link).toHaveAttribute('href', `/nft/${TOKEN_ID}`)
    expect(link).toHaveAttribute('title', TOKEN_ID)
  })

  it('should render with shortTokenID when provided', () => {
    const shortID = '000827...3D8E9A'
    renderComponent(<NFTokenLink tokenID={TOKEN_ID} shortTokenID={shortID} />)
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent(shortID)
    expect(link).toHaveAttribute('href', `/nft/${TOKEN_ID}`)
    expect(link).toHaveAttribute('title', TOKEN_ID)
  })

  it('should use full tokenID when shortTokenID is empty string', () => {
    renderComponent(<NFTokenLink tokenID={TOKEN_ID} shortTokenID="" />)
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent(TOKEN_ID)
    expect(link).toHaveAttribute('href', `/nft/${TOKEN_ID}`)
    expect(link).toHaveAttribute('title', TOKEN_ID)
  })
})
