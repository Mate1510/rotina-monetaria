import { render, screen } from '@testing-library/react'
import CategoriesPage from '@/app/categories/page'

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

describe('CategoriesPage', () => {
  it('Should render InsertCategories and CategoriesTableExtended components', () => {
    render(<CategoriesPage />)

    const insertCategoriesComponent = screen.getByTestId('insert-categories')
    expect(insertCategoriesComponent).toBeInTheDocument()

    const categoriesTableExtendedComponent = screen.getByTestId('categories-table-extended')
    expect(categoriesTableExtendedComponent).toBeInTheDocument()
  })
})
