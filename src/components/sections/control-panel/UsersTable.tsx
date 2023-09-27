'use client'

import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import {
  MdDelete,
  MdEdit,
  MdOutlineAccountCircle,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md'
import Image from 'next/image'
import EditUserModal from './EditUserModal'

const UsersTable = () => {
  const [users, setUsers] = useState<any[]>([])
  const [userToEdit, setUserToEdit] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      console.error('User not authenticated.')
      return
    }

    const userRole = session?.user?.role
    const isAdmin: boolean = userRole === 'ADMIN' ? true : false

    if (!isAdmin) {
      return
    }

    const fetchUsers = async () => {
      const params = { isadmin: isAdmin, page: currentPage }

      try {
        const response = await axios.get('/api/user', { params })

        if (Array.isArray(response.data)) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const fetchTotalPages = async () => {
      const params = { isadmin: isAdmin }

      try {
        const response = await axios.get('/api/get-user-info/total-users', {
          params,
        })

        const pageSize = 15
        const totalPages = Math.ceil(response.data.totalUsers / pageSize)
        setTotalPages(totalPages)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    fetchTotalPages()
  }, [session, currentPage])

  const handleSwitch = async (
    e: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    userId: string,
    type: string,
  ) => {
    const currentUser = users.find(user => user.id === userId)
    const currentValue = currentUser[type]

    let newValue: string
    if (type === 'status') {
      newValue = currentValue === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    } else if (type === 'role') {
      newValue = currentValue === 'ADMIN' ? 'USER' : 'ADMIN'
    }

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, [type]: newValue } : user,
      ),
    )

    try {
      const response = await axios.put(`/api/user/${userId}`, {
        [type]: currentValue,
      })

      if (response.status !== 200) {
        console.error('Error updating:', response.data.error)
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, [type]: currentValue } : user,
          ),
        )
      }
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const handleEditClick = (user: any) => {
    setUserToEdit(user)
  }

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      const response = await axios.put(`/api/user/${updatedUser.id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
      })

      if (!response) {
        throw new Error('Falha ao atualizar os dados do usuário.')
      }

      const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? updatedUser : user,
      )
      setUsers(updatedUsers)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-w-full w-full">
      <div className="min-w-full overflow-x-auto rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange text-left text-white font-medium text-base">
            <tr>
              <th className="py-2 px-4 border-b font-medium"></th>
              <th className="py-2 px-4 border-b font-medium text-lg">Nome</th>
              <th className="py-2 px-4 border-b font-medium text-lg">Email</th>
              <th className="py-2 px-4 border-b font-medium text-lg">
                Data de Criação
              </th>
              <th className="py-2 px-4 border-b font-medium text-lg">
                Data de Atualização
              </th>
              <th className="py-2 px-4 border-b font-medium text-lg">
                Último Acesso
              </th>
              <th className="py-2 px-4 border-b font-medium text-lg">Status</th>
              <th className="py-2 px-4 border-b font-medium text-lg">
                Permissão
              </th>
              <th className="py-2 px-4 border-b font-medium text-lg text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="font-medium">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={42}
                      height={42}
                      className="rounded-full"
                    ></Image>
                  ) : (
                    <MdOutlineAccountCircle
                      size={42}
                      className="text-primaryOrange cursor-pointer"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="truncate w-36">{user.name}</div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="truncate w-36">{user.email}</div>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.lastEntry).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center justify-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.status === 'ACTIVE'}
                        onChange={e => handleSwitch(e, user.id, 'status')}
                        className="sr-only peer"
                      />

                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orangeDarker rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>

                      <span className="ml-3 text-xs font-medium text-gray-900">
                        {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center justify-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.role === 'ADMIN'}
                        onChange={e => handleSwitch(e, user.id, 'role')}
                        className="sr-only peer"
                      />

                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orangeDarker rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>

                      <span className="ml-3 text-xs font-medium text-gray-900">
                        {user.role === 'ADMIN' ? 'Admin' : 'User'}
                      </span>
                    </label>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex justify-around items-center">
                    <MdEdit
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleEditClick(user)}
                    />
                    {/* <MdDelete
                                            className="text-primaryOrange cursor-pointer"
                                            // onClick={}
                                        /> */}
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Não existem usuários cadastrados ainda...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center my-3 gap-3">
        <button disabled={currentPage === 1}>
          <MdOutlineNavigateBefore
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1))
            }}
            className="text-primaryOrange cursor-pointer"
            size={24}
          />
        </button>
        <h3 className="text-primaryOrange font-semibold text-2xl">
          {currentPage} - {totalPages}
        </h3>
        <button disabled={currentPage === totalPages}>
          <MdOutlineNavigateNext
            onClick={() => {
              setCurrentPage(prev => prev + 1)
            }}
            className="text-primaryOrange cursor-pointer"
            size={24}
          />
        </button>
      </div>

      {userToEdit && (
        <EditUserModal
          isOpen={!!userToEdit}
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  )
}

export default UsersTable
