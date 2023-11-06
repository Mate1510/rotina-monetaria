import React, { useEffect, useState } from 'react'
import Card from '@/components/components/Card'
import axios from 'axios'

import { MdTrendingUp, MdTrendingDown, MdAttachMoney } from 'react-icons/md'
import { toast } from 'react-toastify'

const CardSection = ({
  month,
  year,
  userid,
}: {
  month: number
  year: number
  userid: string | undefined
}) => {
  const [incomes, setIncomes] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/finance-cards', {
          params: {
            month,
            year,
            userid,
          },
        })

        const { totalIncome, totalExpense, total } = response.data
        setIncomes(totalIncome)
        setExpenses(totalExpense)
        setBalance(total)
      } catch (error) {
        toast.error('Erro ao buscar resumo financeiro.')
      }
    }

    fetchData()
  }, [month, userid, year])

  return (
    <div className='flex flex-col md:flex-row flex-wrap gap-10 mt-10 mb-16 px-0 md:px-16'>
      <Card title="Receitas" value={`R$${incomes}`} Icon={MdTrendingUp} className='lg:flex-grow'/>
      <Card title="Despesas" value={`R$${expenses}`} Icon={MdTrendingDown} className='lg:flex-grow'/>
      <Card title="Total" value={`R$${balance}`} Icon={MdAttachMoney} className='lg:flex-grow'/>
    </div>
  )
}

export default CardSection
