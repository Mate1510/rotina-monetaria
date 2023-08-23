"use client";

import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex bg-primaryOrange bottom-0 py-14 px-6 mt-12 justify-center relative">
      <div className="relative w-[200px] h-[75px] self-center mr-4">
        <Image src={"/Logo white.svg"} alt={"Rotina Monetária"} fill></Image>
      </div>

      <span className="border-2 bg-white mx-6 absolute top-8 bottom-8"></span>

      <div className="flex flex-col gap-3 text-white font-semibold text-lg self-center ml-4">
        <h4>Feedback</h4>
        <h4>Email</h4>
        <h4>© 2023 Mateus Abreu</h4>
      </div>
    </div>
  );
};

export default Footer;
