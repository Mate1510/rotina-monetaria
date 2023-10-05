import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from '@/components/components/Select'
import React from 'react'

describe('Select Component', () => {
  describe('Render', () => {
    it('Should render the select input', () => {
      render(
        <Select>
          <option value="test">Test</option>
        </Select>,
      )

      const select = screen.getByRole('combobox')

      expect(select).toBeInTheDocument()
    })

    it('Should display error styles and message when error prop is true', () => {
      render(
        <Select error errorMessage="Test error">
          <option value="test">Test</option>
        </Select>,
      )
      const select = screen.getByRole('combobox')
      const errorMessage = screen.getByText('Test error')

      expect(select).toHaveClass('border-red-500')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('Should handle value and onChange correctly', async () => {
      const handleChange = jest.fn()

      render(
        <Select value="testValue" onChange={handleChange}>
          <option value="testValue">Test Value</option>
          <option value="anotherValue">Another Value</option>
        </Select>,
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('testValue')

      await userEvent.selectOptions(select, 'anotherValue')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('Should display the placeholder correctly', () => {
      const placeholderText = 'Select an option'
      render(
        <Select placeholder={placeholderText}>
          <option value="test">Test</option>
        </Select>,
      )

      const placeholder = screen.getByText(placeholderText)
      expect(placeholder).toBeInTheDocument()
    })
  })
})
