'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AuthButton = () => {
  const pathname = usePathname() || ''
  const currentPage = pathname.split('/')[1]

  return (
    <div className="border border-white py-3 rounded-lg hover:border-none transform transition-transform duration-300 hover:scale-110">
      <Link
        className="text-white font-semibold hover:bg-white hover:text-primaryOrange p-3 rounded-lg"
        href={currentPage === 'register' ? '/login' : '/register'}
      >
        {currentPage === 'register' ? 'Entrar' : 'Criar Conta'}
      </Link>
    </div>
  )
}

export default AuthButton
