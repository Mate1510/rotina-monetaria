import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Provider from './Provider'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Rotina Monetária',
  description:
    'Um planejador financeiro de uso pessoal para a gestão de suas finanças',
  icons: './favicon.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${poppins.className} mx-auto flex-col `}>
          <Header />
          <div className="container min-h-screen flex-grow lg:max-w-screen-2xl lg:mx-auto my-10">
            {children}
          </div>
          <Footer />
        </body>
      </Provider>
    </html>
  )
}
