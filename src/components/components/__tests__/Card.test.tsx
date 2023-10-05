import { render, screen } from '@testing-library/react'
import Card from '@/components/components/Card'
import { SiTestinglibrary } from 'react-icons/si'

describe('Card component', () => {
  const mockTitle = 'Test Title'
  const mockValue = 'R$ 100,00'

  it('Should render Card Component', () => {
    render(<Card title={mockTitle} value={mockValue} Icon={SiTestinglibrary} />)

    const cardElement = screen.getByTestId('test-card')

    expect(cardElement).toBeInTheDocument()
  })

  it('Should display title and value correctly', () => {
    render(<Card title={mockTitle} value={mockValue} Icon={SiTestinglibrary} />)

    const titleElement = screen.getByText(mockTitle)
    const valueElement = screen.getByText(mockValue)

    expect(titleElement).toBeInTheDocument()
    expect(valueElement).toBeInTheDocument()
  })

  it('Should render the icon', () => {
    render(<Card title={mockTitle} value={mockValue} Icon={SiTestinglibrary} />)
    
    const iconElement = screen.getByTestId("test-icon-card")

    expect(iconElement).toBeInTheDocument()
  })
})
