"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const { data, status } = useSession();

  const handleLoginClick = () => signIn();
  const handleLogoutClick = () => signOut();
  const handleMenuClick = () => setMenuIsOpen(!menuIsOpen);

  return (
    <div className="container flex mx-auto p-5 justify-between shadow-sm">
      <Link href="/" className="cursor-pointer">
        <Image
          src={"/Logo.svg"}
          alt={"Rotina Monetária"}
          width={150}
          height={50}
        ></Image>
      </Link>

      {status === "unauthenticated" && (
        <div className="border border-solid border-primaryOrange rounded-lg items-center hover:border-none">
          <button
            className="text-primaryOrange font-semibold hover:bg-primaryOrange hover:text-white p-3 rounded-lg"
            onClick={handleLoginClick}
          >
            Log In
          </button>
        </div>
      )}

      {status === "authenticated" && (
        <div className="border border-solid rounded-full border-primaryOrange flex justify-between gap-3 p-3 items-center relative">
          <Image
            className="rounded-full cursor-pointer"
            src={data?.user?.image ?? ""}
            alt={data?.user?.name ?? ""}
            width={32}
            height={32}
          ></Image>

          <HiOutlineMenuAlt3
            className="cursor-pointer text-primaryOrange"
            size={24}
            onClick={handleMenuClick}
          />

          {menuIsOpen && (
            <div>
              <div className="absolute top-16 right-1 rounded-lg shadow-md bg-primaryOrange flex flex-col justify-center items-center">
                <Link
                  href="/finances"
                  className="text-white text-sm font-semibold p-2"
                >
                  Finanças
                </Link>
              </div>

              <div className="absolute top-28 right-1 rounded-lg shadow-md bg-primaryOrange flex flex-col justify-center items-center">
                <button
                  className="text-white text-sm font-semibold p-2"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
