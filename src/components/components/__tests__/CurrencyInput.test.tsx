import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CurrencyInput from '@/components/components/CurrencyInput'
import React from 'react'

function formatToBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

describe('CurrencyInput component', () => {
  describe('Render', () => {
    it('Should render a CurrencyInput', () => {
      render(<CurrencyInput onValueChange={jest.fn()} />)

      const input = screen.getByRole('textbox')

      expect(input).toBeInTheDocument()
    })

    it('Should display error styles and message when error prop is true', () => {
      render(
        <CurrencyInput
          error
          errorMessage="Test error"
          onValueChange={jest.fn()}
        />,
      )

      const input = screen.getByRole('textbox')
      const errorMessage = screen.getByText('Test error')

      expect(input).toHaveClass('border-red-500')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('Should handle value correctly', () => {
      const formattedValue = formatToBRL(100)

      render(<CurrencyInput value="100,00" onValueChange={jest.fn()} />)

      const input = screen.getByRole('textbox')

      expect(input).toHaveValue(formattedValue)
    })

    it('Should handle onValueChange correctly', async () => {
      const handleValueChange = jest.fn()

      render(<CurrencyInput onValueChange={handleValueChange} />)

      const input = screen.getByRole('textbox')
      await userEvent.type(input, '200,00')

      expect(handleValueChange).toHaveBeenCalledTimes(6)
      expect(handleValueChange).lastCalledWith(
        '200,00',
        undefined,
        expect.objectContaining({
          float: 200,
          formatted: formatToBRL(200),
          value: '200,00',
        }),
      )
    })
  })
})
