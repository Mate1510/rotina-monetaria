'use client'

import Card from '@/components/components/Card'
import useFetchUsersActivity from '@/data/useFetchUsersActivity'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
  MdOutlineAccountCircle,
  MdOutlineNoAccounts,
  MdOutlineHowToReg,
} from 'react-icons/md'

interface usersActivity {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
}

const DashboardActivity = () => {
  const { data: session } = useSession()
  const { data: usersActivityData } = useFetchUsersActivity()

  useEffect(() => {
    if (!usersActivityData) {
      return
    }
  }, [session, usersActivityData])

  return (
    <div className="conatiner flex flex-col flex-wrap gap-5 items-center justify-center">
      <div className="mr-40">
        <Card
          title="Total"
          value={usersActivityData?.totalUsers + ' Usuários'}
          Icon={MdOutlineAccountCircle}
        />
      </div>
      <div>
        <Card
          title="Ativos"
          value={usersActivityData?.activeUsers + ' Usuários'}
          Icon={MdOutlineHowToReg}
        />
      </div>
      <div className="ml-40">
        <Card
          title="Inativos"
          value={usersActivityData?.inactiveUsers + ' Usuários'}
          Icon={MdOutlineNoAccounts}
        />
      </div>
    </div>
  )
}

export default DashboardActivity
