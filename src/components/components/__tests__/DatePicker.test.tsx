import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatePicker from '@/components/components/DatePicker'
import React, { useState } from 'react'

describe('DatePicker component', () => {
  const mockOnChange = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Render', () => {
    it('Should render the datepicker component', () => {
      render(<DatePicker onChange={mockOnChange} />)

      const datePickerInput = screen.getByRole('textbox')

      expect(datePickerInput).toBeInTheDocument()
    })

    it('Should display error styles and message when error prop is true', () => {
      render(<DatePicker onChange={mockOnChange} error errorMessage="Test error" className="w-full" placeholderText="Data" />)

      const datePickerInput = screen.getByRole('textbox')
      const errorText = screen.getByText('Test error')

      expect(datePickerInput).toHaveClass('border-red-500')
      expect(errorText).toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('Should handle and display date correctly', async () => {
      render(<DatePicker onChange={mockOnChange} />)

      const datePickerInput = screen.getByRole('textbox')

      await userEvent.type(datePickerInput, '06/10/2023')
      expect(mockOnChange).toHaveBeenCalled()
    })
  })
})
