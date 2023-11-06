'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="flex bg-primaryOrange bottom-0 py-14 px-6 justify-center relative">
      <div className="relative w-[200px] h-[75px] self-center mr-4 transform transition-transform duration-300 hover:scale-110">
        <Image src={'/LogoWhite.svg'} alt={'Rotina Monetária'} fill></Image>
      </div>

      <span className="border-2 bg-white mx-6 absolute top-8 bottom-8"></span>

      <div className="flex flex-col gap-3 text-white font-semibold text-lg self-center ml-4">
        <Link
          href="https://forms.gle/hgE6jB3uQZfKXjNn8"
          target="blank"
          rel="noopener noreferrer"
          className="transform transition-transform duration-300 hover:scale-105"
        >
          Feedback
        </Link>
        <Link
          href="mailto:mateusabreucn@gmail.com"
          className="transform transition-transform duration-300 hover:scale-105"
        >
          Email
        </Link>
        <h4 className="transform transition-transform duration-300 hover:scale-105">
          © 2023 Mateus Abreu
        </h4>
      </div>
    </div>
  )
}

export default Footer
