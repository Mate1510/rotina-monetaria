import { render, screen } from '@testing-library/react'
import FinancesPage from '@/app/finances/page'

jest.mock('@/components/sections/finances/InsertFinances', () => {
  return function MockedInsertFinances() {
    return <div data-testid="insert-finances"></div>
  }
})

jest.mock('@/components/sections/finances/FinanceTableExtended', () => {
  return function MockedFinanceTableExtended() {
    return <div data-testid="finance-table-extended"></div>
  }
})

describe('FinancesPage', () => {
  it('Should render InsertFinances and FinanceTableExtended components', () => {
    render(<FinancesPage />)

    const insertFinancesComponent = screen.getByTestId('insert-finances')
    expect(insertFinancesComponent).toBeInTheDocument()

    const financeTableExtendedComponent = screen.getByTestId('finance-table-extended')
    expect(financeTableExtendedComponent).toBeInTheDocument()
  })
})
