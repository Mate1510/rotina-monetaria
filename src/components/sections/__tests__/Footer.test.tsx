import { render, screen } from '@testing-library/react'
import Footer from '@/components/sections/Footer'

jest.mock('next/link', () => {
  const MockedNextLink = ({ children, href }: { children: any; href: any }) => (
    <a href={href}>{children}</a>
  )

  MockedNextLink.displayName = 'MockedNextLink'

  return MockedNextLink
})

describe('Footer', () => {
  it('renders correctly', () => {
    render(<Footer />)
    expect(screen.getByAltText('Rotina Monetária')).toBeInTheDocument()
  })

  it('renders the correct links', () => {
    render(<Footer />)

    const feedbackLink = screen.getByRole('link', { name: /feedback/i })
    expect(feedbackLink).toBeInTheDocument()
    expect(feedbackLink).toHaveAttribute('href', 'https://forms.gle/hgE6jB3uQZfKXjNn8')

    const emailLink = screen.getByRole('link', { name: /email/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:mateusabreucn@gmail.com')
  })

  it('renders the copyright text', () => {
    render(<Footer />)
    expect(screen.getByText('© 2023 Mateus Abreu')).toBeInTheDocument()
  })
})
