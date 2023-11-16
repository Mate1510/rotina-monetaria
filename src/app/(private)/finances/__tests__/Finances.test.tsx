import { render, screen } from '@testing-library/react'
import FinancesPage from '@/app/(private)/finances/page'
import { FinanceProvider } from '@/contexts/FinanceContext'

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

jest.mock('@/components/sections/YearSelector', () => {
  return function MockedYearSelector({
    selectedYear,
    setSelectedYear,
  }: {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
  }) {
    return (
      <div data-testid="year-selector">
      </div>
    );
  };
});


jest.mock('@/contexts/FinanceContext', () => {
  const mockFinanceProvider = ({ children, selectedYear }: { children: any; selectedYear: number }) => {
    return <div>{children}</div>
  }
  return {
    __esModule: true,
    FinanceProvider: mockFinanceProvider,
  }
})

describe('FinancesPage', () => {
  it('Should render InsertFinances and FinanceTableExtended components', () => {
    render(
      <FinanceProvider selectedYear={new Date().getFullYear()}>
        <FinancesPage />
      </FinanceProvider>
    )

    const insertFinancesComponent = screen.getByTestId('insert-finances')
    expect(insertFinancesComponent).toBeInTheDocument()

    const yearSelectorComponent = screen.getByTestId('year-selector');
    expect(yearSelectorComponent).toBeInTheDocument();


    const financeTableExtendedComponent = screen.getByTestId('finance-table-extended')
    expect(financeTableExtendedComponent).toBeInTheDocument()
  })
})
