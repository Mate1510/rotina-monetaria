import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Provider from './Provider'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import LayoutHelper from './layoutHelper'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Rotina Monetária',
  description:
    'Um planejador financeiro de uso pessoal para a gestão de suas finanças',
  icons: './favicon.svg',
  openGraph: {
    type: 'website',
    title: 'Rotina Monetária',
    description:
      'Um planejador financeiro de uso pessoal para a gestão de suas finanças',
    images: [{ url: './opengraph-image.png' }],
  },
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

          <LayoutHelper>{children}</LayoutHelper>

          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            limit={4}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="dark"
          />
          <Footer />
        </body>
      </Provider>
    </html>
  )
}
