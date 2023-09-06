"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdOutlineAccountCircle } from "react-icons/md";
import AuthButton from "./user/AuthButton";
import { usePathname } from "next/navigation";

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const { data, status } = useSession();

  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];
  let changeColor = false;

  if (
    currentPage == "register" ||
    currentPage == "login" ||
    currentPage == "forget-password" ||
    currentPage == "reset-password"
  ) {
    changeColor = true;
  } else {
    changeColor = false;
  }

  const handleLogoutClick = () => signOut({ callbackUrl: "/login" });
  const handleMenuClick = () => setMenuIsOpen(!menuIsOpen);

  return (
    <div
      className={`flex w-full mx-auto p-6 justify-between items-center border-b-2 border-primaryOrange ${
        changeColor ? "bg-primaryOrange" : "bg-white"
      }`}
    >
      <Link href="/" className="cursor-pointer lg:mx-auto">
        <Image
          src={changeColor ? "/Logo white.svg" : "/Logo.svg"}
          alt={"Rotina Monetária"}
          width={150}
          height={50}
        ></Image>
      </Link>

      {status === "unauthenticated" && <AuthButton page={currentPage} />}

      {status === "authenticated" && (
        <div className="border border-solid rounded-full border-primaryOrange flex justify-between gap-3 p-3 items-center relative">
          {data.user?.image ? (
            <Image
              className="rounded-full cursor-pointer"
              src={data?.user?.image ?? ""}
              alt={data?.user?.name ?? ""}
              width={32}
              height={32}
            ></Image>
          ) : (
            <MdOutlineAccountCircle
              size={32}
              className="text-primaryOrange cursor-pointer"
            />
          )}

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
