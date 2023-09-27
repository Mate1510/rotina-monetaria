'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MdOutlineAccountCircle } from 'react-icons/md'

interface RecentUserData {
  id: string
  name: string
  email: string
  image: string
  createdAt: Date
}

const RecentUsers = () => {
  const [recentUsers, setRecentUsers] = useState<RecentUserData[]>()

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        return
      }

      try {
        const userRole = session?.user?.role
        const isAdmin: boolean = userRole === 'ADMIN' ? true : false

        if (!isAdmin) {
          return
        }

        const params = {
          isadmin: isAdmin,
        }

        const response = await axios.get('/api/get-user-info/recent-users', {
          params,
        })

        if (Array.isArray(response.data)) {
          setRecentUsers(response.data)
        }
      } catch (error) {
      } finally {
      }
    }

    fetchData()
  }, [session])

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full flex flex-col items-center justify-center gap-5">
      <h2 className="text-xl font-semibold text-primaryOrange">
        Usuários Recentes
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {recentUsers?.map(user => (
          <div
            key={user.id}
            className="flex flex-col gap-3 border border-primaryOrange rounded-lg p-5 w-52 h-auto"
          >
            <div className="flex gap-3 items-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-primaryOrange"
                ></Image>
              ) : (
                <MdOutlineAccountCircle
                  size={32}
                  className="text-primaryOrange cursor-pointer"
                />
              )}
              <h3 className="font-semibold text-primaryOrange">{user.name}</h3>
            </div>

            <p className="text-constrastBlack break-words">{user.email}</p>
            <p className="text-textGray text-sm mt-auto">
              Data de Criação: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentUsers
