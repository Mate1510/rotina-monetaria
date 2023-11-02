import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Finances from '@/components/sections/finances/InsertFinances'
import axios from 'axios'

jest.mock('axios')
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { userId: 'mocked-user-id' } },
  })),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Finances Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    mockedAxios.post.mockResolvedValue({ data: {} })
  })

  describe('Render', () => {
    it('renders correctly', async () => {
      render(<Finances />)

      await waitFor(() => {
        expect(screen.getByTestId('insert-finances')).toBeInTheDocument()
      })

      expect(screen.getByTestId('insert-finances')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('R$')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Data')).toBeInTheDocument()
      expect(screen.getByText('Adicionar')).toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('allows user to input finance details', async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { id: '1', name: 'Categoria1' },
          { id: '2', name: 'Categoria2' },
        ],
      })

      render(<Finances />)

      await waitFor(() => {
        expect(screen.getByTestId('insert-finances')).toBeInTheDocument()
      })

      await userEvent.type(screen.getByPlaceholderText('Nome'), 'Salary')
      await userEvent.type(screen.getByPlaceholderText('R$'), '5000')
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: /categorias/i }),
        '1',
      )
      await userEvent.type(screen.getByPlaceholderText('Data'), '01/01/2023')
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: /tipo transação/i }),
        'INCOME',
      )
      await userEvent.click(screen.getByText('Adicionar'))

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/finances/',
          expect.any(Object),
        )
      })
    })
  })
})
