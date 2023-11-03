import '../globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`mx-auto flex-col `}>
        <Header />

        <div className="container flex-grow lg:max-w-screen-2xl lg:mx-auto bg-orangeDarker">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  )
}
