"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];
  let changeColor = false

  if (null) {
    changeColor = true;
  } else {
    changeColor = false;
  }

  return (
    <div className={`flex ${changeColor ? "bg-white" : "bg-primaryOrange"} bottom-0 py-14 px-6 justify-center relative`}>
      <div className="relative w-[200px] h-[75px] self-center mr-4">
        <Image src={changeColor ? "/Logo.svg" : "/Logo white.svg"} alt={"Rotina Monetária"} fill></Image>
      </div>

      <span className={`border-2 ${changeColor ? "bg-primaryOrange border-primaryOrange" : "bg-white"} mx-6 absolute top-8 bottom-8`}></span>

      <div className={`flex flex-col gap-3 ${changeColor ? "text-primaryOrange" : "text-white"} font-semibold text-lg self-center ml-4`}>
        <h4>Feedback</h4>
        <h4>Email</h4>
        <h4>© 2023 Mateus Abreu</h4>
      </div>
    </div>
  );
};

export default Footer;
