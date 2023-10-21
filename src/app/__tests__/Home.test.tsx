import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Home from '@/app/page'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null })),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('@/components/sections/homepage/ChartsSection', () => {
  return () => null
})

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('Home Page', () => {
  describe('Render', () => {
    it('Should render main components when session is active', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: {
          session: {
            id: 'mocked-id',
            sessionToken: 'mocked-session-token',
            userId: 'mocked-user-id',
            expires: '2022-12-31T23:59:59.999Z',
            user: {
              name: 'Mock Name',
            },
          },
        },
      })
      render(<Home />)
      expect(screen.getByText('Bem vindo(a),')).toBeInTheDocument()
      expect(screen.getByTestId('insert-finances')).toBeInTheDocument()
      expect(screen.getByTestId('card-section-homepage')).toBeInTheDocument()
      expect(screen.getByTestId('finance-table-homepage')).toBeInTheDocument()
      expect(screen.getByTestId('goals-homepage')).toBeInTheDocument()
      expect(screen.getByTestId('categories-homepage')).toBeInTheDocument()
    })

    it('Should not render main components when session is not active', () => {
      ;(useSession as jest.Mock).mockReturnValue({ data: null })

      render(<Home />)

      expect(screen.queryByText('Bem vindo(a),')).not.toBeInTheDocument()
      expect(screen.queryByTestId('insert-finances')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('card-section-homepage'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('finance-table-homepage'),
      ).not.toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('Should redirect to login page when session is not active', () => {
      ;(useSession as jest.Mock).mockReturnValue({ data: null })
      const pushMock = jest.fn()
      ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })

      render(<Home />)

      expect(pushMock).toHaveBeenCalledWith('/login')
    })
  })
})
