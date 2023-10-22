import { render, screen } from '@testing-library/react'
import { useSession, signOut } from 'next-auth/react'
import Header from '@/components/sections/Header'
import userEvent from '@testing-library/user-event'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: null })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('next/link', () => {
  const MockedNextLink = ({ children, href }: { children: any; href: any }) => (
    <a href={href}>{children}</a>
  )

  MockedNextLink.displayName = "MockedNextLink";

  return MockedNextLink;
})


beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('Header', () => {
  describe('Render Tests', () => {
    it('renders correctly when user is authenticated', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          id: 'mocked-id',
          sessionToken: 'mocked-session-token',
          userId: 'mocked-user-id',
          expires: '2022-12-31T23:59:59.999Z',
          user: {
            name: 'Mock Name',
            role: 'USER',
          },
        },
        status: 'authenticated',
      })

      render(<Header />)

      expect(screen.getByText('Finanças')).toBeInTheDocument()
      expect(screen.getByText('Categorias')).toBeInTheDocument()
      expect(screen.getByText('Metas')).toBeInTheDocument()
      expect(screen.getByText('Estatísticas')).toBeInTheDocument()
      expect(screen.queryByText('Usuários')).not.toBeInTheDocument()
    })

    it('renders admin links when user is an ADMIN', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          id: 'mocked-id',
          sessionToken: 'mocked-session-token',
          userId: 'mocked-user-id',
          expires: '2022-12-31T23:59:59.999Z',
          user: {
            name: 'Mock Name',
            role: 'ADMIN',
          },
        },
        status: 'authenticated',
      })

      render(<Header />)

      expect(screen.getByText('Usuários')).toBeInTheDocument()
    })

    it('renders correctly when user is unauthenticated', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<Header />)

      expect(screen.queryByText('Finanças')).not.toBeInTheDocument()
      expect(screen.queryByText('Categorias')).not.toBeInTheDocument()
      expect(screen.queryByText('Metas')).not.toBeInTheDocument()
      expect(screen.queryByText('Estatísticas')).not.toBeInTheDocument()
      expect(screen.queryByText('Usuários')).not.toBeInTheDocument()
    })
  })

  describe('Behavior Tests', () => {
    it('menu toggles correctly', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          id: 'mocked-id',
          sessionToken: 'mocked-session-token',
          userId: 'mocked-user-id',
          expires: '2022-12-31T23:59:59.999Z',
          user: {
            name: 'Mock Name',
            role: 'USER',
          },
        },
        status: 'authenticated',
      })

      render(<Header />)

      const menuButton = screen.getByLabelText('menu-button')
      await userEvent.click(menuButton)

      expect(screen.getByText('Logout')).toBeInTheDocument()

      await userEvent.click(menuButton)
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })

    it('handles logout correctly', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          id: 'mocked-id',
          sessionToken: 'mocked-session-token',
          userId: 'mocked-user-id',
          expires: '2022-12-31T23:59:59.999Z',
          user: {
            name: 'Mock Name',
            role: 'USER',
          },
        },
        status: 'authenticated',
      })

      render(<Header />)

      const menuButton = screen.getByLabelText('menu-button')
      await userEvent.click(menuButton)

      const logoutButton = screen.getByText('Logout')
      await userEvent.click(logoutButton)

      expect(signOut).toHaveBeenCalledTimes(1)
    })

    it('renders correct links', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          id: 'mocked-id',
          sessionToken: 'mocked-session-token',
          userId: 'mocked-user-id',
          expires: '2022-12-31T23:59:59.999Z',
          user: {
            name: 'Mock Name',
            role: 'USER',
          },
        },
        status: 'authenticated',
      })

      render(<Header />)

      const financesLink = screen.getByRole('link', { name: /finanças/i })
      expect(financesLink).toHaveAttribute('href', '/finances')

      const categoriesLink = screen.getByRole('link', { name: /categorias/i })
      expect(categoriesLink).toHaveAttribute('href', '/categories')

      const goalsLink = screen.getByRole('link', { name: /metas/i })
      expect(goalsLink).toHaveAttribute('href', '/goals')

      const statsLink = screen.getByRole('link', { name: /estatísticas/i })
      expect(statsLink).toHaveAttribute('href', '/charts')
    })
  })
})
