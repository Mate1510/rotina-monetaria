import { render, screen, fireEvent } from '@testing-library/react'
import ModalComponent from '@/components/sections/Modal'

const mockClose = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ModalComponent', () => {
  it('renders modal when isOpen is true', () => {
    render(
      <ModalComponent isOpen={true} onClose={mockClose} modalTitle="Test Title">
        Test Content
      </ModalComponent>,
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders the correct title', () => {
    render(
      <ModalComponent isOpen={true} onClose={mockClose} modalTitle="Test Title">
        Test Content
      </ModalComponent>,
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders the correct content', () => {
    render(
      <ModalComponent isOpen={true} onClose={mockClose} modalTitle="Test Title">
        Test Content
      </ModalComponent>,
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders action button if provided', () => {
    const actionButton = <button>Custom Action</button>
    render(
      <ModalComponent
        isOpen={true}
        onClose={mockClose}
        modalTitle="Test Title"
        actionButton={actionButton}
      >
        Test Content
      </ModalComponent>,
    )
    expect(screen.getByText('Custom Action')).toBeInTheDocument()
  })

  it('renders cancel button and calls onClose when clicked', () => {
    render(
      <ModalComponent isOpen={true} onClose={mockClose} modalTitle="Test Title">
        Test Content
      </ModalComponent>,
    )
    const cancelButton = screen.getByText('Cancelar')
    expect(cancelButton).toBeInTheDocument()
    fireEvent.click(cancelButton)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
