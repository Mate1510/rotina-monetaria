import { render, screen } from '@testing-library/react'
import CategoriesPage from '@/app/(private)/categories/page'
import { CategoriesProvider } from '@/contexts/CategoriesContext'

jest.mock('@/components/sections/categories/InsertCategories', () => {
  return function MockedInsertCategories() {
    return <div data-testid="insert-categories"></div>
  }
})

jest.mock('@/components/sections/categories/CategoriesTableExtended', () => {
  return function MockedCategoriesTableExtended() {
    return <div data-testid="categories-table-extended"></div>
  }
})

jest.mock('@/contexts/CategoriesContext', () => {
  const mockCategoriesProvider = ({ children }: { children: any }) => {
    return <div>{children}</div>
  }
  return {
    __esModule: true,
    CategoriesProvider: mockCategoriesProvider,
  }
})

describe('CategoriesPage', () => {
  it('Should render InsertCategories and CategoriesTableExtended components', () => {
    render(
      <CategoriesProvider>
        <CategoriesPage />
      </CategoriesProvider>,
    )

    const insertCategoriesComponent = screen.getByTestId('insert-categories')
    expect(insertCategoriesComponent).toBeInTheDocument()

    const categoriesTableExtendedComponent = screen.getByTestId(
      'categories-table-extended',
    )
    expect(categoriesTableExtendedComponent).toBeInTheDocument()
  })
})
