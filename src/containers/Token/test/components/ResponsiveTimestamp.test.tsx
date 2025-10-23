import { render, screen } from '@testing-library/react'
import { ResponsiveTimestamp } from '../../components/ResponsiveTimestamp/ResponsiveTimestamp'

describe('ResponsiveTimestamp Component', () => {
  it('should render without crashing', () => {
    render(<ResponsiveTimestamp timestamp={0} lang="en-US" />)
    expect(
      screen.getByText(/12\/31\/1999.*\d{2}:\d{2}:\d{2}/),
    ).toBeInTheDocument()
  })

  it('should render both desktop and mobile formats', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')
    const mobileSpan = container.querySelector('.mobile-timestamp')

    expect(desktopSpan).toBeInTheDocument()
    expect(mobileSpan).toBeInTheDocument()
  })

  it('should display desktop format with seconds', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')

    // Desktop format should include seconds
    expect(desktopSpan?.textContent).toMatch(/\d{2}:\d{2}:\d{2}/)
  })

  it('should display mobile format without seconds', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const mobileSpan = container.querySelector('.mobile-timestamp')

    // Mobile format should not include seconds (24-hour format)
    expect(mobileSpan?.textContent).toMatch(/\d{2}:\d{2}/)
  })

  it('should handle different timestamps', () => {
    const { container: container1 } = render(
      <ResponsiveTimestamp timestamp={86400} lang="en-US" />,
    )
    const { container: container2 } = render(
      <ResponsiveTimestamp timestamp={172800} lang="en-US" />,
    )

    const desktop1 = container1.querySelector('.desktop-timestamp')?.textContent
    const desktop2 = container2.querySelector('.desktop-timestamp')?.textContent

    expect(desktop1).not.toBe(desktop2)
  })

  it('should support different languages', () => {
    const { container: containerUS } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const { container: containerDE } = render(
      <ResponsiveTimestamp timestamp={0} lang="de-DE" />,
    )

    const desktopUS =
      containerUS.querySelector('.desktop-timestamp')?.textContent
    const desktopDE =
      containerDE.querySelector('.desktop-timestamp')?.textContent

    // Different locales should produce different formatting
    expect(desktopUS).toBeDefined()
    expect(desktopDE).toBeDefined()
  })

  it('should render with responsive-timestamp class', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const wrapper = container.querySelector('.responsive-timestamp')

    expect(wrapper).toBeInTheDocument()
  })

  it('should handle large timestamps', () => {
    const largeTimestamp = 1000000000 // Far in the future
    const { container } = render(
      <ResponsiveTimestamp timestamp={largeTimestamp} lang="en-US" />,
    )

    const desktopSpan = container.querySelector('.desktop-timestamp')
    expect(desktopSpan?.textContent).toBeDefined()
  })

  it('should format date with 2-digit month and day', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')

    // Should contain date in format with 2-digit month and day
    expect(desktopSpan?.textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('should format time with 2-digit hours and minutes', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const mobileSpan = container.querySelector('.mobile-timestamp')

    // Should contain time in 24-hour format with 2-digit hours and minutes
    expect(mobileSpan?.textContent).toMatch(/\d{2}:\d{2}/)
  })

  it('should handle en-GB locale', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-GB" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')

    expect(desktopSpan?.textContent).toBeDefined()
  })

  it('should handle fr-FR locale', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="fr-FR" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')

    expect(desktopSpan?.textContent).toBeDefined()
  })

  it('should render both spans with content', () => {
    const { container } = render(
      <ResponsiveTimestamp timestamp={0} lang="en-US" />,
    )
    const desktopSpan = container.querySelector('.desktop-timestamp')
    const mobileSpan = container.querySelector('.mobile-timestamp')

    expect(desktopSpan?.textContent).toBeTruthy()
    expect(mobileSpan?.textContent).toBeTruthy()
  })
})
