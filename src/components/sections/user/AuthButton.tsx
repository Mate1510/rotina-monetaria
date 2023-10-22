'use client'

import Link from 'next/link'

function AuthButton({ page }: { page: string }) {
  return (
    <div className="border border-white py-3 rounded-lg hover:border-none transform transition-transform duration-300 hover:scale-110">
      <Link
        className="text-white font-semibold hover:bg-white hover:text-primaryOrange p-3 rounded-lg"
        href={page === 'register' ? '/login' : '/register'}
      >
        {page === 'register' ? 'Entrar' : 'Criar Conta'}
      </Link>
    </div>
  )
}

export default AuthButton
