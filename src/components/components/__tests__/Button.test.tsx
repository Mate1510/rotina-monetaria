import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/components/Button'

describe('Button component', () => {
  describe('Render', () => {
    it('Should render without errors', () => {
      render(<Button>Click me</Button>)

      const buttonElement = screen.getByRole('button')

      expect(buttonElement).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('Should have primary styles when variant is primary', () => {
      render(<Button variant="primary">Primary</Button>)

      const buttonElement = screen.getByRole('button')
      expect(buttonElement).toHaveClass('bg-primaryOrange text-white')
    })

    it('Should have outlined styles when variant is outlined', () => {
      render(<Button variant="outlined">Outlined</Button>)

      const buttonElement = screen.getByRole('button')
      expect(buttonElement).toHaveClass(
        'bg-transparent border-2 border-primaryOrange text-primaryOrange',
      )
    })

    it('Should have danger styles when variant is danger', () => {
      render(<Button variant="danger">Danger</Button>)

      const buttonElement = screen.getByRole('button')
      expect(buttonElement).toHaveClass('text-red-500 border-red-500')
    })
  })

  describe('Behavior', () => {
    it('Should handle onClick event', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const buttonElement = screen.getByRole('button')
      await userEvent.click(buttonElement)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
