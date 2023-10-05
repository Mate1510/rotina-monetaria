import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '@/components/components/Input'
import React from 'react'

describe('Input Component', () => {
  describe('Render', () => {
    it('Should render the input', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('Should display error styles and message when error prop is true', () => {
      render(<Input error errorMessage="Test error" />)

      const input = screen.getByRole('textbox')

      expect(input).toHaveClass('border-red-500')
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('Should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} />)

      const input = screen.getByRole('textbox')
      
      expect(ref.current).toBe(input)
    })
  })

  describe('Behavior', () => {
    it('Should handle value and onChange correctly', async () => {
      const handleChange = jest.fn()
      render(<Input value="test value" onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('test value')

      await userEvent.type(input, 'new value')
      expect(handleChange).toHaveBeenCalledTimes(9)
    })
  })
})
