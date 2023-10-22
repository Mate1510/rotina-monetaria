'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { MdLogout, MdOutlineAccountCircle } from 'react-icons/md'
import AuthButton from './user/AuthButton'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false)
  const { data: session, status } = useSession()

  const pathname = usePathname() || "";
  const currentPage = pathname.split('/')[1]
  let changeColor = false

  if (
    currentPage == 'register' ||
    currentPage == 'login' ||
    currentPage == 'forget-password' ||
    currentPage == 'reset-password'
  ) {
    changeColor = true
  } else {
    changeColor = false
  }

  const handleLogoutClick = () => signOut({ callbackUrl: '/login' })
  const handleMenuClick = () => setMenuIsOpen(!menuIsOpen)

  return (
    <div
      className={`w-full mx-auto shadow-sm ${
        changeColor ? 'bg-primaryOrange' : 'bg-white'
      }`}
    >
      <div className="flex mx-auto p-6 justify-between items-center lg:w-4/5">
        <Link href="/" className="cursor-pointer transform transition-transform duration-300 hover:scale-110">
          <Image
            src={changeColor ? '/Logo white.svg' : '/Logo.svg'}
            alt={'Rotina Monetária'}
            width={150}
            height={50}
          ></Image>
        </Link>

        <div className="hidden lg:flex space-x-4">
          {status === 'authenticated' && (
            <div className="flex items-center gap-5">
              <Link
                href="/finances"
                className="text-primaryOrange font-semibold text-lg transform transition-transform duration-300 hover:scale-110"
              >
                Finanças
              </Link>
              <Link
                href="/categories"
                className="text-primaryOrange font-semibold text-lg transform transition-transform duration-300 hover:scale-110"
              >
                Categorias
              </Link>
              <Link
                href="/goals"
                className="text-primaryOrange font-semibold text-lg transform transition-transform duration-300 hover:scale-110"
              >
                Metas
              </Link>
              <Link
                href="/charts"
                className="text-primaryOrange font-semibold text-lg transform transition-transform duration-300 hover:scale-110"
              >
                Estatísticas
              </Link>

              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/control-panel"
                  className="text-primaryOrange font-semibold text-lg transform transition-transform duration-300 hover:scale-110"
                >
                  Usuários
                </Link>
              )}

              <div className="border border-solid rounded-full border-primaryOrange flex justify-between gap-3 p-3 items-center relative">
                <Link href="/user-profile">
                  {session.user?.image ? (
                    <Image
                      className="rounded-full cursor-pointer"
                      src={session?.user?.image ?? ''}
                      alt={session?.user?.name ?? ''}
                      width={32}
                      height={32}
                    ></Image>
                  ) : (
                    <MdOutlineAccountCircle
                      size={32}
                      className="text-primaryOrange cursor-pointer"
                    />
                  )}
                </Link>

                <MdLogout
                  className="cursor-pointer text-primaryOrange"
                  size={24}
                  onClick={handleLogoutClick}
                />
              </div>
            </div>
          )}
          {status === 'unauthenticated' && <AuthButton page={currentPage} />}
        </div>

        {status === 'authenticated' && (
          <div className="lg:hidden border border-solid rounded-full border-primaryOrange flex justify-between gap-3 p-3 items-center relative">
            <Link href="/user-profile">
              {session.user?.image ? (
                <Image
                  className="rounded-full cursor-pointer"
                  src={session?.user?.image ?? ''}
                  alt={session?.user?.name ?? ''}
                  width={32}
                  height={32}
                ></Image>
              ) : (
                <MdOutlineAccountCircle
                  size={32}
                  className="text-primaryOrange cursor-pointer"
                />
              )}
            </Link>

            <HiOutlineMenuAlt3
              className="cursor-pointer text-primaryOrange"
              size={24}
              onClick={handleMenuClick}
              aria-label="menu-button"
            />
            {menuIsOpen && (
              <div className="absolute top-16 right-1 rounded-lg shadow-md bg-primaryOrange flex flex-col justify-center items-center">
                <Link
                  href="/finances"
                  className="w-full text-white text-sm text-center font-semibold p-2 border-b-2"
                >
                  Finanças
                </Link>
                <Link
                  href="/categories"
                  className="w-full text-white text-sm text-center font-semibold p-2 border-b-2"
                >
                  Categorias
                </Link>
                <Link
                  href="/goals"
                  className="w-full text-white text-sm text-center font-semibold p-2 border-b-2"
                >
                  Metas
                </Link>
                <Link
                  href="/charts"
                  className="w-full text-white text-sm text-center font-semibold p-2 border-b-2"
                >
                  Estatísticas
                </Link>

                {session?.user?.role === 'ADMIN' && (
                  <Link
                    href="/control-panel"
                    className="w-full text-white text-sm text-center font-semibold p-2 border-b-2"
                  >
                    Usuários
                  </Link>
                )}

                <button
                  className="w-full text-white text-sm text-center font-semibold p-2"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'unauthenticated' && (
          <div className="lg:hidden">
            <AuthButton page={currentPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
